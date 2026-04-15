# Phase 2 — Text Overflow + Navigation Polish — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship production-ready navigation and polish across all guides — overflow fixes, inter-guide Up-Next CTAs, module-complete quiz CTAs, retry/review buttons, +9 new quiz questions, and a deeper ARIA sweep.

**Architecture:** Append shared CSS once, then roll out 4 UI additions (Up-Next, Module Complete CTA, Retry, Review) across 25 guide files using the pattern established in Phase 1. Each task is a per-module batch of edits with a verification grep at the end.

**Tech Stack:** React 18 + Babel in-browser (no build tooling). `assets/guide-shared.css` is the single shared stylesheet. "Tests" in this plan are grep post-conditions + browser spot-checks, because the repo has no automated test runner.

**Spec:** `docs/superpowers/specs/2026-04-15-phase-2-polish-design.md`

---

## Testing Approach

This project has **no test framework**. "Tests" in this plan mean one of:

- **Grep post-condition** — a `grep` command that must return N matches to prove the change landed everywhere.
- **Visual/functional browser check** — open the file in a browser, click through the change, confirm the UX.
- **Keyboard a11y check** — Tab through, confirm focus rings + Enter/Space activation on new controls.

Do not skip the checks. They are the only quality gate.

## File Inventory

**Shared CSS (1 file):** `assets/guide-shared.css` — appends ~150 lines.

**Overflow fixes (2 files):**
- `index.html` — flex overflow + landing-page anchors
- `guides/architectures/overview.html` — `white-space: nowrap` removal

**Up-Next CTA (18 non-quiz guides):**
- `guides/fundamentals/` — `what-is-genai.html`, `regular-vs-genai.html`, `how-genai-works.html`, `ai-model-types.html`, `limitations.html`, `verify-framework.html`
- `guides/prompt-engineering/` — `costar-meta.html`, `techniques.html`
- `guides/context-engineering/` — `foundations.html`, `mastering-context.html`
- `guides/mcp/` — `fundamentals.html`, `advanced.html`
- `guides/architectures/` — `overview.html`, `llm-chat.html`, `rag.html`, `workflows.html`, `agents.html`, `agentic-ai.html`

**Quiz CTAs + question expansion (6 quiz files):**
- `guides/fundamentals/quiz.html` (18 Qs, CTAs only)
- `guides/prompt-engineering/quiz.html` (+3 Qs → 18, CTAs)
- `guides/context-engineering/quiz.html` (+3 Qs → 18, CTAs)
- `guides/mcp/quiz.html` (+3 Qs → 18, CTAs)
- `guides/architectures/quiz.html` (18 Qs, CTAs; Module 5 → Final Exam)
- `guides/final-exam/quiz.html` (50 Qs, CTAs; Platform Complete)

**Deeper ARIA (all 25 guides — overlaps with above.)**

**Docs:** `CLAUDE.md`

---

## Task 1: Append shared CSS for Up-Next + Module Complete + Quiz Actions

**Files:**
- Modify: `assets/guide-shared.css` (append at end)

**Rationale:** Ship CSS first so that every later task's HTML lands with live styling. No other file needs to change until this is in place.

- [ ] **Step 1.1: Append the new CSS block**

Append to the end of `assets/guide-shared.css` (use Edit with `old_string` = the last line currently in the file, e.g., the final `}` or closing comment of the existing file; then `new_string` = existing content + new block). Full content to append:

```css

/* ==========================================================================
   Phase 2 additions — inter-guide navigation + quiz CTAs
   ========================================================================== */

/* ---------- Up Next (inter-guide footer CTA) ---------- */
.up-next-card {
  margin-top: 48px;
  padding: 24px;
  background: linear-gradient(135deg, var(--color-primary-faint) 0%, var(--color-primary-light) 100%);
  border: 1px solid var(--color-primary-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}
.up-next-label {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: var(--color-primary);
  margin-bottom: 12px;
}
.up-next-link {
  display: flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;
  color: var(--color-text);
  padding: 12px 16px;
  border-radius: var(--radius-md);
  background: white;
  border: 1px solid var(--color-border);
  transition: all var(--transition-bouncy);
}
.up-next-link:hover,
.up-next-link:focus-visible {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-hover);
}
.up-next-link:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}
.up-next-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex-shrink: 0;
}
.up-next-id {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 18px;
  color: var(--color-primary);
}
.up-next-module {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-muted);
  letter-spacing: 0.5px;
}
.up-next-title {
  flex: 1;
  min-width: 0;
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  overflow-wrap: break-word;
}
.up-next-arrow {
  font-size: 24px;
  color: var(--color-primary);
  flex-shrink: 0;
  transition: transform var(--transition-fast);
}
.up-next-link:hover .up-next-arrow { transform: translateX(4px); }

/* ---------- Module Complete CTA (quiz results screens) ---------- */
.module-complete-cta {
  margin: 32px 0;
  padding: 32px;
  background: linear-gradient(135deg, #f0faf0 0%, var(--color-primary-faint) 100%);
  border: 1px solid var(--color-success);
  border-radius: var(--radius-lg);
  text-align: center;
}
.celebrate {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 700;
  color: var(--color-success-deep);
}
.celebrate-icon { font-size: 32px; }
.continue-btn {
  display: inline-block;
  padding: 14px 28px;
  background: var(--color-primary);
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  border-radius: var(--radius-md);
  transition: all var(--transition-bouncy);
}
.continue-btn:hover,
.continue-btn:focus-visible {
  background: #5a4dd5;
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-hover);
}
.continue-btn:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 3px;
}

/* ---------- Quiz Actions (Retry + Review) ---------- */
.quiz-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 16px;
}
.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  color: var(--color-primary);
  border: 1px solid var(--color-primary-light);
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-family: inherit;
  transition: all var(--transition-fast);
}
.action-btn:hover,
.action-btn:focus-visible {
  background: var(--color-primary-faint);
  border-color: var(--color-primary);
}
.action-btn:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}

/* ---------- Landing-page module anchor scroll-margin ---------- */
[id^="module-"] { scroll-margin-top: 80px; }
```

