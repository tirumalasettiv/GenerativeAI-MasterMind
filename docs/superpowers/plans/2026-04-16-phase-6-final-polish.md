# Phase 6 — Final Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the platform production-ready: add mobile responsive breakpoints, expand the Final Exam to 70 questions covering all 7 modules, create per-module OG images, standardize CDN sources, add SEO infrastructure, and sweep all stale references.

**Architecture:** All responsive CSS goes into `assets/guide-shared.css` (no per-guide layout edits). CDN swap and OG image updates are mechanical edits across all 36 guide HTML files. Final Exam expansion adds 20 new question objects and MODULE_META/MODULE_ICONS entries. SEO files (robots.txt, sitemap.xml) are created at the repo root with placeholder base URLs.

**Tech Stack:** React 18.2.0 + ReactDOM (CDN: cdnjs.cloudflare.com), Babel Standalone 7.23.9, Google Fonts (DM Sans + Fraunces), `assets/guide-shared.css` for shared tokens/layout.

**Spec:** `docs/superpowers/specs/2026-04-16-phase-6-final-polish-design.md`

---

## Task 0: Setup worktree

- [ ] Verify `.worktrees` is gitignored
- [ ] `git worktree add .worktrees/phase-6-polish -b phase-6-polish`
- [ ] Verify clean baseline

---

## Task 1: Add responsive breakpoints to `guide-shared.css`

**Files:**
- Modify: `assets/guide-shared.css` (append after line 602, before the closing of the file)

The implementer MUST read `assets/guide-shared.css` first to understand the current structure. All new CSS is appended at the end of the file.

**Breakpoint strategy:**
- `@media (max-width: 1024px)` — Tablet: sidebar 72px, step buttons 48px, labels hidden, reduced padding
- `@media (max-width: 768px)` — Phone: sidebar becomes horizontal step bar, container column layout
- `@media (max-width: 480px)` — Small phone: further size reductions

- [ ] **Step 1:** Read `assets/guide-shared.css` to understand current structure (602 lines)

- [ ] **Step 2:** Append the following responsive CSS at the end of the file:

```css
/* ==========================================================================
   Responsive breakpoints
   ========================================================================== */

/* ---------- Tablet (768px – 1024px) ---------- */
@media (max-width: 1024px) {
  :root {
    --sidebar-width: 72px;
    --step-btn-size: 48px;
    --fs-step-emoji: 20px;
    --content-pad-x: 24px;
    --content-pad-y: 20px;
    --fs-stage: 22px;
    --fs-body: 20px;
    --fs-title: 26px;
  }

  .sidebar {
    padding: 60px 6px 24px;
  }

  .step-btn-label {
    display: none;
  }

  .step-connector {
    height: 10px;
  }

  .top-bar {
    padding: 16px 20px;
  }

  .left-section {
    gap: 12px;
  }

  .scene-card {
    padding: 20px;
  }

  .up-next-card {
    margin-top: 32px;
    padding: 20px;
  }
}

/* ---------- Phone (< 768px) ---------- */
@media (max-width: 768px) {
  :root {
    --step-btn-size: 40px;
    --fs-step-emoji: 18px;
    --content-pad-x: 16px;
    --content-pad-y: 16px;
    --fs-title: 22px;
    --fs-stage: 20px;
    --fs-body: 18px;
    --fs-insight: 15px;
    --arrow-btn-size: 36px;
  }

  body {
    height: auto;
  }

  #root {
    height: auto;
    overflow: visible;
  }

  .container {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
    overflow: visible;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 10px 12px;
    border-right: none;
    border-bottom: 1px solid var(--color-border);
    overflow-x: auto;
    overflow-y: hidden;
    gap: 0;
  }

  .step-wrapper {
    flex-direction: row;
    align-items: center;
  }

  .step-btn-label {
    display: none;
  }

  .step-connector {
    width: 16px;
    height: 2px;
    margin: 0 2px;
  }

  .main-content {
    height: auto;
    overflow: visible;
    min-height: 0;
  }

  .content-area {
    overflow-y: visible;
    min-height: 60vh;
  }

  .top-bar {
    padding: 12px 16px;
    flex-wrap: wrap;
    gap: 8px;
  }

  .badge {
    display: none;
  }

  .left-section {
    gap: 8px;
  }

  .nav-arrows {
    gap: 8px;
  }

  .progress-indicator {
    display: none;
  }

  .scene-card {
    padding: 16px;
  }

  .insight-box {
    padding: 12px 16px;
  }

  .up-next-card {
    margin-top: 24px;
    padding: 16px;
  }

  .up-next-link {
    gap: 12px;
    padding: 10px 12px;
  }

  .up-next-title {
    font-size: 17px;
  }

  .module-complete-cta {
    padding: 24px 16px;
  }

  .celebrate {
    font-size: 22px;
    gap: 8px;
  }

  .quiz-actions {
    gap: 8px;
  }

  .action-btn {
    padding: 8px 16px;
    font-size: 14px;
  }
}

/* ---------- Small phone (< 480px) ---------- */
@media (max-width: 480px) {
  :root {
    --step-btn-size: 36px;
    --fs-step-emoji: 16px;
    --content-pad-x: 12px;
    --content-pad-y: 12px;
    --fs-title: 20px;
    --fs-stage: 18px;
    --fs-body: 16px;
    --fs-insight: 14px;
  }

  .guide-number {
    display: none;
  }

  .top-bar {
    padding: 10px 12px;
  }

  .stage-header {
    margin-bottom: 4px;
  }

  .up-next-link {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }

  .up-next-meta {
    align-items: center;
  }

  .up-next-arrow {
    display: none;
  }
}
```

- [ ] **Step 3:** Verify the CSS is valid by opening `guides/fundamentals/what-is-genai.html` in a browser and resizing to 768px, 480px, and 375px. Confirm:
  - At 768px: sidebar is horizontal, step buttons in a row, content full-width
  - At 480px: guide number hidden, smaller text
  - No horizontal scrollbar at any width

- [ ] **Step 4:** Commit

```bash
git add assets/guide-shared.css
git commit -m "add responsive breakpoints to guide-shared.css for tablet, phone, and small phone"
```

---

## Task 2: Add responsive CSS to `index.html`

**Files:**
- Modify: `index.html`

