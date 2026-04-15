# Module 5 Style Unification Design
**Date:** 2026-04-15  
**Scope:** Module 5 (Architectures) — visual alignment to Module 1 standard  
**Files affected:** 6 non-quiz HTML guides

---

## Goal

Make all guides in Module 5 (Architectures) follow the same visual style as Module 1 (Fundamentals) — covering CSS token alignment, SVG visual language audit of existing diagrams, and adding rich SVG scene diagrams to the stages with the highest conceptual payoff (2–3 per guide).

---

## Section 1: CSS Alignment

Module 1 is the reference. All 6 non-quiz guides in Module 5 are currently using larger spacing/font values. Apply these changes to every affected file:

| Property | Current (M5) | Target (M1 standard) |
|---|---|---|
| `.stage-header` font-size | `28px` | `24px` |
| `.content-area` padding | `32px 48px` | `24px 36px` |
| `.content-area` gap | `30px` | `18px` |
| `.scene-card` padding | `40px` | `28px` |
| `.insight-box` padding | `24px` | `16px 20px` |
| `.insight-box` margin-top | `24px` | `0` |

**Affected files:**
- `guides/architectures/overview.html`
- `guides/architectures/llm-chat.html`
- `guides/architectures/rag.html`
- `guides/architectures/workflows.html`
- `guides/architectures/agents.html`
- `guides/architectures/agentic-ai.html`

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

---

## Section 3: Per-Guide SVG Plan

### overview.html — 2 new diagrams

**S1 (The Spectrum)**  
Five architecture nodes arranged on a horizontal gradient line (left = simple, right = complex). Each node is a colored circle with the architecture name below and its analogy in smaller text. The connecting line uses a purple→pink gradient matching the spectrum gradient already in the CSS widget.

**S2 (Simple Architectures)**  
Two-lane horizontal flow comparison. Top lane: "LLM Chat" — User → LLM → Response (3 nodes, purple). Bottom lane: "RAG" — User → Search → Chunks → LLM → Response (5 nodes, blue). A horizontal dividing line separates the two. Labels above each lane. Placed in the scene-card above the existing interactive tab widget.

---

### llm-chat.html — 2 new diagrams

**S1 (What is LLM Chat?)**  
Architecture SVG: User node (left) → LLM node (center, purple filled) → Response node (right). A "training data" knowledge cloud hangs above/below the LLM node with a dotted arc. A crossed-out side path (labeled "no DB, no search") shows what is absent. Placed above the existing chat demo widget.

