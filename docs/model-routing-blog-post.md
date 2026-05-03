# Model Routing: How to Cut Your Claude API Bill by Another 70% (A Beginner's Guide)

*Part 3 of a cost-optimization series. If you haven't read the [prompt caching](#) or [batch processing](#) posts yet, those come first — but this one is the multiplier on top of both.*

---

If you've followed this series, your Claude bill is already a fraction of what it was when you started. Prompt caching took 90% off your repeated input tokens. Batch processing took 50% off everything that doesn't need to be real-time. Most teams stop there and feel pretty good about themselves.

There's one more lever, and for many production workloads it's actually the biggest one.

It's called **model routing**, and the idea is brutally simple: **stop using a Ferrari to deliver pizza.** Most of the work your application does isn't hard. Classifying an email, extracting a date from a sentence, deciding whether a support ticket is a complaint or a question — these don't need a frontier reasoning model. They need a fast, cheap, accurate one. Use the expensive model only when the task actually requires it.

When done well, model routing alone cuts costs **50-80%** with no quality drop on the work that matters. Combined with caching and batch, the compound effect is what separates production LLM systems that scale economically from ones that go bankrupt at series B.

This post explains what model routing is, when it pays off, exactly how to build it on Claude, the gotchas that beginners hit, and how the same patterns apply on OpenAI.

---

## The Fallacy of "One Model for Everything"

When most developers learn the LLM API, they pick one model and route everything through it. Usually it's the strongest one available — Claude Opus 4.7, GPT-5, whatever's at the top of the marketing page. The reasoning sounds reasonable: *"I want the best quality. Why would I use a weaker model?"*

Here's why. Frontier models cost roughly **5× more per token** than entry-level models in the same family. Claude Haiku 4.5 is $1.00/$5.00 per million tokens. Claude Opus 4.7 is $5.00/$25.00. If you route every request through Opus, you're paying 5× the price for thousands of tasks that Haiku would handle perfectly — ticket classification, simple extraction, routing decisions, format conversion, basic summarization.

The dirty secret of production LLM workloads is that the distribution of difficulty is **wildly skewed**. In a typical application:

- 60-70% of requests are genuinely simple — classification, extraction, lookup, formatting
- 20-30% require real reasoning — multi-step analysis, code generation, document synthesis  
- 5-10% are genuinely hard — complex agents, novel problems, high-stakes decisions

Running all of them through your most expensive model means you're paying premium prices to do work that a model 1/5 the cost would handle equally well. Model routing is just acknowledging that distribution and architecting around it.

---

## The Three-Tier Pattern (And Why It Works)

Claude's three-model lineup almost reads like it was designed for routing, because it was. Each tier has a deliberately different cost-quality profile:

| Tier | Model | Cost (input/output per MTok) | Best For |
|---|---|---|---|
| **Light** | Claude Haiku 4.5 | $1.00 / $5.00 | Classification, extraction, routing decisions, format conversion, simple lookups |
| **Standard** | Claude Sonnet 4.6 | $3.00 / $15.00 | Code generation, multi-step reasoning, document synthesis, most production work |
| **Heavy** | Claude Opus 4.7 | $5.00 / $25.00 | Complex agents, novel problems, deep reasoning, high-stakes decisions |

The standard pattern most production teams converge on is sometimes called the **70/20/10 split**: 70% of traffic to Haiku, 20% to Sonnet, 10% to Opus. The exact ratios vary by application, but the shape is consistent — most work goes to the cheap tier, the middle tier handles the bulk of what actually matters, and the expensive tier is reserved for the small slice of requests where its reasoning genuinely earns its price.

Think of it like the way a hospital triage system works. The triage nurse isn't the most expensive specialist in the building — but they're the most important person for *throughput*, because they decide who needs the cardiologist, who needs the GP, and who can be sent home with paracetamol. Every patient does not need to see the cardiologist. Every LLM request does not need to hit Opus.

---

## How Routing Actually Works (Two Approaches)

There are two fundamentally different ways to implement routing, and the choice between them shapes everything else.