- [ ] **Step 1.2: Grep verify classes exist**

Run: `grep -c "up-next-card\|module-complete-cta\|quiz-actions\|continue-btn\|celebrate-icon\|action-btn" assets/guide-shared.css`
Expected: ≥ 7 matches (one class definition each; some appear more due to `.action-btn:hover` etc.)

- [ ] **Step 1.3: Browser spot-check**

Open `guides/fundamentals/what-is-genai.html` in a browser. Confirm no visual regression (existing styling still works; new classes are just unused additions).

- [ ] **Step 1.4: Commit**

```bash
git add assets/guide-shared.css
git commit -m "add Phase 2 shared CSS for Up-Next + module-complete + quiz actions"
```

---

## Task 2: Fix index.html flex overflow + add landing-page module anchors

**Files:**
- Modify: `index.html` (GuideCard component around line 260–286; ModuleSection component around line 289+)

**Rationale:** The guide cards in the module grid overflow when titles are long because the flex child is missing `minWidth: 0`. The Review Module CTA (Task 9+) needs anchor IDs on each module section. Bundle both because they touch the same file.

- [ ] **Step 2.1: Read the exact current JSX**

Run: `Read index.html offset=258 limit=40`
Confirm the current code matches:
```jsx
<div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
  <GuideIcon guideId={guide.id} />
  <div style={{ flex: 1 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>
        {guide.id} {guide.title}
      </h3>
```

- [ ] **Step 2.2: Apply the overflow fix**

In `index.html`, edit GuideCard JSX:

Change `<div style={{ flex: 1 }}>` →
```jsx
<div style={{ flex: 1, minWidth: 0 }}>
```

Change `<h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>` →
```jsx
<h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", margin: 0, overflowWrap: "break-word" }}>
```

Change the description `<p style={{ fontSize: 13, color: "#6a6a7a", margin: 0 }}>{guide.desc}</p>` →
```jsx
<p style={{ fontSize: 13, color: "#6a6a7a", margin: 0, overflowWrap: "break-word" }}>{guide.desc}</p>
```

- [ ] **Step 2.3: Add module section anchors**

Locate the `ModuleSection` component (around line 289). Find the outermost wrapping `<div style={{ marginBottom: 40 }}>`. Change it to accept and apply an anchor id based on `module.moduleNumber` (or the index — whichever is available from the MODULES array).

Read the ModuleSection component first to confirm the prop name and structure. Then change the outer wrapper to:

```jsx
<section id={`module-${module.moduleNumber}`} style={{ marginBottom: 40 }}>
```

(Change the `<div>` to `<section>` for semantic hierarchy; keep the styling prop identical.)

If MODULES array entries don't have a `moduleNumber` field, add one at the callsite:
- Locate where MODULES is iterated to render ModuleSection (search for `MODULES.map` in index.html).
- Change `{MODULES.map((m) => <ModuleSection module={m} />)}` to `{MODULES.map((m, idx) => <ModuleSection key={idx} module={m} moduleNumber={idx + 1} />)}`.
- Update ModuleSection to accept and use `moduleNumber` prop: `function ModuleSection({ module, moduleNumber })` and use it in the `id`.

- [ ] **Step 2.4: Grep verify**

Run: `grep -n "minWidth: 0" index.html`
Expected: ≥ 1 match on the GuideCard flex container.

Run: `grep -n 'id={`module-' index.html` (note backticks)
Expected: ≥ 1 match on ModuleSection.

- [ ] **Step 2.5: Browser spot-check**

Open `index.html` in a browser. Resize viewport to 768px wide. Confirm guide titles wrap (no horizontal scroll). Click a module heading; confirm URL updates to `#module-N` on click (not required — just confirm the anchor is present via DevTools → Elements → search for `id="module-1"`).

- [ ] **Step 2.6: Commit**

```bash
git add index.html
git commit -m "fix GuideCard flex overflow and add #module-N anchors to landing page"
```

---

## Task 3: Fix architectures/overview.html white-space: nowrap

**Files:**
- Modify: `guides/architectures/overview.html:343`

- [ ] **Step 3.1: Remove nowrap from .gate-answer**

Edit `guides/architectures/overview.html`. Find:

```css
    .gate-answer {
      font-weight: 700;
      font-size: 14px;
      color: #6c5ce7;
      white-space: nowrap;
    }
```

Change to:

```css
    .gate-answer {
      font-weight: 700;
      font-size: 14px;
      color: #6c5ce7;
      overflow-wrap: break-word;
    }
```

- [ ] **Step 3.2: Grep post-condition**

Run: `grep -n "white-space:\s*nowrap" guides/architectures/overview.html`
Expected: no matches for `.gate-answer`. (Other nowrap usages in badges may remain — those are intentional for short labels like "BEGINNER".)

- [ ] **Step 3.3: Browser spot-check**

Open `guides/architectures/overview.html` at 768px viewport width. Scroll to the gate/decision section that uses `.gate-answer` (search visually for gate Q&A cards). Confirm long answers now wrap instead of forcing horizontal scroll.

- [ ] **Step 3.4: Commit**

```bash
git add guides/architectures/overview.html
git commit -m "remove white-space: nowrap from .gate-answer to allow wrapping"
```

---

## Task 4: Add Up-Next CTA to Module 1 (Fundamentals) — 6 non-quiz guides

