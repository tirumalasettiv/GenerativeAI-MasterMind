# Batch Processing: How to Cut Your Claude API Bill By Another 50% (A Beginner's Guide)

*Part 2 of a cost-optimization series. If you haven't read the [prompt caching post](#) yet, start there — these two techniques stack.*

---

There's a moment that hits every developer the first time they look at their LLM bill. You've shipped something useful, traffic is growing, and the invoice arrives larger than you expected. Most beginner tutorials at this point will tell you to "use a smaller model." That's good advice eventually, but it's not the cheapest win.

The cheapest win is asking yourself one question: **"Does this need to respond in real time?"**

If the answer is "no" — even sometimes — you can cut that portion of your bill in half with a few hours of refactoring. Anthropic calls this the **Message Batches API** (or just "the Batch API"). It's a 50% discount, no quality difference, no asterisks. And it stacks with prompt caching, which means a well-architected batch workload using cached system prompts can run at **roughly 5% of the standard rate**.

This post explains what batch processing is, when it's the right call, exactly how to use it on Claude, the pitfalls beginners hit, and how OpenAI's equivalent compares.

---

## The Mental Shift: Sync vs Async

Most beginners learn the LLM API as a synchronous, request-response thing. You call `client.messages.create()`, you wait two seconds, you get an answer, you show it to the user. That model works perfectly for chat interfaces — and terribly for everything else.

Think about what production LLM workloads actually look like:

- A nightly job that summarizes 50,000 support tickets
- A pipeline that generates SEO descriptions for every product in a catalog
- An evaluation harness running 10,000 test prompts against a new system prompt
- A document-processing service that classifies incoming PDFs every few minutes
- A content engine generating tomorrow's social posts overnight

None of these need a 2-second response time. The user isn't watching the screen. The job runs once, finishes when it finishes, and the results land somewhere — a database, a spreadsheet, a Slack notification.

For workloads like these, paying real-time prices is just throwing money away. Batch processing is the API saying: *"If you can wait up to 24 hours, I'll do the same work for half off."*

---

## How Claude's Batch API Works

The Message Batches API has a simple lifecycle:

1. **Submit** a JSON file with up to 100,000 individual requests, each with its own `custom_id`
2. Anthropic processes them **asynchronously** — most batches finish in under an hour, occasionally up to 24
3. **Poll** for status, or wait for the batch to enter the `ended` state
4. **Download** the results — a JSONL file with one response per request, matched by `custom_id`

Here's the simplest possible example:

```python
import anthropic
from anthropic.types.message_create_params import MessageCreateParamsNonStreaming
from anthropic.types.messages.batch_create_params import Request

client = anthropic.Anthropic()

# Build a batch of 3 requests (in practice this would be thousands)
batch = client.messages.batches.create(
    requests=[
        Request(
            custom_id="ticket-001",
            params=MessageCreateParamsNonStreaming(
                model="claude-sonnet-4-6",
                max_tokens=512,
                messages=[{
                    "role": "user",
                    "content": "Classify this ticket: 'Cannot login, password reset broken'"
                }]
            )
        ),
        Request(
            custom_id="ticket-002",
            params=MessageCreateParamsNonStreaming(
                model="claude-sonnet-4-6",
                max_tokens=512,
                messages=[{
                    "role": "user",
                    "content": "Classify this ticket: 'Want to upgrade to enterprise plan'"
                }]
            )
        ),
        Request(
            custom_id="ticket-003",
            params=MessageCreateParamsNonStreaming(
                model="claude-sonnet-4-6",
                max_tokens=512,
                messages=[{
                    "role": "user",
                    "content": "Classify this ticket: 'API returning 500 errors since 2 PM'"
                }]
            )
        ),
    ]
)

print(f"Batch created: {batch.id}")
print(f"Status: {batch.processing_status}")  # 'in_progress'
```

That's the submission. Now you wait. A polling loop looks like this:

```python
import time

while True:
    batch = client.messages.batches.retrieve(batch.id)
    if batch.processing_status == "ended":
        break
    print(f"Still processing... {batch.request_counts}")
    time.sleep(60)  # poll once a minute

# Stream the results
for result in client.messages.batches.results(batch.id):
    if result.result.type == "succeeded":
        print(f"{result.custom_id}: {result.result.message.content[0].text}")
    else:
        print(f"{result.custom_id} FAILED: {result.result.type}")
```

That's it. Same model, same quality, half the price. The `custom_id` you assign on submission flows through to the result, so you can match outputs back to your source records (database row IDs, ticket numbers, document hashes — whatever makes sense).

---

## The Pricing Math

The Batch API gives **50% off both input and output tokens**, on every Claude model, with no exceptions.

| Model | Standard rate (input/output) | Batch rate (input/output) |
|---|---|---|
| Claude Haiku 4.5 | $1.00 / $5.00 per MTok | **$0.50 / $2.50 per MTok** |
| Claude Sonnet 4.6 | $3.00 / $15.00 per MTok | **$1.50 / $7.50 per MTok** |
| Claude Opus 4.6 | $5.00 / $25.00 per MTok | **$2.50 / $12.50 per MTok** |
| Claude Opus 4.7 | $5.00 / $25.00 per MTok | **$2.50 / $12.50 per MTok** |

Let's run a real scenario. Imagine a document-processing pipeline that runs nightly:

- **Volume:** 100,000 documents per month
- **Average input:** 5,000 tokens per document (instructions + document text)
- **Average output:** 500 tokens (a structured summary)
- **Model:** Claude Sonnet 4.6

| Approach | Monthly input cost | Monthly output cost | **Monthly total** |
|---|---|---|---|
| Standard sync API | $1,500 | $750 | **$2,250** |
| Batch API alone | $750 | $375 | **$1,125** |
| Batch + prompt caching | ~$83 | $375 | **~$458** |

That last row is the punchline. **Batch processing and prompt caching stack.** If your 4,000-token instruction block is identical across all 100,000 documents (which it almost certainly is), you cache it. The cached input now costs 10% of the batch rate — so 5% of the standard rate. Your input bill collapses by ~95%. Output stays at the batch rate (50% off standard) because each document's response is unique.

Going from $2,250/month to $458/month for the same work is the kind of math that makes the Batch API the second-most-important cost lever after caching.

---

## When Batch Is the Right Call (and When It Isn't)

**Use the Batch API when:**

