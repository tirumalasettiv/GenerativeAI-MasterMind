# Module Style Unification Design
**Date:** 2026-04-15  
**Scope:** Modules 2, 3, and 4 — visual alignment to Module 1 standard  
**Files affected:** 8 non-quiz HTML guides

---

## Goal

Make all guides in Modules 2 (Prompt Engineering), 3 (Context Engineering), and 4 (MCP) follow the same visual style as Module 1 (Fundamentals) — covering CSS token alignment, SVG visual language, and adding rich SVG scene diagrams to Modules 3 and 4 where they currently use CSS-only visualizations.

---

## Section 1: CSS Alignment

Module 1 is the reference. All 8 non-quiz guides in Modules 2/3/4 are currently using larger spacing/font values. Apply these changes to every affected file:

| Property | Current (M2/3/4) | Target (M1 standard) |
|---|---|---|
| `.stage-header` font-size | `28px` | `24px` |
| `.content-area` padding | `32px 48px` | `24px 36px` |
| `.content-area` gap | `30px` | `18px` |
| `.scene-card` padding | `40px` | `28px` |
| `.arrow-btn` border-width | `2px` (costar-meta only) | `1px` |
| `.insight-box` padding | `24px` (M3/4 only) | `16px 20px` |

**Affected files:**
- `guides/prompt-engineering/costar-meta.html`
- `guides/prompt-engineering/techniques.html`
- `guides/context-engineering/foundations.html`
- `guides/context-engineering/mastering-context.html`
- `guides/mcp/fundamentals.html`
- `guides/mcp/advanced.html`

---

## Section 2: SVG Visual Language Standard

All new and updated SVG diagrams must follow Module 1's exact visual language:

| Element | Standard |
|---|---|
| Primary color | `#6c5ce7` — active nodes, borders, arrows |
| Accent colors | `#2ecc71` green, `#e74c3c` red, `#f39c12` orange, `#3498db` blue |
| Light fill | `#f5f3ff` — active/highlighted node backgrounds |
| Stroke width | `1.5–2px` for borders; `2px` for flow arrows |
| Corner radius | `10–12px` on rectangles; `50%` on circles |
| Font | DM Sans, `12–13px`, `font-weight: 600` |
| Arrow markers | `<marker>` element, fill matches stroke color |
| Dashed lines | `stroke-dasharray: 4 4` for secondary/inactive paths |
| Animation | `nodePulse` on active nodes; `dashMarch` on flow arrows — same keyframes as Module 1 |
| SVG container | `style={{ maxWidth: '100%', overflow: 'visible' }}` — responsive |
| Accessibility | `aria-label` on every scene SVG |

**Module 2 note:** Both guides already have SVG diagrams. Audit color values, stroke widths, and corner radii against the standard above and correct any deviations.

---

## Section 3: Per-Guide SVG Plan

### Module 2 — Prompt Engineering

**costar-meta.html** and **techniques.html**: Style audit and alignment only. No new diagrams. Verify existing SVG diagrams use the standard colors, stroke widths, and corner radii.

---

### Module 3 — Context Engineering: Foundations

| Stage | Title | SVG Diagram Description |
|---|---|---|
| S1 | What is Context Engineering? | Context window filling up: labeled blocks (System Prompt, Memory, Tool Results, Conversation) stacking inside a capacity bar with animated fill |
| S2 | Why It Matters | Three "book" nodes side by side: ✓ Good context / ✗ Missing pages / ✗ Contradictory notes, each with a quality score badge |
| S3 | When Things Go Wrong | Three-failure pipeline: Poisoning (red) → Confusion (orange) → Clash (red), with labeled bottleneck icons and a degrading output arrow |
| S4 | Who Needs It? | Hub-and-spoke: central AI node, three roles (Developer, User, Team) radiating out with labeled connection types |
| S5 | Key Foundations | Two-column comparison: Static Prompts vs. Dynamic Context, with outcome arrows showing quality differential |

---

### Module 3 — Context Engineering: Mastering Context

| Stage | Title | SVG Diagram Description |
|---|---|---|
| S1 | Memory Hierarchy | Four-tier stack (Working → Episodic → Semantic → Procedural), color-coded, with arrows funneling into a context window |
| S2 | Three Tiers | Three labeled boxes (Project / User / Dynamic) cascading into a context window box, with scope annotations |
| S3 | Intelligent Retrieval | Flow: Query → Relevance Filter → Recency Filter → Context Window → LLM, with example tool labels at each filter |
| S4 | Compression & Isolation | Left: conversation history → compress → summary node. Right: orchestrator tree with 3 isolated sub-agents, each with scoped context |
| S5 | Advanced Architecture | Four interconnected principle nodes (Identity, Empowerment, Reasoning, Boundaries) in a cycle around a central "Agent" hub |

---

### Module 4 — MCP: Fundamentals

| Stage | Title | SVG Diagram Description |
|---|---|---|
| S1 | Why MCP? | Before/After split: left = N×M chaotic integration web (messy lines), right = N+M clean star topology through MCP hub |
| S2 | Architecture | Full host→client→server diagram: Host App contains MCP Client, connects via Protocol to MCP Server exposing Tools / Resources / Prompts |
| S3 | MCP in Action | 5-step execution flow: User Query → LLM Reasoning → Tool Identified → MCP Call → Response Returned, with animated active step |
| S4 | Setting Up MCP | Linear install flow: CLI Command → MCP Registered → Tools Exposed → Context Enriched, with labeled nodes |
| S5 | Key Foundations | Network effects flywheel: Developers → More Tools → Platform Adoption → More Developers (circular arrow diagram) |

---

### Module 4 — MCP: Advanced

| Stage | Title | SVG Diagram Description |
|---|---|---|
| S1 | Context Bloat | Horizontal stacked bar: context window capacity with tool-definition blocks consuming ~20%, color-coded by server |
| S2 | Optimization | Three vertical bars: All Servers (20%, red), Strict Config (2.4%, green), Session Toggle (3.2%, green) — labeled with token counts |
| S3 | Plugins | Bundle illustration: four component boxes (Commands, Subagents, MCP Servers, Hooks) grouped inside a package outline with install arrow |
| S4 | Drawbacks | Four-bottleneck pipeline: Context Pollution → Ping-Pong Execution → Language Mismatch → Schema Limits, each with a warning icon |
| S5 | Code Mode | Side-by-side: Traditional MCP (multiple round-trip arrows) vs. Code Mode (single arrow + execute block), with latency labels |
| S6 | Key Takeaways | 2×2 decision matrix: axes = Complexity vs. Performance, quadrants for MCP / Plugins / Code Mode / Hybrid |

---

## Implementation Notes

- Every new SVG is a React JSX function component (named `S1Diagram`, `S2Diagram`, etc.) defined in the `<script type="text/babel">` block alongside the existing stage components
- SVG diagrams are placed inside the existing `.scene-card` div in each stage's render function
- CSS-only visualizations in Modules 3/4 that currently show the same concept as the new SVG diagram should be removed to avoid duplication; interactive accordions and disclosure cards that add click-to-expand detail should be kept
- All animations reuse the keyframes already defined in Module 1 (`fadeIn`, `pulse`, `dashMarch`) — copy exact keyframe definitions into each file's `<style>` block
- No shared CSS or JS files — each guide remains fully self-contained