**Files:**
- Modify: `guides/fundamentals/what-is-genai.html`
- Modify: `guides/fundamentals/regular-vs-genai.html`
- Modify: `guides/fundamentals/how-genai-works.html`
- Modify: `guides/fundamentals/ai-model-types.html`
- Modify: `guides/fundamentals/limitations.html`
- Modify: `guides/fundamentals/verify-framework.html`

**Pattern:** Each guide gets (a) a `NEXT_GUIDE` constant at the top of its `<script type="text/babel">` block, and (b) an Up-Next card rendered when `currentStage === stages.length - 1` (or equivalent — **search each file** for the existing last-stage check).

### 4.1 NEXT_GUIDE values for Module 1

| File | NEXT_GUIDE value |
|---|---|
| `what-is-genai.html` | `{ id: "1.2", title: "Regular vs. GenAI", module: "Module 1", href: "./regular-vs-genai.html" }` |
| `regular-vs-genai.html` | `{ id: "1.3", title: "How GenAI Works", module: "Module 1", href: "./how-genai-works.html" }` |
| `how-genai-works.html` | `{ id: "1.4", title: "AI Model Types", module: "Module 1", href: "./ai-model-types.html" }` |
| `ai-model-types.html` | `{ id: "1.5", title: "Limitations", module: "Module 1", href: "./limitations.html" }` |
| `limitations.html` | `{ id: "1.6", title: "VERIFY Framework", module: "Module 1", href: "./verify-framework.html" }` |
| `verify-framework.html` | `{ id: "1.7", title: "Fundamentals Quiz", module: "Module 1", href: "./quiz.html", isQuiz: true }` |

### 4.2 Per-file procedure (repeat for each of the 6 files)

- [ ] **Step 4.1: Add NEXT_GUIDE constant**

In each file, find the `<script type="text/babel">` block. Locate the first top-level `const` or `function` declaration (e.g., `const { useState, useRef, useEffect } = React;` is usually first). Immediately after that line, insert:

```jsx
    const NEXT_GUIDE = { id: "X.Y", title: "...", module: "Module 1", href: "./...html" };
```

Fill in with the exact value from the table in section 4.1.

- [ ] **Step 4.2: Locate the final-stage conditional**

Find the existing final-stage render. In most guides this looks like:

```jsx
{currentStage === stages.length - 1 && ( ... )}
```

or uses a destructured variable. If the file has NO existing `currentStage === stages.length - 1` pattern, search for the stage render's main mapping — look for patterns like `stages[currentStage]`, `stages.map`, or a disabled Next arrow condition `disabled={currentStage === stages.length - 1}`.

The Up-Next card should render **inside the main content area, after the final stage's own content**. The simplest place to add it is just before the closing `</main>` tag, gated by the same final-stage check.

- [ ] **Step 4.3: Insert the Up-Next JSX**

Inside `<main id="main">` (or `<main id="main" className="content-area">`), just before the closing `</main>`, insert:

```jsx
                {currentStage === stages.length - 1 && (
                  <div className="up-next-card" role="complementary" aria-label="Up next">
                    <span className="up-next-label">UP NEXT</span>
                    <a href={NEXT_GUIDE.href} className="up-next-link">
                      <div className="up-next-meta">
                        <span className="up-next-id">{NEXT_GUIDE.id}</span>
                        <span className="up-next-module">{NEXT_GUIDE.module}</span>
                      </div>
                      <div className="up-next-title">{NEXT_GUIDE.title}</div>
                      <span className="up-next-arrow" aria-hidden="true">→</span>
                    </a>
                  </div>
                )}
```

If the file uses a different variable name for the current stage (e.g., `stage`, `activeStage`, `stageIndex`), substitute accordingly. Read the existing final-stage check in the file first; match its variable.

- [ ] **Step 4.4: Browser check**

Open the file. Click through all stages to the final one. Confirm:
- Up-Next card appears at the bottom of content area.
- Clicking the link navigates to the correct next-guide URL.
- Tab focus reaches the link and shows a focus ring.

- [ ] **Step 4.5: Move to next file**

Repeat steps 4.1–4.4 for each of the 6 Module 1 files.

### 4.3 Commit

- [ ] **Step 4.6: Grep post-condition**

Run: `grep -l "NEXT_GUIDE" guides/fundamentals/*.html`
Expected: all 6 non-quiz files listed. (`quiz.html` should NOT appear.)

Run: `grep -l "up-next-card" guides/fundamentals/*.html`
Expected: same 6 files.

- [ ] **Step 4.7: Commit**

```bash
git add guides/fundamentals/*.html
git commit -m "add Up-Next CTA to Module 1 (Fundamentals) 6 non-quiz guides"
```

---

## Task 5: Add Up-Next CTA to Module 2 (Prompt Engineering) — 2 non-quiz guides

**Files:**
- Modify: `guides/prompt-engineering/costar-meta.html`
- Modify: `guides/prompt-engineering/techniques.html`

### 5.1 NEXT_GUIDE values

| File | NEXT_GUIDE value |
|---|---|
| `costar-meta.html` | `{ id: "2.2", title: "Prompt Techniques", module: "Module 2", href: "./techniques.html" }` |
| `techniques.html` | `{ id: "2.3", title: "Prompt Engineering Quiz", module: "Module 2", href: "./quiz.html", isQuiz: true }` |

- [ ] **Step 5.1: Apply the pattern from Task 4**

For each file, follow steps 4.1–4.4 exactly, substituting the NEXT_GUIDE value from the table above.

- [ ] **Step 5.2: Grep post-condition**

Run: `grep -l "NEXT_GUIDE" guides/prompt-engineering/*.html`
Expected: 2 files (`costar-meta.html`, `techniques.html`). `quiz.html` should NOT appear.

- [ ] **Step 5.3: Commit**

```bash
git add guides/prompt-engineering/*.html
git commit -m "add Up-Next CTA to Module 2 (Prompt Engineering) 2 non-quiz guides"
```