- The user isn't waiting for the response in real time
- The work can run on a schedule (nightly, hourly) rather than on demand
- You're processing many similar requests as a job — extraction, classification, summarization, scoring
- You're running an evaluation suite or generating synthetic data for fine-tuning
- You need very long outputs (more on this in a second — batch supports 300K-token outputs that sync doesn't)
- Volume is high enough that the savings matter (below ~$50/month, it's not worth the engineering)

**Don't use the Batch API when:**

- The user is staring at a chat interface waiting for a reply
- The response feeds into a downstream user-facing flow within seconds
- You only have a handful of requests (the overhead of submission + polling isn't worth it)
- You need streaming output (batch is non-streaming by definition)
- Your workload requires Zero Data Retention (ZDR) — the Batch API isn't ZDR-eligible, which matters for some enterprise/regulated use cases

The decision is rarely "use one or the other forever." Most production systems end up with **a hybrid pattern**: a sync API for the user-facing chat, and a batch pipeline for the analytics/enrichment/eval work that runs in the background.

---

## The Five Gotchas

These are the silent traps that catch every team's first batch deployment.

### 1. The 24-hour deadline is a deadline

Anthropic guarantees results within 24 hours. Most batches finish in under an hour, but you cannot count on that. If your batch hasn't completed in 24 hours, the unfinished requests are marked `expired` and you don't pay for them — but you also don't get results. Architect around this by:

- Submitting batches well before any downstream deadline
- Treating "expired" as a real outcome you have to handle in code
- Splitting truly large batches so a partial failure doesn't lose 24 hours of work

### 2. Batches don't fail — individual requests do

A batch returns a mix of outcomes: `succeeded`, `errored`, `canceled`, `expired`. Beginners often write code that treats the batch as a single atomic unit, then crash when one of 50,000 requests has malformed input. **Always iterate over results and handle each `result.type` explicitly.** Plan for partial success.

```python
for result in client.messages.batches.results(batch.id):
    if result.result.type == "succeeded":
        save_to_database(result.custom_id, result.result.message)
    elif result.result.type == "errored":
        log_error(result.custom_id, result.result.error)
    elif result.result.type == "expired":
        retry_in_next_batch(result.custom_id)
```

### 3. The 100,000-request and 256MB limits

Each batch is capped at **100,000 requests OR 256MB of payload, whichever comes first.** For most workloads the request count is the binding constraint, but if your prompts are long (large documents, big retrieved contexts), you'll hit the byte limit first. The fix is simple: split into multiple batches and submit them in parallel. The Batch API allows several batches in flight simultaneously.

### 4. Polling vs webhooks

The basic example above uses polling, which is fine for occasional jobs but wasteful for production pipelines. Anthropic supports webhooks — register an endpoint and get notified when the batch ends instead of polling every 60 seconds. For anything running on a schedule, webhooks are the right pattern. For exploratory or one-off jobs, polling is simpler.

### 5. The 300K-token output trick most people don't know about

Here's a benefit that's not just about cost. By default, Claude's synchronous API caps outputs at 64K-128K tokens depending on the model. If you need to generate something genuinely long — a book chapter, exhaustive structured data extraction, a massive code scaffold — you'd normally have to chain multiple requests.

**The Batch API supports outputs up to 300,000 tokens** on Opus 4.7, Opus 4.6, and Sonnet 4.6 by adding the `output-300k-2026-03-24` beta header. A single 300K-token generation can take over an hour to complete, which is why it's batch-only. Standard batch pricing (50% off) still applies. For long-form generation workloads, batch isn't just cheaper — it's strictly more capable than the sync API.

---

## A Realistic Pattern: Batch Processing With Caching

Here's a more production-shaped example showing both techniques working together. Imagine a service that classifies incoming customer support tickets every hour.

```python
import anthropic
from anthropic.types.message_create_params import MessageCreateParamsNonStreaming
from anthropic.types.messages.batch_create_params import Request

client = anthropic.Anthropic()

# Large, stable instruction block — cache this across all tickets
CLASSIFICATION_PROMPT = """You are a support ticket classifier for AcmeCorp.

[... 4,000 tokens of categories, examples, edge cases, output format ...]

Output a JSON object with: category, severity, suggested_team, summary."""


def build_request(ticket_id: str, ticket_text: str) -> Request:
    return Request(
        custom_id=ticket_id,
        params=MessageCreateParamsNonStreaming(
            model="claude-sonnet-4-6",
            max_tokens=512,
            system=[
                {
                    "type": "text",
                    "text": CLASSIFICATION_PROMPT,
                    "cache_control": {"type": "ephemeral"}  # cache once across batch
                }
            ],
            messages=[{"role": "user", "content": ticket_text}]
        )
    )


def classify_tickets(tickets: list[dict]) -> str:
    """Submit a batch and return the batch ID for later polling."""
    batch = client.messages.batches.create(
        requests=[build_request(t["id"], t["text"]) for t in tickets]
    )
    return batch.id
```

That `cache_control` flag inside a batch is where the magic happens. The 4,000-token classification prompt is processed once and reused for every ticket in the batch. Combined with the 50% batch discount on input and output, you're paying roughly **5% of the equivalent sync-API cost** for the same work.

This pattern — large stable system prompt + cache breakpoint + batch submission — is the canonical shape of cost-optimized production LLM pipelines on Claude in 2026.

---

## How OpenAI's Approach Differs

OpenAI has a Batch API too, and the design is broadly similar — same async model, same 24-hour SLA, same use cases. A few notable differences:

| Aspect | Anthropic Claude Batch API | OpenAI Batch API |
|---|---|---|
| **Discount** | 50% off input and output | 50% off input and output |
| **Turnaround** | Most batches under 1 hour, 24-hour ceiling | Same |
| **Submission format** | JSON via SDK request objects | JSONL file upload |
| **Per-batch limit** | 100,000 requests / 256MB | 50,000 requests / 200MB |
| **Stacks with prompt caching** | Yes — explicit cache breakpoints work in batch | Caching is automatic, applies inside batch too |
| **Long-output beta** | 300K tokens on Sonnet 4.6 / Opus 4.6 / 4.7 | Standard limits apply |

Both providers offer essentially the same value proposition: 50% off if you're willing to wait. The main practical differences are submission ergonomics (Anthropic uses SDK objects; OpenAI uses uploaded JSONL files), the per-batch ceiling (Anthropic is roughly 2× larger), and Anthropic's extended-output beta for long-form generation.

If you're already on Claude for the quality and the prompt-caching savings, staying on Claude for batch is the obvious move. If you're multi-provider, you can run batches on whichever model fits the task — the API patterns are similar enough that wrapping both behind a thin abstraction is straightforward.

---

## A Five-Step Action Plan

If you're building anything that processes more than a few hundred LLM requests per day, here's what to do this week:

1. **Audit your workloads.** Make a list of every place your code calls the LLM API. For each one, ask: *"Could this tolerate up to 24 hours of latency?"* You'll be surprised how many can.
2. **Pick the highest-volume async workload first.** Probably a nightly job, an enrichment pipeline, or an evaluation suite. That's your migration target.
3. **Refactor the request loop into a batch submission.** Replace the `for ticket in tickets: client.messages.create(...)` pattern with a single batch submission. Two hours of work, max.
4. **Add caching on the system prompt** if it's over 2,048 tokens (Sonnet) or 4,096 tokens (Haiku/Opus). This is the multiplier — batch alone gives 50% off; batch + caching gives ~95% off.
5. **Compare the bill before and after** at the end of the month. The Anthropic console shows token usage by feature — batch tokens appear as a separate line item, so the savings are easy to see.

Most teams do this once per workload and never look back. The hardest part is psychological: getting comfortable with the idea that "asynchronous" isn't a downgrade. For everything that isn't a chat interface, async is just *correct*.

---

## The Mental Model Worth Remembering

Beginner LLM tutorials inherit their architecture from the chat interface — single request, single response, two-second SLA. That's a fine model for chat. It's a terrible default for everything else.

The teams that run production LLM workloads efficiently make a different default assumption: **synchronous API calls are reserved for user-facing interactions; everything else is batch by default.** Background jobs, enrichment, evaluation, classification, content generation, document processing — all of it goes through the Batch API unless there's a specific reason it can't.

Once you flip that mental default, the architecture becomes obvious. The user-facing chat uses sync calls with caching. The pipelines, jobs, and analytics use batch with caching. The bill at the end of the month is half what it would otherwise have been — sometimes a twentieth, when caching and batch combine on a workload that supports both.

That compound effect is the actual answer to "how do production LLM teams keep costs reasonable at scale?" It's not a smaller model, it's not aggressive prompt compression, it's not switching providers. It's recognizing that **most LLM work doesn't need to happen in real time**, and structuring your system around that fact.

---

## Further Reading

- Anthropic's official docs: [Message Batches API on Claude](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
- OpenAI's Batch API documentation
- The companion post in this series: *Prompt Caching: How to Cut Your Claude API Bill by 90%*

If this was useful, the next post in the series covers **model routing** — how to use Haiku for the easy 80% of requests and reserve Sonnet/Opus for the hard 20%, often cutting costs another 3-5× on top of caching and batch.
