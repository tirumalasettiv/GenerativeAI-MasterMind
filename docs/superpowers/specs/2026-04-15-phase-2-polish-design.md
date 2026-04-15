# Phase 2 — Text Overflow + Navigation Polish Design

> **Status:** Design spec. Implementation plan will follow in `docs/superpowers/plans/2026-04-15-phase-2-polish.md`.
> **Supersedes nothing.** Builds on the Phase 1 foundations (shared CSS at `assets/guide-shared.css`, accessibility baseline across 25 guides).

## Context

Phase 1 established consistent visual styling, meta/OG tags, and a WCAG-AA accessibility baseline across all 25 guide files. What remains for production readiness in this phase:

1. **Residual text overflow** — `index.html` flex containers missing `minWidth: 0`; `architectures/overview.html` code spans that still use `white-space: nowrap`.
2. **No inter-guide navigation** — a learner finishing a guide has no direct way forward except the browser back button plus the landing page. Every guide ends in a dead end.
3. **No module-complete celebration** — finishing a module quiz drops the learner on the results screen with no onward path.
4. **No quiz retry or module-review button** — learners who want to re-take a quiz or revisit the module must go back manually.
5. **Quiz count imbalance** — Modules 2, 3, and 4 each have 15 questions; Modules 1 and 5 have 18. Phase 2 normalizes to 18 per module (+9 new questions total).
6. **Deeper ARIA** — Phase 1 handled landmarks + skip link + step/arrow button semantics. Phase 2 adds `aria-expanded` on disclosures, heading-hierarchy sanity, and `aria-describedby` on complex widgets.

## Goals (measurable)

- Zero visible overflow or clipped text at viewport widths 768px, 1024px, 1440px on every guide and the landing page.
- Every non-quiz guide's final stage shows an "Up Next ▶" card linking to the next guide in module order.
- Every module quiz results screen shows a "Module N Complete" CTA to the next module's first guide (Module 5 → Final Exam; Final Exam → landing page).
- Every quiz results screen shows "Retry quiz" and "Review module" buttons.
- Modules 2, 3, and 4 each have exactly 18 quiz questions, matching Modules 1 and 5.
- All disclosure components expose `aria-expanded`; heading hierarchy is strictly h1 → h2 → h3 (no skips, no multiple h1s).
- Lighthouse Accessibility score ≥ 95 on spot-checked guides.

## Non-Goals

- No new content guides (deferred to Phase 4).
- No merging or consolidation of existing content (deferred to Phase 3).
- No changes to the MODULES array in `index.html` or to guide order (the learning path is fixed).
- No per-module OG images (deferred to Phase 6).

---

## 1. Overflow Fixes (Targeted)

### 1.1 `index.html`

Around line 262 — the MODULES grid renders each card as a flexbox row with `<div style={{ flex: 1 }}>` wrapping the title + badge column. This flex child is missing `minWidth: 0`, so long titles force horizontal overflow. The nested `<h3>` also lacks word-break safety.

**Change:**

```jsx
{/* BEFORE */}
<div style={{ flex: 1 }}>
  <h3 style={{ fontSize: 22, fontWeight: 700 /* ... */ }}>{m.title}</h3>
  ...
</div>

{/* AFTER */}
<div style={{ flex: 1, minWidth: 0 }}>
  <h3 style={{ fontSize: 22, fontWeight: 700, overflowWrap: "break-word", wordBreak: "break-word" /* ... */ }}>
    {m.title}
  </h3>
  ...
</div>
```

The module description `<p>` one level deeper also gets `overflowWrap: "break-word"` as a safety net.

### 1.2 `architectures/overview.html`

Code spans inside certain comparison cards use `white-space: nowrap`. Remove `nowrap` (or wrap the span content in a `<code>` element — the shared CSS already applies `overflow-wrap: break-word` to `<code>`).

### 1.3 Anywhere else

Any `.typing` animation without a `max-width` gets `max-width: 100%` + `text-overflow: ellipsis` (shared CSS already provides this default, but spot-check any guide-specific override).

---

## 2. Inter-Guide Prev/Next (Footer CTA)

### 2.1 Guide order (canonical sequence)

This sequence defines "next" for every guide. Drives the Up-Next cards.

**Module 1 — Fundamentals:**
1. `what-is-genai.html`
2. `regular-vs-genai.html`
3. `how-genai-works.html`
4. `ai-model-types.html`
5. `limitations.html`
6. `verify-framework.html`
7. `quiz.html`

**Module 2 — Prompt Engineering:**
1. `costar-meta.html`
2. `techniques.html`
3. `quiz.html`

**Module 3 — Context Engineering:**
1. `foundations.html`
2. `mastering-context.html`
3. `quiz.html`

**Module 4 — MCP:**
1. `fundamentals.html`
2. `advanced.html`
3. `quiz.html`

**Module 5 — Architectures:**
1. `overview.html`
2. `llm-chat.html`
3. `rag.html`
4. `workflows.html`
5. `agents.html`
6. `agentic-ai.html`
7. `quiz.html`

**Final Exam:**
1. `final-exam/quiz.html`