---

## Task 6: Add Up-Next CTA to Module 3 (Context Engineering) — 2 non-quiz guides

**Files:**
- Modify: `guides/context-engineering/foundations.html`
- Modify: `guides/context-engineering/mastering-context.html`

### 6.1 NEXT_GUIDE values

| File | NEXT_GUIDE value |
|---|---|
| `foundations.html` | `{ id: "3.2", title: "Mastering Context", module: "Module 3", href: "./mastering-context.html" }` |
| `mastering-context.html` | `{ id: "3.3", title: "Context Engineering Quiz", module: "Module 3", href: "./quiz.html", isQuiz: true }` |

- [ ] **Step 6.1: Apply the Task 4 pattern to both files**

- [ ] **Step 6.2: Grep post-condition**

Run: `grep -l "NEXT_GUIDE" guides/context-engineering/*.html`
Expected: 2 files (not `quiz.html`).

- [ ] **Step 6.3: Commit**

```bash
git add guides/context-engineering/*.html
git commit -m "add Up-Next CTA to Module 3 (Context Engineering) 2 non-quiz guides"
```

---

## Task 7: Add Up-Next CTA to Module 4 (MCP) — 2 non-quiz guides

**Files:**
- Modify: `guides/mcp/fundamentals.html`
- Modify: `guides/mcp/advanced.html`

### 7.1 NEXT_GUIDE values

| File | NEXT_GUIDE value |
|---|---|
| `fundamentals.html` | `{ id: "4.2", title: "MCP Advanced", module: "Module 4", href: "./advanced.html" }` |
| `advanced.html` | `{ id: "4.3", title: "MCP Quiz", module: "Module 4", href: "./quiz.html", isQuiz: true }` |

- [ ] **Step 7.1: Apply the Task 4 pattern to both files**

- [ ] **Step 7.2: Grep post-condition**

Run: `grep -l "NEXT_GUIDE" guides/mcp/*.html`
Expected: 2 files (not `quiz.html`).

- [ ] **Step 7.3: Commit**

```bash
git add guides/mcp/*.html
git commit -m "add Up-Next CTA to Module 4 (MCP) 2 non-quiz guides"
```

---

## Task 8: Add Up-Next CTA to Module 5 (Architectures) — 6 non-quiz guides

**Files:**
- Modify: `guides/architectures/overview.html`
- Modify: `guides/architectures/llm-chat.html`
- Modify: `guides/architectures/rag.html`
- Modify: `guides/architectures/workflows.html`
- Modify: `guides/architectures/agents.html`
- Modify: `guides/architectures/agentic-ai.html`

### 8.1 NEXT_GUIDE values

| File | NEXT_GUIDE value |
|---|---|
| `overview.html` | `{ id: "5.2", title: "LLM Chat", module: "Module 5", href: "./llm-chat.html" }` |
| `llm-chat.html` | `{ id: "5.3", title: "RAG", module: "Module 5", href: "./rag.html" }` |
| `rag.html` | `{ id: "5.4", title: "Workflows", module: "Module 5", href: "./workflows.html" }` |
| `workflows.html` | `{ id: "5.5", title: "Agents", module: "Module 5", href: "./agents.html" }` |
| `agents.html` | `{ id: "5.6", title: "Agentic AI", module: "Module 5", href: "./agentic-ai.html" }` |
| `agentic-ai.html` | `{ id: "5.7", title: "Architectures Quiz", module: "Module 5", href: "./quiz.html", isQuiz: true }` |

- [ ] **Step 8.1: Apply the Task 4 pattern to all 6 files**

- [ ] **Step 8.2: Grep post-condition**

Run: `grep -l "NEXT_GUIDE" guides/architectures/*.html`
Expected: 6 files (not `quiz.html`).

- [ ] **Step 8.3: Commit**

```bash
git add guides/architectures/*.html
git commit -m "add Up-Next CTA to Module 5 (Architectures) 6 non-quiz guides"
```

---

## Task 9: Add Module Complete + Retry + Review CTAs to Module 1 quiz

**Files:**
- Modify: `guides/fundamentals/quiz.html`

**Rationale:** Module 1 is the canonical reference for ResultsView. This task establishes the pattern (replace the current "Back to Guides" + "Retake Quiz" pair with the new three-CTA layout, with Retry implemented as a real `setState` reset instead of `window.location.reload()`). Subsequent quiz tasks reuse this pattern.

- [ ] **Step 9.1: Read the current ResultsView**

Run: `Read guides/fundamentals/quiz.html offset=593 limit=120`
Confirm the existing structure ends with:
```jsx
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 24 }}>
            <a href="../../index.html" ... >Back to Guides</a>
            <button ... onClick={() => window.location.reload()}>Retake Quiz</button>
          </div>
        </div>
      );
    }
```

- [ ] **Step 9.2: Update ResultsView signature to accept onRetry**

Change:
```jsx
function ResultsView({ questions, answers }) {
```
to:
```jsx
function ResultsView({ questions, answers, onRetry }) {
```

- [ ] **Step 9.3: Replace the final action-button block**

Replace the entire `<div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 24 }}>` block (the one containing "Back to Guides" + "Retake Quiz") with:

```jsx
          <div className="module-complete-cta">
            <div className="celebrate">
              <span className="celebrate-icon" aria-hidden="true">🎉</span>
              <span className="celebrate-text">Module 1 Complete</span>
            </div>
            <a href="../prompt-engineering/costar-meta.html" className="continue-btn">
              Continue to Module 2: Prompt Engineering →
            </a>
          </div>

          <div className="quiz-actions" role="group" aria-label="Quiz actions">
            <button type="button" className="action-btn" onClick={onRetry} aria-label="Retry this quiz">
              ↻ Retry quiz
            </button>
            <a href="../../index.html#module-1" className="action-btn" aria-label="Review Module 1">
              📖 Review module
            </a>
          </div>
```

