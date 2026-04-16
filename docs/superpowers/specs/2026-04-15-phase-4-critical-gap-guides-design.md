# Phase 4 — Critical Gap Guides Design

**Date:** 2026-04-15
**Parent plan:** Phase 4 of 6 in the production-readiness roadmap
**Goal:** Fill three critical content gaps in Module 1 (Fundamentals) with new interactive guides for Embeddings, Safety & Alignment, and Evaluation & Benchmarks.

---

## Context

Modules 1-5 are functionally complete but three foundational topics are missing: how text becomes numbers (embeddings), how models are made safe (alignment + guardrails), and how to measure AI quality (evaluation + benchmarks). These concepts are referenced in passing across existing guides (RAG mentions embeddings, limitations mentions hallucinations, verify-framework gives a personal checklist) but never taught as standalone topics. This phase fills those gaps with three new guides that go deeper than the surface-level references.

---

## Module 1 Structure After Phase 4

| ID | Title | File | Badge | Status |
|---|---|---|---|---|
| 1.1 | What is Generative AI? | `what-is-genai.html` | BEGINNER | existing |
| 1.2 | Regular vs Gen AI | `regular-vs-genai.html` | BEGINNER | existing |
| 1.3 | Inside the Black Box | `how-genai-works.html` | DEEP DIVE | existing |
| 1.4 | Types of AI Models | `ai-model-types.html` | INTERACTIVE | existing |
| 1.5 | Three Critical Limitations | `limitations.html` | BEGINNER | existing |
| 1.6 | VERIFY Framework | `verify-framework.html` | INTERACTIVE | existing |
| **1.7** | **Embeddings** | **`embeddings.html`** | **DEEP DIVE** | **new** |
| **1.8** | **Safety & Alignment** | **`safety-alignment.html`** | **INTERACTIVE** | **new** |
| **1.9** | **Evaluation & Benchmarks** | **`evaluation.html`** | **INTERACTIVE** | **new** |
| 1.10 | Module 1 Quiz | `quiz.html` | QUIZ | existing (renumbered from 1.7) |

**Pedagogical arc:** "What is it?" (1.1-1.2) → "How does it work?" (1.3-1.4) → "What are the risks?" (1.5-1.6) → "How does text become numbers?" (1.7) → "How do we keep it safe?" (1.8) → "How do we measure quality?" (1.9) → Quiz (1.10)

---

## NEXT_GUIDE Chain Updates

| Guide | Current NEXT_GUIDE | New NEXT_GUIDE |
|---|---|---|
| `verify-framework.html` (1.6) | `{ id: "1.7", title: "Fundamentals Quiz", href: "./quiz.html", isQuiz: true }` | `{ id: "1.7", title: "Embeddings", module: "Module 1", href: "./embeddings.html" }` |
| `embeddings.html` (1.7) | n/a (new) | `{ id: "1.8", title: "Safety & Alignment", module: "Module 1", href: "./safety-alignment.html" }` |
| `safety-alignment.html` (1.8) | n/a (new) | `{ id: "1.9", title: "Evaluation & Benchmarks", module: "Module 1", href: "./evaluation.html" }` |
| `evaluation.html` (1.9) | n/a (new) | `{ id: "1.10", title: "Fundamentals Quiz", module: "Module 1", href: "./quiz.html", isQuiz: true }` |

---

## Guide 1.7: Embeddings (DEEP DIVE)

**File:** `guides/fundamentals/embeddings.html`
**Target size:** ~1200 lines
**Pedagogical goal:** Learners understand that "words become numbers in a space where meaning = proximity" — the concept underpinning RAG retrieval, semantic search, and recommendation systems.

### Stage 1: The Problem

**Sidebar label:** Problem
**Header:** Why Computers Can't Read Words

Text is categorical, not numerical. Computers operate on numbers. Simple approaches like one-hot encoding create sparse vectors that lose all meaning — "happy" and "joyful" are as different as "happy" and "submarine." Motivates the need for dense representations that capture meaning.