### 2.2 In-guide constant

Each non-quiz guide gets a `NEXT_GUIDE` constant in its `<script type="text/babel">` block, right above the main component:

```js
const NEXT_GUIDE = {
  id: "1.2",
  title: "Regular vs. GenAI",
  href: "./regular-vs-genai.html",
  module: "Module 1"
};
```

For the last non-quiz guide in each module (e.g., `verify-framework.html`), `NEXT_GUIDE` points at the module's `quiz.html`:

```js
const NEXT_GUIDE = {
  id: "1.7",
  title: "Fundamentals Quiz",
  href: "./quiz.html",
  module: "Module 1",
  isQuiz: true
};
```

### 2.3 Up-Next footer rendering

On the final stage, the content area renders this after the normal stage content:

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

### 2.4 Shared CSS additions

Append to `assets/guide-shared.css`:

```css
/* ---------- Up Next (inter-guide navigation) ---------- */
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
```

---

## 3. Module Complete CTA on Quiz Results

### 3.1 Quiz-to-next-module map

| After quiz | Continue destination |
|---|---|
| Fundamentals quiz (Module 1) | `../prompt-engineering/costar-meta.html` |
| Prompt Engineering quiz (Module 2) | `../context-engineering/foundations.html` |
| Context Engineering quiz (Module 3) | `../mcp/fundamentals.html` |
| MCP quiz (Module 4) | `../architectures/overview.html` |
| Architectures quiz (Module 5) | `../final-exam/quiz.html` |
| Final Exam | `../../index.html` (with a celebratory message) |

### 3.2 CTA rendering (on each quiz results screen)

Inserted below the score summary, above any existing retry/share UI:

```jsx
<div className="module-complete-cta">
  <div className="celebrate">
    <span className="celebrate-icon" aria-hidden="true">🎉</span>
    <span className="celebrate-text">Module {MODULE_NUMBER} Complete</span>
  </div>
  <a href={NEXT_MODULE.href} className="continue-btn">
    Continue to {NEXT_MODULE.label} →
  </a>
</div>
```

For the Final Exam:

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
```

### 3.3 Shared CSS additions

```css
/* ---------- Module Complete CTA ---------- */
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
```

---

## 4. Retry Quiz + Review Module

### 4.1 Behavior

- **Retry quiz:** Resets all quiz state (current question index = 0, all answers cleared, score reset) and returns to Question 1. No page reload — React `setState` only.
- **Review module:** Anchor link `../../index.html#module-{N}` that jumps back to the module's card on the landing page. Landing page gets `id="module-{N}"` anchors on each module's section.

### 4.2 Rendering

Below the Module Complete CTA on every quiz results screen:

```jsx
<div className="quiz-actions" role="group" aria-label="Quiz actions">
  <button type="button" className="action-btn secondary" onClick={resetQuiz} aria-label="Retry this quiz">
    ↻ Retry quiz
  </button>
  <a href={`../../index.html#module-${MODULE_NUMBER}`} className="action-btn secondary" aria-label={`Review Module ${MODULE_NUMBER}`}>
    📖 Review module
  </a>
</div>
```

For the Final Exam, "Review module" is replaced with "Review all modules" pointing at `../../index.html`.

### 4.3 Shared CSS additions

```css
/* ---------- Quiz Actions ---------- */
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
```

### 4.4 Landing page anchors

In `index.html`, each module section gets `id="module-{N}"`:

```jsx
<section id={`module-${idx + 1}`} className="module-card">
  ...
