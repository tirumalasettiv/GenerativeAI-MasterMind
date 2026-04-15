# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GenerativeAI-MasterMind is a static educational platform teaching Generative AI through interactive browser-based modules. There is no build system, bundler, or package manager — all HTML files run directly in the browser using React 18 + Babel via CDN.

## Development

**Preview**: Open any HTML file directly in a browser. No server required.

**No build/test/lint commands exist.** This is a zero-tooling static site.

## Architecture

### Tech Stack
- React 18.2.0 + ReactDOM (CDN: unpkg.com)
- Babel Standalone 7.23.9 (in-browser JSX compilation via `<script type="text/babel">`)
- Google Fonts: DM Sans (body) + Fraunces (headings)
- No npm, no bundler, no TypeScript

### Landing Page (`index.html`)
The main portal renders a React app with a `MODULES` array that defines all guides — paths, badges, availability flags, emojis, and descriptions. Guide visibility is controlled by `available: true/false` in this array. Any new guide must be registered here.

### Guide Pages (`guides/{module}/{topic}.html`)
Each guide is a **functionally self-contained** HTML file (~900–1500 lines) containing:
- Inline CSS in `<style>` tags (guide-specific component styles only)
- Inline JSX in `<script type="text/babel">`
- Embedded data structures (STAGES, EXAMPLES, INSIGHTS arrays)

**Two-panel layout pattern**: 120px left sidebar with circular step buttons (64×64px) + scrollable main content area. Top bar has back-link, guide number, title, badge, and prev/next arrows.

### Shared Styles
All design tokens, layout shell (`.container`, `.sidebar`, `.main-content`), and shared components (`.step-btn`, `.top-bar`, `.badge`, `.scene-card`, `.insight-box`, `.arrow-btn`, etc.) live in `assets/guide-shared.css`. Every guide links it:

```html
<link rel="stylesheet" href="../../assets/guide-shared.css">
```

(For `index.html` at the repo root, the path is `assets/guide-shared.css`.)

Guides keep only guide-specific component styles in their inline `<style>` block. Token values are defined as CSS custom properties on `:root` — see the file for the full list. The shared CSS also provides the accessibility baseline: focus rings (`:focus-visible`), skip-link styling, and `prefers-reduced-motion` handling.

### Five Modules
1. **Fundamentals** (`guides/fundamentals/`) — 7 guides: what-is-genai, regular-vs-genai, how-genai-works, ai-model-types, limitations, verify-framework, quiz
2. **Prompt Engineering** (`guides/prompt-engineering/`) — 3 guides: costar-meta, techniques, quiz
3. **Context Engineering** (`guides/context-engineering/`) — 3 guides: foundations, mastering-context, quiz
4. **MCP** (`guides/mcp/`) — 3 guides: fundamentals, advanced, quiz
5. **Architectures** (`guides/architectures/`) — 7 guides: overview, llm-chat, rag, workflows, agents, agentic-ai, quiz
6. **Final Exam** (`guides/final-exam/`) — 1 quiz: 50 questions spanning all five modules

### Docs (`docs/`)
Supplementary content: RAG explainer pages (`rag-explainer.html`, `rag-internals.html`), a curriculum markdown, and the master `GenAI Concepts .md` reference document. The `docs/assets/` images are referenced from the GenAI Concepts markdown.

## Key Conventions

- **File naming**: kebab-case for HTML (`costar-meta.html`, `what-is-genai.html`)
- **Guide numbering**: Dotted IDs like 1.1, 2.3, 4.2 used in breadcrumbs and navigation
- **React patterns**: Functional components only, useState/useEffect/useRef, inline styles for guide-specific components + shared classes from `assets/guide-shared.css` for layout/badges/cards/insights
- **Badge system**: 5 types — BEGINNER, INTERACTIVE, DEEP DIVE, QUIZ, USE CASE — with colors defined in `BADGE_COLORS`/`BADGE_BG` objects in `index.html`. Badge text must match these exact labels (no "GUIDE" suffix).
- **Design tokens**: Defined as CSS custom properties on `:root` in `assets/guide-shared.css`. Primary purple `#6c5ce7` (`--color-primary`), success green `#2ecc71` (`--color-success`), border `#e0e0e0` (`--color-border`), radius scale 8/12/16/20px (`--radius-sm`/`md`/`lg`/`xl`), bouncy transition `0.3s cubic-bezier(0.22, 0.68, 0, 1.2)` (`--transition-bouncy`).
- **Accessibility baseline**: every guide wraps its root in a `React.Fragment` with a skip link, uses `<aside>` for the sidebar, `<nav>` for arrow buttons, `<main id="main">` for content. Step and arrow controls are `<button type="button">` elements with `aria-label` and `aria-current` where applicable.
- **Inter-guide navigation**: Non-quiz guides define a `NEXT_GUIDE = { id, title, module, href, isQuiz? }` constant near the top of their `<script type="text/babel">` block (right before the `stages`/`STAGES` array). The final stage renders an `.up-next-card` linking to this next guide. Quiz pages render `.module-complete-cta` instead, pointing at the next module's first guide (Module 5 → Final Exam; Final Exam → landing page). `.quiz-actions` below it contains a Retry quiz button and Review module anchor link.
- **Landing-page module anchors**: Each module section in `index.html` is wrapped in `<section id={`module-${module.id}`}>` so quiz "Review module" links (`../../index.html#module-N`) land on the correct card. Shared CSS applies `scroll-margin-top: 80px` to `[id^="module-"]` to clear the sticky header on jump.

## Adding a New Guide

1. Create `guides/{module}/{topic}.html` following the two-panel layout pattern of existing guides. In `<head>`, after the Google Fonts link, add `<link rel="stylesheet" href="../../assets/guide-shared.css">` and the full OG/meta tag block (description, `og:*`, `twitter:*`, `theme-color`).
2. Keep only guide-specific component styles in the inline `<style>` block — layout, typography, badges, cards, and insights come from the shared CSS. Use `var(--token)` references where possible.
3. Wrap the returned JSX in a `React.Fragment` with `<a href="#main" className="skip-link">Skip to main content</a>` as the first child. Use `<aside aria-label="Guide sections">` for the sidebar, `<nav aria-label="Section navigation">` for the arrow controls, `<main id="main" className="content-area">` for content. Step and arrow controls are `<button type="button">` with `aria-label` (and `aria-current="step"` on the active step).
4. For non-quiz guides, add a `NEXT_GUIDE = { id, title, module, href, isQuiz? }` constant before the stages array. Render an `.up-next-card` as the last child of `<main>` when the current stage is the final stage. For quiz pages, wire up the `resetQuiz` handler + `.module-complete-cta` + `.quiz-actions` following the pattern in `guides/fundamentals/quiz.html`.
5. Add the guide entry to the `MODULES` array in `index.html` with `available: true`.
6. Update prev/next navigation arrows in adjacent guides.
