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
Each guide is a **self-contained** HTML file (~1000–1600 lines) containing:
- Inline CSS in `<style>` tags
- Inline JSX in `<script type="text/babel">`
- Embedded data structures (STAGES, EXAMPLES, INSIGHTS arrays)
- No shared CSS or JS imports between guides

**Two-panel layout pattern**: 120px left sidebar with circular step buttons (64×64px) + scrollable main content area. Top bar has back-link, guide number, title, badge, and prev/next arrows.

### Five Modules
1. **Fundamentals** (`guides/fundamentals/`) — 7 guides: what-is-genai, regular-vs-genai, how-genai-works, ai-model-types, limitations, verify-framework, quiz
2. **Prompt Engineering** (`guides/prompt-engineering/`) — 3 guides: costar-meta, techniques, quiz
3. **Context Engineering** (`guides/context-engineering/`) — 3 guides: foundations, mastering-context, quiz
4. **MCP** (`guides/mcp/`) — 3 guides: fundamentals, advanced, quiz
5. **Architectures** (`guides/architectures/`) — 6 guides: overview, llm-chat, rag, workflows, agents, agentic-ai

### Docs (`docs/`)
Supplementary content: RAG explainer pages (`rag-explainer.html`, `rag-internals.html`), a curriculum markdown, and the master `GenAI Concepts .md` reference document. The `docs/assets/` images are referenced from the GenAI Concepts markdown.

## Key Conventions

- **File naming**: kebab-case for HTML (`costar-meta.html`, `what-is-genai.html`)
- **Guide numbering**: Dotted IDs like 1.1, 2.3, 4.2 used in breadcrumbs and navigation
- **React patterns**: Functional components only, useState/useEffect/useRef, inline styles (no external CSS files)
- **Badge system**: 5 types — BEGINNER, INTERACTIVE, DEEP DIVE, QUIZ, USE CASE — with colors defined in `BADGE_COLORS`/`BADGE_BG` objects in `index.html`
- **Design tokens**: Primary purple `#6c5ce7`, success green `#2ecc71`, dark bg `#1a1a2e`, border `#e8e8f0`, border-radius 12–20px, transition `0.3s cubic-bezier(0.22, 0.68, 0, 1.2)`

## Adding a New Guide

1. Create `guides/{module}/{topic}.html` following the two-panel layout pattern of existing guides
2. Add the guide entry to the `MODULES` array in `index.html` with `available: true`
3. Update prev/next navigation arrows in adjacent guides
