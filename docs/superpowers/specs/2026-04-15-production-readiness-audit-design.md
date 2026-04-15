# Production Readiness Audit — Design Spec

**Date:** 2026-04-15
**Scope:** Full-platform production readiness for GenerativeAI-MasterMind
**Supersedes:**
- `2026-04-15-module-style-unification-design.md` (Modules 2/3/4 SVG/CSS work — now largely landed)
- `2026-04-15-module5-style-unification-design.md` (Module 5 SVG/CSS work — now largely landed)

---

## Context

The platform is functionally complete but carries measurable drift that blocks production readiness. Three parallel audits of the codebase surfaced:

- **35+ CSS token deviations** across guides (step button sizes, sidebar padding, page backgrounds, badge labels like "INTERACTIVE GUIDE" vs the canonical "INTERACTIVE").
- **Text overflow hotspots**: `index.html:251-271` flex container missing `minWidth: 0`; `.typing` class in 4+ guides pairs `white-space: nowrap` with `overflow: hidden` but no ellipsis; code blocks without `word-break`.
- **Systemic accessibility gaps**: step buttons rendered as `<div>` without `tabindex`, `role="button"`, or `onKeyDown`; no semantic heading hierarchy verification; contrast risk on light-purple-on-light-purple pairings.
- **Missing production metadata**: no Open Graph tags, no meta descriptions on any guide.
- **Quiz imbalance**: Modules 1 & 5 have 18 questions; Modules 2, 3, 4 have 15; no "retry quiz" or "continue to next module" CTA.
- **Curriculum gaps**: no dedicated coverage of embeddings, safety/alignment, evaluation/benchmarks; missing role labs (Day 5-6), build labs (Day 10-13), and capstone (Day 14) from the 14-day curriculum doc.
- **Content redundancy**: architectures/overview.html duplicates content from individual architecture guides; COSTAR/CRAFT framings not unified.

**Root architectural cause of visual drift:** every guide is a self-contained HTML file with inline CSS. The two prior style-unification specs normalized values within this constraint but provide no mechanism to prevent future drift. The user has approved pivoting the architecture to extract a shared CSS file.

**Outcome target:** shippable, consistent, accessible, curriculum-complete educational platform.

---

## Pre-requisite: commit uncommitted work

At spec-write time, there are **3,131 line insertions across 10 files** uncommitted (Module 1 guides plus Modules 2/3/4 quizzes). These represent ongoing style-unification and quiz-expansion work from the two superseded specs. Before Phase 1 begins, that work must be committed so Phase 1 starts from a clean baseline and its diff is reviewable in isolation.

---

## Overall approach: 6 sequential phases

Each phase gets its own spec + plan + execution cycle. This document focuses Phase 1 in depth; Phases 2–6 are scope notes for the roadmap.

| # | Phase | Output |
|---|---|---|
| **1** | **Foundations** — extract shared CSS, normalize outliers, accessibility core, meta/OG tags, badge text fixes, CLAUDE.md update | Consistent, accessible, SEO-ready existing guides |
| 2 | Text overflow + navigation polish — flex/overflow fixes, prev/next links, module-complete CTA, normalize quiz counts, retry mechanism | Flow polish |
| 3 | Content consolidation — cross-link instead of duplicate, unify COSTAR/CRAFT, trim architecture-overview overlap, verify `docs/rag-*` references | Redundancy eliminated |
| 4 | Critical gap guides — new guides for Embeddings, Safety & Alignment, Evaluation & Benchmarks | 3 new guides |
| 5 | Curriculum labs — role labs, build labs (RAG/workflow/agent walkthroughs), capstone | ~7 new guides |
| 6 | Final polish — end-to-end re-audit, per-module OG images, sitemap/robots, deployment checklist | Production sign-off |

---

# Phase 1 — Foundations (detailed design)

## 1.1 Target file structure

