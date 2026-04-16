# Phase 6 — Final Polish Design Spec

## Context

Phases 1–5 built and polished the platform to 7 modules (39 guides) + a 50-question Final Exam. The content is functionally complete. Phase 6 is the production-readiness pass: mobile responsive design, Final Exam expansion, per-module OG images, CDN standardization, SEO infrastructure, and an end-to-end smoke test.

## Decisions Made

| Decision | Choice |
|---|---|
| Mobile responsive | Full responsive: desktop (>1024px), tablet (768px–1024px), phone (<768px), small phone (<480px) |
| Final Exam | Expand from 50 → ~70 questions covering all 7 modules |
| OG images | Per-module branded color bar SVGs (1200x630) |
| CDN source | Standardize all 36 guides on cdnjs.cloudflare.com (matching index.html) |
| Deployment target | Placeholder `SITE_URL` in robots.txt/sitemap.xml |

---

## 1. Mobile Responsive Design

### Strategy

All responsive rules go into `assets/guide-shared.css` — no per-guide edits needed for layout reflow. The existing two-panel layout (120px sidebar + scrollable content) transforms at each breakpoint.

### Breakpoints

**Desktop (>1024px)** — No change. Current layout: 120px sidebar, 64px step buttons with labels, full content area with 36px horizontal padding.

**Tablet (768px–1024px):**
- Sidebar: 72px wide, step buttons shrink to 48px, labels hidden
- Top bar: padding reduced from 20px 40px to 16px 20px
- Content area: padding reduced from 24px 36px to 20px 24px
- Font sizes: stage header 22px (from 24px), body 20px (from 22px)

**Phone (<768px):**
- Sidebar becomes a horizontal step bar positioned below the top bar
- Step buttons: 40px, arranged in a flex row with horizontal connectors (2px lines)
- Labels hidden (emoji-only navigation)
- Container: switches from `flex-direction: row` to `flex-direction: column`
- Content fills full width, padding 16px
- Top bar: badge hidden, title font 22px (from 28px)
- `.scene-card` padding reduced to 16px

**Small phone (<480px):**
- Step buttons: 36px
- Top bar: guide-number hidden, back-link shortened
- Content padding: 12px
- Stage header: 20px, body: 18px

### Landing page (`index.html`) responsive

The landing page has its own inline styles for the module card grid. Add responsive rules in its `<style>` block:
- **<768px**: Module cards stack to single column, hero section padding reduced, footer text wraps
- **<480px**: Module title font reduced, guide list items more compact

### Quiz pages responsive

Quiz pages use inline styles for `.option-card` elements. Add responsive overrides:
- **<768px**: Option card padding reduced, font sizes scaled down
- **<480px**: Option letter circles shrink from 36px to 28px

---

## 2. Final Exam Expansion

### Current state

`guides/final-exam/quiz.html` has 50 questions covering Modules 1–5 with these section counts:
- Module 1 (Fundamentals): ~18 questions across sections 1.1–1.9
- Module 2 (Prompt Engineering): ~8 questions
- Module 3 (Context Engineering): ~8 questions
- Module 4 (MCP): ~8 questions
- Module 5 (Architectures): ~8 questions

### Additions

Add **20 new questions** after the existing 50:

**Module 6 — Role Labs (10 questions):**
- 5 PM Lab (6.1): AI use case identification, COSTAR prompt building, competitive analysis with AI, PRD generation, time-savings estimation
- 5 Citizen Coder Lab (6.2): Data model design with AI, UI screen specification, workflow logic generation, Excel formula generation, app prototyping patterns

**Module 7 — Build Labs & Capstone (10 questions):**
- 2 RAG Build (7.1): Document chunking strategies, RAG evaluation scoring
- 2 Workflow Build (7.2): Multi-step pipeline design, failure debugging
- 2 Agent Build (7.3): Tool selection, agent prompt structure
- 2 Multi-Agent Design (7.4): Coordination patterns (supervisor/debate/pipeline/swarm), handoff protocols
- 2 Capstone (7.5): Architecture decision-making, solution design process