</section>
```

(Exact JSX depends on current structure; anchor added to whichever element wraps each module card.)

---

## 5. Quiz Count Normalization (+9 New Questions)

### 5.1 Current counts

| Quiz | Questions today | Target |
|---|---|---|
| Fundamentals (Module 1) | 18 | 18 |
| Prompt Engineering (Module 2) | 15 | 18 (+3) |
| Context Engineering (Module 3) | 15 | 18 (+3) |
| MCP (Module 4) | 15 | 18 (+3) |
| Architectures (Module 5) | 18 | 18 |
| Final Exam | 50 | 50 |

### 5.2 Authoring process

For each of the 3 target quizzes, Claude drafts 3 new questions (plus correct answer, 3 distractors, explanation). User reviews before implementation. Questions match the existing quiz's tone and difficulty (neither trick questions nor trivia — they test the module's learning objectives).

### 5.3 Proposed topics

**Prompt Engineering (+3):** covering gaps in the current quiz

- Chain-of-Thought prompting: when to use it vs. when it's wasteful.
- Role prompting limitations (when "You are an expert X" doesn't actually help).
- Few-shot vs. zero-shot trade-offs (cost, consistency, token cost).

**Context Engineering (+3):**

- Context window vs. effective context (lost-in-the-middle effect).
- When to prefer long context over RAG (and vice versa).
- Token budgets: system prompt vs. user input vs. tool-call scaffolding.

**MCP (+3):**

- MCP server lifecycle (when it runs, where it lives, trust model).
- MCP tools vs. resources vs. prompts — which to use when.
- Authentication patterns for MCP servers (local vs. remote; secrets handling).

Full question text (stem + 4 options + correct index + explanation) is authored during implementation and surfaced for user review before merging.

### 5.4 Insertion location

Questions are appended to the existing `QUESTIONS` array in each quiz file. No reordering of current questions. Progress bar and results page automatically scale because they read `QUESTIONS.length`.

---

## 6. Deeper ARIA Sweep

### 6.1 Disclosures

Every expandable panel (tech-card click-to-reveal, tab widgets, collapsible explanations) gets:

- `aria-expanded={isOpen}` on the toggle control
- `aria-controls="{panel-id}"` on the toggle
- `id="{panel-id}"` on the revealable region
- If the toggle is a `<div>`, convert to `<button type="button">`; if conversion isn't feasible (e.g., card-wide click target), add `role="button"`, `tabIndex={0}`, and `onKeyDown` handler that triggers on `Enter` or `Space`.

### 6.2 Heading hierarchy

Each guide becomes:

- `<h1>` — guide title (top-bar, once per page)
- `<h2>` — stage header (one per stage, the `.stage-header` class)
- `<h3>` — sub-section headings within a stage (currently often just styled divs)
- No skipped levels (no `<h3>` without an `<h2>` parent)

The top-bar `.title` currently renders as a generic `<div>` in some guides. Standardize to `<h1 className="title">`.

### 6.3 Complex widgets

Tech-cards, tab widgets, and interactive demos that pair a control with explanatory text get `aria-describedby` linking the control to the explanation element (which already exists — just needs a stable `id` and the attribute on the control).

### 6.4 Scope

This sweep touches all 25 guides from Phase 1. Each guide's specific disclosure/widget inventory is identified by reading the file; the pattern is identical, just applied to different JSX.

---

## 7. Files Touched

| Area | Files | Count |
|---|---|---|
| Overflow fixes | `index.html`, `architectures/overview.html` | 2 |
| Up-Next footer CTA | 18 non-quiz guides (6 Fundamentals + 2 Prompt + 2 Context + 2 MCP + 6 Architectures) | 18 |
| Quiz CTAs (Module Complete + Retry + Review) | 5 module quizzes + Final Exam | 6 |
| Quiz count normalization | 3 quizzes (Modules 2, 3, 4) — overlaps with previous row | 3 |
| Deeper ARIA sweep | all 25 guides — overlaps with previous rows | 25 |
| Shared CSS append | `assets/guide-shared.css` | 1 |
| Landing-page anchors | `index.html` — overlaps with overflow fix | same file |
| CLAUDE.md updates (up-next convention, landing-page anchor convention) | `CLAUDE.md` | 1 |

**Unique file count: ~28** (mostly re-touching Phase 1 files).

---

## 8. Verification Plan

1. **Overflow spot-check at 3 viewport widths** (768, 1024, 1440): open `index.html` + 3 random guides + `architectures/overview.html`; confirm no horizontal scroll, no clipped text.
2. **Up-Next sequence walk:** manually click "Up Next ▶" from `what-is-genai.html` all the way through the final exam; confirm each link lands on the right next-guide and no broken links.
3. **Quiz flow walk:** complete each of the 6 quizzes; confirm Module Complete CTA appears, Continue CTA goes to the right next destination, Retry resets state (verify by checking question index is 0 and no answers pre-selected), Review module anchors back to the correct `#module-N`.
4. **Quiz count audit:** `grep -c "question:" guides/*/quiz.html` confirms 18 entries for Modules 2, 3, 4 (matches Modules 1 and 5).
5. **Keyboard a11y:** Tab through 2 random guides; confirm every disclosure exposes `aria-expanded` that toggles on Enter/Space; heading order is clean (inspect with DevTools Accessibility → Headings).
6. **Lighthouse run:** 3 spot-checked guides score ≥ 95 on Accessibility.
7. **Grep post-conditions:**
   - `grep -rl "NEXT_GUIDE" guides/` should list all 18 non-quiz guides
   - `grep -rl "module-complete-cta" guides/` should list all 6 quiz files
   - `grep -l 'id="module-' index.html` should return index.html

## 9. Open Questions (resolved during implementation)

- **Exact wording of "Continue to..." labels** — use the canonical module names from `index.html`'s MODULES array (already in guide badges).
- **Share-your-mastery button after final exam** — deferred; only "Back to Home" for now.
- **Anchored scroll target on landing page** — use the module card's top edge (default `scroll-margin-top: 80px` on `#module-N` to clear any sticky header).

## 10. Implementation Order

Sequential to keep diffs easy to review:

1. Shared CSS append (single file, all selectors used later land first).
2. `index.html` overflow fix + landing-page anchors.
3. `architectures/overview.html` overflow fix.
4. Up-Next CTA rollout across all 17 non-quiz guides (one commit per module).
5. Quiz CTAs (Module Complete + Retry + Review) across all 6 quiz files (one commit per quiz, 6 commits).
6. Quiz count normalization — 9 new questions authored + reviewed + inserted (3 commits).
7. Deeper ARIA sweep (one commit per module).
8. CLAUDE.md updates + final verification pass.

Estimated commit count: ~20.