```
GenerativeAI-MasterMind/
├── assets/
│   ├── guide-shared.css       (NEW — design tokens, layout shell, shared components)
│   └── og-default.svg         (NEW — default social-share preview image)
├── index.html                  (modified — meta tags, accessibility tweaks)
├── guides/
│   └── {module}/{topic}.html  (all modified — link shared CSS, remove duplicate rules,
│                               add meta tags, add a11y attributes, normalize badges)
├── docs/
└── CLAUDE.md                   (modified — document new architecture)
```

## 1.2 Canonical source of truth

Design tokens and shared component styles are derived from **Module 1 (Fundamentals)**, specifically `guides/fundamentals/what-is-genai.html` and `guides/fundamentals/quiz.html` — the cleanest canonical versions. Prior work already aligned Modules 2/3/4/5 toward Module 1 values (see superseded specs); Phase 1 formalizes those values in one file.

## 1.3 `assets/guide-shared.css` — structure

The shared CSS contains six sections:

1. **Design tokens** as CSS custom properties on `:root` — colors (brand, semantic, neutrals), typography (families, sizes), spacing, radius, layout dimensions, motion curves, elevation shadows.
2. **Reset** — universal `margin:0; padding:0; box-sizing:border-box`.
3. **Body + root layout** — `.container`, `.sidebar`, `.main-content` two-panel shell; every layout element has `min-width: 0` to prevent flex overflow.
4. **Shared components** — `.step-btn` + variants, `.step-btn-label`, `.step-connector`, `.top-bar`, `.back-link`, `.badge`, `.guide-number`, `.title`, `.stage-header`, `.nav-arrows`, `.progress-indicator`, `.arrow-btn`, `.content-area`, `.explanation`, `.scene-card`, `.insight-box`, `.insight-label`, `code`/`pre`, `.typing`.
5. **Animations** — `fadeIn`, `pulse`, `blink`, `slideIn`; honored via `.fade-in`, `.pulse` utility classes; wrapped in `@media (prefers-reduced-motion: reduce)` override.
6. **Focus / a11y utilities** — global `:focus-visible` outline on buttons/links/role=button, skip-link styling, SVG max-width.

**Canonical token values** (exact set):

| Category | Token | Value |
|---|---|---|
| Brand | `--color-primary` | `#6c5ce7` |
| Brand | `--color-primary-soft` | `#a78bfa` |
| Brand | `--color-primary-light` | `#e8e3f8` |
| Brand | `--color-primary-faint` | `#f5f3ff` |
| Brand | `--color-primary-muted` | `#b0a6e8` |
| Semantic | `--color-success` | `#2ecc71` |
| Semantic | `--color-success-bg` | `#f0faf0` |
| Semantic | `--color-success-deep` | `#1a5e3a` |
| Semantic | `--color-error` | `#e74c3c` |
| Semantic | `--color-warning` | `#f39c12` |
| Semantic | `--color-info` | `#3498db` |
| Neutral | `--color-bg` | `#ffffff` |
| Neutral | `--color-bg-subtle` | `#f8f9fa` |
| Neutral | `--color-text` | `#1a1a1a` |
| Neutral | `--color-text-body` | `#2a2a2a` |
| Neutral | `--color-text-muted` | `#666666` |
| Neutral | `--color-text-faint` | `#999999` |
| Neutral | `--color-border` | `#e0e0e0` |
| Neutral | `--color-border-soft` | `#e8e8f0` |
| Type | `--font-body` | `'DM Sans', sans-serif` |
| Type | `--font-display` | `'Fraunces', serif` |
| Type | `--fs-title` | `28px` |
| Type | `--fs-stage` | `24px` |
| Type | `--fs-body` | `22px` |
| Type | `--fs-insight` | `17px` |
| Type | `--fs-badge` | `12px` |
| Type | `--fs-step-emoji` | `26px` |
| Type | `--fs-step-label` | `11px` |
| Type | `--fs-nav` | `14px` |
| Type | `--fs-guide-number` | `20px` |
| Radius | `--radius-sm` | `8px` |
| Radius | `--radius-md` | `12px` |
| Radius | `--radius-lg` | `16px` |
| Radius | `--radius-xl` | `20px` |
| Layout | `--sidebar-width` | `120px` |
| Layout | `--step-btn-size` | `64px` |
| Layout | `--arrow-btn-size` | `40px` |
| Layout | `--content-pad-y` | `24px` |
| Layout | `--content-pad-x` | `36px` |
| Layout | `--content-gap` | `18px` |
| Motion | `--transition-fast` | `0.2s ease` |
| Motion | `--transition-default` | `0.3s ease` |
| Motion | `--transition-bouncy` | `0.3s cubic-bezier(0.22, 0.68, 0, 1.2)` |
| Elevation | `--shadow-card` | `0 4px 20px rgba(108, 92, 231, 0.08)` |
| Elevation | `--shadow-card-hover` | `0 8px 20px rgba(108, 92, 231, 0.12)` |
| Elevation | `--shadow-step-active` | `0 4px 12px rgba(108, 92, 231, 0.3)` |