**Scene card:** SVG showing one-hot vectors for 3 words — massive sparse grids with a single 1 — to visually convey the waste and the loss of semantic relationships.

**Insight:** "If every word is equally different from every other word, the computer has no way to understand that 'vacation' and 'holiday' mean the same thing."

### Stage 2: What Are Embeddings?

**Sidebar label:** Vectors
**Header:** Words as Points in Meaning-Space

Embeddings map words to dense vectors (e.g., 768 or 1536 dimensions) where similar meanings cluster nearby. Dimensionality reduction to 2D for visualization. The classic example: king − man + woman ≈ queen (vector arithmetic encodes relationships).

**Scene card: Interactive 2D scatter-plot SVG** showing labeled word clusters:
- Royalty cluster: king, queen, prince, princess
- Animal cluster: cat, dog, horse, fish
- Emotion cluster: happy, joyful, sad, angry

Click a word to highlight it and show dashed lines to its nearest neighbors with similarity scores.

**Insight:** "In embedding space, meaning IS proximity. Words that are used in similar contexts end up at similar coordinates — even across languages."

### Stage 3: How Similarity Works

**Sidebar label:** Similarity
**Header:** Measuring Meaning with Math

Cosine similarity: measures the angle between two vectors. Same direction = similar (cosine ≈ 1.0). Perpendicular = unrelated (cosine ≈ 0). Opposite = antonym-ish (cosine ≈ -1). Key distinction: cosine measures direction, not magnitude — a short vector and a long vector pointing the same way are still similar.

**Scene card: Interactive similarity explorer.** A list of 6 word-pairs displayed as clickable pills (e.g., "cat / kitten", "king / queen", "cat / democracy", "happy / joyful", "hot / cold", "bank / river"). Clicking a pair shows:
- An SVG gauge from 0.0 to 1.0 with the needle at the cosine score
- A one-line explanation ("These words appear in very similar contexts → high similarity")

**Insight:** "This is why 'vacation' matches 'annual leave' in a RAG system — their embeddings point nearly the same direction, even though they share zero words."

### Stage 4: Vector Databases

**Sidebar label:** Vector DBs
**Header:** Storing and Searching Millions of Meanings

Once you embed millions of documents, you need specialized storage. Vector databases index embeddings for fast approximate nearest-neighbor (ANN) search. They trade perfect accuracy for speed — finding 95% of the best matches in milliseconds instead of 100% in hours.

**Scene card: Click-expand cards** for 4 vector DBs:
- Pinecone — Fully managed cloud vector DB. Best for: teams that want zero infrastructure.
- Chroma — Open-source, embeds in your app. Best for: prototyping and local development.
- FAISS (Meta) — Library, not a service. Best for: high-performance research workloads.
- Weaviate — Open-source with hybrid search. Best for: combining keyword + vector search.

Each card: emoji, title, one-line subtitle, expandable detail with use case. Follow existing `click-card` + `disclosure-badge` pattern from `overview.html`.

**Insight:** "A vector database is like a library organized by meaning instead of author name. Ask for 'vacation policy' and it finds documents about 'PTO,' 'annual leave,' and 'time-off guidelines' — even if none contain the word 'vacation.'"

### Stage 5: Embeddings in Action

**Sidebar label:** In Action
**Header:** Where Embeddings Power Real Systems

Three use cases presented as tabbed panels (following the tab pattern from `overview.html` S2):
1. **RAG Retrieval** — Embed the question, search the vector DB, retrieve the most relevant chunks, feed to LLM. Callback to Module 5.3 (RAG Architecture).
2. **Semantic Search** — Beyond keyword matching. Search engines, support ticket routing, code search.
3. **Clustering & Recommendations** — Group similar items automatically. Product recommendations, document categorization, anomaly detection.

