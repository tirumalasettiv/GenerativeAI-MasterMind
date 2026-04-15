# Phase 1 — Foundations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract all shared CSS into `assets/guide-shared.css`, link it from every guide, remove duplicate inline rules, add production metadata (OG/meta tags), add a baseline accessibility layer (keyboard nav, ARIA, skip link, reduced motion), normalize badge labels and the `prompt-engineering/techniques.html` outlier, and update `CLAUDE.md` to document the new architecture.

**Architecture:** Every guide HTML currently carries its own copy of shared layout and component CSS inline, causing drift. This phase introduces a single `assets/guide-shared.css` derived from Module 1 (the canonical styling). Each guide links the shared file from `<head>` and keeps only guide-specific styles inline. Accessibility and metadata additions are applied uniformly across every guide.

**Tech Stack:** Static HTML + React 18 via CDN + Babel Standalone + inline CSS. No build system, no tests. "Testing" here means: browser visual verification, axe-core DevTools accessibility scan, Lighthouse audit, and `grep` post-condition checks.

**Reference:** `docs/superpowers/specs/2026-04-15-production-readiness-audit-design.md`

---

## File Structure

```
GenerativeAI-MasterMind/
├── assets/
│   ├── guide-shared.css          [NEW — Task 2]
│   └── og-default.svg            [NEW — Task 3]
├── index.html                     [MODIFY — Task 11]
├── guides/
│   ├── fundamentals/
│   │   ├── what-is-genai.html    [MODIFY — Task 4 (reference)]
│   │   ├── regular-vs-genai.html [MODIFY — Task 6]
│   │   ├── how-genai-works.html  [MODIFY — Task 6]
│   │   ├── ai-model-types.html   [MODIFY — Task 6]
│   │   ├── limitations.html      [MODIFY — Task 6]
│   │   ├── verify-framework.html [MODIFY — Task 6]
│   │   └── quiz.html             [MODIFY — Task 6]
│   ├── prompt-engineering/
│   │   ├── costar-meta.html      [MODIFY — Task 7]
│   │   ├── techniques.html       [MODIFY — Task 7 (outlier cleanup)]
│   │   └── quiz.html             [MODIFY — Task 7]
│   ├── context-engineering/
│   │   ├── foundations.html      [MODIFY — Task 8]
│   │   ├── mastering-context.html[MODIFY — Task 8]
│   │   └── quiz.html             [MODIFY — Task 8]
│   ├── mcp/
│   │   ├── fundamentals.html     [MODIFY — Task 9]
│   │   ├── advanced.html         [MODIFY — Task 9]
│   │   └── quiz.html             [MODIFY — Task 9]
│   ├── architectures/
│   │   ├── overview.html         [MODIFY — Task 10]
│   │   ├── llm-chat.html         [MODIFY — Task 10]
│   │   ├── rag.html              [MODIFY — Task 10]
│   │   ├── workflows.html        [MODIFY — Task 10]
│   │   ├── agents.html           [MODIFY — Task 10]
│   │   ├── agentic-ai.html       [MODIFY — Task 10]
│   │   └── quiz.html             [MODIFY — Task 10]
│   └── final-exam/
│       └── quiz.html             [MODIFY — Task 11]
├── CLAUDE.md                      [MODIFY — Task 12]
└── docs/                          (untouched in Phase 1)
```

**13 tasks total. 28 files touched (2 new, 25 modified, 1 doc).**

---

## Canonical Reference Patterns (used by Tasks 4–11)

### Pattern A: `<head>` edits — applied to every guide HTML

1. After the Google Fonts `<link>`, insert the shared CSS link with the module-appropriate relative path:
   - For guides nested at `guides/{module}/*.html`: `href="../../assets/guide-shared.css"`
   - For `index.html` at repo root: `href="assets/guide-shared.css"`

2. Replace existing minimal `<meta>` tags with the full set:

   ```html
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <meta name="description" content="{PER-GUIDE DESCRIPTION, ≤160 chars}">
   <meta name="theme-color" content="#6c5ce7">
   <meta property="og:title" content="{PER-GUIDE TITLE}">
   <meta property="og:description" content="{SAME AS description}">
   <meta property="og:type" content="article">
   <meta property="og:image" content="{RELATIVE PATH}/assets/og-default.svg">
   <meta name="twitter:card" content="summary_large_image">
   <meta name="twitter:title" content="{PER-GUIDE TITLE}">
   <meta name="twitter:description" content="{SAME AS description}">
   <link rel="icon" type="image/svg+xml" href="{RELATIVE PATH}/favicon.svg">
   ```

### Pattern B: Inline `<style>` dedupe — rules to DELETE from every guide

Delete every rule whose selector is in the "Shared" column below. Keep any rule marked "Guide-specific — KEEP if present".

| Selector | Action | Notes |
|---|---|---|
| `*` universal reset | DELETE | In shared |
| `body` | DELETE | In shared |
| `#root` | DELETE | In shared |
| `.container` | DELETE | In shared |
| `.sidebar` | DELETE | In shared |
| `.main-content` | DELETE | In shared |
| `.main-container` | RENAME to `.main-content` | Some guides use this name |
| `.step-wrapper` | DELETE | In shared |
| `.step-btn` (+ `.active`, `.correct`, `.incorrect`, `:hover`) | DELETE | In shared |
| `.step-btn-label` (+ `.active`) | DELETE | In shared |
| `.step-connector` (+ `.active`) | DELETE | In shared |
| `.top-bar` | DELETE | In shared |
| `.left-section` | DELETE | In shared |
| `.back-link` (+ `:hover`) | DELETE | In shared |
| `.badge` | DELETE | In shared |
| `.guide-number` | DELETE | In shared |
| `.title` | DELETE | In shared |
| `.stage-header` | DELETE | In shared |
| `.nav-arrows` | DELETE | In shared |
| `.progress-indicator` | DELETE | In shared |
| `.arrow-btn` (+ `:hover`, `:disabled`) | DELETE | In shared |
| `.content-area` | DELETE | In shared |
| `.explanation` | DELETE | In shared |
| `.scene-card` | DELETE | In shared |
| `.insight-box` | DELETE | In shared |
| `.insight-label` | DELETE | In shared |
| `@keyframes fadeIn`, `pulse`, `blink`, `slideIn` | DELETE | In shared |
| `.fade-in`, `.pulse`, `.typing` utility classes | DELETE | In shared |
| `.scrollbar-hide`, `.scrollbar-hide::-webkit-scrollbar` | DELETE | In shared |
| `svg` max-width rule | DELETE | In shared |
| Everything else (analogy cards, tech cards, stage-specific widgets, SVG-specific animations like `nodePulse`/`dashMarch`, interactive component styles) | KEEP | Guide-specific |

### Pattern C: Accessibility edits — JSX transformations applied to every guide

1. **Step button**: find `<div className="step-btn ...` in the JSX and convert to `<button type="button" className="step-btn ..." aria-label={\`Step ${n}: ${title}\`} aria-current={active ? "step" : undefined} ...>`. Preserve all existing props/handlers.
2. **Arrow buttons**: any `<div>` acting as nav arrow → `<button type="button" aria-label="Previous section">` / `"Next section"` with existing handler preserved.
3. **Skip link**: insert as the very first child of the root component's returned fragment:
   ```jsx
   <a href="#main" className="skip-link">Skip to main content</a>
   ```
4. **Main landmark**: wrap the content area with `<main id="main">` (or add the attribute to the existing `.content-area` element).
5. **Nav/aside landmarks**: wrap step sidebar with `<aside aria-label="Guide sections">`, nav-arrows with `<nav aria-label="Section navigation">`.
6. **Clickable SVG nodes** (only if the guide has `<g onClick=...>` or similar): add `role="button"`, `tabIndex={0}`, and `onKeyDown` that triggers the same handler on `Enter` or `Space`. Template:
   ```jsx
   onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); } }}
   ```