Full CSS file contents are in the companion plan file; see `docs/superpowers/plans/2026-04-15-phase-1-foundations.md` when created.

## 1.4 Per-guide migration pattern

Each guide's `<head>` receives the shared CSS link right after the Google Fonts line:

```html
<link rel="stylesheet" href="../../assets/guide-shared.css">
```

Within each guide's existing inline `<style>` block, remove rules that duplicate shared CSS (the universal reset, `body`, `#root`, `.container`, `.sidebar`, `.step-wrapper`, `.step-btn` + variants, `.step-btn-label`, `.step-connector`, `.main-content`, `.top-bar`, `.left-section`, `.back-link`, `.badge`, `.guide-number`, `.title`, `.stage-header`, `.nav-arrows`, `.progress-indicator`, `.arrow-btn`, `.content-area`, `.explanation`, `.scene-card`, `.insight-box`, `.insight-label`, `@keyframes fadeIn/pulse/blink`).

Keep only guide-specific component styles (e.g., `.tech-card`, `.analogy-card`, `.split-panel`, stage-specific SVG keyframes like `nodePulse` / `dashMarch`).

## 1.5 Per-guide meta additions

Add to every guide's `<head>`:

```html
<meta name="description" content="{guide-specific description, ≤160 chars}">
<meta property="og:title" content="{guide title}">
<meta property="og:description" content="{same as description}">
<meta property="og:type" content="article">
<meta property="og:image" content="../../assets/og-default.svg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{guide title}">
<meta name="twitter:description" content="{same as description}">
<meta name="theme-color" content="#6c5ce7">
```

A single `assets/og-default.svg` (purple gradient, "GenAI MasterMind" wordmark) is created in Phase 1. Per-module OG imagery is deferred to Phase 6.

Each guide's description string is authored individually to reflect the guide's specific content — full mapping in the plan file.

## 1.6 Accessibility baseline

Applied across every guide as part of Phase 1:

1. **Step buttons**: change `<div className="step-btn">` → `<button className="step-btn" type="button" aria-label="Step {n}: {title}" aria-current={active ? "step" : undefined}>`. Existing `onClick` handlers preserved.
2. **Arrow nav**: any `<div>` arrow → `<button type="button" aria-label="Previous section" | "Next section">`.
3. **Interactive SVG nodes with click handlers**: add `role="button"`, `tabIndex={0}`, and an `onKeyDown` handler that triggers the same action on `Enter` or `Space`.
4. **Focus rings**: handled globally by `:focus-visible` rules in shared CSS.
5. **Skip link**: add `<a href="#main" className="skip-link">Skip to main content</a>` at the top of each guide. `.skip-link` is absolutely-positioned off-screen and becomes visible on `:focus`.
6. **Prefers-reduced-motion**: handled globally in shared CSS — disables non-essential animations.
7. **Landmarks**: wrap content area in `<main id="main">`, nav arrows in `<nav>`, step sidebar in `<aside>`.
8. **Contrast fixes**: audit the two known-risk pairs (`#b0a6e8` on white; `#a78bfa` on `#f5f3ff`). Where they back small text failing WCAG AA (4.5:1), switch to `--color-primary`.