**Scene card: SVG flow diagram** showing the RAG pipeline with embeddings highlighted: Document → **Embed** → **Store** → Query → **Retrieve** → Augment → Generate. The "Embed," "Store," and "Retrieve" steps are highlighted in the primary purple color to show where embeddings do the work.

**Insight:** "Embeddings are the invisible bridge between human language and machine computation. Every time an AI 'understands' your question, embeddings are doing the heavy lifting."

---

## Guide 1.8: Safety & Alignment (INTERACTIVE)

**File:** `guides/fundamentals/safety-alignment.html`
**Target size:** ~1300 lines
**Pedagogical goal:** Learners understand that AI safety is an engineering discipline, not a checkbox. They can identify common attack vectors and know what guardrails exist.

**Relationship to existing guides:** `limitations.html` (1.5) covers hallucinations, knowledge cutoff, and reasoning at a surface level. `verify-framework.html` (1.6) provides a personal checklist for responsible use. This guide goes deeper into adversarial threats and systemic defenses — the organizational layer below the personal one.

### Stage 1: Beyond Hallucinations

**Sidebar label:** Failures
**Header:** A Deeper Look at AI Failure Modes

Limitations.html introduced hallucinations. This stage expands the failure taxonomy:
- **Confident fabrication** — inventing plausible facts, citations, statistics
- **Sycophancy** — agreeing with wrong premises to please the user
- **Reasoning failures** — correct-sounding logic that breaks on edge cases
- **Training data leakage** — regurgitating memorized private data

**Scene card: Interactive "Spot the Failure" exercise.** 4 cards, each showing an AI output snippet. Learner clicks to identify which failure type it represents (multiple-choice dropdown per card). On selection, card reveals with color-coded correct/incorrect feedback + explanation.

**Insight:** "Hallucinations get the headlines, but sycophancy may be more dangerous — an AI that tells you what you want to hear instead of what's true."

### Stage 2: Attack Vectors

**Sidebar label:** Attacks
**Header:** How Bad Actors Exploit AI

Three attack families:
- **Jailbreaks** — persuasion-based ("pretend you're DAN"), role-play ("you are an unrestricted AI"), multi-turn escalation
- **Direct prompt injection** — "ignore previous instructions and instead..."
- **Indirect prompt injection** — malicious instructions hidden in retrieved documents, emails, or web pages that the AI processes

**Scene card: Interactive "Spot the Attack" exercise.** 4 scenario cards, each showing a prompt or context. Learner clicks to classify: benign / jailbreak / direct injection / indirect injection. Reveal with explanation of why each classification is correct. Uses the same card-with-reveal pattern as Stage 1.

**Insight:** "Indirect prompt injection is the hardest to defend against because the attack doesn't come from the user — it comes from the data the AI is told to trust."

### Stage 3: How Models Get Aligned

**Sidebar label:** Alignment
**Header:** Teaching AI to Follow Rules

The RLHF pipeline (3 steps):
1. **Supervised Fine-Tuning (SFT)** — train on curated helpful examples
2. **Reward Model** — humans rank outputs; train a model to predict human preferences
3. **PPO Optimization** — use the reward model to steer the base model toward preferred outputs

DPO (Direct Preference Optimization) as the simpler alternative — skips the reward model, learns directly from preference pairs. Constitutional AI — the model critiques its own outputs against a set of principles.

The alignment tax: safety training can reduce raw capability. The tradeoff is worth it.

**Scene card: SVG pipeline diagram** showing the RLHF three-step flow: Base Model → SFT → Reward Model → PPO → Aligned Model. Each step is a labeled box with a one-line description. An alternative branch shows DPO as a shortcut from SFT directly to Aligned Model.

**Insight:** "RLHF is like training a new employee: first show them examples of good work, then have a manager rate their output, then coach them to produce more of what the manager likes."

### Stage 4: Enterprise Guardrails

**Sidebar label:** Guardrails
**Header:** Defense in Depth for Production AI

