# Prompt Caching: How to Cut Your Claude API Bill by 90% (A Beginner's Guide)

*A practical, no-hype walkthrough of the single highest-leverage cost optimization for LLM applications.*

---

If you're new to building with LLM APIs, here's a number that should get your attention: developers regularly report cutting their monthly Claude bills from **$720 to $72** with one parameter change. Not 7%. Not 17%. **Ninety percent off** their input-token costs.

That parameter is called **prompt caching**, and most beginner tutorials skip past it because it sounds like an "advanced optimization." It isn't. It's the first thing you should learn after `client.messages.create()`.

This post explains what prompt caching is, why it exists, exactly how to use it with Claude, and the gotchas that quietly waste money for teams who turn it on without understanding the mechanics. We'll close with a brief OpenAI comparison so you can apply the same thinking across providers.

---

## The Problem Prompt Caching Solves

Every time you call an LLM API, you send a payload that typically looks like this:

1. A **system prompt** with instructions, role, output format — often 2,000 to 20,000 tokens
2. **Tool definitions** if you're using function calling — another 1,000 to 5,000 tokens
3. A few **examples** for few-shot learning
4. **Conversation history** from prior turns
5. The **new user message** — usually only a few hundred tokens

Here's the kicker: items 1 through 4 are **identical on every single call**. You're paying full input price to re-send the same 15,000 tokens of instructions over and over, while only items in #5 actually change.

Think of it like calling a customer support line. Every time you call, before you can ask your question, you have to re-read the company's entire 50-page policy manual to the agent. That's wasteful — the agent already knows the manual. You should just be able to say "I'm calling about *my* question" and the agent picks up from there.

Prompt caching is exactly that. The model "memorizes" the static parts of your prompt for a short window, and on subsequent calls within that window, you pay roughly **10% of the normal input price** for the cached portion.

---

## How Claude's Prompt Caching Works

Claude's prompt caching is **explicit** — meaning *you* tell the API which blocks of your prompt to cache. You do this by adding a `cache_control` flag to a content block. Anthropic then caches everything from the start of the prompt up to and including that block.

Here's the simplest possible example in Python:

```python
import anthropic

client = anthropic.Anthropic()

LARGE_SYSTEM_PROMPT = """You are an expert technical support agent for AcmeCorp.
[... 5,000 more tokens of detailed instructions, product docs, escalation rules ...]
"""

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": LARGE_SYSTEM_PROMPT,
            "cache_control": {"type": "ephemeral"}  # 👈 cache this block
        }
    ],
    messages=[
        {"role": "user", "content": "How do I reset my password?"}
    ]
)

# Verify it worked
print("Tokens written to cache:", response.usage.cache_creation_input_tokens)
print("Tokens read from cache:", response.usage.cache_read_input_tokens)
```

On the **first** call, you pay slightly more than normal — that's the one-time write cost. On every **subsequent** call within the cache window, you pay only ~10% of the normal input price for the cached portion. The break-even point is **two calls**. After that, it's pure savings.

Notice the verification at the end. Always check `cache_creation_input_tokens` and `cache_read_input_tokens` in the response. If both are zero, your cache silently failed — almost always because of one of the gotchas below.

---

## The Pricing Math (Why It Matters)

Claude's prompt caching uses three different prices for the same tokens depending on what's happening:

| Token type | Multiplier | What it means |
|---|---|---|
| **Standard input** | 1.0× base | First time the model sees these tokens, no caching |
| **Cache write (5-min TTL)** | 1.25× base | One-time cost to store the cached block, lasts 5 minutes |
| **Cache write (1-hour TTL)** | 2.0× base | One-time cost, lasts 1 hour |
| **Cache read** | 0.1× base | Every subsequent call that hits the cache |

Let's run real numbers on Claude Sonnet 4.6 (base input price: $3.00 per million tokens):

- Standard input: **$3.00 / MTok**
- Cache write (5-min): **$3.75 / MTok** (paid once)
- Cache read: **$0.30 / MTok** (paid every subsequent call)

Imagine an 8,000-token system prompt used across 100 calls per hour:

| Scenario | Monthly cost |
|---|---|
| **Without caching** (8K tokens × 100 calls × 24 hrs × 30 days × $3/M) | **$1,728** |
| **With caching** (1 write + 99 reads per hour, repeated) | **~$176** |

That's a **90% reduction** on that portion of the bill. The bigger your static prefix and the higher your call volume, the more dramatic the savings.

---

## When Caching Makes Sense (and When It Doesn't)

**Cache when you have:**
- A system prompt over the minimum threshold (more on this in a second)
- Tool/function definitions you reuse across calls
- Few-shot examples that don't change between requests
- Long reference documents that get queried many times (RAG, document analysis)
- Multi-turn conversations where prior messages stay in the context

**Don't bother caching when:**
- Your prompt is shorter than the minimum threshold (the cache silently won't activate)
- Each request has completely different content with no repeated prefix
- You only call the API once per session and then stop for hours
- Your "static" content actually changes between calls (timestamps, request IDs, dynamic values mixed in)

The single biggest mistake beginners make: they put `cache_control` on a 500-token system prompt and wonder why nothing happens. Caching has minimum sizes, and below those minimums it silently does nothing.

---

## The Five Gotchas Nobody Warns You About

These are the silent killers — every one of them I've seen developers waste money on.

### 1. The minimum token threshold

Your cached block must exceed a per-model minimum or caching simply doesn't activate. The request still succeeds, but `cache_creation_input_tokens` comes back as zero and you pay full price.

| Model | Minimum tokens to cache |
|---|---|
| Claude Opus 4.7 | 4,096 |
| Claude Sonnet 4.6 | 2,048 |
| Claude Haiku 4.5 | 4,096 |
| Older Sonnet 4.5, Opus 4.1, Sonnet 3.7 | 1,024 |

If your system prompt is below this, either pad it with useful content (more examples, more context) or accept that caching won't help.

### 2. Exact-match-or-nothing

Cache hits require the cached content to match **byte for byte**. Change one character, one whitespace, one comma — and you create a fresh cache entry instead of hitting the existing one. Common ways teams accidentally break this:

- Including the current timestamp in the system prompt ("Today is 2026-05-03 14:32:01...")
- Inserting a request ID or session ID near the top
- Using a templating engine that varies whitespace between runs
- Reordering tool definitions between calls

**Rule:** anything in the cached block must be 100% deterministic. Move dynamic content *after* the cache breakpoint.

### 3. The 5-minute TTL surprise

The default cache lifetime is **5 minutes**, not an hour. Every cache read refreshes the 5-minute timer, so high-traffic systems naturally keep their caches warm. But if your traffic is bursty — say, a developer tool that pauses while a user thinks for 7 minutes — the cache expires between calls and you pay the write cost all over again.

If your access pattern is sparse, use the 1-hour TTL:

```python
"cache_control": {"type": "ephemeral", "ttl": "1h"}
```

The 1-hour write costs 2× base instead of 1.25× base, so the math only works if you'll get at least two cache reads within the hour. For sustained workloads, 5-minute is fine. For agent flows with long pauses, 1-hour is usually safer.

### 4. Order matters

Anthropic caches in this order: `tools` → `system` → `messages`, in that exact sequence, up to and including the block you mark with `cache_control`. So:

- If your tool definitions change between calls but your system prompt doesn't, **the system prompt won't cache** because the prefix changed. Tools come first.
- Static content goes early in the prompt; dynamic content goes late.

### 5. You get up to 4 cache breakpoints

You can mark up to four blocks with `cache_control`. This lets you cache different sections that change at different rates — e.g., cache your tool definitions once, your system prompt once, your few-shot examples once, your retrieved documents once. Each marker creates a checkpoint; the API will use whichever cached prefix is the longest match.

For most beginner use cases, **one cache breakpoint on the system prompt is enough**. Don't over-engineer it.

---

## A Practical Pattern: Caching for a Multi-Turn Chatbot

Here's a slightly more realistic example showing what a production-shaped chatbot looks like with caching:

```python
import anthropic

client = anthropic.Anthropic()

SYSTEM_PROMPT = """You are an AI assistant for AcmeCorp's developer portal.
[... thousands of tokens of role, instructions, product knowledge ...]
"""

TOOLS = [
    {
        "name": "search_docs",
        "description": "Search the AcmeCorp documentation",
        "input_schema": {
            "type": "object",
            "properties": {"query": {"type": "string"}},
            "required": ["query"]
        }
    }
    # ... more tool definitions ...
]

def chat(conversation_history: list, user_message: str) -> str:
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=[
            {
                "type": "text",
                "text": SYSTEM_PROMPT,
                "cache_control": {"type": "ephemeral"}  # cache the system prompt
            }
        ],
        tools=TOOLS,  # tools auto-cache when system is cached
        messages=conversation_history + [
            {"role": "user", "content": user_message}
        ]
    )

    # Log cache stats so you can see it working
    usage = response.usage
    print(f"Cache write: {usage.cache_creation_input_tokens} tokens")
    print(f"Cache read:  {usage.cache_read_input_tokens} tokens")
    print(f"Fresh input: {usage.input_tokens} tokens")

    return response.content[0].text
```

Run this twice in quick succession and you'll see the second call shows a non-zero `cache_read_input_tokens` and a much smaller `input_tokens` value. That's the savings happening in real time.

---

## How OpenAI's Approach Differs

OpenAI offers prompt caching too, but the design philosophy is different in three important ways:

| Aspect | Anthropic Claude | OpenAI |
|---|---|---|
| **Activation** | Explicit — you mark blocks with `cache_control` | Automatic — happens whenever prompts share a prefix |
| **Cost reduction** | ~90% off cached portions | ~50% off cached portions |
| **Minimum size** | 2,048–4,096 tokens (model-dependent) | 1,024 tokens |
| **Match requirement** | Exact byte match from start of prompt | Exact byte match of prompt prefix |
| **Configuration** | You control TTL (5 min or 1 hr) | No user-facing TTL control |

**The practical implication:** with OpenAI, you don't add any code — you just structure your prompts consistently with static content first and dynamic content last. Caching happens automatically. With Claude, you have more control and bigger savings, but you have to deliberately mark what to cache.

For a beginner choosing between providers on cost grounds alone: Claude's 90% discount is meaningfully better than OpenAI's 50%, and the 4-minute setup to add `cache_control` is trivially easy. The gap closes if your prompts are highly variable, since neither provider can cache what doesn't repeat.

---

## A Five-Minute Action Plan

If you're building anything with the Claude API right now, here's the order of operations:

1. **Identify your largest static prefix.** Usually it's your system prompt. Count its tokens. If it's under the minimum for your model, add more useful content (canonical examples, output format spec) until it's above.
2. **Add one `cache_control` breakpoint** at the end of that block. Don't overthink it.
3. **Log `cache_creation_input_tokens` and `cache_read_input_tokens`** on every response. If you can't see it, you can't optimize it.
4. **Make a second call within 5 minutes** and confirm the cache read is non-zero. If it isn't, something in your "static" content is actually varying — find it and fix it.
5. **Look at your bill at the end of the week.** You should see input-token costs drop dramatically.

That's it. Five minutes of work, often 70-90% off your monthly LLM bill on the input side.

---

## The Mental Model Worth Remembering

Most beginner tutorials treat LLM APIs as stateless function calls — you send a prompt, you get a response, the model "forgets" everything between calls. That's still true at the model level, but the **infrastructure layer** does have memory now, and it's specifically designed to reward developers who structure their prompts thoughtfully.

The teams who do this well aren't the ones with the biggest budgets. They're the ones who understood early that **the static-vs-dynamic split in your prompt is an architectural decision, not a styling choice**. Static content goes first, gets marked for caching, and never changes byte-for-byte between calls. Dynamic content goes last and varies freely.

Once you internalize that, prompt caching stops feeling like an "optimization" and starts feeling like the obvious way to design any production LLM application.

---

## Further Reading

- Anthropic's official docs: [Prompt caching on Claude API](https://docs.claude.com/en/docs/build-with-claude/prompt-caching)
- OpenAI's automatic prompt caching documentation
- Claude pricing page for current per-model rates

If you found this useful, the next post in this series will cover **batch processing** — Anthropic's other 50% discount, which stacks on top of caching for non-real-time workloads.