Deeper ARIA (e.g., `aria-expanded` on disclosures, semantic heading hierarchy verification) is deferred to Phase 2 because it touches per-component JSX.

## 1.7 Badge text normalization

Rename inconsistent badge labels to match the `index.html` MODULES array source of truth:

- `INTERACTIVE GUIDE` → `INTERACTIVE` in:
  - `guides/fundamentals/what-is-genai.html`
  - `guides/fundamentals/verify-framework.html`
  - `guides/fundamentals/regular-vs-genai.html`
  - `guides/prompt-engineering/costar-meta.html`
- `BEGINNER GUIDE` → `BEGINNER` in:
  - `guides/context-engineering/foundations.html`
  - `guides/mcp/fundamentals.html`

## 1.8 Outlier normalization: `prompt-engineering/techniques.html`

Delete these inline overrides so the shared CSS applies canonical values:

| Selector | Delete value | Canonical (via shared) |
|---|---|---|
| `.step-btn` width/height | `56px` | `64px` |
| `.sidebar` padding | `40px 12px 40px` | `80px 12px 40px` |
| `.title` font-size | `26px` | `28px` |
| `.explanation` font-size | `18px` | `22px` |
| `.insight-box` padding | `20px 24px` | `16px 20px` |

## 1.9 CLAUDE.md updates

In the **Architecture** section:
- Add a subsection "Shared styles" describing `assets/guide-shared.css` as the canonical source of truth for design tokens, layout, and shared components. Link path: `assets/guide-shared.css`.
- Update "Self-contained" language — guides are now "functionally self-contained" (inline JSX, inline guide-specific CSS) but consume shared tokens/components from the shared CSS file.

In the **Adding a New Guide** section:
- Step 1b (new): "Link `../../assets/guide-shared.css` in `<head>`. Only add guide-specific component styles in the inline `<style>` block."

In the **Key Conventions / Design tokens** section:
- Replace hand-listed hex values with a pointer: "See `:root` in `assets/guide-shared.css` for the full token list."

## 1.10 Files touched in Phase 1

| Type | Files | Count |
|---|---|---|
| New | `assets/guide-shared.css`, `assets/og-default.svg` | 2 |
| Modified (guides — shared CSS link, rule dedupe, meta tags, a11y attrs, badge fixes) | `index.html` + 24 guide HTMLs (7 fundamentals + 3 prompt-engineering + 3 context-engineering + 3 mcp + 7 architectures + 1 final-exam) | 25 |
| Modified (docs) | `CLAUDE.md` | 1 |
| **Total** | | **28** |

## 1.11 Verification plan

1. **Visual diff**: open three sample guides side-by-side pre/post-migration: `guides/fundamentals/what-is-genai.html` (canonical baseline), `guides/prompt-engineering/techniques.html` (worst outlier), `guides/architectures/overview.html` (a different module). Confirm no unintended visual change except the explicit outlier normalizations.
2. **Accessibility scan**: run `axe-core` via browser DevTools on three guides; target zero critical/serious violations for keyboard, ARIA, and contrast.
3. **Keyboard walkthrough**: tab through one full guide — skip link works, step buttons take focus with visible ring, arrow buttons reachable, Enter/Space activate.
4. **Meta tags**: view page source on two guides; confirm OG tags present; paste URL into an OG-preview tool (e.g. `opengraph.xyz`).
5. **Reduced motion**: toggle system pref; confirm animations disabled.
6. **Lighthouse**: run against three guides — target Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
7. **No regressions**: click every link in `index.html`; every guide loads with correct visual style.
8. **Grep sanity check**: `grep -r "\.step-btn\s*{" guides/` should return zero matches post-migration (rules now live only in shared CSS).