- [ ] **Step 9.4: Add resetQuiz handler in parent Quiz component**

Locate the `Quiz()` component (line 715 area). Inside it, find the state declarations:
```jsx
const [currentQuestion, setCurrentQuestion] = useState(0);
const [selectedAnswer, setSelectedAnswer] = useState(null);
const [answered, setAnswered] = useState(false);
const [answers, setAnswers] = useState([]);
const [showResults, setShowResults] = useState(false);
```

Immediately after these, add:
```jsx
const resetQuiz = () => {
  setCurrentQuestion(0);
  setSelectedAnswer(null);
  setAnswered(false);
  setAnswers([]);
  setShowResults(false);
  if (contentRef.current) contentRef.current.scrollTop = 0;
};
```

- [ ] **Step 9.5: Pass onRetry to ResultsView**

Find the `<ResultsView ...>` JSX (inside the main area, around line 853). Change:
```jsx
<ResultsView questions={QUESTIONS} answers={answers} />
```
to:
```jsx
<ResultsView questions={QUESTIONS} answers={answers} onRetry={resetQuiz} />
```

- [ ] **Step 9.6: Browser check**

Open `guides/fundamentals/quiz.html`. Answer through all 18 questions quickly (use DevTools if needed — the goal is to reach ResultsView). On the results screen confirm:
- "🎉 Module 1 Complete" celebration appears.
- "Continue to Module 2: Prompt Engineering →" button navigates to `../prompt-engineering/costar-meta.html`.
- "↻ Retry quiz" button resets to Question 1 with no answers pre-selected and scrolls content area to top.
- "📖 Review module" anchor lands on `index.html#module-1`.

- [ ] **Step 9.7: Commit**

```bash
git add guides/fundamentals/quiz.html
git commit -m "add Module Complete + Retry + Review CTAs to Module 1 quiz"
```

---

## Task 10: Add CTAs to Module 2 quiz + author 3 new questions

**Files:**
- Modify: `guides/prompt-engineering/quiz.html`

### 10.1 New questions to append

Append these to the existing `QUESTIONS` array (end of the array, before the closing `];`). Preserve the existing data shape the file already uses. Read the file's first question object to confirm exact field names (`question`, `options`, `correct`, `explanation`, possibly `section`). The three questions:

```jsx
  {
    question: "You're asking an LLM to solve a multi-step logic puzzle. When is Chain-of-Thought prompting most useful?",
    options: [
      "Always — it improves output on every task",
      "For math, logic, or multi-step reasoning tasks where step-by-step thinking helps",
      "Only for creative writing tasks",
      "Never — modern models don't need it"
    ],
    correct: 1,
    explanation: "Chain-of-Thought shines on multi-step reasoning (math, logic, planning). It's wasteful — and can even hurt — on simple lookups or creative tasks where extra verbosity dilutes the answer."
  },
  {
    question: "You prepend 'You are an expert cardiologist' to a prompt asking about a rare heart condition. What does this actually do?",
    options: [
      "Gives the model real medical expertise it didn't have before",
      "Unlocks a hidden 'expert mode' in the model",
      "Shifts the response style toward domain-appropriate vocabulary and structure, but doesn't add knowledge the model lacks",
      "Has no effect at all"
    ],
    correct: 2,
    explanation: "Role prompting shapes tone and framing — the model draws on the domain patterns in its training — but it does NOT add knowledge. If the model doesn't know a condition, calling it 'expert' won't help."
  },
  {
    question: "You have a classification task with 5 categories. The model works OK zero-shot but sometimes picks wrong labels. You try few-shot with 3 examples. What's the main trade-off?",
    options: [
      "Few-shot is always strictly better",
      "Few-shot improves consistency and label accuracy, but costs more tokens per call",
      "Few-shot always hurts accuracy",
      "Zero-shot is faster but uses more tokens"
    ],
    correct: 1,
    explanation: "Few-shot examples anchor the model to your exact format and categories — usually improving consistency — but you pay for those extra tokens on every call. For high-volume workloads, that cost compounds."
  },
```

- [ ] **Step 10.1: Read existing question structure**

Run: `Read guides/prompt-engineering/quiz.html` with offset targeting the QUESTIONS array start.

Confirm the data shape (`question`, `options`, `correct`, `explanation`). If there's a `section` field, add `section: "Advanced Techniques"` (or match an existing section name) to each new question.

- [ ] **Step 10.2: Append the 3 new questions**

Find the end of the `QUESTIONS` array (the closing `];`). Insert the 3 new question objects immediately before it. If there's a `section` field in existing questions, add it to the new ones using an appropriate section name.

- [ ] **Step 10.3: Apply the Task 9 CTA pattern**

Follow steps 9.1–9.5 for this file:
- ResultsView accepts `onRetry` prop
- Replace final-action-button block with the three-CTA layout
- Use these strings for Module 2:
  - Celebrate: "Module 2 Complete"
  - Continue href: `"../context-engineering/foundations.html"`
  - Continue label: `"Continue to Module 3: Context Engineering →"`
  - Review href: `"../../index.html#module-2"`
- Add `resetQuiz` handler in parent Quiz component
- Pass `onRetry={resetQuiz}` to ResultsView