The landing page uses inline styles in JSX (not CSS classes from guide-shared.css) for its module card grid, hero section, and footer. These need responsive media queries added to the `<style>` block.

- [ ] **Step 1:** Read `index.html` in full to understand the inline style patterns

- [ ] **Step 2:** The landing page currently has no `<style>` block. Add one inside `<head>`, after the `guide-shared.css` link and before the React script tags. Insert:

```html
<style>
  @media (max-width: 768px) {
    .module-guides-list { font-size: 14px !important; }
  }
  @media (max-width: 480px) {
    .module-guides-list { font-size: 13px !important; }
  }
</style>
```

Note: The landing page uses inline styles via JSX `style={}` props. CSS media queries can't override inline styles without `!important` or restructuring to CSS classes. Since the landing page is a single file and not worth refactoring, we add targeted responsive overrides for elements that have className references. For elements using only inline styles, we need to add responsive behavior via JavaScript.

- [ ] **Step 3:** In the JSX, find the hero/header section and the footer stats line. Add responsive inline styles where feasible. Specifically, find the footer line that currently reads:

```jsx
5 Modules &middot; 24 Guides &middot; 50-Question Final Exam
```

Change it to:

```jsx
7 Modules &middot; 40 Guides &middot; 70-Question Final Exam
```

- [ ] **Step 4:** In the JSX, find any `minWidth: 320` or similar fixed-width constraints on module cards and ensure they have `minWidth: 0` or are wrapped in responsive-friendly flex containers.

- [ ] **Step 5:** Verify by opening `index.html` in a browser at 375px width. Confirm:
  - Module cards stack vertically
  - No horizontal overflow
  - Footer text wraps cleanly
  - Hero section is readable

- [ ] **Step 6:** Commit

```bash
git add index.html
git commit -m "add responsive overrides and fix stale footer stats in index.html"
```

---

## Task 3: Add responsive CSS to quiz pages

**Files:**
- Modify: `guides/fundamentals/quiz.html` (Module 1 quiz — the pattern reference)
- Modify: `guides/prompt-engineering/quiz.html`
- Modify: `guides/context-engineering/quiz.html`
- Modify: `guides/mcp/quiz.html`
- Modify: `guides/architectures/quiz.html`
- Modify: `guides/role-labs/quiz.html`
- Modify: `guides/build-labs/quiz.html`
- Modify: `guides/final-exam/quiz.html`

Quiz pages have guide-specific inline `<style>` blocks with `.option-card`, `.option-letter`, `.submit-btn`, `.section-tag`, `.score-ring`, and `.result-card` classes. These need responsive overrides.

- [ ] **Step 1:** Read `guides/fundamentals/quiz.html` to understand the quiz-specific CSS classes (the first ~50 lines of `<style>`)

- [ ] **Step 2:** In each of the 8 quiz files listed above, append the following responsive rules at the end of the existing `<style>` block (before the closing `</style>` tag):

```css
@media (max-width: 768px) {
  .option-card { padding: 14px 16px; font-size: 15px; gap: 12px; }
  .option-letter { width: 32px; height: 32px; font-size: 13px; }
  .submit-btn { padding: 12px 32px; font-size: 15px; }
  .score-ring { width: 140px; height: 140px; }
  .score-ring svg { width: 140px; height: 140px; }
  .score-number { font-size: 36px; }
  .result-card { padding: 14px 16px; gap: 12px; }
}
@media (max-width: 480px) {
  .option-card { padding: 12px 14px; font-size: 14px; gap: 10px; }
  .option-letter { width: 28px; height: 28px; font-size: 12px; }
  .submit-btn { padding: 10px 24px; font-size: 14px; }
  .section-tag { font-size: 10px; padding: 3px 10px; }
  .score-ring { width: 120px; height: 120px; }
  .score-ring svg { width: 120px; height: 120px; }
  .score-number { font-size: 30px; }
  .result-card { padding: 12px; gap: 10px; flex-wrap: wrap; }
}
```

- [ ] **Step 3:** For the final exam quiz (`guides/final-exam/quiz.html`), the results view has a `minWidth: 320` on the module scores column. Find this line:

```jsx
<div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 320 }}>
```

Change `minWidth: 320` to `minWidth: 0, width: '100%', maxWidth: 400`:

```jsx
<div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0, width: '100%', maxWidth: 400 }}>
```

- [ ] **Step 4:** Verify by opening `guides/fundamentals/quiz.html` at 375px width. Confirm option cards are readable and the submit button fits.

- [ ] **Step 5:** Commit

```bash
git add guides/fundamentals/quiz.html guides/prompt-engineering/quiz.html guides/context-engineering/quiz.html guides/mcp/quiz.html guides/architectures/quiz.html guides/role-labs/quiz.html guides/build-labs/quiz.html guides/final-exam/quiz.html
git commit -m "add responsive CSS to all 8 quiz pages for phone and small-phone breakpoints"
```

---

## Task 4: Create per-module OG image SVGs

**Files:**
- Create: `assets/og-landing.svg`
- Create: `assets/og-module-1.svg`
- Create: `assets/og-module-2.svg`
- Create: `assets/og-module-3.svg`
- Create: `assets/og-module-4.svg`
- Create: `assets/og-module-5.svg`
- Create: `assets/og-module-6.svg`
- Create: `assets/og-module-7.svg`
- Create: `assets/og-exam.svg`

Each SVG is 1200x630px. Design: dark purple gradient background, module emoji (centered, large), module name text, "GenerativeAI MasterMind" subtitle, accent color strip at bottom.

- [ ] **Step 1:** Create `assets/og-landing.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" role="img" aria-label="GenerativeAI MasterMind — Interactive Learning">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a1a2e"/>
      <stop offset="50%" stop-color="#2d1b69"/>
      <stop offset="100%" stop-color="#6c5ce7"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="600" y="240" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="120">🧠</text>
  <text x="600" y="360" text-anchor="middle" font-family="'DM Sans', sans-serif" font-weight="700" font-size="48" fill="#ffffff">GenerativeAI MasterMind</text>
  <text x="600" y="410" text-anchor="middle" font-family="'DM Sans', sans-serif" font-weight="500" font-size="24" fill="rgba(255,255,255,0.6)">7 Modules · 40 Guides · Interactive Learning</text>
  <rect y="622" width="1200" height="8" fill="#6c5ce7"/>
</svg>
```