---

# Phases 2–6 — roadmap scope notes

## Phase 2 — text overflow + navigation polish

- Fix `index.html:251-271` flex container missing `minWidth: 0`; add `word-break` on descriptions.
- Fix `architectures/overview.html:613` `white-space: nowrap` code example.
- Any residual overflow not already covered by shared CSS's `overflow-wrap: break-word` defaults.
- Add inter-guide prev/next links within each module (currently only back-to-index).
- Add "🎉 Module Complete — Continue to Module N" CTA on each module quiz's results screen.
- Normalize quiz question counts: Modules 2, 3, 4 go from 15 → 18 questions each (add 3 Qs per quiz, review wording with user).
- Add "Retry Quiz" + "Review Module" buttons on results page.
- Deeper ARIA (`aria-expanded` on disclosures, semantic heading hierarchy) — touches per-component JSX.

## Phase 3 — content consolidation

- Unify COSTAR/CRAFT into a single canonical treatment in `prompt-engineering/costar-meta.html`; cross-link from curriculum doc.
- Trim `architectures/overview.html` sections that duplicate individual architecture guides; convert overview to navigator + high-level comparison only.
- Verify existence of `docs/rag-explainer.html` / `docs/rag-internals.html`; if missing, remove references; if present, dedupe vs `architectures/rag.html`.
- Reuse `what-is-genai.html` analogy SVGs (parrot, librarian) in `limitations.html` and `verify-framework.html` instead of duplicating.

## Phase 4 — critical gap guides (3 new)

- `guides/fundamentals/embeddings.html` — embeddings, vector space intuition, cosine similarity, vector DBs, uses in RAG.
- `guides/fundamentals/safety-alignment.html` — hallucinations (deep), jailbreaks, prompt injection, RLHF/DPO, content safety, enterprise guardrails.
- `guides/fundamentals/evaluation.html` — testing GenAI output, benchmarks (MMLU, HELM, HumanEval), LLM-as-judge, custom eval sets, red-teaming.

Each registered in `index.html` MODULES array. Fundamentals quiz gains 3 questions covering these topics.

## Phase 5 — curriculum labs (~7 new guides)

From `docs/14-Day-Generative-AI-Training-Curriculum.md`:

- New module `guides/role-labs/` — `pm-lab.html` (Day 5), `citizen-coder-lab.html` (Day 6).
- New module `guides/build-labs/` — `rag-build.html` (Day 10-11 RAG build), `workflow-build.html` (Day 11-12 Dify.ai / n8n), `agent-build.html` (Day 12 agent design), `multi-agent-build.html` (Day 13 multi-agent design).
- `guides/capstone/capstone.html` — Day 14 final project template.
- Register new modules in `index.html` MODULES array.

## Phase 6 — final polish

- End-to-end re-audit with three parallel Explore agents.
- Per-module OG images (replace default).
- Add `robots.txt`, `sitemap.xml`, `.gitignore` if missing.
- Run Lighthouse on every guide; document scores.
- Production deployment checklist (hosting, cache headers, HTTPS, domain).
- Smoke test on mobile breakpoints (320, 375, 768).

---

## Open decisions before implementation begins

1. **Uncommitted work** — commit the 3,131-line diff across 10 files before Phase 1 starts, so Phase 1 diff is reviewable in isolation.
2. **Prompt-engineering/techniques.html normalization** — confirm the current narrower styles were unintended drift (not deliberate for its 12 technique cards). Current design assumes drift and snaps to canonical.
3. **OG image direction for Phase 1** — default logo/wordmark SVG only; per-module imagery deferred to Phase 6.

On approval, the next step is to invoke the `superpowers:writing-plans` skill to turn this Phase 1 design into a detailed, executable step-by-step plan in `docs/superpowers/plans/2026-04-15-phase-1-foundations.md`.