### Pattern D: Skip-link CSS — add to every guide's inline `<style>` block (since it's guide-scoped positioning anchor)

Note: the base `.skip-link` rules already ship in `assets/guide-shared.css`. Nothing additional needs to be added per-guide.

### Pattern E: Badge text normalization

If the guide contains any of these strings in JSX (search with grep), replace:
- `"INTERACTIVE GUIDE"` → `"INTERACTIVE"`
- `"BEGINNER GUIDE"` → `"BEGINNER"`

---

## Task 1: Pre-flight — commit pre-existing style-unification work

**Files:**
- Modify: N/A (git operations only)

- [ ] **Step 1: Check current branch and repo status**

Run:
```bash
cd /Users/tirumalasettiv/active-projects/GenerativeAI-MasterMind && git status --short && git branch --show-current
```
Expected: on `main` with ~10 modified files (ongoing style-unification + quiz expansion) and 1 untracked plan file.

- [ ] **Step 2: Review the uncommitted changes**

Run:
```bash
git diff --stat
git diff guides/fundamentals/what-is-genai.html | head -100
```
Expected: changes match the superseded style-unification specs (token alignment, SVG additions, quiz expansion). If anything looks unrelated, stop and ask the user before committing.

- [ ] **Step 3: Stage and commit the pre-existing work as one logical commit**

Run:
```bash
git add guides/context-engineering/quiz.html guides/fundamentals/ai-model-types.html guides/fundamentals/how-genai-works.html guides/fundamentals/limitations.html guides/fundamentals/quiz.html guides/fundamentals/regular-vs-genai.html guides/fundamentals/verify-framework.html guides/fundamentals/what-is-genai.html guides/mcp/quiz.html guides/prompt-engineering/quiz.html
git add docs/superpowers/plans/2026-04-03-course-final-exam.md docs/superpowers/specs/2026-04-15-production-readiness-audit-design.md docs/superpowers/plans/2026-04-15-phase-1-foundations.md
git commit -m "$(cat <<'EOF'
land style-unification work, final-exam plan, and phase-1 spec+plan

- wraps up Module 1 & quiz CSS token alignment from the two superseded
  style-unification specs (2026-04-15-module-style-unification-design,
  2026-04-15-module5-style-unification-design)
- adds final-exam plan reference, phase-1 foundations spec, and phase-1
  foundations plan to docs/superpowers/

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
git status
```
Expected: working tree clean.

- [ ] **Step 4: Confirm clean baseline**

Run:
```bash
git status
```
Expected: `nothing to commit, working tree clean`.

---

## Task 2: Create `assets/guide-shared.css`

**Files:**
- Create: `assets/guide-shared.css`

- [ ] **Step 1: Create the assets directory**

Run:
```bash
mkdir -p /Users/tirumalasettiv/active-projects/GenerativeAI-MasterMind/assets
ls -la /Users/tirumalasettiv/active-projects/GenerativeAI-MasterMind/assets
```
Expected: empty directory created.

- [ ] **Step 2: Write the full shared CSS file**

Create `assets/guide-shared.css` with this exact content:

```css
/* ==========================================================================
   GenerativeAI-MasterMind — Shared Guide Styles
   Derived from Module 1 (Fundamentals) canonical styling.
   Every guide page links this file. Guide-specific component styles stay
   in the per-guide <style> block.
   ========================================================================== */

/* ---------- Design Tokens ---------- */
:root {
  /* Brand */
  --color-primary: #6c5ce7;
  --color-primary-soft: #a78bfa;
  --color-primary-light: #e8e3f8;
  --color-primary-faint: #f5f3ff;
  --color-primary-muted: #b0a6e8;

  /* Semantic */
  --color-success: #2ecc71;
  --color-success-bg: #f0faf0;
  --color-success-deep: #1a5e3a;
  --color-error: #e74c3c;
  --color-warning: #f39c12;
  --color-info: #3498db;

  /* Neutrals */
  --color-bg: #ffffff;
  --color-bg-subtle: #f8f9fa;
  --color-bg-dark: #1a1a2e;
  --color-text: #1a1a1a;
  --color-text-body: #2a2a2a;
  --color-text-muted: #666666;
  --color-text-faint: #999999;
  --color-border: #e0e0e0;
  --color-border-soft: #e8e8f0;

  /* Typography */
  --font-body: 'DM Sans', sans-serif;
  --font-display: 'Fraunces', serif;
  --fs-title: 28px;
  --fs-stage: 24px;
  --fs-body: 22px;
  --fs-insight: 17px;
  --fs-badge: 12px;
  --fs-step-emoji: 26px;
  --fs-step-label: 11px;
  --fs-nav: 14px;
  --fs-guide-number: 20px;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 36px;

  /* Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;

  /* Layout */
  --sidebar-width: 120px;
  --sidebar-pad-y-top: 80px;
  --sidebar-pad-y-bot: 40px;
  --step-btn-size: 64px;
  --arrow-btn-size: 40px;
  --content-pad-y: 24px;
  --content-pad-x: 36px;
  --content-gap: 18px;

  /* Motion */
  --transition-fast: 0.2s ease;
  --transition-default: 0.3s ease;
  --transition-bouncy: 0.3s cubic-bezier(0.22, 0.68, 0, 1.2);

  /* Elevation */
  --shadow-card: 0 4px 20px rgba(108, 92, 231, 0.08);
  --shadow-card-hover: 0 8px 20px rgba(108, 92, 231, 0.12);
  --shadow-step-active: 0 4px 12px rgba(108, 92, 231, 0.3);
}

/* ---------- Reset ---------- */
* { margin: 0; padding: 0; box-sizing: border-box; }

/* ---------- Skip link ---------- */
.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  z-index: 9999;
  background: var(--color-primary);
  color: #fff;
  padding: 12px 20px;
  border-radius: 0 0 var(--radius-sm) 0;
  font-weight: 600;
  text-decoration: none;
}
.skip-link:focus {
  left: 0;
  outline: 3px solid #fff;
  outline-offset: 2px;
}

/* ---------- Body & Root ---------- */
body {
  font-family: var(--font-body);
  background: var(--color-bg);
  color: var(--color-text);
  height: 100vh;
}
#root { height: 100vh; overflow: hidden; }

/* ---------- Layout shell ---------- */
.container { display: flex; height: 100vh; overflow: hidden; }

.sidebar {
  width: var(--sidebar-width);
  background: var(--color-bg-subtle);
  border-right: 1px solid var(--color-border);
  padding: var(--sidebar-pad-y-top) 12px var(--sidebar-pad-y-bot);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  min-width: 0;
}

/* ---------- Sidebar steps ---------- */
.step-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.step-btn {
  width: var(--step-btn-size);
  height: var(--step-btn-size);
  border-radius: 50%;
  background: #fff;
  border: 2px solid var(--color-border);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--fs-step-emoji);
  transition: all var(--transition-default);
  position: relative;
  flex-shrink: 0;
  color: inherit;
  font-family: inherit;
  padding: 0;
}
.step-btn:hover { border-color: var(--color-primary); transform: translateY(-2px); }
.step-btn:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}
.step-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
  transform: scale(1.1);
  box-shadow: var(--shadow-step-active);
}
.step-btn.correct { background: var(--color-success); border-color: var(--color-success); color: #fff; }
.step-btn.incorrect { background: var(--color-error); border-color: var(--color-error); color: #fff; }

.step-btn-label {
  font-size: var(--fs-step-label);
  font-weight: 600;
  color: var(--color-text-faint);
  margin-top: var(--space-xs);
  text-align: center;
  letter-spacing: 0.3px;
  max-width: 96px;
  line-height: 1.2;
  overflow-wrap: break-word;
  word-break: break-word;
  transition: color var(--transition-default);
}
.step-wrapper.active .step-btn-label { color: var(--color-primary); }

.step-connector {
  width: 2px;
  height: 16px;
  background: var(--color-border);
  margin: 2px 0;
  flex-shrink: 0;
}
.step-connector.active { background: var(--color-primary); }

/* ---------- Top bar ---------- */
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 40px;
  border-bottom: 3px solid transparent;
  border-image: linear-gradient(90deg, var(--color-primary), var(--color-primary-soft), var(--color-success)) 1;
  background: #fff;
  flex-shrink: 0;
  gap: var(--space-md);
}

.left-section { display: flex; align-items: center; gap: 20px; min-width: 0; flex: 1; }

.back-link {
  color: var(--color-primary);
  text-decoration: none;
  font-size: var(--fs-nav);
  font-weight: 500;
  cursor: pointer;
  transition: color var(--transition-fast);
  flex-shrink: 0;
}
.back-link:hover { color: var(--color-success); }
.back-link:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; border-radius: 4px; }

.badge {
  display: inline-block;
  background: var(--color-primary-light);
  color: var(--color-primary);
  padding: 8px 16px;
  border-radius: var(--radius-xl);
  font-size: var(--fs-badge);
  font-weight: 700;
  letter-spacing: 0.5px;
  flex-shrink: 0;
  white-space: nowrap;
}

.guide-number {
  font-family: var(--font-display);
  font-size: var(--fs-guide-number);
  font-weight: 700;
  color: var(--color-primary-muted);
  margin-right: 8px;
  flex-shrink: 0;
}

.title {
  font-family: var(--font-display);
  font-size: var(--fs-title);
  font-weight: 700;
  color: var(--color-text);
  min-width: 0;
  overflow-wrap: break-word;
}

/* ---------- Nav arrows ---------- */
.nav-arrows { display: flex; gap: 12px; align-items: center; flex-shrink: 0; }

.progress-indicator {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary);
  background: var(--color-primary-faint);
  padding: 4px 12px;
  border-radius: var(--radius-md);
  margin-right: 12px;
}

.arrow-btn {
  width: var(--arrow-btn-size);
  height: var(--arrow-btn-size);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: #fff;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  color: inherit;
  font-family: inherit;
  padding: 0;
}
.arrow-btn:hover:not(:disabled) { border-color: var(--color-primary); color: var(--color-primary); transform: translateY(-2px); }
.arrow-btn:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
.arrow-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* ---------- Content area ---------- */
.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  scroll-behavior: smooth;
  padding: var(--content-pad-y) var(--content-pad-x);
  gap: var(--content-gap);
  min-width: 0;
}

.stage-header {
  font-family: var(--font-display);
  font-size: var(--fs-stage);
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 8px;
}

.explanation {
  font-size: var(--fs-body);
  line-height: 1.7;
  color: var(--color-text-body);
  overflow-wrap: break-word;
}

/* ---------- Shared components ---------- */
.scene-card {
  background: linear-gradient(135deg, #fafafe 0%, #f5f3ff 50%, #f0f8ff 100%);
  border-radius: var(--radius-lg);
  padding: 28px;
  border: 1px solid var(--color-primary-light);
  min-height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-card);
}

.insight-box {
  background: var(--color-success-bg);
  border-left: 4px solid var(--color-success);
  padding: 16px 20px;
  border-radius: var(--radius-sm);
  color: var(--color-success-deep);
  font-size: var(--fs-insight);
  line-height: 1.7;
  margin-top: 0;
  position: relative;
  overflow-wrap: break-word;
}

.insight-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--color-success);
  margin-bottom: 8px;
  text-transform: uppercase;
}

/* ---------- Code (safe overflow) ---------- */
code, pre, .code-block {
  font-family: 'SF Mono', 'Menlo', 'Consolas', monospace;
  overflow-wrap: break-word;
  word-break: break-word;
}
pre {
  overflow-x: auto;
  padding: 12px 16px;
  background: var(--color-bg-subtle);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border-soft);
}

/* ---------- Typing animation (safe) ---------- */
.typing {
  display: inline-block;
  overflow: hidden;
  border-right: 2px solid var(--color-primary);
  white-space: nowrap;
  max-width: 100%;
  text-overflow: ellipsis;
  animation: blink 1s steps(1) infinite;
}

/* ---------- Animations ---------- */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
@keyframes blink {
  0%, 50%, 100% { opacity: 1; }
  25%, 75% { opacity: 0; }
}
@keyframes slideIn {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}
.fade-in { animation: fadeIn 0.6s ease forwards; }
.pulse { animation: pulse 2s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* ---------- SVG ---------- */
svg { max-width: 100%; height: auto; }

/* ---------- Scrollbar util ---------- */
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.scrollbar-hide::-webkit-scrollbar { display: none; }

/* ---------- Global focus ring ---------- */
button:focus-visible,
a:focus-visible,
[role="button"]:focus-visible,
[tabindex="0"]:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}
```

- [ ] **Step 3: Verify the file exists and has the expected size**

Run:
```bash
wc -l /Users/tirumalasettiv/active-projects/GenerativeAI-MasterMind/assets/guide-shared.css
```
Expected: ~340 lines.

- [ ] **Step 4: Commit**

Run:
```bash
cd /Users/tirumalasettiv/active-projects/GenerativeAI-MasterMind && git add assets/guide-shared.css && git commit -m "$(cat <<'EOF'
add assets/guide-shared.css — canonical design tokens + shared styles

Module 1-derived shared stylesheet. Every guide links this file and keeps
only guide-specific component styles inline. Includes design tokens,
layout shell, shared components, skip-link, focus ring, reduced-motion
support.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Create `assets/og-default.svg`

**Files:**
- Create: `assets/og-default.svg`

- [ ] **Step 1: Write the OG default SVG**

Create `assets/og-default.svg` with this exact content (1200×630 — standard OG dimensions):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" role="img" aria-label="GenerativeAI MasterMind — Interactive Learning">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6c5ce7"/>
      <stop offset="50%" stop-color="#a78bfa"/>
      <stop offset="100%" stop-color="#2ecc71"/>
    </linearGradient>
    <linearGradient id="card" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#f5f3ff" stop-opacity="0.9"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <g transform="translate(80,80)">
    <rect width="1040" height="470" rx="28" fill="url(#card)"/>
    <text x="60" y="120" font-family="Fraunces, serif" font-weight="700" font-size="32" fill="#6c5ce7">GenerativeAI</text>
    <text x="60" y="220" font-family="Fraunces, serif" font-weight="700" font-size="96" fill="#1a1a1a">MasterMind</text>
    <text x="60" y="290" font-family="DM Sans, sans-serif" font-weight="500" font-size="28" fill="#666">Interactive Generative AI Learning Platform</text>
    <g transform="translate(60,350)">
      <circle cx="30" cy="30" r="28" fill="#6c5ce7"/>
      <text x="30" y="38" text-anchor="middle" font-family="Fraunces, serif" font-weight="700" font-size="24" fill="#fff">5</text>
      <text x="80" y="38" font-family="DM Sans, sans-serif" font-weight="600" font-size="22" fill="#2a2a2a">Modules</text>
      <circle cx="240" cy="30" r="28" fill="#2ecc71"/>
      <text x="240" y="38" text-anchor="middle" font-family="Fraunces, serif" font-weight="700" font-size="22" fill="#fff">24</text>
      <text x="290" y="38" font-family="DM Sans, sans-serif" font-weight="600" font-size="22" fill="#2a2a2a">Guides</text>
      <circle cx="470" cy="30" r="28" fill="#f39c12"/>
      <text x="470" y="38" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="20" fill="#fff">AI</text>
      <text x="520" y="38" font-family="DM Sans, sans-serif" font-weight="600" font-size="22" fill="#2a2a2a">Fundamentals → Agents</text>
    </g>
  </g>
</svg>
```