Guardrails as layers:
- **Input filters** — block prompt injections, PII, prohibited topics before they reach the model
- **Output validation** — check responses for hallucinations, harmful content, PII leakage
- **Rate limiting** — prevent abuse and cost runaway
- **Moderation APIs** — OpenAI Moderation, Anthropic content filtering, AWS Comprehend
- **Sandboxing** — limit what the AI can access (tools, data, network)

**Scene card: Click-expand cards** for each guardrail layer. Each card shows: what it blocks, a before/after example (unfiltered → filtered output), and when to use it. Follow existing `click-card` + `disclosure-badge` pattern.

**Insight:** "No single guardrail is enough. Production AI systems stack 3-5 layers of defense — just like network security doesn't rely on a single firewall."

### Stage 5: Responsible Deployment

**Sidebar label:** Deploy
**Header:** From Lab to Production Safely

The deployment checklist:
- **Red-teaming** before launch (preview of the evaluation guide 1.9)
- **Monitoring** in production — track hallucination rates, user flags, drift
- **Incident response** — what to do when things go wrong (rollback, disable, communicate)
- **Human-in-the-loop** — when to keep a human reviewer

Callback to VERIFY framework (1.6) as the individual-level practice that complements organizational guardrails.

**Scene card: Deployment readiness checklist** rendered as a styled list with checkboxes (visual only, not interactive state). Each item has a brief explanation. The design reinforces that safety is a process, not a gate.

**Insight:** "Security is a spectrum, not a switch. The goal isn't perfect safety — it's knowing your risk surface and reducing it systematically."

---

## Guide 1.9: Evaluation & Benchmarks (INTERACTIVE)

**File:** `guides/fundamentals/evaluation.html`
**Target size:** ~1200 lines
**Pedagogical goal:** Learners understand that "try it and see" isn't evaluation — systematic measurement is how you know if AI works for your use case.

### Stage 1: The Evaluation Problem

**Sidebar label:** Problem
**Header:** Why "It Looks Good" Isn't Enough

