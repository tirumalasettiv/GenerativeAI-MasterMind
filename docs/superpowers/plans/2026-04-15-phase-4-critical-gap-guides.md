# Phase 4 — Critical Gap Guides Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create three new fundamentals guides (Embeddings 1.7, Safety & Alignment 1.8, Evaluation & Benchmarks 1.9) and integrate them into the Module 1 navigation chain, landing page, and quiz.

**Architecture:** Each guide is a self-contained HTML file (~1200 lines) with inline CSS + JSX compiled in-browser by Babel. Follows the existing two-panel layout pattern. Interactive elements use React useState hooks. All guides link `assets/guide-shared.css` and keep only guide-specific styles inline.

**Tech Stack:** React 18.2.0 + ReactDOM (CDN), Babel Standalone 7.23.9, Google Fonts (DM Sans + Fraunces), `assets/guide-shared.css` for shared tokens/layout.

**Spec:** `docs/superpowers/specs/2026-04-15-phase-4-critical-gap-guides-design.md`

---

## Structural Template

Every new guide follows the exact structure of `guides/fundamentals/what-is-genai.html`. The implementer MUST read that file as the structural reference. Key structural elements:

**`<head>` block (lines 1-21):** meta charset, viewport, description, theme-color, og:title, og:description, og:type, og:image, twitter:card, twitter:title, twitter:description, favicon, title, Google Fonts link, guide-shared.css link, React CDN, ReactDOM CDN, Babel standalone.

**`<style>` block:** Only guide-specific component styles. Layout/typography/badges/cards come from guide-shared.css.

**`<script type="text/babel">` block:**
1. Stage components (S1, S2, S3, S4, S5) as functional React components
2. SVG icon strings for sidebar steps
3. `NEXT_GUIDE` constant
4. `stages` array mapping icons → labels → components
5. `Guide()` main component with `useState(0)` for currentStage, `useRef` for contentRef
6. JSX shell: React.Fragment → skip-link → .container → aside.sidebar → .main-content → .top-bar → main#main.content-area → CurrentComponent + up-next-card on final stage
7. `ReactDOM.createRoot(document.getElementById('root')).render(<Guide />);`

**Accessibility requirements:** skip-link, `<aside aria-label="Guide sections">`, `<button type="button">` for step-btns with `aria-label` and `aria-current`, `<nav aria-label="Section navigation">` for arrows, `<main id="main">`, `aria-expanded` + `aria-controls` + `onKeyDown` for any disclosure cards, `role="complementary"` on up-next-card.