- [ ] **Step 2:** Create `assets/og-module-1.svg` (Fundamentals, emoji 🧠, accent #2ecc71):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" role="img" aria-label="Module 1: Fundamentals — GenerativeAI MasterMind">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a1a2e"/>
      <stop offset="50%" stop-color="#2d1b69"/>
      <stop offset="100%" stop-color="#6c5ce7"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="600" y="220" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="120">🧠</text>
  <text x="600" y="340" text-anchor="middle" font-family="'DM Sans', sans-serif" font-weight="700" font-size="48" fill="#ffffff">Module 1: Fundamentals</text>
  <text x="600" y="400" text-anchor="middle" font-family="'DM Sans', sans-serif" font-weight="500" font-size="24" fill="rgba(255,255,255,0.6)">GenerativeAI MasterMind</text>
  <rect y="622" width="1200" height="8" fill="#2ecc71"/>
</svg>
```

- [ ] **Step 3:** Create `assets/og-module-2.svg` (Prompt Engineering, emoji ✍️, accent #f39c12):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" role="img" aria-label="Module 2: Prompt Engineering — GenerativeAI MasterMind">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a1a2e"/>
      <stop offset="50%" stop-color="#2d1b69"/>
      <stop offset="100%" stop-color="#6c5ce7"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="600" y="220" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="120">✍️</text>
  <text x="600" y="340" text-anchor="middle" font-family="'DM Sans', sans-serif" font-weight="700" font-size="48" fill="#ffffff">Module 2: Prompt Engineering</text>
  <text x="600" y="400" text-anchor="middle" font-family="'DM Sans', sans-serif" font-weight="500" font-size="24" fill="rgba(255,255,255,0.6)">GenerativeAI MasterMind</text>
  <rect y="622" width="1200" height="8" fill="#f39c12"/>
</svg>
```

- [ ] **Step 4:** Create `assets/og-module-3.svg` (Context Engineering, emoji 🧩, accent #3498db):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" role="img" aria-label="Module 3: Context Engineering — GenerativeAI MasterMind">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a1a2e"/>
      <stop offset="50%" stop-color="#2d1b69"/>
      <stop offset="100%" stop-color="#6c5ce7"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="600" y="220" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="120">🧩</text>
  <text x="600" y="340" text-anchor="middle" font-family="'DM Sans', sans-serif" font-weight="700" font-size="48" fill="#ffffff">Module 3: Context Engineering</text>
  <text x="600" y="400" text-anchor="middle" font-family="'DM Sans', sans-serif" font-weight="500" font-size="24" fill="rgba(255,255,255,0.6)">GenerativeAI MasterMind</text>
  <rect y="622" width="1200" height="8" fill="#3498db"/>
</svg>
```

- [ ] **Step 5:** Create `assets/og-module-4.svg` (MCP, emoji 🔌, accent #e74c3c):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" role="img" aria-label="Module 4: MCP — GenerativeAI MasterMind">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a1a2e"/>
      <stop offset="50%" stop-color="#2d1b69"/>
      <stop offset="100%" stop-color="#6c5ce7"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="600" y="220" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="120">🔌</text>
  <text x="600" y="340" text-anchor="middle" font-family="'DM Sans', sans-serif" font-weight="700" font-size="48" fill="#ffffff">Module 4: MCP</text>
  <text x="600" y="400" text-anchor="middle" font-family="'DM Sans', sans-serif" font-weight="500" font-size="24" fill="rgba(255,255,255,0.6)">GenerativeAI MasterMind</text>
  <rect y="622" width="1200" height="8" fill="#e74c3c"/>
</svg>
```

- [ ] **Step 6:** Create `assets/og-module-5.svg` (Architectures, emoji 🏗️, accent #9b59b6):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" role="img" aria-label="Module 5: Architectures — GenerativeAI MasterMind">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a1a2e"/>
      <stop offset="50%" stop-color="#2d1b69"/>
      <stop offset="100%" stop-color="#6c5ce7"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="600" y="220" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="120">🏗️</text>
  <text x="600" y="340" text-anchor="middle" font-family="'DM Sans', sans-serif" font-weight="700" font-size="48" fill="#ffffff">Module 5: Architectures</text>
  <text x="600" y="400" text-anchor="middle" font-family="'DM Sans', sans-serif" font-weight="500" font-size="24" fill="rgba(255,255,255,0.6)">GenerativeAI MasterMind</text>
  <rect y="622" width="1200" height="8" fill="#9b59b6"/>
</svg>
```

- [ ] **Step 7:** Create `assets/og-module-6.svg` (Role Labs, emoji 📋, accent #1abc9c):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" role="img" aria-label="Module 6: Role Labs — GenerativeAI MasterMind">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a1a2e"/>
      <stop offset="50%" stop-color="#2d1b69"/>
      <stop offset="100%" stop-color="#6c5ce7"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="600" y="220" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="120">📋</text>
  <text x="600" y="340" text-anchor="middle" font-family="'DM Sans', sans-serif" font-weight="700" font-size="48" fill="#ffffff">Module 6: Role Labs</text>
  <text x="600" y="400" text-anchor="middle" font-family="'DM Sans', sans-serif" font-weight="500" font-size="24" fill="rgba(255,255,255,0.6)">GenerativeAI MasterMind</text>
  <rect y="622" width="1200" height="8" fill="#1abc9c"/>
</svg>
```

- [ ] **Step 8:** Create `assets/og-module-7.svg` (Build Labs & Capstone, emoji 🔨, accent #e67e22):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" role="img" aria-label="Module 7: Build Labs &amp; Capstone — GenerativeAI MasterMind">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a1a2e"/>
      <stop offset="50%" stop-color="#2d1b69"/>
      <stop offset="100%" stop-color="#6c5ce7"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="600" y="220" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="120">🔨</text>
  <text x="600" y="340" text-anchor="middle" font-family="'DM Sans', sans-serif" font-weight="700" font-size="48" fill="#ffffff">Module 7: Build Labs</text>
  <text x="600" y="400" text-anchor="middle" font-family="'DM Sans', sans-serif" font-weight="500" font-size="24" fill="rgba(255,255,255,0.6)">GenerativeAI MasterMind</text>
  <rect y="622" width="1200" height="8" fill="#e67e22"/>
</svg>
```

- [ ] **Step 9:** Create `assets/og-exam.svg` (Final Exam, emoji 🎓, accent #e74c3c):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" role="img" aria-label="Final Exam — GenerativeAI MasterMind">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a1a2e"/>
      <stop offset="50%" stop-color="#2d1b69"/>
      <stop offset="100%" stop-color="#6c5ce7"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="600" y="220" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="120">🎓</text>
  <text x="600" y="340" text-anchor="middle" font-family="'DM Sans', sans-serif" font-weight="700" font-size="48" fill="#ffffff">Final Exam</text>
  <text x="600" y="400" text-anchor="middle" font-family="'DM Sans', sans-serif" font-weight="500" font-size="24" fill="rgba(255,255,255,0.6)">GenerativeAI MasterMind</text>
  <rect y="622" width="1200" height="8" fill="#e74c3c"/>
</svg>
```

- [ ] **Step 10:** Verify all 9 SVGs render correctly by opening each in a browser

- [ ] **Step 11:** Commit

```bash
git add assets/og-landing.svg assets/og-module-1.svg assets/og-module-2.svg assets/og-module-3.svg assets/og-module-4.svg assets/og-module-5.svg assets/og-module-6.svg assets/og-module-7.svg assets/og-exam.svg
git commit -m "create per-module OG image SVGs with branded color bars"
```

---

## Task 5: CDN standardization + OG image update across all 36 guides

**Files:**
- Modify: All 36 guide HTML files listed below

This is a mechanical find-and-replace task across all guide files. Each file needs:
1. CDN URLs changed from unpkg to cdnjs
2. `crossorigin` attribute removed from React/ReactDOM script tags
3. `og:image` meta tag updated from `og-default.svg` to the module-specific OG SVG

The implementer should use `sed` or similar for bulk replacements.

### CDN replacements (apply to all 36 files):

| Find | Replace |
|---|---|
| `<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>` | `<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"></script>` |
| `<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>` | `<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"></script>` |
| `<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>` | `<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.9/babel.min.js"></script>` |

### OG image replacements by module:

**Module 1 guides** (10 files) — change `og-default.svg` to `og-module-1.svg`:
- `guides/fundamentals/what-is-genai.html`
- `guides/fundamentals/regular-vs-genai.html`
- `guides/fundamentals/how-genai-works.html`
- `guides/fundamentals/ai-model-types.html`
- `guides/fundamentals/limitations.html`
- `guides/fundamentals/verify-framework.html`
- `guides/fundamentals/embeddings.html`
- `guides/fundamentals/safety-alignment.html`
- `guides/fundamentals/evaluation.html`
- `guides/fundamentals/quiz.html`

**Module 2 guides** (3 files) — change to `og-module-2.svg`:
- `guides/prompt-engineering/costar-meta.html`
- `guides/prompt-engineering/techniques.html`
- `guides/prompt-engineering/quiz.html`

**Module 3 guides** (3 files) — change to `og-module-3.svg`:
- `guides/context-engineering/foundations.html`
- `guides/context-engineering/mastering-context.html`
- `guides/context-engineering/quiz.html`

**Module 4 guides** (3 files) — change to `og-module-4.svg`:
- `guides/mcp/fundamentals.html`
- `guides/mcp/advanced.html`
- `guides/mcp/quiz.html`

**Module 5 guides** (7 files) — change to `og-module-5.svg`:
- `guides/architectures/overview.html`
- `guides/architectures/llm-chat.html`
- `guides/architectures/rag.html`
- `guides/architectures/workflows.html`
- `guides/architectures/agents.html`
- `guides/architectures/agentic-ai.html`
- `guides/architectures/quiz.html`

**Module 6 guides** (3 files) — change to `og-module-6.svg`:
- `guides/role-labs/pm-lab.html`
- `guides/role-labs/citizen-coder-lab.html`
- `guides/role-labs/quiz.html`

**Module 7 guides** (6 files) — change to `og-module-7.svg`:
- `guides/build-labs/rag-build.html`
- `guides/build-labs/workflow-build.html`
- `guides/build-labs/agent-build.html`
- `guides/build-labs/multi-agent-build.html`
- `guides/build-labs/capstone.html`
- `guides/build-labs/quiz.html`

**Final Exam** (1 file) — change to `og-exam.svg`:
- `guides/final-exam/quiz.html`

Also update `index.html`:
- Change `<meta property="og:image" content="assets/og-default.svg">` to `<meta property="og:image" content="assets/og-landing.svg">`

- [ ] **Step 1:** Run CDN replacement across all guide files using sed:

```bash
# From the worktree root
find guides -name "*.html" -exec sed -i '' \
  -e 's|<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>|<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"></script>|g' \
  -e 's|<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>|<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"></script>|g' \
  -e 's|<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>|<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.9/babel.min.js"></script>|g' \
  {} +
```

- [ ] **Step 2:** Verify zero unpkg references remain:

```bash
grep -r "unpkg.com" guides/
# Expected: no output
```

- [ ] **Step 3:** Run OG image replacements per module:

```bash
# Module 1
for f in guides/fundamentals/*.html; do
  sed -i '' 's|og-default.svg|og-module-1.svg|g' "$f"
done

# Module 2
for f in guides/prompt-engineering/*.html; do
  sed -i '' 's|og-default.svg|og-module-2.svg|g' "$f"
done

# Module 3
for f in guides/context-engineering/*.html; do
  sed -i '' 's|og-default.svg|og-module-3.svg|g' "$f"
done

# Module 4
for f in guides/mcp/*.html; do
  sed -i '' 's|og-default.svg|og-module-4.svg|g' "$f"
done

# Module 5
for f in guides/architectures/*.html; do
  sed -i '' 's|og-default.svg|og-module-5.svg|g' "$f"
done

# Module 6
for f in guides/role-labs/*.html; do
  sed -i '' 's|og-default.svg|og-module-6.svg|g' "$f"
done

# Module 7
for f in guides/build-labs/*.html; do
  sed -i '' 's|og-default.svg|og-module-7.svg|g' "$f"
done

# Final Exam
sed -i '' 's|og-default.svg|og-exam.svg|g' guides/final-exam/quiz.html

# Landing page
sed -i '' 's|og-default.svg|og-landing.svg|g' index.html
```

- [ ] **Step 4:** Verify OG image references are correct:

```bash
grep -r "og-default.svg" guides/ index.html
# Expected: no output (all replaced)

grep -c "og-module-1.svg" guides/fundamentals/*.html
# Expected: 10 (one per file)
```

- [ ] **Step 5:** Spot-check one file from each module to verify CDN and OG image are correct

- [ ] **Step 6:** Commit

```bash
git add guides/ index.html
git commit -m "standardize CDN to cdnjs.cloudflare.com and update OG images per module"
```

---

## Task 6: Expand Final Exam to 70 questions

**Files:**
- Modify: `guides/final-exam/quiz.html`

The implementer MUST read the full file first. Key structures to understand:
- `MODULE_META` object (line ~56): maps module number → {name, color, bg, emoji}
- `QUESTIONS` array (line ~64): 50 question objects with `{id, module, section, question, options, correct, explanation}`
- `MODULE_ICONS` object (line ~722): maps module number → SVG string
- Results view (line ~825): uses `MODULE_META` and `MODULE_ICONS` to render per-module scores

### Changes needed:

1. Add Module 6 and 7 to `MODULE_META`
2. Add 20 new questions to `QUESTIONS` array (ids 51-70)
3. Add Module 6 and 7 to `MODULE_ICONS`
4. Fix stale text references

- [ ] **Step 1:** Read `guides/final-exam/quiz.html` in full

- [ ] **Step 2:** Add entries to `MODULE_META` after the Module 5 entry (after `5: { ... },`):

```js
      6: { name: "Role Labs", color: "#1abc9c", bg: "#e8f8f5", emoji: "\uD83D\uDCCB" },
      7: { name: "Build Labs", color: "#e67e22", bg: "#fef5e7", emoji: "\uD83D\uDD28" },
```

- [ ] **Step 3:** Add 20 new questions at the end of the `QUESTIONS` array (before the closing `];`). Insert after the question with `id: 50`:

```js
      // Module 6: Role Labs
      {
        id: 51, module: 6,
        section: "Module 6 \u2014 Role Labs",
        question: "When using the COSTAR framework to generate user stories, what does the 'S' (Style) parameter control?",
        options: [
          "The programming language of the output",
          "The format and tone of the AI's response",
          "The size of the generated document",
          "The speed of the AI's processing"
        ],
        correct: 1,
        explanation: "In the COSTAR framework, Style controls the format and tone of the AI's output \u2014 for example, specifying 'Agile user story format with acceptance criteria' ensures the response matches your team's conventions."
      },
      {
        id: 52, module: 6,
        section: "Module 6 \u2014 Role Labs",
        question: "What is the primary benefit of using AI for competitive analysis as a product manager?",
        options: [
          "AI eliminates the need for human market research",
          "AI can access competitors' internal databases",
          "AI rapidly synthesizes publicly available information into structured comparisons",
          "AI predictions about competitors are always accurate"
        ],
        correct: 2,
        explanation: "AI excels at quickly synthesizing publicly available information \u2014 product pages, reviews, pricing, feature lists \u2014 into structured comparison grids. It accelerates research but doesn't replace human judgment about strategic implications."
      },
      {
        id: 53, module: 6,
        section: "Module 6 \u2014 Role Labs",
        question: "When generating a PRD with AI, which approach produces the most useful output?",
        options: [
          "Ask AI to write the entire PRD from a one-line description",
          "Provide detailed context about users, constraints, and goals, then iterate on sections",
          "Copy a competitor's PRD and ask AI to modify it",
          "Let AI decide the product requirements based on market trends"
        ],
        correct: 1,
        explanation: "AI-generated PRDs improve dramatically with rich context. Providing user personas, business constraints, technical limitations, and success metrics lets the AI generate focused, relevant requirements rather than generic boilerplate."
      },
      {
        id: 54, module: 6,
        section: "Module 6 \u2014 Role Labs",
        question: "What is a key risk when using AI to estimate time savings for PM workflows?",
        options: [
          "AI always underestimates time savings",
          "AI estimates may not account for review, iteration, and quality assurance overhead",
          "AI cannot understand PM workflows",
          "Time savings estimates are never useful"
        ],
        correct: 1,
        explanation: "AI can dramatically speed up draft generation, but the total time for a task includes review, revision, stakeholder feedback, and quality assurance. Raw AI output rarely ships without human refinement, so time-savings estimates should account for the full workflow."
      },
      {
        id: 55, module: 6,
        section: "Module 6 \u2014 Role Labs",
        question: "In the citizen coder workflow, what is the recommended first step before asking AI to generate code?",
        options: [
          "Learn the programming language syntax",
          "Define the data model and entities clearly",
          "Set up a development environment",
          "Write unit tests"
        ],
        correct: 1,
        explanation: "Starting with a clear data model \u2014 entities, their attributes, and relationships \u2014 gives the AI the structural foundation to generate coherent code. Without this, AI-generated code tends to be inconsistent about how data is organized."
      },
      {
        id: 56, module: 6,
        section: "Module 6 \u2014 Role Labs",
        question: "What does AI-assisted 'UI screen specification' help a citizen coder accomplish?",
        options: [
          "Automatically deploy a web application",
          "Generate pixel-perfect designs without a designer",
          "Translate feature requirements into structured screen layouts and component descriptions",
          "Replace the need for user testing"
        ],
        correct: 2,
        explanation: "UI screen specification translates high-level feature ideas into structured descriptions of screens, components, and interactions. This gives AI code generators a clear blueprint to work from, resulting in more usable interfaces."
      },
      {
        id: 57, module: 6,
        section: "Module 6 \u2014 Role Labs",
        question: "When using AI to generate workflow logic (like automation rules or formulas), what is the most important context to provide?",
        options: [
          "The brand colors of the application",
          "The exact input data format, expected transformations, and desired output format",
          "The programming language preferences",
          "The deployment timeline"
        ],
        correct: 1,
        explanation: "Workflow logic generation depends on precise data context: what the inputs look like, what transformations are needed, and what the output should be. Providing sample data and expected results helps AI generate accurate formulas and automation rules."
      },
      {
        id: 58, module: 6,
        section: "Module 6 \u2014 Role Labs",
        question: "What is the 'two-output' pattern used in citizen coder labs?",
        options: [
          "Generating code in two programming languages simultaneously",
          "Asking AI to produce both the implementation and an explanation of how it works",
          "Running the same prompt twice for consistency",
          "Creating both a mobile and desktop version"
        ],
        correct: 1,
        explanation: "The two-output pattern asks AI to generate both the working code AND an explanation of what it does and why. This helps citizen coders learn from the output rather than treating AI as a black box, building their understanding over time."
      },
      {
        id: 59, module: 6,
        section: "Module 6 \u2014 Role Labs",
        question: "Why is iterative prompting more effective than single-prompt generation for complex PM deliverables?",
        options: [
          "AI models have strict output length limits",
          "Breaking complex deliverables into sections allows focused refinement and maintains coherence",
          "Single prompts are not supported by modern AI models",
          "Iterative prompting is always faster"
        ],
        correct: 1,
        explanation: "Complex deliverables like PRDs or competitive analyses benefit from section-by-section generation because each section can be reviewed and refined independently. This prevents quality degradation that occurs when AI tries to generate everything at once."
      },
      {
        id: 60, module: 6,
        section: "Module 6 \u2014 Role Labs",
        question: "What distinguishes a 'citizen coder' from a traditional developer in the context of AI-assisted building?",
        options: [
          "Citizen coders use different programming languages",
          "Citizen coders rely on AI to bridge the gap between intent and implementation",
          "Citizen coders cannot create functional applications",
          "Citizen coders only work on mobile applications"
        ],
        correct: 1,
        explanation: "A citizen coder uses AI as a translation layer between what they want to build (intent) and working code (implementation). They focus on clearly describing requirements, data models, and workflows, while AI handles the syntax and implementation details."
      },
      // Module 7: Build Labs & Capstone
      {
        id: 61, module: 7,
        section: "Module 7 \u2014 Build Labs",
        question: "When building a RAG system, what is the primary purpose of 'chunking' documents?",
        options: [
          "To reduce storage costs",
          "To split documents into semantically meaningful pieces that fit the model's context window",
          "To encrypt sensitive information",
          "To convert documents to a different format"
        ],
        correct: 1,
        explanation: "Chunking splits documents into pieces that are both semantically coherent and small enough to fit in the model's context window. Chunk size affects retrieval quality \u2014 too large misses precision, too small loses context."
      },
      {
        id: 62, module: 7,
        section: "Module 7 \u2014 Build Labs",
        question: "In RAG evaluation, what does a 'partial' score on a test query indicate?",
        options: [
          "The system crashed mid-response",
          "The retrieved documents were from the wrong collection",
          "The answer contained some correct information but was incomplete or included inaccuracies",
          "The query was malformed"
        ],
        correct: 2,
        explanation: "A 'partial' score means the RAG system retrieved relevant documents and generated a response with some correct information, but the answer was either incomplete, contained minor inaccuracies, or missed key details. This signals a need to tune chunking, retrieval, or the system prompt."
      },
      {
        id: 63, module: 7,
        section: "Module 7 \u2014 Build Labs",
        question: "What is the most critical step in designing a multi-step AI workflow?",
        options: [
          "Choosing the most expensive model for each step",
          "Defining clear inputs and outputs for each node so failures can be isolated",
          "Running all steps in parallel for speed",
          "Using the same prompt template for every step"
        ],
        correct: 1,
        explanation: "Clear input/output contracts between workflow nodes are essential. When each step has well-defined expectations, failures can be traced to specific nodes, outputs can be validated between steps, and individual nodes can be tested and improved independently."
      },
      {
        id: 64, module: 7,
        section: "Module 7 \u2014 Build Labs",
        question: "When debugging a failing workflow step, what should you check first?",
        options: [
          "The model's training data",
          "The input data format and whether it matches the step's expected schema",
          "The cost per token",
          "The workflow's visual design"
        ],
        correct: 1,
        explanation: "Most workflow failures stem from data format mismatches between steps. Checking whether the input to a failing step matches its expected schema \u2014 field names, data types, required vs. optional fields \u2014 catches the most common category of errors."
      },
      {
        id: 65, module: 7,
        section: "Module 7 \u2014 Build Labs",
        question: "What role do 'tool descriptions' play in an AI agent's prompt?",
        options: [
          "They are marketing text shown to end users",
          "They tell the agent when and how to use each tool, guiding its tool selection decisions",
          "They are only needed for debugging purposes",
          "They control the agent's response speed"
        ],
        correct: 1,
        explanation: "Tool descriptions are critical for agent performance. They tell the agent what each tool does, when to use it, what parameters it accepts, and what it returns. Poorly written tool descriptions lead to agents choosing wrong tools or passing incorrect parameters."
      },
      {
        id: 66, module: 7,
        section: "Module 7 \u2014 Build Labs",
        question: "What is the biggest risk when an AI agent enters a reasoning loop?",
        options: [
          "The agent produces better answers",
          "The agent consumes unlimited tokens/cost while making no progress toward the goal",
          "The agent's output becomes more creative",
          "The agent automatically stops after one loop"
        ],
        correct: 1,
        explanation: "Reasoning loops (the agent repeatedly calling the same tools or re-planning without progress) are a major failure mode. They consume tokens/cost without advancing the task. Production agents need loop detection and maximum-step limits as safety guardrails."
      },
      {
        id: 67, module: 7,
        section: "Module 7 \u2014 Build Labs",
        question: "In a multi-agent system, what distinguishes the 'supervisor' pattern from the 'debate' pattern?",
        options: [
          "Supervisors are faster; debate is slower",
          "A supervisor orchestrates and delegates to specialist agents; debate has agents critique each other's outputs",
          "Supervisors use more tokens; debate uses fewer",
          "There is no meaningful difference"
        ],
        correct: 1,
        explanation: "The supervisor pattern has a central orchestrator that delegates sub-tasks to specialist agents and synthesizes their outputs. The debate pattern has multiple agents independently address the same problem and critique each other's answers, converging through adversarial refinement."
      },
      {
        id: 68, module: 7,
        section: "Module 7 \u2014 Build Labs",
        question: "What is the purpose of a 'handoff protocol' in multi-agent systems?",
        options: [
          "To transfer user authentication between agents",
          "To define what information and context is passed when one agent transfers work to another",
          "To measure agent performance",
          "To encrypt communications between agents"
        ],
        correct: 1,
        explanation: "Handoff protocols define the format and content of information passed between agents when work transfers. This includes task context, completed work, constraints, and expected next steps. Poor handoffs cause agents to lose context or repeat work."
      },
      {
        id: 69, module: 7,
        section: "Module 7 \u2014 Build Labs",
        question: "In the capstone architecture decision process, when should you choose a RAG architecture over a simple LLM chat?",
        options: [
          "When you need faster response times",
          "When the task requires accurate answers grounded in specific, up-to-date documents",
          "When you want cheaper API costs",
          "When the user base is very large"
        ],
        correct: 1,
        explanation: "RAG is the right upgrade from LLM chat when accuracy matters and the task requires grounding in specific documents \u2014 company policies, technical documentation, recent data. Plain LLM chat relies solely on training data, which may be outdated or lack domain-specific knowledge."
      },
      {
        id: 70, module: 7,
        section: "Module 7 \u2014 Build Labs",
        question: "What is the 'start simple, measure, upgrade' principle in AI architecture selection?",
        options: [
          "Always begin with the most advanced architecture to future-proof",
          "Start with the simplest viable architecture, measure its real-world performance, and add complexity only when data shows it's needed",
          "Use simple architectures for small companies and complex ones for large enterprises",
          "Upgrade architectures on a fixed quarterly schedule"
        ],
        correct: 1,
        explanation: "This principle prevents over-engineering. Many tasks that seem to need agents actually work fine with RAG or even LLM chat. Starting simple, measuring against real requirements, and upgrading only with evidence saves significant development time and cost."
      },
```

- [ ] **Step 4:** Add Module 6 and 7 to `MODULE_ICONS` object (after the `5: '...',` entry):

```js
      6: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8"/><path d="M8 10h8"/><path d="M8 14h5"/></svg>',
      7: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>',
```

- [ ] **Step 5:** Fix stale text references in `guides/final-exam/quiz.html`:

Find and replace these strings:
- `"The final exam — 50 questions spanning all five modules of GenerativeAI MasterMind."` → `"The final exam — 70 questions spanning all seven modules of GenerativeAI MasterMind."`  (appears 3 times: meta description, og:description, twitter:description)
- `Course Final Exam \u2014 All 5 Modules` → `Course Final Exam \u2014 All 7 Modules` (line ~855 in the JSX)

- [ ] **Step 6:** Verify the file loads in a browser without JSX errors. Check that:
  - Question count shows 70 total
  - Questions 51-70 appear when navigating through the exam
  - Results view shows Module 6 and Module 7 scores
  - Module 6 and 7 icons render in the results

- [ ] **Step 7:** Commit

```bash
git add guides/final-exam/quiz.html
git commit -m "expand Final Exam to 70 questions covering all 7 modules"
```

---

## Task 7: Create robots.txt and sitemap.xml

**Files:**
- Create: `robots.txt`
- Create: `sitemap.xml`

- [ ] **Step 1:** Create `robots.txt` at the repo root:

```
User-agent: *
Allow: /

Sitemap: SITE_URL/sitemap.xml
```

- [ ] **Step 2:** Create `sitemap.xml` at the repo root. Use today's date (2026-04-16) as the `<lastmod>` value for all URLs:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>SITE_URL/index.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <!-- Module 1: Fundamentals -->
  <url>
    <loc>SITE_URL/guides/fundamentals/what-is-genai.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>SITE_URL/guides/fundamentals/regular-vs-genai.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>SITE_URL/guides/fundamentals/how-genai-works.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>SITE_URL/guides/fundamentals/ai-model-types.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>SITE_URL/guides/fundamentals/limitations.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>SITE_URL/guides/fundamentals/verify-framework.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>SITE_URL/guides/fundamentals/embeddings.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>SITE_URL/guides/fundamentals/safety-alignment.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>SITE_URL/guides/fundamentals/evaluation.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>SITE_URL/guides/fundamentals/quiz.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <!-- Module 2: Prompt Engineering -->
  <url>
    <loc>SITE_URL/guides/prompt-engineering/costar-meta.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>SITE_URL/guides/prompt-engineering/techniques.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>SITE_URL/guides/prompt-engineering/quiz.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <!-- Module 3: Context Engineering -->
  <url>
    <loc>SITE_URL/guides/context-engineering/foundations.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>SITE_URL/guides/context-engineering/mastering-context.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>SITE_URL/guides/context-engineering/quiz.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <!-- Module 4: MCP -->
  <url>
    <loc>SITE_URL/guides/mcp/fundamentals.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>SITE_URL/guides/mcp/advanced.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>SITE_URL/guides/mcp/quiz.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <!-- Module 5: Architectures -->
  <url>
    <loc>SITE_URL/guides/architectures/overview.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>SITE_URL/guides/architectures/llm-chat.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>SITE_URL/guides/architectures/rag.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>SITE_URL/guides/architectures/workflows.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>SITE_URL/guides/architectures/agents.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>SITE_URL/guides/architectures/agentic-ai.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>SITE_URL/guides/architectures/quiz.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <!-- Module 6: Role Labs -->
  <url>
    <loc>SITE_URL/guides/role-labs/pm-lab.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>SITE_URL/guides/role-labs/citizen-coder-lab.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>SITE_URL/guides/role-labs/quiz.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <!-- Module 7: Build Labs & Capstone -->
  <url>
    <loc>SITE_URL/guides/build-labs/rag-build.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>SITE_URL/guides/build-labs/workflow-build.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>SITE_URL/guides/build-labs/agent-build.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>SITE_URL/guides/build-labs/multi-agent-build.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>SITE_URL/guides/build-labs/capstone.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>SITE_URL/guides/build-labs/quiz.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
  <!-- Final Exam -->
  <url>
    <loc>SITE_URL/guides/final-exam/quiz.html</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
  </url>
</urlset>
```

- [ ] **Step 3:** Verify both files exist and are well-formed:

```bash
cat robots.txt
head -5 sitemap.xml
grep -c "<url>" sitemap.xml
# Expected: 38
```

- [ ] **Step 4:** Commit

```bash
git add robots.txt sitemap.xml
git commit -m "add robots.txt and sitemap.xml with SITE_URL placeholder"
```

---

## Task 8: Production cleanup — .gitignore, CLAUDE.md, stale reference sweep

**Files:**
- Modify: `.gitignore`
- Modify: `CLAUDE.md`
- Modify: any files with stale references found by grep

- [ ] **Step 1:** Read current `.gitignore` and `CLAUDE.md`

- [ ] **Step 2:** Add defensive entries to `.gitignore`:

```
node_modules/
*.log
```

- [ ] **Step 3:** Update `CLAUDE.md`:

In the Tech Stack section, change:
```
- React 18.2.0 + ReactDOM (CDN: unpkg.com)
```
to:
```
- React 18.2.0 + ReactDOM (CDN: cdnjs.cloudflare.com)
```

In the Seven Modules section, change line 53:
```
8. **Final Exam** (`guides/final-exam/`) — 1 quiz: 50 questions spanning all five modules
```
to:
```
8. **Final Exam** (`guides/final-exam/`) — 1 quiz: 70 questions spanning all seven modules
```

- [ ] **Step 4:** Run stale reference sweep:

```bash
grep -rn "five modules\|Five modules\|5 modules\|5 Modules" --include="*.html" --include="*.md" .
grep -rn "24 Guides\|24 guides\|30 Guides\|30 guides" --include="*.html" --include="*.md" .
grep -rn "50-Question\|50 questions" --include="*.html" --include="*.md" .
```

Fix any remaining stale references found in source files (not in `docs/superpowers/specs/` or `docs/superpowers/plans/` — those are historical documents). Expected fixes:
- `index.html` line 694: `5 Modules · 24 Guides · 50-Question Final Exam` → already fixed in Task 2
- `CLAUDE.md` line 53: already fixed in Step 3 above
- Any other matches should be fixed

- [ ] **Step 5:** Update the existing `assets/og-default.svg` to reflect current stats (7 Modules, 40 Guides) since it may still be referenced or serve as fallback. Change the circle text from "5" to "7" and "24" to "40":

In `assets/og-default.svg`, find:
```svg
<text x="30" y="38" text-anchor="middle" font-family="Fraunces, serif" font-weight="700" font-size="24" fill="#fff">5</text>
```
Change to:
```svg
<text x="30" y="38" text-anchor="middle" font-family="Fraunces, serif" font-weight="700" font-size="24" fill="#fff">7</text>
```

Find:
```svg
<text x="240" y="38" text-anchor="middle" font-family="Fraunces, serif" font-weight="700" font-size="22" fill="#fff">24</text>
```
Change to:
```svg
<text x="240" y="38" text-anchor="middle" font-family="Fraunces, serif" font-weight="700" font-size="22" fill="#fff">40</text>
```

- [ ] **Step 6:** Verify no stale references remain:

```bash
grep -rn "five modules\|Five modules" --include="*.html" --include="*.css" .
grep -rn "24 Guides" --include="*.html" --include="*.svg" .
# Expected: no output from source files
```

- [ ] **Step 7:** Commit

```bash
git add .gitignore CLAUDE.md assets/og-default.svg
git commit -m "production cleanup: update .gitignore, CLAUDE.md, and fix stale references"
```

---

## Task 9: End-to-end smoke test

**Files:**
- No files modified (verification only)

- [ ] **Step 1:** Verify CDN consistency:

```bash
grep -r "unpkg.com" guides/ index.html
# Expected: no output
```

- [ ] **Step 2:** Verify OG image references:

```bash
grep -r "og-default.svg" guides/ index.html
# Expected: no output (all replaced with module-specific images)
```

- [ ] **Step 3:** Verify stale references eliminated:

```bash
grep -ri "five modules\|5 modules" --include="*.html" .
grep -ri "24 guides" --include="*.html" .
# Expected: no output
```

- [ ] **Step 4:** Verify file counts:

```bash
ls assets/og-*.svg | wc -l
# Expected: 10 (og-default + og-landing + og-module-1 through 7 + og-exam)

ls guides/**/*.html | wc -l
# Expected: 36

cat robots.txt
# Expected: well-formed with SITE_URL placeholder

grep -c "<url>" sitemap.xml
# Expected: 38
```

- [ ] **Step 5:** Verify responsive CSS exists:

```bash
grep -c "@media" assets/guide-shared.css
# Expected: 4 (prefers-reduced-motion + 3 breakpoints)
```

- [ ] **Step 6:** Open 3 sample guides in browser and resize to verify responsive layout works:
- `guides/fundamentals/what-is-genai.html` — resize to 768px, 480px, 375px
- `guides/architectures/rag.html` — resize to 768px, 480px, 375px
- `guides/build-labs/capstone.html` — resize to 768px, 480px, 375px

Verify at each width:
- No horizontal scrollbar
- At 768px: sidebar becomes horizontal step bar
- At 480px: guide number hidden, smaller text
- Content remains readable

- [ ] **Step 7:** Open `guides/final-exam/quiz.html` and verify:
- 70 questions total (navigate to end)
- Module 6 and 7 questions appear
- Results view shows 7 modules with icons

- [ ] **Step 8:** View source on `guides/fundamentals/what-is-genai.html` and verify:
- `og:image` points to `../../assets/og-module-1.svg`
- CDN URLs use `cdnjs.cloudflare.com`
- No unpkg references

---

## Execution notes

- **Task 0**: Setup. Use haiku.
- **Task 1**: CSS-only, substantial creative work. Use sonnet.
- **Task 2**: Single file, moderate complexity (JSX inline styles + responsive). Use sonnet.
- **Task 3**: Mechanical, same CSS appended to 8 files + one JSX tweak. Use haiku.
- **Task 4**: 9 SVG files, templated structure. Use haiku.
- **Task 5**: Mechanical bulk sed replacements across 37 files. Use haiku.
- **Task 6**: Substantial creative work (20 new questions + structural additions). Use sonnet.
- **Task 7**: Two small files, templated content. Use haiku.
- **Task 8**: Mixed mechanical edits + grep verification. Use haiku.
- **Task 9**: Verification only. Use haiku.

- Tasks 1-3 are the responsive CSS group (dependent: Task 1 must complete before Tasks 2-3 can reference the shared breakpoints, though Tasks 2-3 add their own inline overrides).
- Task 4 (OG SVGs) is independent of everything else.
- Task 5 (CDN + OG update) depends on Task 4 (SVG files must exist).
- Task 6 (Final Exam) is independent of Tasks 1-5.
- Task 7 (SEO files) is independent.
- Task 8 (cleanup) should run after Tasks 2 and 6 (they both touch stale references).
- Task 9 (smoke test) must run last.