Vibes-based testing vs. systematic evaluation. Three failure modes of informal testing: confirmation bias (you notice what works), small sample (3 good outputs ≠ reliable), edge case blindness (real users find inputs you'd never test). The three pillars of evaluation: correctness, safety, usefulness.

**Scene card: SVG comparison** — left panel "Vibes-Based Testing" (person looking at 3 outputs, thumbs up) vs. right panel "Systematic Evaluation" (spreadsheet with scores, 200 test cases, statistical summary). The visual contrast drives the point.

**Insight:** "You wouldn't ship a car without crash tests. You wouldn't launch a drug without clinical trials. Why would you deploy AI without a systematic evaluation?"

### Stage 2: Public Benchmarks

**Sidebar label:** Benchmarks
**Header:** The Standardized Tests of AI

Five major benchmarks:
- **MMLU** — 57 academic subjects, tests knowledge breadth (14K questions)
- **HumanEval** — code generation, 164 programming problems
- **MT-Bench** — multi-turn conversation quality, scored by GPT-4
- **HELM** — holistic evaluation across 42 scenarios + 7 metrics
- **Chatbot Arena** — head-to-head human preference voting (Elo ratings)

**Scene card: Interactive benchmark cards.** 5 click-expand cards, each showing:
- What it tests (one sentence)
- Sample question/task (concrete example)
- Current top performers (2-3 model names + scores)
- Key limitation (one sentence)

Follow existing `click-card` + `disclosure-badge` pattern.

**Insight:** "Benchmarks tell you how a model compares to others. They don't tell you if it works for YOUR task. A model scoring 90% on MMLU might score 40% on your company's domain-specific questions."

### Stage 3: LLM-as-Judge

**Sidebar label:** LLM Judge
**Header:** Using AI to Evaluate AI

Concept: use a capable model (e.g., GPT-4, Claude) to score another model's outputs against a rubric. Agreement rates with humans: ~80-85%. Known biases: position bias (prefers the first option), verbosity bias (prefers longer answers), self-preference (prefers its own outputs).

**Scene card: Interactive "Rate This Output" exercise.** Show:
1. A user prompt
2. An AI response
3. A 3-criteria rubric (Accuracy 1-5, Completeness 1-5, Clarity 1-5)

Learner clicks to set their score on each criterion (5 clickable circles per row). After scoring all three, a "Compare" button reveals the LLM-judge's scores side-by-side with the learner's. Brief explanation of any divergence.

**Insight:** "LLM-as-judge scales evaluation from hundreds to millions of test cases. The tradeoff: ~15-20% disagreement with human raters. For most applications, that's good enough to catch regressions."

### Stage 4: Custom Eval Sets

**Sidebar label:** Custom Evals
**Header:** Building Your Own Evaluation

The golden dataset: 50-200 examples with expected outputs and rubrics. Quality matters more than quantity. The eval flywheel: deploy → collect real failures → add failures to eval set → improve the system → redeploy.

A/B testing basics: how to compare two model versions statistically. Concept of statistical significance (enough test cases to trust the difference is real, not noise).

**Scene card: SVG flow diagram** — the eval flywheel as a circular pipeline: Deploy → Monitor → Collect Failures → Add to Eval Set → Improve System → back to Deploy. Each step is a labeled node in a circular arrangement.

**Insight:** "The best eval sets aren't designed — they're grown. Start with 50 examples. After a month in production, your users will have found the failures you never imagined."

### Stage 5: Red Teaming

**Sidebar label:** Red Team
**Header:** Breaking AI on Purpose

Red teaming as a discipline: systematically trying to make the AI fail. Two approaches:
- **Systematic** — category grid: bias, factuality, safety, edge cases, adversarial inputs, format compliance
- **Creative** — persona-based testing (confused user, malicious user, domain expert, child), scenario-based testing

**Scene card: Interactive mini red-team exercise.** Present a use case scenario (e.g., "customer support chatbot for a bank"). Show a 2x3 grid of test categories (bias, factuality, safety, edge cases, adversarial, format). Learner clicks 3 categories to build their red-team plan. After selecting, each chosen category reveals 2-3 specific test prompts they would use.

Callback to Safety guide (1.8): red-teaming tests the guardrails designed in Stage 4 of that guide.

**Insight:** "The goal of red teaming isn't to prove the AI works — it's to find where it breaks. A red team that finds nothing hasn't done its job."

---

## Integration Work

### `index.html` — MODULES array updates

Add 3 new entries after the 1.6 VERIFY entry:

```js
{ id: "1.7", title: "Embeddings", path: "guides/fundamentals/embeddings.html", badge: "DEEP DIVE", available: true, emoji: "🧮", desc: "How text becomes numbers in meaning-space" },
{ id: "1.8", title: "Safety & Alignment", path: "guides/fundamentals/safety-alignment.html", badge: "INTERACTIVE", available: true, emoji: "🛡️", desc: "Attack vectors, alignment, and enterprise guardrails" },
{ id: "1.9", title: "Evaluation & Benchmarks", path: "guides/fundamentals/evaluation.html", badge: "INTERACTIVE", available: true, emoji: "📏", desc: "Systematic testing from benchmarks to red teaming" },
```

Update quiz entry: `id: "1.7"` → `id: "1.10"`.

### `guides/fundamentals/verify-framework.html` — NEXT_GUIDE update

Change from `{ id: "1.7", title: "Fundamentals Quiz", ..., href: "./quiz.html", isQuiz: true }` to `{ id: "1.7", title: "Embeddings", module: "Module 1", href: "./embeddings.html" }`.

### `guides/fundamentals/quiz.html` — Renumber + 3 new questions

1. Change guide number display from `1.7` to `1.10` (line 819).
2. Add 3 new questions to the questions array:

**Embeddings Q:**
```js
{
  id: 19,
  section: "Embeddings",
  question: "What does cosine similarity measure between two embedding vectors?",
  options: [
    "The physical distance between the vectors",
    "The number of shared words",
    "The directional similarity of their meaning",
    "The length of each vector"
  ],
  correct: 2,
  explanation: "Cosine similarity measures the angle between two vectors \u2014 vectors pointing in similar directions have similar meaning, regardless of their magnitude. This is how RAG systems find semantically similar documents even when they share no keywords."
}
```

**Safety Q:**
```js
{
  id: 20,
  section: "Safety & Alignment",
  question: "Which type of attack tricks an AI by embedding malicious instructions in documents the AI retrieves and processes?",
  options: [
    "Jailbreaking",
    "Social engineering",
    "Direct prompt injection",
    "Indirect prompt injection"
  ],
  correct: 3,
  explanation: "Indirect prompt injection hides malicious instructions in external content (documents, emails, web pages) that the AI processes. Unlike direct injection where the user types the attack, indirect injection comes through the data the AI is told to trust \u2014 making it harder to detect."
}
```

**Evaluation Q:**
```js
{
  id: 21,
  section: "Evaluation & Benchmarks",
  question: "What is the main limitation of using public benchmarks like MMLU to evaluate an LLM for your specific use case?",
  options: [
    "Benchmarks are too easy for modern models",
    "Benchmarks test general knowledge, not your domain-specific needs",
    "Benchmarks are always outdated",
    "Benchmarks only measure response speed"
  ],
  correct: 1,
  explanation: "Public benchmarks test broad capabilities across standardized tasks. A model scoring 90% on MMLU might score 40% on your company\u2019s domain-specific questions. Custom evaluation sets aligned with your actual use case are essential for reliable deployment decisions."
}
```

### Each new guide — standard structure

Every new guide follows the established conventions:

- `<head>`: Google Fonts link → `<link rel="stylesheet" href="../../assets/guide-shared.css">` → full OG/meta tag block
- Inline `<style>`: guide-specific component styles only (interactive elements, custom cards)
- JSX structure: `React.Fragment` → skip-link → `.container` → `<aside>` sidebar → `.main-content` → top-bar → `.content-area`
- `NEXT_GUIDE` constant before the stages array
- Up-Next card on final stage
- ARIA: `aria-label` on sidebar/nav, `aria-current="step"` on active step, `button type="button"` for all interactive controls, `aria-expanded` + `aria-controls` on disclosure cards, `onKeyDown` for Enter/Space

---

## Files Inventory

| Type | Files | Count |
|---|---|---|
| **Create** | `guides/fundamentals/embeddings.html`, `guides/fundamentals/safety-alignment.html`, `guides/fundamentals/evaluation.html` | 3 |
| **Modify** | `index.html`, `guides/fundamentals/verify-framework.html`, `guides/fundamentals/quiz.html` | 3 |
| **Total** | | **6** |

---

## Out of Scope

- Final exam question updates (Phase 6 will audit for new-guide coverage)
- External SVG assets (inline SVGs per project convention)
- Content edits to existing guides (only NEXT_GUIDE and quiz ID changes)
- Mobile responsive breakpoints (Phase 6)
- Per-guide OG images (Phase 6 — the `og-default.svg` placeholder is used)

---

## Verification Plan

1. **Landing page:** All 10 Module 1 entries render in order (1.1-1.10). New guide cards show correct badges and emojis.
2. **Navigation chain:** Click through 1.6 → 1.7 → 1.8 → 1.9 → 1.10 using Up-Next cards. Each link works.
3. **Per-guide check (x3):** Each new guide loads, sidebar shows 5 stages, all stages render, scene cards display, interactive elements respond to clicks, insight boxes appear.
4. **Quiz:** Module 1 quiz shows guide number 1.10. Questions 19-21 appear at the end. Answers score correctly.
5. **Accessibility:** Tab through each new guide — skip-link works, step buttons focusable with visible ring, disclosure cards respond to Enter/Space.
6. **No regressions:** Spot-check 2 existing guides (what-is-genai, limitations) — no style or behavior changes.