**Disclosure card pattern (from overview.html):** Cards with `role="button"`, `tabIndex={0}`, `onClick={toggle}`, `onKeyDown` for Enter/Space, `aria-expanded={isOpen}`, `aria-controls={id}`, and a `.disclosure-badge` chevron SVG that rotates on expand. CSS classes: `click-card`, `disclosure-card-host`, `click-card-emoji`, `click-card-title`, `click-card-sub`, `click-card-detail`. These classes are defined guide-locally (copy the CSS from overview.html into the new guide's `<style>` block).

---

## Task 0: Setup worktree

- [ ] Verify `.worktrees` is gitignored
- [ ] `git worktree add .worktrees/phase-4-guides -b phase-4-guides`
- [ ] Verify clean baseline

---

## Task 1: Create `guides/fundamentals/embeddings.html`

**Files:**
- Create: `guides/fundamentals/embeddings.html`

**NEXT_GUIDE:** `{ id: "1.8", title: "Safety & Alignment", module: "Module 1", href: "./safety-alignment.html" }`

**Guide number:** 1.7
**Title:** Embeddings
**Badge:** DEEP DIVE
**Meta description:** "Learn how text becomes numbers in meaning-space. Interactive guide to embeddings, vector similarity, vector databases, and how they power RAG and semantic search."

**5 Stages (see spec for full content):**

| # | Label | Header | Key Interactive Element |
|---|---|---|---|
| 1 | Problem | Why Computers Can't Read Words | SVG: one-hot encoding visualization (sparse grids) |
| 2 | Vectors | Words as Points in Meaning-Space | Interactive: 2D scatter-plot with clickable word clusters, click highlights neighbors + similarity scores |
| 3 | Similarity | Measuring Meaning with Math | Interactive: 6 clickable word-pairs, each reveals SVG gauge (0-1) with cosine score + explanation |
| 4 | Vector DBs | Storing and Searching Millions of Meanings | Click-expand cards: Pinecone, Chroma, FAISS, Weaviate (use disclosure-card pattern) |
| 5 | In Action | Where Embeddings Power Real Systems | Tabbed panels (RAG/Search/Clustering) + SVG flow diagram of RAG pipeline with embed steps highlighted |

**Insight texts (one per stage, in order):**
1. "If every word is equally different from every other word, the computer has no way to understand that 'vacation' and 'holiday' mean the same thing."
2. "In embedding space, meaning IS proximity. Words that are used in similar contexts end up at similar coordinates — even across languages."
3. "This is why 'vacation' matches 'annual leave' in a RAG system — their embeddings point nearly the same direction, even though they share zero words."
4. "A vector database is like a library organized by meaning instead of author name. Ask for 'vacation policy' and it finds documents about 'PTO,' 'annual leave,' and 'time-off guidelines.'"
5. "Embeddings are the invisible bridge between human language and machine computation. Every time an AI 'understands' your question, embeddings are doing the heavy lifting."

- [ ] **Step 1:** Read `guides/fundamentals/what-is-genai.html` as the structural template
- [ ] **Step 2:** Create the full `guides/fundamentals/embeddings.html` file following the template structure, with all 5 stages implemented as described above
- [ ] **Step 3:** Verify the file loads in a browser (check for JSX syntax errors by opening it)
- [ ] **Step 4:** Verify NEXT_GUIDE is set correctly
- [ ] **Step 5:** Commit

---

## Task 2: Create `guides/fundamentals/safety-alignment.html`

**Files:**
- Create: `guides/fundamentals/safety-alignment.html`

**NEXT_GUIDE:** `{ id: "1.9", title: "Evaluation & Benchmarks", module: "Module 1", href: "./evaluation.html" }`

**Guide number:** 1.8
**Title:** Safety & Alignment
**Badge:** INTERACTIVE
**Meta description:** "Interactive guide to AI safety. Explore failure modes, attack vectors, RLHF alignment, enterprise guardrails, and responsible deployment practices."

**5 Stages (see spec for full content):**

| # | Label | Header | Key Interactive Element |
|---|---|---|---|
| 1 | Failures | A Deeper Look at AI Failure Modes | Interactive: "Spot the Failure" — 4 AI output cards, learner identifies failure type (fabrication/sycophancy/reasoning/leakage), reveal with feedback |
| 2 | Attacks | How Bad Actors Exploit AI | Interactive: "Spot the Attack" — 4 scenario cards, classify as benign/jailbreak/direct-injection/indirect-injection, reveal |
| 3 | Alignment | Teaching AI to Follow Rules | SVG pipeline: Base Model → SFT → Reward Model → PPO → Aligned Model, with DPO shortcut branch |
| 4 | Guardrails | Defense in Depth for Production AI | Click-expand cards: input filters, output validation, rate limiting, moderation APIs, sandboxing (disclosure pattern) |
| 5 | Deploy | From Lab to Production Safely | Styled deployment checklist (visual checkboxes, not interactive state), callback to VERIFY framework |

**Insight texts:**
1. "Hallucinations get the headlines, but sycophancy may be more dangerous — an AI that tells you what you want to hear instead of what's true."
2. "Indirect prompt injection is the hardest to defend against because the attack doesn't come from the user — it comes from the data the AI is told to trust."
3. "RLHF is like training a new employee: first show them examples of good work, then have a manager rate their output, then coach them to produce more of what the manager likes."
4. "No single guardrail is enough. Production AI systems stack 3-5 layers of defense — just like network security doesn't rely on a single firewall."
5. "Security is a spectrum, not a switch. The goal isn't perfect safety — it's knowing your risk surface and reducing it systematically."

- [ ] **Step 1:** Read `guides/fundamentals/what-is-genai.html` as the structural template
- [ ] **Step 2:** Create the full `guides/fundamentals/safety-alignment.html` file
- [ ] **Step 3:** Verify the file loads in a browser
- [ ] **Step 4:** Verify NEXT_GUIDE is set correctly
- [ ] **Step 5:** Commit

---

## Task 3: Create `guides/fundamentals/evaluation.html`

**Files:**
- Create: `guides/fundamentals/evaluation.html`

**NEXT_GUIDE:** `{ id: "1.10", title: "Fundamentals Quiz", module: "Module 1", href: "./quiz.html", isQuiz: true }`

**Guide number:** 1.9
**Title:** Evaluation & Benchmarks
**Badge:** INTERACTIVE
**Meta description:** "Interactive guide to evaluating AI. Learn about benchmarks (MMLU, HumanEval), LLM-as-judge, custom eval sets, and red teaming for production AI."

**5 Stages (see spec for full content):**

| # | Label | Header | Key Interactive Element |
|---|---|---|---|
| 1 | Problem | Why "It Looks Good" Isn't Enough | SVG comparison: "Vibes-Based Testing" (person, 3 outputs, thumbs up) vs "Systematic Evaluation" (spreadsheet, 200 cases, stats) |
| 2 | Benchmarks | The Standardized Tests of AI | Click-expand cards: MMLU, HumanEval, MT-Bench, HELM, Chatbot Arena (disclosure pattern) |
| 3 | LLM Judge | Using AI to Evaluate AI | Interactive: "Rate This Output" — show prompt + AI response + 3-criteria rubric, learner scores 1-5 per criterion (clickable circles), Compare button reveals LLM-judge scores |
| 4 | Custom Evals | Building Your Own Evaluation | SVG: eval flywheel circular diagram (Deploy → Monitor → Collect Failures → Add to Eval Set → Improve → Deploy) |
| 5 | Red Team | Breaking AI on Purpose | Interactive: use-case scenario + 2x3 category grid, learner picks 3 categories to build red-team plan, reveal shows specific test prompts per category |

**Insight texts:**
1. "You wouldn't ship a car without crash tests. You wouldn't launch a drug without clinical trials. Why would you deploy AI without a systematic evaluation?"
2. "Benchmarks tell you how a model compares to others. They don't tell you if it works for YOUR task. A model scoring 90% on MMLU might score 40% on your company's domain-specific questions."
3. "LLM-as-judge scales evaluation from hundreds to millions of test cases. The tradeoff: ~15-20% disagreement with human raters. For most applications, that's good enough to catch regressions."
4. "The best eval sets aren't designed — they're grown. Start with 50 examples. After a month in production, your users will have found the failures you never imagined."
5. "The goal of red teaming isn't to prove the AI works — it's to find where it breaks. A red team that finds nothing hasn't done its job."

- [ ] **Step 1:** Read `guides/fundamentals/what-is-genai.html` as the structural template
- [ ] **Step 2:** Create the full `guides/fundamentals/evaluation.html` file
- [ ] **Step 3:** Verify the file loads in a browser
- [ ] **Step 4:** Verify NEXT_GUIDE is set correctly
- [ ] **Step 5:** Commit

---

## Task 4: Update `verify-framework.html` NEXT_GUIDE + Update `index.html` MODULES + Update `quiz.html`

**Files:**
- Modify: `guides/fundamentals/verify-framework.html` (line ~409)
- Modify: `index.html` (lines 34-40, MODULES array for Module 1)
- Modify: `guides/fundamentals/quiz.html` (line 819 guide number + add 3 questions)

### 4a: verify-framework.html NEXT_GUIDE

Current (line 409):
```js
const NEXT_GUIDE = { id: "1.7", title: "Fundamentals Quiz", module: "Module 1", href: "./quiz.html", isQuiz: true };
```

New:
```js
const NEXT_GUIDE = { id: "1.7", title: "Embeddings", module: "Module 1", href: "./embeddings.html" };
```

### 4b: index.html MODULES array

After the 1.6 VERIFY entry (line 39), insert 3 new entries:
```js
{ id: "1.7", title: "Embeddings", path: "guides/fundamentals/embeddings.html", badge: "DEEP DIVE", available: true, emoji: "🧮", desc: "How text becomes numbers in meaning-space" },
{ id: "1.8", title: "Safety & Alignment", path: "guides/fundamentals/safety-alignment.html", badge: "INTERACTIVE", available: true, emoji: "🛡️", desc: "Attack vectors, alignment, and enterprise guardrails" },
{ id: "1.9", title: "Evaluation & Benchmarks", path: "guides/fundamentals/evaluation.html", badge: "INTERACTIVE", available: true, emoji: "📏", desc: "Systematic testing from benchmarks to red teaming" },
```

Update quiz entry from `id: "1.7"` to `id: "1.10"`.

### 4c: quiz.html

1. Change guide number from `1.7` to `1.10` (line 819: `<span className="guide-number">1.7</span>` → `<span className="guide-number">1.10</span>`).

2. Add 3 new questions at the end of the questions array (use the next available IDs — check current max ID first). Exact question objects:

```js
{
  id: NEW_ID,
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
},
{
  id: NEW_ID+1,
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
},
{
  id: NEW_ID+2,
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

- [ ] **Step 1:** Read current state of all 3 files
- [ ] **Step 2:** Apply all edits
- [ ] **Step 3:** Verify: `grep -c "1\.7\|1\.8\|1\.9\|1\.10" index.html` shows the new IDs
- [ ] **Step 4:** Verify quiz has 3 more questions than before
- [ ] **Step 5:** Commit

---

## Task 5: Final verification sweep

- [ ] **Step 1:** All 3 new HTML files exist under `guides/fundamentals/`
- [ ] **Step 2:** `index.html` shows 10 Module 1 entries (1.1-1.10)
- [ ] **Step 3:** NEXT_GUIDE chain: verify-framework → embeddings → safety → evaluation → quiz
- [ ] **Step 4:** Quiz guide number shows 1.10
- [ ] **Step 5:** Quiz question count increased by 3
- [ ] **Step 6:** Each new guide loads without JSX errors
- [ ] **Step 7:** No other files changed besides the 6 expected
- [ ] **Step 8:** Browser smoke test all 3 new guides

---

## Execution notes

- Tasks 1-3 are independent and create new files — can theoretically run in parallel but should run sequentially per subagent-driven-development rules.
- Task 4 is integration work — depends on Tasks 1-3 being committed (so file paths resolve).
- Task 5 is verification — depends on everything else.
- Use sonnet model for Tasks 1-3 (substantial creative + code generation). Use haiku for Task 4 (mechanical edits). Use haiku for Task 5 (verification commands).
- The implementer for each guide task MUST read `guides/fundamentals/what-is-genai.html` first as the structural template.