### SECTION_ICONS additions

Add SVG icon strings for sections "6.1" (briefcase), "6.2" (code brackets), "7.1" (search/magnifier), "7.2" (cycle arrows), "7.3" (robot), "7.4" (people group), "7.5" (graduation cap).

### Stale reference fixes

All in `guides/final-exam/quiz.html`:
- Meta description: "all five modules" → "all seven modules"
- og:description: same
- twitter:description: same
- Line ~855: "All 5 Modules" → "All 7 Modules"
- Total question display: update any "50" references to "70"

---

## 3. Per-Module OG Images

### Design

Each SVG is 1200x630px with:
- Purple gradient background: `linear-gradient(135deg, #1a1a2e 0%, #2d1b69 50%, #6c5ce7 100%)`
- Module emoji centered, large (120px equivalent)
- Module name in white, DM Sans 700, 48px
- "GenerativeAI MasterMind" subtitle, white at 60% opacity, 24px
- Accent color strip: 8px tall bar at the bottom, module-specific color

### Files and accent colors

| File | Module | Emoji | Accent Color |
|---|---|---|---|
| `assets/og-landing.svg` | Landing Page | 🧠 | `#6c5ce7` (purple) |
| `assets/og-module-1.svg` | Fundamentals | 🧠 | `#2ecc71` (green) |
| `assets/og-module-2.svg` | Prompt Engineering | ✍️ | `#f39c12` (amber) |
| `assets/og-module-3.svg` | Context Engineering | 🧩 | `#3498db` (blue) |
| `assets/og-module-4.svg` | MCP | 🔌 | `#e74c3c` (red) |
| `assets/og-module-5.svg` | Architectures | 🏗️ | `#9b59b6` (violet) |
| `assets/og-module-6.svg` | Role Labs | 📋 | `#1abc9c` (teal) |
| `assets/og-module-7.svg` | Build Labs & Capstone | 🔨 | `#e67e22` (orange) |
| `assets/og-exam.svg` | Final Exam | 🎓 | `#e74c3c` (red) |

### Meta tag updates

Every guide's `<head>` has `<meta property="og:image" content="...">`. Update:
- `index.html`: `assets/og-landing.svg`
- All Module 1 guides: `../../assets/og-module-1.svg`
- All Module 2 guides: `../../assets/og-module-2.svg`
- (and so on for Modules 3–7)
- `guides/final-exam/quiz.html`: `../../assets/og-exam.svg`

---

## 4. CDN Standardization

### Current state

- `index.html` (1 file): uses `cdnjs.cloudflare.com`
- All 36 guide HTML files: use `unpkg.com`

### Target

All 36 guides switch to cdnjs.cloudflare.com. Three replacements per file:

| Old (unpkg) | New (cdnjs) |
|---|---|
| `https://unpkg.com/react@18/umd/react.production.min.js` | `https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js` |
| `https://unpkg.com/react-dom@18/umd/react-dom.production.min.js` | `https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js` |
| `https://unpkg.com/@babel/standalone/babel.min.js` | `https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.9/babel.min.js` |

Also remove `crossorigin` attribute from the script tags (cdnjs doesn't require it, and index.html doesn't use it).

### Files to modify

All 36 files under `guides/`:
- `guides/fundamentals/` (10 files): what-is-genai, regular-vs-genai, how-genai-works, ai-model-types, limitations, verify-framework, embeddings, safety-alignment, evaluation, quiz
- `guides/prompt-engineering/` (3 files): costar-meta, techniques, quiz
- `guides/context-engineering/` (3 files): foundations, mastering-context, quiz
- `guides/mcp/` (3 files): fundamentals, advanced, quiz
- `guides/architectures/` (7 files): overview, llm-chat, rag, workflows, agents, agentic-ai, quiz
- `guides/role-labs/` (3 files): pm-lab, citizen-coder-lab, quiz
- `guides/build-labs/` (6 files): rag-build, workflow-build, agent-build, multi-agent-build, capstone, quiz
- `guides/final-exam/` (1 file): quiz