(The parent Quiz component's state variable names may differ from Module 1; read first and match the actual names used in this file.)

- [ ] **Step 10.4: Grep post-condition (question count)**

Run: `grep -c "question:" guides/prompt-engineering/quiz.html`
Expected: 18.

- [ ] **Step 10.5: Browser check**

Open the file. Verify:
- 18 sidebar step buttons appear.
- Complete the quiz; new questions appear as Q16/Q17/Q18 (order in array).
- Results screen shows Module 2 Complete CTA pointing at Module 3.
- Retry resets state.
- Review links to `#module-2`.

- [ ] **Step 10.6: Commit**

```bash
git add guides/prompt-engineering/quiz.html
git commit -m "add 3 Module 2 quiz questions (CoT, role prompting, few-shot) and Module Complete CTAs"
```

---

## Task 11: Add CTAs to Module 3 quiz + author 3 new questions

**Files:**
- Modify: `guides/context-engineering/quiz.html`

### 11.1 New questions to append

```jsx
  {
    question: "You paste a 200-page document into a 1M-token context window. The model still misses key details buried in the middle. What's happening?",
    options: [
      "The context window isn't actually 1M tokens",
      "The 'lost in the middle' effect — models attend less reliably to content in the middle of long contexts",
      "The model is broken",
      "You need to re-paste it"
    ],
    correct: 1,
    explanation: "Effective context < total context. Models reliably attend to the beginning and end of long inputs; middle content gets less attention. RAG or deliberate chunking/summarization often beats raw long-context dumps."
  },
  {
    question: "Your domain knowledge is 50MB of documentation that updates weekly. When is long-context preferable to RAG?",
    options: [
      "Always — just paste everything",
      "Never — RAG is always better",
      "When the full context fits AND queries need to reason across many documents at once, AND you don't need fresh retrieval",
      "Only for coding tasks"
    ],
    correct: 2,
    explanation: "Long-context wins when cross-document reasoning matters and the material fits. RAG wins when freshness matters, the corpus is too large, or you need citations. Hybrid approaches often beat either alone."
  },
  {
    question: "Your 8k-token budget breaks down as: 2k system prompt, 1k user query, 2k retrieved context, 1k tool schemas. The model cuts off mid-reply. What's wrong?",
    options: [
      "The model is broken",
      "You only budgeted 6k of the 8k — that leaves just 2k for the model's reply, which isn't enough",
      "Tool schemas are free and don't count",
      "The user query was too long"
    ],
    correct: 1,
    explanation: "Context budgets include the OUTPUT. Input + output must fit the window. Leaving 2k headroom for a reply is often too tight for anything complex — plan token budgets with the max reply length in mind."
  },
```

- [ ] **Step 11.1: Read existing question structure**

- [ ] **Step 11.2: Append 3 new questions**

- [ ] **Step 11.3: Apply CTA pattern**

Strings for Module 3:
- Celebrate: "Module 3 Complete"
- Continue href: `"../mcp/fundamentals.html"`
- Continue label: `"Continue to Module 4: MCP →"`
- Review href: `"../../index.html#module-3"`

- [ ] **Step 11.4: Grep post-condition**

Run: `grep -c "question:" guides/context-engineering/quiz.html`
Expected: 18.

- [ ] **Step 11.5: Browser check**

Same checks as Task 10.5, adjusted for Module 3.

- [ ] **Step 11.6: Commit**

```bash
git add guides/context-engineering/quiz.html
git commit -m "add 3 Module 3 quiz questions (lost-in-middle, long vs RAG, token budgets) and Module Complete CTAs"
```

---

## Task 12: Add CTAs to Module 4 quiz + author 3 new questions

**Files:**
- Modify: `guides/mcp/quiz.html`

### 12.1 New questions to append

```jsx
  {
    question: "When does an MCP server actually run?",
    options: [
      "Continuously in the background on Anthropic's servers",
      "It's spawned by the MCP client (e.g., Claude Desktop) when needed and runs locally with your user's permissions and access",
      "Only when Claude decides to call a tool",
      "It runs in the cloud and Anthropic manages it"
    ],
    correct: 1,
    explanation: "MCP servers run locally (or remotely if you host them), spawned by the client. They execute with your user's permissions — which is why trust and scope matter. Anthropic doesn't host or manage MCP servers."
  },
  {
    question: "You're building an MCP server for a recipe app. You want Claude to know about my pantry AND call 'search recipes' on demand. Which primitives fit?",
    options: [
      "Both as tools",
      "Both as resources",
      "'My pantry' as a resource (passive, user-selectable data), 'search recipes' as a tool (Claude-invoked action)",
      "Both as prompts"
    ],
    correct: 2,
    explanation: "Resources = user-selected passive data (pulled into context). Tools = model-invoked actions. Prompts = reusable user-invoked templates. Static data you want Claude to reference → resource. Actions Claude should decide to take → tool."
  },
  {
    question: "Your MCP server needs to call a paid API that requires an API key. Where does the secret belong?",
    options: [
      "Hardcoded in the server code",
      "Sent from Claude in the tool call",
      "Stored in an environment variable or OS keychain the server reads at startup — never passed through the model",
      "Stored in the resource list"
    ],
    correct: 2,
    explanation: "Secrets should never cross the model boundary — they'd end up in logs, training data, or chat history. Store in env vars or the OS keychain; the server reads them locally and uses them on your behalf."
  },
```

- [ ] **Step 12.1: Read existing question structure**

- [ ] **Step 12.2: Append 3 new questions**

- [ ] **Step 12.3: Apply CTA pattern**

Strings for Module 4:
- Celebrate: "Module 4 Complete"
- Continue href: `"../architectures/overview.html"`
- Continue label: `"Continue to Module 5: Architectures →"`
- Review href: `"../../index.html#module-4"`

- [ ] **Step 12.4: Grep post-condition**

Run: `grep -c "question:" guides/mcp/quiz.html`
Expected: 18.

- [ ] **Step 12.5: Browser check**

- [ ] **Step 12.6: Commit**

```bash
git add guides/mcp/quiz.html
git commit -m "add 3 Module 4 quiz questions (lifecycle, tools vs resources, secrets) and Module Complete CTAs"
```

---

## Task 13: Add CTAs to Module 5 quiz (Architectures)

**Files:**
- Modify: `guides/architectures/quiz.html`

- [ ] **Step 13.1: Apply CTA pattern (no new questions — Module 5 already has 18)**

Follow steps 9.1–9.5. Strings for Module 5:
- Celebrate: "Module 5 Complete"
- Continue href: `"../final-exam/quiz.html"`
- Continue label: `"Continue to the Final Exam →"`
- Review href: `"../../index.html#module-5"`

- [ ] **Step 13.2: Grep post-condition**

Run: `grep -c "question:" guides/architectures/quiz.html`
Expected: 18 (unchanged).

Run: `grep "module-complete-cta" guides/architectures/quiz.html`
Expected: at least 1 match.

- [ ] **Step 13.3: Browser check**

Confirm Continue CTA points to Final Exam.

- [ ] **Step 13.4: Commit**

```bash
git add guides/architectures/quiz.html
git commit -m "add Module Complete CTA pointing to Final Exam on Module 5 quiz"
```

---

## Task 14: Add Platform Complete CTA to Final Exam

**Files:**
- Modify: `guides/final-exam/quiz.html`

**Rationale:** Final Exam is the end of the path. The CTA celebrates platform completion and returns to home. No "next module" exists.

- [ ] **Step 14.1: Read the final-exam ResultsView**

Find its ResultsView component and its current post-score action area.

- [ ] **Step 14.2: Apply CTA pattern with final-exam variations**

Follow the Task 9 pattern, with these substitutions:

Replace the final action block with:

```jsx
          <div className="module-complete-cta">
            <div className="celebrate">
              <span className="celebrate-icon" aria-hidden="true">🏆</span>
              <span className="celebrate-text">Platform Complete</span>
            </div>
            <a href="../../index.html" className="continue-btn">
              Back to Home →
            </a>
          </div>

          <div className="quiz-actions" role="group" aria-label="Quiz actions">
            <button type="button" className="action-btn" onClick={onRetry} aria-label="Retake the final exam">
              ↻ Retake exam
            </button>
            <a href="../../index.html" className="action-btn" aria-label="Review all modules">
              📖 Review all modules
            </a>
          </div>
```

Add the same `resetQuiz` handler in the parent Quiz component (match that file's state variable names) and pass `onRetry={resetQuiz}` to ResultsView.

- [ ] **Step 14.3: Grep post-condition**

Run: `grep "module-complete-cta" guides/final-exam/quiz.html`
Expected: ≥ 1 match.

Run: `grep -c "question:" guides/final-exam/quiz.html`
Expected: 50 (unchanged).

- [ ] **Step 14.4: Browser check**

Confirm the Platform Complete celebration shows, Back to Home links correctly, Retake resets state.

- [ ] **Step 14.5: Commit**

```bash
git add guides/final-exam/quiz.html
git commit -m "add Platform Complete CTA and retry/review to final exam"
```

---

## Task 15: Deeper ARIA sweep — Module 1 (Fundamentals)

**Files:**
- Modify: `guides/fundamentals/*.html` (all 7)

**Scope (same for Tasks 15, 16, 17):**

1. **aria-expanded on disclosures.** Find every click-to-reveal component. Make sure the toggle has `aria-expanded={isOpen}`, `aria-controls="{panel-id}"`, and if it's a non-button click target, add `role="button"`, `tabIndex={0}`, and an `onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}` handler.
2. **Heading hierarchy.** The top-bar `.title` should be `<h1>`. Stage headers (`.stage-header` class) should be `<h2>`. Sub-section titles within a stage should be `<h3>`. No level-skipping.
3. **aria-describedby** on complex controls that pair a toggle with explanatory text.

### 15.1 Per-file procedure (repeat for each of 7 files)

- [ ] **Step 15.1: Audit the file's disclosure components**

Read the file. Search for patterns that signal disclosures:

```bash
grep -n "useState.*expanded\|useState.*open\|onClick.*setIsOpen\|onClick.*setExpanded\|onClick.*setShow" <file>
```

For each disclosure found, locate the toggle element and the revealed panel.

- [ ] **Step 15.2: Add aria-expanded + keyboard handler**

Example pattern:

```jsx
{/* BEFORE */}
<div className="tech-card" onClick={() => setOpen(!isOpen)}>
  <div className="tech-title">Transformer</div>
  {isOpen && <div className="tech-body">Long explanation...</div>}
</div>

{/* AFTER */}
<div
  className="tech-card"
  role="button"
  tabIndex={0}
  aria-expanded={isOpen}
  aria-controls="tech-transformer"
  onClick={() => setOpen(!isOpen)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(!isOpen);
    }
  }}
>
  <div className="tech-title">Transformer</div>
  {isOpen && <div id="tech-transformer" className="tech-body">Long explanation...</div>}
</div>
```

If the toggle is already a `<button>`, just add `aria-expanded` + `aria-controls` (no `role` or `tabIndex` needed).

- [ ] **Step 15.3: Fix heading hierarchy**

In each file, find `.title` (the top-bar guide title). If it's a `<div>` or `<span>`, change to `<h1 className="title">`.

Find `.stage-header`. Should be `<h2>`. Search `grep -n "stage-header" <file>` — change any non-`<h2>` element rendering that class to `<h2 className="stage-header">`.

Find stage sub-section headings (heading-like elements inside the main stage content). Ensure they're `<h3>`. Don't introduce new headings — only fix tag levels on existing heading-shaped content.

- [ ] **Step 15.4: Browser keyboard check**

Open the file. Tab through to a disclosure. Press Enter — confirm it toggles open/closed. Press Space — same. Check DevTools → Accessibility → Heading hierarchy: expect h1 → h2 → h3 with no skips.

- [ ] **Step 15.5: Move to next file**

Repeat 15.1–15.4 for each of the 7 fundamentals files.

### 15.2 Grep post-condition + commit

- [ ] **Step 15.6: Grep verify aria-expanded landed**

Run: `grep -l "aria-expanded" guides/fundamentals/*.html`
Expected: most files listed (guides without any disclosures are exempt — check the file; if zero disclosures exist, no aria-expanded is expected).

- [ ] **Step 15.7: Commit**

```bash
git add guides/fundamentals/*.html
git commit -m "add aria-expanded, keyboard handlers, and heading hierarchy to Module 1"
```

---

## Task 16: Deeper ARIA sweep — Modules 2, 3, 4

**Files:**
- Modify: `guides/prompt-engineering/*.html` (3)
- Modify: `guides/context-engineering/*.html` (3)
- Modify: `guides/mcp/*.html` (3)

- [ ] **Step 16.1: Apply Task 15 procedure to Module 2 (3 files)**

- [ ] **Step 16.2: Apply Task 15 procedure to Module 3 (3 files)**

- [ ] **Step 16.3: Apply Task 15 procedure to Module 4 (3 files)**

- [ ] **Step 16.4: Grep verify**

Run: `grep -l "aria-expanded" guides/prompt-engineering/*.html guides/context-engineering/*.html guides/mcp/*.html`
Expected: files with disclosures listed.

- [ ] **Step 16.5: Commit**

```bash
git add guides/prompt-engineering/*.html guides/context-engineering/*.html guides/mcp/*.html
git commit -m "add aria-expanded, keyboard handlers, and heading hierarchy to Modules 2/3/4"
```

---

## Task 17: Deeper ARIA sweep — Module 5 + Final Exam

**Files:**
- Modify: `guides/architectures/*.html` (7)
- Modify: `guides/final-exam/quiz.html`

- [ ] **Step 17.1: Apply Task 15 procedure to Module 5 (7 files)**

- [ ] **Step 17.2: Apply Task 15 procedure to Final Exam (1 file)**

- [ ] **Step 17.3: Grep verify**

Run: `grep -l "aria-expanded" guides/architectures/*.html guides/final-exam/*.html`

- [ ] **Step 17.4: Commit**

```bash
git add guides/architectures/*.html guides/final-exam/*.html
git commit -m "add aria-expanded, keyboard handlers, and heading hierarchy to Module 5 and Final Exam"
```

---

## Task 18: Update CLAUDE.md + final verification

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 18.1: Document the NEXT_GUIDE convention**

In CLAUDE.md, under "Key Conventions" or "Adding a New Guide", add:

```markdown
- **Inter-guide navigation**: Non-quiz guides define a `NEXT_GUIDE = { id, title, module, href }` constant at the top of their `<script type="text/babel">` block. The final stage renders an `.up-next-card` linking to this next guide. Quiz pages render `.module-complete-cta` instead, pointing at the next module's first guide (Module 5 → Final Exam; Final Exam → landing page).
- **Landing-page anchors**: Each module section in `index.html` is wrapped in `<section id="module-{N}">` so quiz "Review module" links (`../../index.html#module-N`) land on the correct card.
```

- [ ] **Step 18.2: Final full-repo grep sweep**

Run each:

```bash
# 18 non-quiz guides have NEXT_GUIDE
grep -rl "NEXT_GUIDE" guides/ | grep -v quiz.html | wc -l
# Expected: 18

# 6 quiz files (5 module quizzes + final exam) have module-complete-cta
grep -rl "module-complete-cta" guides/ | grep quiz.html | wc -l
# Expected: 6

# Modules 2, 3, 4 each have exactly 18 questions
grep -c "question:" guides/prompt-engineering/quiz.html  # 18
grep -c "question:" guides/context-engineering/quiz.html # 18
grep -c "question:" guides/mcp/quiz.html                 # 18

# Landing page has module anchors
grep -c 'id={`module-' index.html  # ≥ 1

# Overflow fix landed
grep -c "minWidth: 0" index.html  # ≥ 1

# white-space: nowrap gone from .gate-answer
grep -A 3 "\.gate-answer" guides/architectures/overview.html | grep "white-space: nowrap"
# Expected: no match
```

- [ ] **Step 18.3: Lighthouse a11y spot-check (manual)**

Open Chrome DevTools → Lighthouse. Run on:
- `guides/fundamentals/what-is-genai.html`
- `guides/architectures/rag.html`
- `guides/fundamentals/quiz.html`

Expected: Accessibility score ≥ 95 on all three. Record scores in the commit message.

- [ ] **Step 18.4: End-to-end click walk**

Start at `index.html`. Follow the Up-Next chain through every guide in every module, all the way to the final exam results. Note any broken links, missing CTAs, or style regressions.

- [ ] **Step 18.5: Commit**

```bash
git add CLAUDE.md
git commit -m "document NEXT_GUIDE convention and landing-page module anchors"
```

---

## Verification Summary (end of Phase 2)

All of the following should be true after Task 18:

- [x] No horizontal scroll at 768px viewport on `index.html`, `architectures/overview.html`, or any guide.
- [x] Every non-quiz guide (18 files) ends its final stage with an Up-Next card linking to the next guide.
- [x] Every quiz results screen (6 files) shows Module Complete / Platform Complete CTA + Retry + Review buttons.
- [x] Modules 2, 3, 4 quizzes each have 18 questions.
- [x] Every disclosure in every guide exposes `aria-expanded` and responds to Enter/Space.
- [x] Heading hierarchy is clean (h1 → h2 → h3) across all guides.
- [x] CLAUDE.md documents the NEXT_GUIDE + landing-page anchor conventions.
- [x] Lighthouse Accessibility ≥ 95 on three spot-checked guides.

## Commit count estimate

18 commits (one per task). Roughly matches the spec's "~20 commits" estimate.