- [ ] **Step 2: Verify file exists**

Run:
```bash
ls -la /Users/tirumalasettiv/active-projects/GenerativeAI-MasterMind/assets/og-default.svg
```
Expected: file exists, ~1.5KB.

- [ ] **Step 3: Commit**

Run:
```bash
cd /Users/tirumalasettiv/active-projects/GenerativeAI-MasterMind && git add assets/og-default.svg && git commit -m "$(cat <<'EOF'
add assets/og-default.svg — social-share preview

Default 1200x630 OG image using brand gradient + wordmark. Per-module
imagery deferred to Phase 6.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Migrate reference guide — `guides/fundamentals/what-is-genai.html`

This task establishes the migration pattern. Follow it exactly. Later tasks reference this pattern.

**Files:**
- Modify: `guides/fundamentals/what-is-genai.html`

- [ ] **Step 1: Read the current file's `<head>` block**

Run:
```bash
head -20 /Users/tirumalasettiv/active-projects/GenerativeAI-MasterMind/guides/fundamentals/what-is-genai.html
```
Expected: shows existing minimal meta + Google Fonts + React CDN + `<style>` open.

- [ ] **Step 2: Replace the `<head>` meta/link section**

Using the Edit tool, replace the block from line 1 through the closing `</script>` of the Babel standalone script with this (preserving relative paths appropriate to `guides/fundamentals/`):

Find (old):
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/svg+xml" href="../../favicon.svg">
  <title>What is Generative AI? - Interactive Guide</title>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:wght@700&display=swap" rel="stylesheet">
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
```

Replace with:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Interactive guide to Generative AI. Learn what GenAI is, how it differs from traditional software, and what makes it powerful through hands-on examples.">
  <meta name="theme-color" content="#6c5ce7">
  <meta property="og:title" content="What is Generative AI? — Interactive Guide">
  <meta property="og:description" content="Interactive guide to Generative AI. Learn what GenAI is, how it differs from traditional software, and what makes it powerful through hands-on examples.">
  <meta property="og:type" content="article">
  <meta property="og:image" content="../../assets/og-default.svg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="What is Generative AI? — Interactive Guide">
  <meta name="twitter:description" content="Interactive guide to Generative AI. Learn what GenAI is, how it differs from traditional software, and what makes it powerful through hands-on examples.">
  <link rel="icon" type="image/svg+xml" href="../../favicon.svg">
  <title>What is Generative AI? - Interactive Guide</title>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:wght@700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../assets/guide-shared.css">
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
```

- [ ] **Step 3: Delete duplicate CSS rules from the inline `<style>` block**

Read lines 12–310 of the file. Using the Edit tool, delete the following rule blocks from `<style>`, which now live in shared CSS (see Pattern B):

Delete:
- `*` universal reset
- `body { ... height: 100vh; }`
- `#root { ... overflow: hidden; }`
- `.container { ... overflow: hidden; }`
- `.sidebar { width: 120px; ... gap: 4px; }`
- `.step-wrapper { ... flex-shrink: 0; }`
- `.step-btn { ... flex-shrink: 0; }` and `.step-btn.active`, `.step-btn:hover`
- `.step-btn-label` and `.step-wrapper.active .step-btn-label`
- `.step-connector` and `.step-connector.active`
- `.main-content { ... overflow: hidden; }`
- `.top-bar { ... flex-shrink: 0; }`
- `.left-section { ... gap: 20px; }`
- `.back-link` and `.back-link:hover`
- `.badge { ... letter-spacing: 0.5px; }`
- `.guide-number { ... margin-right: 8px; }`
- `.title { ... color: #1a1a1a; }`
- `.stage-header { ... margin-bottom: 8px; }`
- `.nav-arrows { ... gap: 12px; }`
- `.arrow-btn { ... transition: all 0.2s ease; }` and `.arrow-btn:hover`, `.arrow-btn:disabled`
- `.content-area { ... gap: 18px; }`
- `.explanation { ... color: #2a2a2a; }`
- `.scene-card { ... box-shadow: 0 4px 20px rgba(108, 92, 231, 0.08); }`
- `.insight-box { ... position: relative; }`
- `.insight-label { ... text-transform: uppercase; }`
- `@keyframes fadeIn { ... }`
- `@keyframes pulse { ... }`
- `@keyframes blink { ... }`
- `.fade-in`, `.pulse`, `.typing` rules

Keep (guide-specific — starts around line 312):
- `.demo-outputs`, `.output-type`, `.output-icon`, `.output-text`
- `.analogy-cards`, `.analogy-card`, `.analogy-icon`, `.analogy-title`
- All stage 3/4/5 specific styles
- Any SVG-specific `@keyframes` (e.g. `nodePulse`, `dashMarch`) if present

After deletion, the first rule in `<style>` should be the first guide-specific rule (e.g., `.demo-outputs`).

- [ ] **Step 4: Add skip-link JSX**

Find the root React component's return statement (likely `return (<div className="container">` or similar at around line 1800+). Change to:

```jsx
return (
  <React.Fragment>
    <a href="#main" className="skip-link">Skip to main content</a>
    <div className="container">
      ...existing content...
    </div>
  </React.Fragment>
);
```

- [ ] **Step 5: Convert step-btn `<div>`s to `<button>`s**

Find all `<div className="step-btn` occurrences (likely inside a `.map()` rendering the sidebar). Replace the outer element from `<div>` to `<button type="button"` and add `aria-label={\`Step ${i + 1}: ${step.label}\`}` and `aria-current={currentStep === i ? "step" : undefined}`. Preserve existing `onClick`, `key`, and className logic.

Example transformation:
```jsx
// Before
<div
  key={i}
  className={`step-btn ${currentStep === i ? 'active' : ''}`}
  onClick={() => setCurrentStep(i)}
>
  {step.emoji}
</div>

// After
<button
  type="button"
  key={i}
  className={`step-btn ${currentStep === i ? 'active' : ''}`}
  aria-label={`Step ${i + 1}: ${step.label}`}
  aria-current={currentStep === i ? "step" : undefined}
  onClick={() => setCurrentStep(i)}
>
  {step.emoji}
</button>
```

- [ ] **Step 6: Convert arrow nav `<div>`s to `<button>`s (if present as div)**

Find the nav-arrows block. If arrows are already `<button>` elements, ensure they have `type="button"` and `aria-label="Previous section"` / `"Next section"`. If they are `<div>`, convert them.

- [ ] **Step 7: Add landmarks**

Wrap step sidebar in `<aside aria-label="Guide sections">`:
```jsx
<aside className="sidebar" aria-label="Guide sections">
  {/* step-wrapper / step-btn etc. */}
</aside>
```

Wrap nav-arrows in `<nav>`:
```jsx
<nav className="nav-arrows" aria-label="Section navigation">
  {/* prev/next buttons */}
</nav>
```

Change `<div className="content-area">` to `<main id="main" className="content-area">`.

- [ ] **Step 8: Badge text check**

Run:
```bash
grep -n "INTERACTIVE GUIDE\|BEGINNER GUIDE" /Users/tirumalasettiv/active-projects/GenerativeAI-MasterMind/guides/fundamentals/what-is-genai.html
```