**S3 (Why It's Underrated)**  
Two-column comparison SVG. Left column: "Ship Day 1" — single prompt node with a short arrow to ✓ Result. Right column: "Ship in a quarter" — long winding path (RAG pipeline, vector DB, embedding steps) eventually reaching ✓ Result. A vertical "Time & Effort" axis runs between them. Drives home that LLM Chat is often underrated.

---

### rag.html — 3 new diagrams

**S1 (What is RAG?)**  
Before/After split diagram. Left half: User → LLM → Answer with a red "⚠ Hallucination" warning badge. Right half: User → Doc Store + Retrieval → LLM → Answer (grounded) with a green "✓ Grounded" badge. A vertical dividing line separates before/after.

**S2 (The Five Components)**  
5-step horizontal pipeline with labeled nodes and icons:  
Document Loader (📄) → Chunker (✂️) → Embeddings (🧮) → Vector DB (🗃️) → LLM Synthesis (🤖)  
Each node is a rect with icon above and label below. Flow arrows between nodes. Colors progress from grey to purple to indicate increasing sophistication.

**S3 (Under the Hood)**  
Query flow diagram: Query → Embed Query → Vector Similarity Search (with small vector dots visualization) → Top-K Chunks → Context Assembly → LLM → Answer. Each step is a labeled node. The "Vector Similarity Search" node shows a small scatter-plot of dots with one highlighted cluster to convey semantic search.

---

### workflows.html — audit + 1 new diagram

**S1 (What are Workflows?) — Audit**  
The existing `AssemblyLineSVG` uses `#95a5a6` grey and `#6c5ce7` purple — colors are acceptable. Audit stroke widths and ensure conveyor belt animation uses the `dashMarch` keyframe pattern rather than raw SMIL `animate` if possible. Correct any deviations from the visual language standard.

**S4 (Workflow vs Agent)**  
New comparison SVG. Left half "Workflow": four nodes A→B→C→D connected by straight locked arrows, a padlock icon above showing fixed path. Right half "Agent": a central Agent node with branching paths (decision diamonds) and a loop-back arrow, showing dynamic routing. Labels: "Predictable" (left) vs "Adaptive" (right).

---

### agents.html — audit 2 existing + 1 new diagram

**S1 (What is an Agent?) — Audit**  
The existing hub-and-spoke SVG has correct colors and layout. Audit: ensure dashed lines use `stroke-dasharray: 4 3` (not `4,3` comma form), corner radius is `10` on tool nodes, stroke width is `1.5`. Add `aria-label` if missing.

**S3 (The ReAct Loop) — Audit**  
The existing ReAct loop SVG uses correct purple/orange/green for Thought/Action/Observe nodes. Audit: ensure stroke width is `2px`, `rx="10"`, DM Sans font family is declared on all text elements, arrowhead marker fill matches stroke color.

**S2 (Three Core Capabilities)**  
New triangle SVG. An equilateral triangle with vertices labeled: "Reasoning 🧠" (top), "Tool Use 🔧" (bottom-left), "Memory 🧩" (bottom-right). A filled purple "Agent" circle sits at the centroid. Each edge is labeled with what breaks when that vertex is removed: top edge = "can't adapt", left edge = "can't act", right edge = "forgets mid-task". Each vertex node uses the standard `#f5f3ff` fill with `#6c5ce7` border.

---

### agentic-ai.html — audit 2 existing + 1 new diagram

**S1 (What is Agentic AI?) — Audit**  
The existing interactive agent network SVG uses `agent.color` per node (custom colors) and white stroke. Audit: ensure connection lines use `#d0d0d0` inactive and `#6c5ce7` active with `strokeWidth={1.5}` inactive and `strokeWidth={2}` active. Add `aria-label` to the SVG wrapper if missing.

**S3 (Product Launch Team) — Audit**  
The existing animated pipeline SVG uses per-agent colors. Audit: ensure supervisor arc uses `#b0a6e8` (light purple) with `stroke-dasharray: 6 4`, pipeline rect stroke widths are `2px`, active state stroke width is `3px`. These match the current code — confirm and correct if needed.

**S6 (When to Use Agentic AI)**  
New 2×2 decision matrix SVG. X-axis: "Task Complexity" (low→high). Y-axis: "Uncertainty / Dynamism" (low→high). Four quadrants:
- Bottom-left (low/low): "Workflow" — purple label
- Bottom-right (high/low): "Single Agent" — orange label  
- Top-left (low/high): "RAG + Agent" — blue label
- Top-right (high/high): "Agentic AI" — pink/accent label
Axis lines with tick marks, a center crosshair, quadrant labels. Clean minimal style.

---

## Implementation Notes

- Every new SVG is a React JSX function component (`S1Diagram`, `S2Diagram`, etc.) defined in the `<script type="text/babel">` block alongside existing stage components
- SVG diagrams are placed inside the existing `.scene-card` div in each stage's render function — above any existing interactive CSS widget, not replacing it
- The `nodePulse` and `dashMarch` keyframe animations are copied into each file's `<style>` block only if the new SVG uses them; no unused CSS is added
- No shared CSS or JS files — each guide remains fully self-contained
- `aria-label` added to all scene SVGs
- Audit-only files (workflows S1, agents S1/S3, agentic-ai S1/S3) require only targeted attribute corrections — no structural changes