### Approach 1: Static Routing (Rules-Based)

You decide upfront, by code path or task type, which model handles which kind of request. This is the simpler pattern and is what most teams should start with.

```python
import anthropic

client = anthropic.Anthropic()

def classify_ticket(text: str) -> str:
    """Simple classification — Haiku is fine."""
    return _call(model="claude-haiku-4-5", prompt=text)

def generate_code_review(diff: str) -> str:
    """Code reasoning — Sonnet is the right tier."""
    return _call(model="claude-sonnet-4-6", prompt=diff)

def architect_solution(requirements: str) -> str:
    """Complex multi-step reasoning — Opus earns its price here."""
    return _call(model="claude-opus-4-7", prompt=requirements)

def _call(model: str, prompt: str) -> str:
    response = client.messages.create(
        model=model,
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}]
    )
    return response.content[0].text
```

That's it. Different functions, different models, decision made at design time. This works beautifully when your task types are clearly distinguishable in code — you already know "classify a ticket" is fundamentally easier than "review architecture."

Static routing is the right starting point because you're forced to think clearly about which tasks actually need the expensive model. Most teams discover during this exercise that the answer is "fewer than I assumed."

### Approach 2: Dynamic Routing (Complexity-Based)

Sometimes you can't tell at design time how hard a request will be. A user prompt in a general-purpose chatbot might be "what's the capital of France" (trivially Haiku) or "explain the implications of the Riemann hypothesis for cryptographic security" (definitely Opus). For these cases you need a router that decides at runtime.

The pattern: a fast, cheap classifier model (usually Haiku) looks at the incoming request and decides which downstream model should handle it.

```python
def route_request(user_prompt: str) -> str:
    """Use Haiku to classify the request, then route to the right tier."""
    
    routing_decision = client.messages.create(
        model="claude-haiku-4-5",
        max_tokens=10,
        system="""Classify this request's complexity. Output exactly one word:
SIMPLE — basic Q&A, lookup, classification, extraction
STANDARD — code, multi-step reasoning, analysis
COMPLEX — novel problems, deep architecture, multi-agent coordination""",
        messages=[{"role": "user", "content": user_prompt}]
    )
    
    tier = routing_decision.content[0].text.strip().upper()
    
    model_map = {
        "SIMPLE": "claude-haiku-4-5",
        "STANDARD": "claude-sonnet-4-6",
        "COMPLEX": "claude-opus-4-7",
    }
    chosen_model = model_map.get(tier, "claude-sonnet-4-6")  # default to safe middle
    
    response = client.messages.create(
        model=chosen_model,
        max_tokens=2048,
        messages=[{"role": "user", "content": user_prompt}]
    )
    return response.content[0].text
```

The classifier call costs almost nothing (10 tokens out, a few hundred tokens in, on Haiku). The savings come from the *next* call going to the right tier. Even if 30% of your traffic still ends up on Opus, the other 70% running on Haiku/Sonnet creates massive savings.

For teams that want this without writing it themselves, **RouteLLM** is an open-source library that does the same thing with more sophisticated complexity scoring. It's worth knowing exists, but for most beginner use cases the 30 lines of code above are sufficient.

---

## The Pricing Math

Let's run real numbers on a workload similar to ones I've seen in production. Imagine an internal assistant handling 1 million requests per month with average size 3,000 input tokens and 500 output tokens.

**Naive approach — everything on Opus 4.7:**

- Input: 3B tokens × $5/M = $15,000
- Output: 500M tokens × $25/M = $12,500
- **Monthly total: $27,500**

**Tiered routing — 70% Haiku / 20% Sonnet / 10% Opus:**

| Tier | Volume | Input cost | Output cost | Total |
|---|---|---|---|---|
| Haiku (70%) | 700K req | $2,100 | $1,750 | $3,850 |
| Sonnet (20%) | 200K req | $1,800 | $1,500 | $3,300 |
| Opus (10%) | 100K req | $1,500 | $1,250 | $2,750 |
| | | | | **$9,900** |