If any hits, replace `"INTERACTIVE GUIDE"` → `"INTERACTIVE"`. (This file was in the audit list; expect one hit around line 1833.)

- [ ] **Step 9: Browser visual verification**

Start a local HTTP server:
```bash
cd /Users/tirumalasettiv/active-projects/GenerativeAI-MasterMind && python3 -m http.server 8765 &
```

Open `http://localhost:8765/guides/fundamentals/what-is-genai.html` in a browser. Manually verify:
- Page renders without CSS missing (fonts, colors, layout match pre-migration).
- Step buttons are keyboard-focusable (Tab reaches them, visible focus ring).
- Tab to the first element reveals the skip link.
- Badge text says "INTERACTIVE" not "INTERACTIVE GUIDE".
- All interactions (step clicks, arrow nav) still work.

- [ ] **Step 10: Accessibility scan**

With the file open in browser, open DevTools → Lighthouse → run Accessibility audit on the current page. Target: score ≥ 95.

Alternatively install the `axe DevTools` Chrome extension; run the scan on the page. Target: 0 critical/serious violations.

- [ ] **Step 11: Stop the local server**

```bash
# find and kill
lsof -ti:8765 | xargs kill -9 2>/dev/null || true
```

- [ ] **Step 12: Commit**

Run:
```bash
cd /Users/tirumalasettiv/active-projects/GenerativeAI-MasterMind && git add guides/fundamentals/what-is-genai.html && git commit -m "$(cat <<'EOF'
migrate fundamentals/what-is-genai.html to shared CSS + a11y baseline

- links assets/guide-shared.css, removes duplicate inline rules
- adds OG/meta tags pointing at assets/og-default.svg
- step-btn and arrow-btn converted to <button>; aria-label and
  aria-current added; landmarks (aside/nav/main#main); skip link
- badge text INTERACTIVE GUIDE -> INTERACTIVE

Reference migration; pattern reused by remaining guides in Phase 1.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Visual side-by-side check of reference guide

**Files:** none (verification only).

- [ ] **Step 1: Fetch the pre-migration copy**

Run:
```bash
cd /Users/tirumalasettiv/active-projects/GenerativeAI-MasterMind && git show HEAD~1:guides/fundamentals/what-is-genai.html > /tmp/what-is-genai.pre.html
```

- [ ] **Step 2: Diff the rendered view**

Start the local server:
```bash
python3 -m http.server 8765 &
```

Open two tabs:
- `http://localhost:8765/guides/fundamentals/what-is-genai.html` (post-migration)
- `file:///tmp/what-is-genai.pre.html` (pre-migration)

Tab through both. Confirm zero visual/behavioral regressions (only intended change: focus rings now visible on keyboard nav; badge says INTERACTIVE not INTERACTIVE GUIDE).

If regressions found, fix the post-migration file before proceeding.

- [ ] **Step 3: Stop server**

```bash
lsof -ti:8765 | xargs kill -9 2>/dev/null || true
```

---

## Task 6: Migrate remaining fundamentals module (6 files)

Apply the same migration pattern (Task 4 steps 2–8) to each file below. For each file, use the meta description listed and the path `../../assets/guide-shared.css`.

**Files:**
- Modify: `guides/fundamentals/regular-vs-genai.html`
- Modify: `guides/fundamentals/how-genai-works.html`
- Modify: `guides/fundamentals/ai-model-types.html`
- Modify: `guides/fundamentals/limitations.html`
- Modify: `guides/fundamentals/verify-framework.html`
- Modify: `guides/fundamentals/quiz.html`

**Meta descriptions to use:**

| File | Description (≤160 chars) | OG Title |
|---|---|---|
| `regular-vs-genai.html` | Compare traditional AI and Generative AI side by side. See what each can and cannot do, and when to reach for which. | Regular AI vs Generative AI — Interactive Guide |
| `how-genai-works.html` | Open the black box. A visual walk through tokens, embeddings, attention, and next-token prediction that power modern LLMs. | Inside the Black Box: How Generative AI Works |
| `ai-model-types.html` | Explore the main families of AI models — language, vision, multimodal, diffusion — and what each is best at. | AI Model Types — Interactive Guide |
| `limitations.html` | Understand what Generative AI still gets wrong: hallucinations, knowledge cutoffs, math errors, and more. | Limitations of Generative AI — Interactive Guide |
| `verify-framework.html` | Use the VERIFY framework to check Generative AI output: Verify, Evaluate, Reason, Investigate, Fact-check, You confirm. | The VERIFY Framework — Interactive Guide |
| `quiz.html` | Test your Generative AI fundamentals knowledge with this interactive quiz covering Module 1. | Module 1 Quiz — Generative AI Fundamentals |

**Badge fixes needed** (per audit):
- `regular-vs-genai.html` → replace `"INTERACTIVE GUIDE"` with `"INTERACTIVE"`
- `verify-framework.html` → replace `"INTERACTIVE GUIDE"` with `"INTERACTIVE"`

**Guide-specific styles to preserve** (do NOT delete these — list is informative):
- `regular-vs-genai.html`: `.split-screen`, `.split-panel`, `.panel-title`, `.icon-large`, `.librarian-scene`, `.books`, `.book`, `.analogy-text`, stage-specific styles
- `how-genai-works.html`: `.stage-title` (note: different from `.stage-header`), `.analogy-text`, `.interactive-input`, transformer pipeline styles
- `ai-model-types.html`: model card styles, comparison table styles
- `limitations.html`: warning card styles, hallucination demo styles
- `verify-framework.html`: framework letter cards, animation-heavy styles
- `quiz.html`: question card, answer option, result screen styles

- [ ] **Step 1: For each of the 6 files, apply Task 4 steps 2–8**

Do them sequentially, not in parallel (easier to verify each). Same pattern each time.

- [ ] **Step 2: Remove `body { background: #f8f9fa }` override**

These three files currently override the page background from `#ffffff` to `#f8f9fa`, which conflicts with the shared CSS default. Find the rule in each file's inline `<style>` and remove the `background` declaration (or the whole `body` rule):
- `how-genai-works.html`
- `ai-model-types.html`
- `regular-vs-genai.html`

After edit, the shared `#ffffff` takes effect. If the guide explicitly needs the subtle grey (visually verify — some guides may look better with it), keep only `body { background: var(--color-bg-subtle); }` and note the exception; otherwise remove.

- [ ] **Step 3: Fix font-import variations**

Normalize all fundamentals guide Google Fonts links to:
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Fraunces:wght@700&display=swap" rel="stylesheet">
```
Remove any extra weights (e.g., `:wght@600;700`) or optical sizing (`opsz,wght@6..72,600`) — shared CSS only uses 400/500/700 for DM Sans and 700 for Fraunces.

- [ ] **Step 4: Visual spot-check each file in browser**

Start `python3 -m http.server 8765`, open each file, click through all stages, confirm no visual regression. Stop server when done.

- [ ] **Step 5: Commit**

Run:
```bash
cd /Users/tirumalasettiv/active-projects/GenerativeAI-MasterMind && git add guides/fundamentals/ && git commit -m "$(cat <<'EOF'
migrate remaining Module 1 (Fundamentals) guides to shared CSS

- 6 files: regular-vs-genai, how-genai-works, ai-model-types, limitations,
  verify-framework, quiz
- links assets/guide-shared.css, dedupes inline rules, adds OG/meta tags
- accessibility baseline: step/arrow buttons, landmarks, skip link
- badge text INTERACTIVE GUIDE -> INTERACTIVE on regular-vs-genai,
  verify-framework