---

## 5. robots.txt + sitemap.xml

### robots.txt

```
User-agent: *
Allow: /

Sitemap: SITE_URL/sitemap.xml
```

### sitemap.xml

Standard XML sitemap listing all 38 URLs:
- `SITE_URL/index.html`
- `SITE_URL/guides/fundamentals/what-is-genai.html` (and all 9 other Module 1 guides)
- `SITE_URL/guides/prompt-engineering/costar-meta.html` (and 2 others)
- `SITE_URL/guides/context-engineering/foundations.html` (and 2 others)
- `SITE_URL/guides/mcp/fundamentals.html` (and 2 others)
- `SITE_URL/guides/architectures/overview.html` (and 6 others)
- `SITE_URL/guides/role-labs/pm-lab.html` (and 2 others)
- `SITE_URL/guides/build-labs/rag-build.html` (and 5 others)
- `SITE_URL/guides/final-exam/quiz.html`

Each `<url>` entry has `<loc>`, `<lastmod>` (derived from git log date), and `<changefreq>monthly</changefreq>`.

`SITE_URL` is a literal placeholder string — find-and-replace when deploying.

---

## 6. Production Cleanup

### .gitignore additions

Add `node_modules/` and `*.log` as defensive entries.

### CLAUDE.md updates

- "five modules" → "seven modules" (if any remain)
- Final Exam description: "50 questions spanning all five modules" → "70 questions spanning all seven modules"
- Guide counts: verify all module guide counts are accurate
- Add note about CDN standardization on cdnjs.cloudflare.com

### Stale reference sweep

Grep across all files for:
- "five modules" / "Five modules" / "5 modules"
- "24 guides" / "24 Guides"
- "30 guides" / "30 Guides"
- "50 questions" / "50-Question"

Fix all to reflect current state: 7 modules, 40 guides (39 + final exam), 70 questions.

### index.html footer

Update the footer stats line from "5 Modules · 24 Guides · 50-Question Final Exam" to "7 Modules · 40 Guides · 70-Question Final Exam".

---

## 7. Smoke Test

### Verification matrix

| Check | Method | Scope |
|---|---|---|
| JSX loads without error | Open in browser, check console | All 37 HTML files |
| Desktop layout correct | Visual check at 1280px | 3 sample guides (1 per category: fundamentals, architectures, build-labs) |
| Tablet layout correct | Resize to 768px | Same 3 guides |
| Phone layout correct | Resize to 375px | Same 3 guides |
| NEXT_GUIDE chain | Click through first → last in 2 modules | Module 1 (longest chain) + Module 7 |
| OG tags render | View source, check og:image path resolves | 3 guides + index |
| robots.txt well-formed | Open in browser | 1 file |
| sitemap.xml well-formed | Open in browser, verify XML structure | 1 file |
| CDN consistency | `grep -r "unpkg.com" guides/` returns 0 results | All guides |
| Stale references | `grep -ri "five modules\|5 modules\|24 guides" .` returns 0 in source files | All files |
| Landing page responsive | Resize index.html to 375px | 1 file |
| Quiz responsive | Resize a quiz page to 375px | 1 quiz |

---

## Files Summary

| Type | Files | Count |
|---|---|---|
| Modified | `assets/guide-shared.css` (responsive breakpoints) | 1 |
| Modified | All 36 guide HTML files (CDN swap + OG image update) | 36 |
| Modified | `index.html` (OG image + footer stats + responsive CSS) | 1 |
| Modified | `guides/final-exam/quiz.html` (20 new questions + stale refs + OG) | 1 |
| Modified | `CLAUDE.md` (stale refs + CDN note) | 1 |
| Modified | `.gitignore` (defensive entries) | 1 |
| Created | `assets/og-landing.svg`, `og-module-1.svg` – `og-module-7.svg`, `og-exam.svg` | 9 |
| Created | `robots.txt` | 1 |
| Created | `sitemap.xml` | 1 |
| **Total** | | **52** |