**Monthly bill drops from $27,500 to $9,900 — a 64% reduction.** Same outputs to the user, because the workloads were correctly matched to the model tier. You just stopped overpaying for the 70% of requests that didn't need a frontier model.

Now here's where it gets serious. Stack this with the previous two posts:

| Stack | Monthly cost | Reduction vs naive |
|---|---|---|
| Naive (all Opus) | $27,500 | — |
| Routing only | $9,900 | 64% off |
| Routing + caching | ~$3,500 | 87% off |
| Routing + caching + batch (where applicable) | ~$1,800 | 93% off |

That progression — from $27,500 down to $1,800 for the *same workload* — is the actual reason production LLM systems can be economical at scale. It's not a single magic optimization; it's three multiplicative ones applied in the right order.

---

## When Routing Pays Off (and When It Doesn't)

**Use routing when:**

- Your traffic includes a mix of clearly simple and clearly complex tasks
- You're running >$200/month in LLM costs (below this, the engineering effort isn't worth it)
- You can identify task types in code (static routing) or generate a fast classification (dynamic routing)
- Your user base tolerates some quality variance — Haiku isn't worse, but it's different on edge cases
- You have a way to measure quality so you can validate that routing didn't degrade anything

**Don't bother with routing when:**

- Every single request genuinely requires top-tier reasoning (rare, but it happens — research workloads, complex agents, frontier code generation)
- Your traffic is so low that the savings won't justify the engineering ($50/month bills don't need a router)
- You don't have a quality eval harness — without measurement, you'll silently degrade quality and not know
- You're in early prototyping and haven't validated the application yet (premature optimization)

The single most common mistake: **routing too aggressively too early.** It's better to ship with everything on Sonnet, validate it works, then carve out specific task types to push to Haiku. Going the other way — starting with everything on Haiku and discovering quality problems in production — is much harder to recover from.

---

## The Five Gotchas

These are the silent traps that catch every team's first routing deployment.

### 1. Quality drift in the tail

The 70% of "simple" requests you routed to Haiku will mostly work. The problem is the 5-10% of edge cases you didn't anticipate. Haiku will handle a clean ticket classification beautifully, then completely misclassify the one ticket where the customer is being sarcastic in three languages. Without a fallback, that single bad output ships to production.

**The fix:** build a confidence check. If Haiku's response looks degenerate (too short, malformed, contains hedging language), retry on Sonnet. Cost goes up slightly; quality holds.

### 2. The router itself is a single point of failure

If you're using dynamic routing, a bug in the classifier sends *everything* to the wrong tier. I've seen a team accidentally route 100% of traffic to Opus for three days because of a string-matching bug in the routing logic. Their bill that week was 12× normal.

**The fix:** log the routing decision on every request, alert on anomalous distributions (e.g. "Opus traffic exceeded 25% of total"), and have a kill switch that pins everything to a specific model if the router misbehaves.

### 3. Output token cost dominates at the heavy tier

Across all Claude models, output tokens cost 5× input tokens. On Opus 4.7, that's $25/MTok output vs $5/MTok input. If your "complex" tier produces long, verbose responses, the output cost will dwarf everything else. A single 4,000-token Opus response costs $0.10 — multiply by 100K requests and you're at $10,000/month from output alone.

**The fix:** set tight `max_tokens` on each tier. Haiku rarely needs more than 512 tokens of output; Sonnet usually 1,024-2,048; Opus only stretches to 4,096+ when the task genuinely requires it. Don't let your expensive tier ramble.

### 4. Cache breakage across tiers

Prompt caching is per-model. When you route the same system prompt across Haiku and Sonnet, each model maintains its own cache. If 70% of your traffic goes to Haiku and 20% to Sonnet, you're maintaining two caches with worse hit rates than if everything ran on one model.

**The fix:** for high-volume static routing, accept the duplicate caches — the per-tier savings still vastly exceed the cache cost. For dynamic routing where the split varies, monitor `cache_read_input_tokens` per model and adjust if cache hit rates collapse.

### 5. The classifier itself can hallucinate