- body background overrides (#f8f9fa) removed; font imports normalized

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Migrate prompt-engineering module (3 files, includes outlier cleanup)

**Files:**
- Modify: `guides/prompt-engineering/costar-meta.html`
- Modify: `guides/prompt-engineering/techniques.html` ← **outlier, needs explicit override cleanup**
- Modify: `guides/prompt-engineering/quiz.html`

**Meta descriptions:**

| File | Description | OG Title |
|---|---|---|
| `costar-meta.html` | Master the COSTAR and Meta prompting frameworks to write clear, high-quality prompts. Interactive walkthrough. | COSTAR & Meta Prompting — Interactive Guide |
| `techniques.html` | Ten battle-tested prompt engineering techniques — Zero-Shot, Few-Shot, Chain-of-Thought, ReAct and more — with examples. | Master 10 Prompt Engineering Techniques |
| `quiz.html` | Test your prompt engineering knowledge with this interactive Module 2 quiz. | Module 2 Quiz — Prompt Engineering |

**Badge fixes:**
- `costar-meta.html` → `"INTERACTIVE GUIDE"` to `"INTERACTIVE"`

**Guide-specific styles to preserve:**
- `costar-meta.html`: COSTAR SVG styles, meta prompt comparison styles
- `techniques.html`: `.overview-intro`, `.cards-grid`, `.tech-card`, `.tech-card.expanded`, `.card-top-row`, `.card-icon-wrap`, `.card-number`, all technique card internals
- `quiz.html`: question/answer/result styles

- [ ] **Step 1: costar-meta.html — apply standard migration pattern**

Apply Task 4 steps 2–8. No special handling required.

- [ ] **Step 2: techniques.html — apply standard migration AND delete outlier overrides**

Apply Task 4 steps 2–8. Additionally, ensure these specific rules are DELETED (they are outliers; the shared CSS will now apply canonical values):

Delete from inline `<style>`:
- `.step-btn { width: 56px; height: 56px; ... padding: 14px; color: #6c5ce7; }` (entirely delete; shared rule applies 64×64 canonical)
- `.step-btn.active { ... transform: scale(1.08); ... }` (delete; shared uses 1.1)
- `.step-btn-label { font-size: 10px; ... max-width: 92px; line-height: 1.2; }` (delete)
- `.sidebar { ... padding: 40px 12px 40px; ... }` (delete; shared applies 80px 12px 40px)
- `.title { font-size: 26px; ... }` (delete; shared applies 28px)
- `.explanation { font-size: 18px; ... }` (delete; shared applies 22px)
- `.insight-box { ... padding: 20px 24px; ... font-size: 15px; ... }` (delete; shared applies 16px 20px + 17px font)

Confirm the tech-card grid (`.cards-grid`, `.tech-card`, etc.) rules remain — they are guide-specific.

- [ ] **Step 3: quiz.html — apply standard migration pattern**

Apply Task 4 steps 2–8. No outlier overrides.

- [ ] **Step 4: Visual spot-check**

Start `python3 -m http.server 8765`. Open:
- `http://localhost:8765/guides/prompt-engineering/techniques.html` ← verify step buttons are now 64×64 (not 56×56), title is 28px, explanation is 22px
- `http://localhost:8765/guides/prompt-engineering/costar-meta.html`
- `http://localhost:8765/guides/prompt-engineering/quiz.html`

Confirm no regressions; `techniques.html` now visually matches Module 1 conventions.

- [ ] **Step 5: Commit**

Run:
```bash
cd /Users/tirumalasettiv/active-projects/GenerativeAI-MasterMind && git add guides/prompt-engineering/ && git commit -m "$(cat <<'EOF'
migrate Module 2 (Prompt Engineering) guides to shared CSS

- 3 files: costar-meta, techniques, quiz
- links assets/guide-shared.css, dedupes inline rules, adds OG/meta tags
- accessibility baseline applied
- techniques.html outlier overrides removed (step-btn 56->64, sidebar
  padding 40->80, title 26->28, explanation 18->22, insight padding)
- badge text INTERACTIVE GUIDE -> INTERACTIVE on costar-meta

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Migrate context-engineering module (3 files)

**Files:**
- Modify: `guides/context-engineering/foundations.html`
- Modify: `guides/context-engineering/mastering-context.html`
- Modify: `guides/context-engineering/quiz.html`

**Meta descriptions:**

| File | Description | OG Title |
|---|---|---|
| `foundations.html` | Learn context engineering foundations — what it is, why it matters, and how it beats one-shot prompts. | Context Engineering Foundations — Interactive Guide |
| `mastering-context.html` | Master context engineering: memory architecture, intelligent retrieval, compression, isolation, and agent design principles. | Mastering Context Engineering — Interactive Guide |
| `quiz.html` | Test your context engineering knowledge with this interactive Module 3 quiz. | Module 3 Quiz — Context Engineering |

**Badge fix:**
- `foundations.html` → `"BEGINNER GUIDE"` to `"BEGINNER"`

**Guide-specific styles to preserve:**
- `foundations.html`: context-window visualization styles, book-node styles, S1-S5 scene diagram SVG animations
- `mastering-context.html`: memory-hierarchy styles, retrieval-flow styles, S1-S5 diagram animations
- `quiz.html`: question/answer/result styles

- [ ] **Step 1: Apply Task 4 steps 2–8 to each of the 3 files**

- [ ] **Step 2: Visual spot-check all 3 files**

Use local server as above.

- [ ] **Step 3: Commit**

Run:
```bash
cd /Users/tirumalasettiv/active-projects/GenerativeAI-MasterMind && git add guides/context-engineering/ && git commit -m "$(cat <<'EOF'
migrate Module 3 (Context Engineering) guides to shared CSS

- 3 files: foundations, mastering-context, quiz
- links assets/guide-shared.css, dedupes inline rules, adds OG/meta tags
- accessibility baseline applied
- badge text BEGINNER GUIDE -> BEGINNER on foundations

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Migrate MCP module (3 files)

**Files:**
- Modify: `guides/mcp/fundamentals.html`
- Modify: `guides/mcp/advanced.html`
- Modify: `guides/mcp/quiz.html`

**Meta descriptions:**

| File | Description | OG Title |
|---|---|---|
| `fundamentals.html` | Introduction to the Model Context Protocol (MCP) — what it is, why it exists, and how it standardizes tool integration. | MCP Fundamentals — Interactive Guide |
| `advanced.html` | Advanced MCP — context bloat, optimization, plugins, Code Mode, and when to use each. | MCP Advanced — Interactive Guide |
| `quiz.html` | Test your MCP knowledge with this interactive Module 4 quiz. | Module 4 Quiz — MCP |

**Badge fix:**
- `fundamentals.html` → `"BEGINNER GUIDE"` to `"BEGINNER"`

**Guide-specific styles to preserve:**
- `fundamentals.html`: S1-S5 scene diagrams (N×M topology, host/client/server, execution flow, install flow, flywheel)
- `advanced.html`: context bloat bar styles, optimization chart styles, plugin bundle styles, 2×2 decision matrix styles
- `quiz.html`: question/answer/result styles

- [ ] **Step 1: Apply Task 4 steps 2–8 to each file**

- [ ] **Step 2: Visual spot-check**

- [ ] **Step 3: Commit**

Run:
```bash
cd /Users/tirumalasettiv/active-projects/GenerativeAI-MasterMind && git add guides/mcp/ && git commit -m "$(cat <<'EOF'
migrate Module 4 (MCP) guides to shared CSS

- 3 files: fundamentals, advanced, quiz
- links assets/guide-shared.css, dedupes inline rules, adds OG/meta tags
- accessibility baseline applied
- badge text BEGINNER GUIDE -> BEGINNER on fundamentals

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Migrate architectures module (7 files)

**Files:**
- Modify: `guides/architectures/overview.html`
- Modify: `guides/architectures/llm-chat.html`
- Modify: `guides/architectures/rag.html`
- Modify: `guides/architectures/workflows.html`
- Modify: `guides/architectures/agents.html`
- Modify: `guides/architectures/agentic-ai.html`
- Modify: `guides/architectures/quiz.html`

**Meta descriptions:**

| File | Description | OG Title |
|---|---|---|
| `overview.html` | Compare the five GenAI architectures — LLM Chat, RAG, Workflows, Agents, Agentic AI — and learn how to pick the right one. | GenAI Architectures Overview — Interactive Guide |
| `llm-chat.html` | The simplest GenAI architecture — a user prompt to an LLM. Underrated, fast to ship, and often enough. | LLM Chat Architecture — Interactive Guide |
| `rag.html` | Retrieval-Augmented Generation — ground the LLM in your documents. Architecture, components, and build flow. | RAG Architecture — Interactive Guide |
| `workflows.html` | Predictable multi-step LLM pipelines — when workflows win over agents, and how to design them. | Workflow Architecture — Interactive Guide |
| `agents.html` | Agents — LLMs that reason, plan, use tools, and loop. ReAct, capabilities, and when to reach for one. | Agent Architecture — Interactive Guide |
| `agentic-ai.html` | Multi-agent systems — teams of specialist agents coordinated by a supervisor. When and why. | Agentic AI — Interactive Guide |
| `quiz.html` | Test your GenAI architectures knowledge with this interactive Module 5 quiz. | Module 5 Quiz — Architectures |

**Badge fixes:** none known (audit did not flag any in this module).

**Guide-specific styles to preserve:**
- `overview.html`: spectrum widget, decision-tab styles, S1/S2 diagrams
- `llm-chat.html`: chat demo styles, S1/S3 diagrams
- `rag.html`: S1-S3 pipeline diagrams (Before/After, Five Components, Under the Hood)
- `workflows.html`: AssemblyLineSVG styles, S4 comparison diagram
- `agents.html`: hub-and-spoke SVG styles, ReAct loop, S2 triangle
- `agentic-ai.html`: agent network SVG, pipeline SVG, S6 decision matrix, disclosure-badge styles
- `quiz.html`: question/answer/result styles

- [ ] **Step 1: Apply Task 4 steps 2–8 to each of the 7 files**

- [ ] **Step 2: Visual spot-check each**

Pay special attention to Module 5 because it had significant recent SVG work — ensure the diagrams still render correctly (the `nodePulse` / `dashMarch` keyframes and the interactive components must be kept in the inline `<style>` blocks).

- [ ] **Step 3: Commit**

Run:
```bash
cd /Users/tirumalasettiv/active-projects/GenerativeAI-MasterMind && git add guides/architectures/ && git commit -m "$(cat <<'EOF'
migrate Module 5 (Architectures) guides to shared CSS

- 7 files: overview, llm-chat, rag, workflows, agents, agentic-ai, quiz
- links assets/guide-shared.css, dedupes inline rules, adds OG/meta tags
- accessibility baseline applied
- SVG scene-specific keyframes (nodePulse, dashMarch) preserved inline

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: Migrate final-exam quiz + index.html

**Files:**
- Modify: `guides/final-exam/quiz.html`
- Modify: `index.html`

**Meta descriptions:**

| File | Description | OG Title |
|---|---|---|
| `guides/final-exam/quiz.html` | The final exam — 50 questions spanning all five modules of GenerativeAI MasterMind. | Final Exam — GenerativeAI MasterMind |
| `index.html` | Interactive learning platform for Generative AI. Five modules — fundamentals, prompt engineering, context engineering, MCP, and architectures. | GenerativeAI MasterMind — Interactive Learning |

**`guides/final-exam/quiz.html` note:** This file currently uses a gradient badge background instead of flat `#e8e3f8`. After linking shared CSS, delete the local `.badge` rule so the shared flat style applies. If the gradient was intentional for the final-exam badge, keep it as a `.badge-exam` modifier class instead.

**`index.html` notes:**
- Relative path to shared CSS is `assets/guide-shared.css` (not `../../`).
- The `index.html` meta tags go BEFORE the React CDN scripts.
- This file has significant inline CSS and React MODULES array — do not touch the React data; only modify `<head>`, `<style>`, and specific JSX flex container (line ~251-271) to add `minWidth: 0` and `word-break` (see Phase 2 for more).

- [ ] **Step 1: Migrate `guides/final-exam/quiz.html`**

Apply Task 4 steps 2–8. Additionally delete the gradient `.badge` override.

- [ ] **Step 2: Migrate `index.html`**

- Add full meta tag set (paths: `assets/og-default.svg`, `favicon.svg`).
- Add `<link rel="stylesheet" href="assets/guide-shared.css">` after Google Fonts.
- In the inline `<style>`, dedupe shared rules (per Pattern B).
- Add a skip link as first child of root component return.
- If any step-btn pattern exists on index, apply Pattern C; otherwise just verify `main` landmark exists.
- Leave the flex container at line ~251-271 UNTOUCHED — Phase 2 fixes the `minWidth: 0` overflow issue there.

- [ ] **Step 3: Visual spot-check**

Open `http://localhost:8765/index.html` and `http://localhost:8765/guides/final-exam/quiz.html`. Confirm module grid renders correctly and final-exam quiz renders.

- [ ] **Step 4: Commit**

Run:
```bash
cd /Users/tirumalasettiv/active-projects/GenerativeAI-MasterMind && git add index.html guides/final-exam/quiz.html && git commit -m "$(cat <<'EOF'
migrate index.html and final-exam/quiz.html to shared CSS

- both link assets/guide-shared.css, inline rules deduped
- OG/meta tags added on both
- final-exam gradient badge override removed; flat canonical style applies
- index meta tags + skip link; flex overflow fix deferred to Phase 2

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Read the current CLAUDE.md**

Read `/Users/tirumalasettiv/active-projects/GenerativeAI-MasterMind/CLAUDE.md` fully.

- [ ] **Step 2: Update the Architecture section**

Find the subsection under "### Guide Pages" that says:
```
**Two-panel layout pattern**: 120px left sidebar with circular step buttons (64×64px) + scrollable main content area. Top bar has back-link, guide number, title, badge, and prev/next arrows.
```

Immediately after it, insert:
```markdown

### Shared Styles
All design tokens, layout shell (`.container`/`.sidebar`/`.main-content`), and shared components (`.step-btn`, `.top-bar`, `.badge`, `.scene-card`, `.insight-box`, etc.) live in `assets/guide-shared.css`. Every guide links it:
```html
<link rel="stylesheet" href="../../assets/guide-shared.css">
```
Guides keep only guide-specific component styles in their inline `<style>` block. Token values are defined as CSS custom properties on `:root` — see the file for the full list. Guides are still functionally self-contained (inline JSX, no bundler), but consume shared styling.
```

- [ ] **Step 3: Update the "Adding a New Guide" section**

Find:
```
1. Create `guides/{module}/{topic}.html` following the two-panel layout pattern of existing guides
```

Replace with:
```
1. Create `guides/{module}/{topic}.html` following the two-panel layout pattern of existing guides. Link `../../assets/guide-shared.css` in `<head>` right after the Google Fonts `<link>`. Add only guide-specific styles in the inline `<style>` block — shared layout/components are inherited from the shared CSS.
```

- [ ] **Step 4: Update "Design tokens" in Key Conventions**

Find:
```
- **Design tokens**: Primary purple `#6c5ce7`, success green `#2ecc71`, dark bg `#1a1a2e`, border `#e8e8f0`, border-radius 12–20px, transition `0.3s cubic-bezier(0.22, 0.68, 0, 1.2)`
```

Replace with:
```
- **Design tokens**: Defined as CSS custom properties on `:root` in `assets/guide-shared.css`. Primary purple `#6c5ce7` (`--color-primary`), success green `#2ecc71` (`--color-success`), border `#e0e0e0` (`--color-border`), radius scale 8/12/16/20px (`--radius-sm/md/lg/xl`), bouncy transition `0.3s cubic-bezier(0.22, 0.68, 0, 1.2)` (`--transition-bouncy`).
```

- [ ] **Step 5: Commit**

Run:
```bash
cd /Users/tirumalasettiv/active-projects/GenerativeAI-MasterMind && git add CLAUDE.md && git commit -m "$(cat <<'EOF'
update CLAUDE.md to document shared CSS architecture

- adds 'Shared Styles' subsection under Architecture
- updates 'Adding a New Guide' steps to require the shared CSS link
- points Design tokens bullet at :root custom properties in shared CSS

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 13: Full Phase 1 verification

**Files:** none (verification only; may fix regressions inline if found).

- [ ] **Step 1: Grep post-condition — no duplicated shared rules**

Run:
```bash
cd /Users/tirumalasettiv/active-projects/GenerativeAI-MasterMind && grep -rn "\.step-btn\s*{" guides/ index.html 2>&1 | head -20
```
Expected: zero matches. If any match, that file still has a local `.step-btn` rule that should be deleted (unless intentionally overriding — review case-by-case).

Same for `.badge {`, `.insight-box {`, `.scene-card {`, `.top-bar {`, `.back-link {` — repeat grep for each.

- [ ] **Step 2: Grep post-condition — shared CSS link present in every guide**

Run:
```bash
grep -rL "assets/guide-shared.css" guides/ index.html 2>&1
```
Expected: zero output (every HTML file links the shared CSS).

- [ ] **Step 3: Grep post-condition — OG meta tags present in every guide**

Run:
```bash
grep -rL "og:title" guides/ index.html 2>&1
```
Expected: zero output.

- [ ] **Step 4: Grep post-condition — badge text normalized**

Run:
```bash
grep -rn "INTERACTIVE GUIDE\|BEGINNER GUIDE" guides/ index.html 2>&1
```
Expected: zero matches.

- [ ] **Step 5: Visual diff across all modules**

Start local server:
```bash
python3 -m http.server 8765 &
```

Open and click through every guide in the browser. For each, confirm:
- Page renders (no CSS-missing white-flash)
- Step buttons are 64×64 circles with purple active state
- Top bar has gradient bottom border
- Badge reads correct text
- All stage/content/scene-card/insight-box styling matches Module 1 visual language

Keep a mental checklist. If any guide has issues, note file + problem and fix inline.

- [ ] **Step 6: Accessibility scan — 3 sample guides**

Run `axe DevTools` extension against:
- `http://localhost:8765/guides/fundamentals/what-is-genai.html`
- `http://localhost:8765/guides/prompt-engineering/techniques.html` (was the worst outlier — verify clean now)
- `http://localhost:8765/guides/architectures/agentic-ai.html` (most interactive SVG)

Target: 0 critical/serious violations for each.

- [ ] **Step 7: Keyboard walkthrough**

On `what-is-genai.html`, Tab through the entire page. Verify:
- First Tab reveals the skip link (focus visible, offset from edge)
- Enter on skip link jumps focus to `#main`
- All step buttons reachable, visible focus ring
- Enter/Space on a step button activates it
- Prev/Next arrow buttons reachable with visible focus
- No keyboard trap; Shift+Tab reverses cleanly

- [ ] **Step 8: Reduced-motion verification**

Enable "Reduce motion" in system preferences. Reload any guide with fade-in animations (e.g., `what-is-genai.html`). Confirm fade-ins happen instantly (no animation). Disable reduce motion when done.

- [ ] **Step 9: Lighthouse — 3 sample guides**

Run Lighthouse (Chrome DevTools → Lighthouse → Mobile → All categories) against the same three guides as Step 6. Target scores: Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95. Performance may lag due to CDN scripts; focus on the first three.

- [ ] **Step 10: Stop local server**

```bash
lsof -ti:8765 | xargs kill -9 2>/dev/null || true
```

- [ ] **Step 11: Final grep — ensure shared CSS file not accidentally changed**

Run:
```bash
cd /Users/tirumalasettiv/active-projects/GenerativeAI-MasterMind && git diff --stat HEAD~11..HEAD -- assets/guide-shared.css
```
Expected: file was only created (not modified again). If it was modified during migration, review why — may indicate missing shared rule.

- [ ] **Step 12: Final summary commit (docs only, if needed)**

If any last-minute fixes were needed during verification:
```bash
git add -A
git commit -m "$(cat <<'EOF'
phase 1 verification fixes

Minor regressions caught in end-to-end verification pass.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

If no fixes needed, skip this step.

- [ ] **Step 13: Phase 1 complete — summary**

Run:
```bash
git log --oneline HEAD~12..HEAD
```
Expected: ~11 clean commits (task 1 pre-work + tasks 2–12). Phase 1 is complete.

Next step: brainstorm Phase 2 (text overflow + navigation polish) via the `superpowers:brainstorming` skill.

---

## Self-Review Checklist

After writing this plan, I reviewed it against the spec and checked for issues.

**Spec coverage:**
- §1.1 file structure → Tasks 2, 3, 4–11 (new files + modifications) ✓
- §1.2 canonical source → Reference Patterns section + Task 2 contents ✓
- §1.3 CSS file structure + tokens → Task 2 full content ✓
- §1.4 per-guide migration pattern → Pattern A + B + Tasks 4–11 ✓
- §1.5 meta additions → Pattern A + per-file descriptions in Tasks 4, 6–11 ✓
- §1.6 accessibility baseline → Pattern C + Task 4 steps 4–7, applied throughout ✓
- §1.7 badge normalization → Pattern E + explicit fixes in Tasks 4, 6, 7, 8, 9 ✓
- §1.8 techniques.html outlier → Task 7 Step 2 with exact rules listed ✓
- §1.9 CLAUDE.md updates → Task 12 ✓
- §1.10 files touched count → File Structure section reflects 28 files ✓
- §1.11 verification plan → Task 13 ✓

**Placeholder scan:** No TBDs, TODOs, "fill in", "similar to", or hand-waved "error handling" placeholders. Every step has the exact content, exact path, or exact command needed.

**Type/name consistency:** All class names match between the shared CSS (Task 2), the dedupe list (Pattern B), and the migration references (Tasks 4–11). `aria-label` templates for step buttons and arrow buttons are consistent across Pattern C and Task 4 Step 5. File paths and relative paths verified (`../../assets/guide-shared.css` for nested guides, `assets/guide-shared.css` for index.html).

**Known limitations:**
- This is a static HTML project with no test framework; "testing" is browser visual verification + axe + Lighthouse + grep. No unit tests exist; writing TDD-style tests for CSS would require adding Jest/Playwright and is out of scope for Phase 1.
- Task 4 Steps 4–7 (a11y JSX edits) will vary slightly per file because each guide's JSX structure is different. The executing engineer must apply the patterns thoughtfully, not mechanically.
- Some guides (e.g. `how-genai-works.html`) use `.stage-title` rather than `.stage-header`; verify which is the right replacement during migration, or keep the class but ensure it uses shared tokens via a small local rule.