Dynamic routers using Haiku as the classifier can occasionally output garbage — neither SIMPLE nor STANDARD nor COMPLEX, just something unexpected. Without a default fallback, your code crashes or routes to nothing.

**The fix:** the example earlier shows the right pattern — `model_map.get(tier, "claude-sonnet-4-6")` defaults to the middle tier on any unrecognized output. Always have a sane fallback. Sonnet is almost always the right default because it can handle both easy and moderately hard work without falling over.

---

## A Realistic Pattern: All Three Optimizations Together

Here's the canonical shape of a cost-optimized production pipeline that uses all three techniques from this series. Imagine a service that processes incoming customer support emails — classifying them, extracting structured data, and generating draft replies.

```python
import anthropic
from anthropic.types.message_create_params import MessageCreateParamsNonStreaming
from anthropic.types.messages.batch_create_params import Request

client = anthropic.Anthropic()

# Stable instruction blocks — different prompts per task, all cacheable
CLASSIFY_PROMPT = """You are a support email classifier...
[4,000 tokens of categories, examples, edge cases]"""

EXTRACT_PROMPT = """Extract structured data from this email...
[3,000 tokens of schema, examples]"""

DRAFT_REPLY_PROMPT = """Draft a professional reply to this customer...
[5,000 tokens of brand voice, escalation rules, examples]"""


def build_classify_request(email_id: str, email: str) -> Request:
    """Step 1: Classify — simple task, route to Haiku, cache the prompt."""
    return Request(
        custom_id=f"classify-{email_id}",
        params=MessageCreateParamsNonStreaming(
            model="claude-haiku-4-5",  # cheap tier
            max_tokens=128,
            system=[{
                "type": "text",
                "text": CLASSIFY_PROMPT,
                "cache_control": {"type": "ephemeral"}  # caching
            }],
            messages=[{"role": "user", "content": email}]
        )
    )


def build_extract_request(email_id: str, email: str) -> Request:
    """Step 2: Extract structured data — Sonnet, also cached."""
    return Request(
        custom_id=f"extract-{email_id}",
        params=MessageCreateParamsNonStreaming(
            model="claude-sonnet-4-6",  # mid tier
            max_tokens=512,
            system=[{
                "type": "text",
                "text": EXTRACT_PROMPT,
                "cache_control": {"type": "ephemeral"}
            }],
            messages=[{"role": "user", "content": email}]
        )
    )


def build_draft_request(email_id: str, email: str, urgency: str) -> Request:
    """Step 3: Draft reply — route by urgency."""
    # Routine replies on Sonnet, escalations on Opus
    model = "claude-opus-4-7" if urgency == "high" else "claude-sonnet-4-6"
    return Request(
        custom_id=f"draft-{email_id}",
        params=MessageCreateParamsNonStreaming(
            model=model,
            max_tokens=1024,
            system=[{
                "type": "text",
                "text": DRAFT_REPLY_PROMPT,
                "cache_control": {"type": "ephemeral"}
            }],
            messages=[{"role": "user", "content": email}]
        )
    )


def process_email_batch(emails: list[dict]) -> str:
    """Submit a batch combining all three steps with mixed models."""
    requests = []
    for email in emails:
        requests.append(build_classify_request(email["id"], email["text"]))
        requests.append(build_extract_request(email["id"], email["text"]))
        requests.append(build_draft_request(email["id"], email["text"], email["urgency"]))
    
    batch = client.messages.batches.create(requests=requests)
    return batch.id
```

This single pipeline applies all three optimizations:

- **Routing:** Haiku for classification, Sonnet for extraction, Sonnet/Opus for drafts based on urgency
- **Caching:** Each system prompt is cached, dramatically reducing input cost at scale
- **Batch:** The whole job runs async at 50% off

Compared to a naive implementation that does all three steps sequentially on Opus with no caching and no batch, this pipeline runs at roughly **5-7% of the cost** for the same output.

---

## How OpenAI's Approach Compares

OpenAI doesn't market a "tiered" model lineup the same way Claude does, but the concept is identical. The mapping looks like this:

| Tier | Anthropic | OpenAI |
|---|---|---|
| Light | Claude Haiku 4.5 | GPT-5.4 nano / GPT-5.4 mini |
| Standard | Claude Sonnet 4.6 | GPT-5.4 |
| Heavy | Claude Opus 4.7 | o3 / GPT-5 reasoning |

The routing pattern is exactly the same. Static routing — pick a model per task type. Dynamic routing — use a cheap classifier to decide. The code structure barely changes between providers; you're just swapping model strings.

A few honest differences worth knowing:

- **OpenAI's nano tier is cheaper than Haiku** ($0.20/$1.25 per MTok vs Haiku's $1.00/$5.00) — for very high volume classification work, OpenAI's bottom tier can win on raw price
- **Claude's quality bar across tiers tends to hold up better** — Haiku handles tasks that smaller models struggle with, which means routing can be more aggressive on Claude
- **Cross-provider routing** is a real pattern at scale — RouteLLM and similar libraries can route across both providers, picking whichever is cheapest for a given task type. This adds complexity but can squeeze out another 10-20% in cost.

For most beginners, sticking within one provider's lineup is the right call. Cross-provider routing is a problem to solve when your bill is large enough to justify the engineering — usually meaning $5K+/month in LLM spend.

---

## A Five-Step Action Plan

If your application has any meaningful LLM volume, here's the order of operations:

1. **Audit your task types.** List every distinct LLM call your application makes. For each one, write down: what's the actual reasoning required? Be honest. Most teams discover that 60-70% of their calls are doing work a smaller model could handle.
2. **Migrate the obvious wins to Haiku first.** Classification, simple extraction, format conversion, routing decisions — these are no-brainers. Run a side-by-side comparison on a sample of real traffic. If Haiku matches Sonnet on the metrics you care about, switch.
3. **Keep Sonnet as your default** for everything in the gray zone. Sonnet is the workhorse — don't agonize over whether something might be doable on Haiku unless you have data.
4. **Reserve Opus for proven needs.** Only route to Opus when you've tested and shown that Sonnet's output is materially worse. "It might benefit from Opus" is not enough justification.
5. **Build a quality dashboard before you start.** You cannot do model routing safely without measurement. Track quality per tier per task type. If quality drops, the dashboard tells you immediately. Without it, you're flying blind.

That last one is the one most teams skip and regret. Routing without measurement is gambling, not optimization.

---

## The Mental Model Worth Remembering

Beginner LLM tutorials teach you to call one model. Production LLM systems use three or four, picked deliberately for each kind of work. The shift from "which model is best?" to "which model is best *for this specific task*?" is the conceptual leap that separates someone learning the API from someone shipping at scale.

The teams that do this well aren't picking models based on benchmarks or vibes — they're picking based on the **observed quality on their own evaluation set** for each task type. A team building a code review tool might use Sonnet for general review and Opus only for security-critical analysis. A team doing document extraction might use Haiku for everything because their extraction tasks are well-bounded. There's no universal answer, only an answer for your application.

The compound effect of caching, batching, and routing is the reason production LLM costs in 2026 can be **5-15× lower than they were in 2024** for the same workloads. None of these techniques is exotic. None requires a research team or a custom infrastructure stack. They're available to anyone reading the docs.

Once you internalize that LLM cost optimization is mostly architectural — *where* you call the API, *which* model you call, *which* parts you cache — you stop thinking of it as "saving money" and start thinking of it as "designing the system correctly." That shift is the actual goal of this series.

---

## Further Reading

- Anthropic's model selection guide: [Choosing the right Claude model](https://docs.claude.com/en/docs/about-claude/models)
- RouteLLM: open-source dynamic routing across providers
- Companion posts: *Prompt Caching* (Part 1) and *Batch Processing* (Part 2)

If you've read all three posts, you now have the same cost-optimization toolkit production LLM teams use at scale: caching for static prefixes, batch for async work, and routing for matching tasks to model tiers. The next post in the series — *Building Production Eval Harnesses* — is the missing piece that lets you do all this safely. You can't optimize what you don't measure, and you can't measure quality at scale without a proper eval harness.
