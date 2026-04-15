# Module 5 Style Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align all 6 Module 5 Architecture guides to the Module 1 visual standard — fixing 6 CSS properties across all files, auditing existing SVGs in workflows/agents/agentic-ai, and adding new SVG scene diagrams to the highest-payoff stages.

**Architecture:** Direct HTML file edits using the Edit tool. Each guide is a fully self-contained HTML file with inline CSS and JSX compiled by Babel in the browser. SVG diagrams are React JSX function components added to the `<script type="text/babel">` block. No build step needed — open any HTML file directly in a browser to verify.

**Tech Stack:** React 18 + Babel Standalone (CDN), inline SVG-in-JSX, static HTML files.

---

### Task 1: CSS alignment — all 6 guides

**Files:**
- Modify: `guides/architectures/overview.html`
- Modify: `guides/architectures/llm-chat.html`
- Modify: `guides/architectures/rag.html`
- Modify: `guides/architectures/workflows.html`
- Modify: `guides/architectures/agents.html`
- Modify: `guides/architectures/agentic-ai.html`

The same 6 CSS property values need updating in every file. The properties are in the `<style>` block near the top of each file (around lines 185–265). Current values and targets:

| Rule | Property | Current | Target |
|---|---|---|---|
| `.stage-header` | `font-size` | `28px` | `24px` |
| `.content-area` | `padding` | `32px 48px` | `24px 36px` |
| `.content-area` | `gap` | `30px` | `18px` |
| `.scene-card` | `padding` | `40px` | `28px` |
| `.insight-box` | `padding` | `24px` | `16px 20px` |
| `.insight-box` | `margin-top` | `24px` | `0` |

- [ ] **Step 1: Fix overview.html**

In `guides/architectures/overview.html`, apply all 6 edits above.

`.stage-header` block (around line 185):
```css
.stage-header {
  font-family: 'Fraunces', serif;
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}
```

`.content-area` block (around line 223):
```css
.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  scroll-behavior: smooth;
  padding: 24px 36px;
  gap: 18px;
}
```

`.scene-card` block (around line 239) — change only `padding`:
```css
padding: 28px;
```

`.insight-box` block (around line 252):
```css
.insight-box {
  background: #f0faf0;
  border-left: 4px solid #2ecc71;
  padding: 16px 20px;
  border-radius: 8px;
  color: #1a5e3a;
  font-size: 17px;
  line-height: 1.7;
  margin-top: 0;
  position: relative;
}
```

- [ ] **Step 2: Fix llm-chat.html**

Apply the same 6 edits to `guides/architectures/llm-chat.html` (same property names, same target values, same approximate line range).

- [ ] **Step 3: Fix rag.html**

Apply the same 6 edits to `guides/architectures/rag.html`.

- [ ] **Step 4: Fix workflows.html**

Apply the same 6 edits to `guides/architectures/workflows.html`.

- [ ] **Step 5: Fix agents.html**

Apply the same 6 edits to `guides/architectures/agents.html`.

- [ ] **Step 6: Fix agentic-ai.html**

Apply the same 6 edits to `guides/architectures/agentic-ai.html`.

- [ ] **Step 7: Verify visually**

Open each of the 6 files in a browser. Check that:
- Stage headers are slightly smaller and tighter than before
- Content area has reduced padding (content sits closer to the edges)
- Scene cards have less internal padding
- Insight boxes (green, at bottom of each stage) are compact with no large top gap

- [ ] **Step 8: Commit**

```bash
git add guides/architectures/overview.html guides/architectures/llm-chat.html guides/architectures/rag.html guides/architectures/workflows.html guides/architectures/agents.html guides/architectures/agentic-ai.html
git commit -m "fix module 5 CSS spacing to match module 1 standard"
```

---

### Task 2: overview.html — S1 and S2 diagrams

**Files:**
- Modify: `guides/architectures/overview.html`

Add two SVG diagram components. Each is a named function defined in the `<script type="text/babel">` block. Place each function immediately before the stage comment it belongs to (e.g. `/* Stage 1` or `function S1(`).

- [ ] **Step 1: Add S1Diagram (The Spectrum)**

Insert this function immediately before the Stage 1 function in `guides/architectures/overview.html`:

```jsx
function S1Diagram() {
  const nodes = [
    { label: 'LLM Chat',   analogy: 'Bicycle', color: '#6c5ce7', x: 60  },
    { label: 'RAG',        analogy: 'Car',     color: '#3498db', x: 165 },
    { label: 'Workflow',   analogy: 'Bus',     color: '#f39c12', x: 270 },
    { label: 'Agent',      analogy: 'Taxi',    color: '#e74c3c', x: 375 },
    { label: 'Agentic AI', analogy: 'Fleet',   color: '#e056a0', x: 480 },
  ];
  return (
    <svg width="540" height="110" viewBox="0 0 540 110"
      style={{ maxWidth: '100%', overflow: 'visible' }}
      aria-label="Architecture spectrum from simple to complex">
      <defs>
        <linearGradient id="specGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6c5ce7" />
          <stop offset="100%" stopColor="#e056a0" />
        </linearGradient>
      </defs>
      <text x="60" y="14" textAnchor="middle" fontSize="10" fontWeight="600" fill="#aaa" fontFamily="DM Sans">SIMPLE</text>
      <text x="480" y="14" textAnchor="middle" fontSize="10" fontWeight="600" fill="#aaa" fontFamily="DM Sans">COMPLEX</text>
      <line x1="60" y1="50" x2="480" y2="50" stroke="url(#specGrad)" strokeWidth="3" />
      {nodes.map(n => (
        <g key={n.label}>
          <circle cx={n.x} cy="50" r="20" fill={n.color} />
          <text x={n.x} y="82" textAnchor="middle" fontSize="11" fontWeight="600" fill="#1a1a1a" fontFamily="DM Sans">{n.label}</text>
          <text x={n.x} y="96" textAnchor="middle" fontSize="10" fill="#888" fontFamily="DM Sans">{n.analogy}</text>
        </g>
      ))}
    </svg>
  );
}
```

In the Stage 1 render (`S1` function), inside `<div className="scene-card">`, insert `<S1Diagram />` as the **first child**, before the existing `<div style={{ width: '100%' }}>`.

- [ ] **Step 2: Add S2Diagram (Simple Architectures)**

Insert this function immediately before the Stage 2 function:

```jsx
function S2Diagram() {
  const llmNodes = [
    { label: 'User',     bg: '#f5f3ff', color: '#6c5ce7', x: 70  },
    { label: 'LLM',      bg: '#6c5ce7', color: 'white',   x: 230 },
    { label: 'Response', bg: '#f5f3ff', color: '#6c5ce7', x: 390 },
  ];
  const ragNodes = [
    { label: 'User',   bg: '#e0f0ff', color: '#3498db', x: 40  },
    { label: 'Search', bg: '#3498db', color: 'white',   x: 140 },
    { label: 'Chunks', bg: '#e0f0ff', color: '#3498db', x: 240 },
    { label: 'LLM',    bg: '#3498db', color: 'white',   x: 340 },
    { label: 'Answer', bg: '#e0f0ff', color: '#3498db', x: 440 },
  ];
  return (
    <svg width="500" height="150" viewBox="0 0 500 150"
      style={{ maxWidth: '100%', overflow: 'visible', marginBottom: '16px' }}
      aria-label="LLM Chat vs RAG architecture comparison">
      <defs>
        <marker id="ovArrP" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0,8 3,0 6" fill="#6c5ce7" />
        </marker>
        <marker id="ovArrB" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0,8 3,0 6" fill="#3498db" />
        </marker>
      </defs>
      <text x="6" y="32" fontSize="11" fontWeight="700" fill="#6c5ce7" fontFamily="DM Sans">LLM Chat</text>
      {llmNodes.map((n, i, arr) => (
        <g key={n.label + 'l'}>
          <rect x={n.x - 45} y="40" width="90" height="30" rx="10" fill={n.bg} stroke="#6c5ce7" strokeWidth="1.5" />
          <text x={n.x} y="59" textAnchor="middle" fontSize="12" fontWeight="600" fill={n.color} fontFamily="DM Sans">{n.label}</text>
          {i < arr.length - 1 && (
            <line x1={n.x + 45} y1="55" x2={arr[i + 1].x - 45} y2="55"
              stroke="#6c5ce7" strokeWidth="2" markerEnd="url(#ovArrP)" />
          )}
        </g>
      ))}
      <line x1="0" y1="86" x2="500" y2="86" stroke="#e0e0e0" strokeWidth="1" strokeDasharray="4 4" />
      <text x="6" y="108" fontSize="11" fontWeight="700" fill="#3498db" fontFamily="DM Sans">RAG</text>
      {ragNodes.map((n, i, arr) => (
        <g key={n.label + 'r'}>
          <rect x={n.x - 38} y="114" width="76" height="28" rx="8" fill={n.bg} stroke="#3498db" strokeWidth="1.5" />
          <text x={n.x} y="132" textAnchor="middle" fontSize="11" fontWeight="600" fill={n.color} fontFamily="DM Sans">{n.label}</text>
          {i < arr.length - 1 && (
            <line x1={n.x + 38} y1="128" x2={arr[i + 1].x - 38} y2="128"
              stroke="#3498db" strokeWidth="2" markerEnd="url(#ovArrB)" />
          )}
        </g>
      ))}
    </svg>
  );
}
```

In the Stage 2 render (`S2` function), inside `<div className="scene-card">`, insert `<S2Diagram />` as the **first child**, before the existing `<div style={{ width: '100%' }}>` containing the tab buttons.

- [ ] **Step 3: Verify**

Open `guides/architectures/overview.html` in browser.
- Stage 1 (The Spectrum): A gradient line with 5 colored circles (violet → blue → orange → red → pink) labeled with arch name and analogy should appear **above** the interactive spectrum cards.
- Stage 2 (Simple Architectures): A two-lane flow comparison SVG (LLM Chat purple 3-node / RAG blue 5-node, separated by a dashed line) should appear **above** the tab buttons.

- [ ] **Step 4: Commit**

```bash
git add guides/architectures/overview.html
git commit -m "add SVG scene diagrams to overview.html stages 1 and 2"
```

---

### Task 3: llm-chat.html — S1 and S3 diagrams

**Files:**
- Modify: `guides/architectures/llm-chat.html`

- [ ] **Step 1: Add S1Diagram (What is LLM Chat?)**

Insert this function immediately before the Stage 1 function in `guides/architectures/llm-chat.html`:

```jsx
function S1Diagram() {
  return (
    <svg width="480" height="130" viewBox="0 0 480 130"
      style={{ maxWidth: '100%', overflow: 'visible', marginBottom: '20px' }}
      aria-label="LLM Chat architecture: User prompt goes to LLM trained on data, response generated without external lookups">
      <defs>
        <marker id="lcArr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0,8 3,0 6" fill="#6c5ce7" />
        </marker>
      </defs>
      {/* User */}
      <rect x="10" y="48" width="90" height="36" rx="10" fill="#f5f3ff" stroke="#6c5ce7" strokeWidth="1.5" />
      <text x="55" y="70" textAnchor="middle" fontSize="12" fontWeight="600" fill="#6c5ce7" fontFamily="DM Sans">User</text>
      <line x1="100" y1="66" x2="154" y2="66" stroke="#6c5ce7" strokeWidth="2" markerEnd="url(#lcArr)" />
      {/* LLM */}
      <rect x="155" y="42" width="120" height="48" rx="12" fill="#6c5ce7" />
      <text x="215" y="63" textAnchor="middle" fontSize="13" fontWeight="700" fill="white" fontFamily="DM Sans">LLM</text>
      <text x="215" y="80" textAnchor="middle" fontSize="10" fill="#d4ccff" fontFamily="DM Sans">billions of params</text>
      {/* Training data arc */}
      <path d="M 160 48 Q 215 8 275 48" fill="none" stroke="#b0a6e8" strokeWidth="1.5" strokeDasharray="4 4" />
      <text x="215" y="20" textAnchor="middle" fontSize="10" fill="#b0a6e8" fontFamily="DM Sans">training data</text>
      <line x1="275" y1="66" x2="329" y2="66" stroke="#6c5ce7" strokeWidth="2" markerEnd="url(#lcArr)" />
      {/* Response */}
      <rect x="330" y="48" width="110" height="36" rx="10" fill="#f5f3ff" stroke="#6c5ce7" strokeWidth="1.5" />
      <text x="385" y="70" textAnchor="middle" fontSize="12" fontWeight="600" fill="#6c5ce7" fontFamily="DM Sans">Response</text>
      {/* Footer note */}
      <text x="240" y="112" textAnchor="middle" fontSize="10" fill="#aaa" fontFamily="DM Sans">no database · no web search · no tools</text>
    </svg>
  );
}
```

In the Stage 1 render (`S1` function), inside `<div className="scene-card">`, insert `<S1Diagram />` as the **first child**, before the existing `<div className="chat-container">`.

- [ ] **Step 2: Add S3Diagram (Why It's Underrated)**

Insert this function immediately before the Stage 3 function:

```jsx
function S3Diagram() {
  return (
    <svg width="460" height="140" viewBox="0 0 460 140"
      style={{ maxWidth: '100%', overflow: 'visible', marginBottom: '20px' }}
      aria-label="Ship Day 1 with a well-crafted prompt versus ship in a quarter building RAG">
      <defs>
        <marker id="lcArrG" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0,8 3,0 6" fill="#2ecc71" />
        </marker>
        <marker id="lcArrO" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0,8 3,0 6" fill="#f39c12" />
        </marker>
      </defs>
      {/* Divider */}
      <line x1="230" y1="8" x2="230" y2="132" stroke="#e0e0e0" strokeWidth="1" strokeDasharray="4 4" />
      {/* Left: Ship Day 1 */}
      <text x="115" y="22" textAnchor="middle" fontSize="12" fontWeight="700" fill="#2ecc71" fontFamily="DM Sans">Ship Day 1</text>
      <rect x="20" y="36" width="90" height="30" rx="10" fill="#e8f8f0" stroke="#2ecc71" strokeWidth="1.5" />
      <text x="65" y="55" textAnchor="middle" fontSize="11" fontWeight="600" fill="#2ecc71" fontFamily="DM Sans">Prompt</text>
      <line x1="110" y1="51" x2="168" y2="51" stroke="#2ecc71" strokeWidth="2" markerEnd="url(#lcArrG)" />
      <rect x="168" y="36" width="44" height="30" rx="10" fill="#2ecc71" />
      <text x="190" y="55" textAnchor="middle" fontSize="14" fontWeight="700" fill="white" fontFamily="DM Sans">✓</text>
      <text x="115" y="88" textAnchor="middle" fontSize="10" fill="#666" fontFamily="DM Sans">1 day · low cost</text>
      {/* Right: Ship in a Quarter */}
      <text x="345" y="22" textAnchor="middle" fontSize="12" fontWeight="700" fill="#f39c12" fontFamily="DM Sans">Ship in a Quarter</text>
      {[
        { label: 'Embed docs',   y: 34 },
        { label: 'Vector DB',    y: 64 },
        { label: 'RAG pipeline', y: 94 },
      ].map((s, i, arr) => (
        <g key={s.label}>
          <rect x="248" y={s.y} width="106" height="24" rx="6" fill="#fff8e1" stroke="#f39c12" strokeWidth="1.5" />
          <text x="301" y={s.y + 15} textAnchor="middle" fontSize="10" fontWeight="600" fill="#f39c12" fontFamily="DM Sans">{s.label}</text>
          {i < arr.length - 1 && (
            <line x1="301" y1={s.y + 24} x2="301" y2={arr[i + 1].y} stroke="#f39c12" strokeWidth="1.5" markerEnd="url(#lcArrO)" />
          )}
        </g>
      ))}
      <line x1="354" y1="106" x2="396" y2="106" stroke="#f39c12" strokeWidth="2" markerEnd="url(#lcArrO)" />
      <rect x="396" y="94" width="44" height="24" rx="8" fill="#f39c12" />
      <text x="418" y="110" textAnchor="middle" fontSize="14" fontWeight="700" fill="white" fontFamily="DM Sans">✓</text>
      <text x="345" y="132" textAnchor="middle" fontSize="10" fill="#666" fontFamily="DM Sans">90 days · significant cost</text>
    </svg>
  );
}
```

In the Stage 3 render (`S3` function), inside `<div className="scene-card">`, insert `<S3Diagram />` as the **first child**.

- [ ] **Step 3: Verify**

Open `guides/architectures/llm-chat.html` in browser.
- Stage 1: Architecture SVG (User → LLM → Response with training data arc) appears above the chat demo widget.
- Stage 3: Two-column comparison SVG (Day 1 prompt vs 90-day RAG) appears above the technique table.

- [ ] **Step 4: Commit**

```bash
git add guides/architectures/llm-chat.html
git commit -m "add SVG scene diagrams to llm-chat.html stages 1 and 3"
```

---

### Task 4: rag.html — S1, S2, and S3 diagrams

**Files:**
- Modify: `guides/architectures/rag.html`

- [ ] **Step 1: Add S1Diagram (What is RAG?)**

Insert this function immediately before the Stage 1 function in `guides/architectures/rag.html`:

```jsx
function S1Diagram() {
  return (
    <svg width="480" height="140" viewBox="0 0 480 140"
      style={{ maxWidth: '100%', overflow: 'visible', marginBottom: '20px' }}
      aria-label="Before RAG: LLM alone risks hallucination. After RAG: document retrieval grounds the answer">
      <defs>
        <marker id="ragArrR" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0,8 3,0 6" fill="#e74c3c" />
        </marker>
        <marker id="ragArrG" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0,8 3,0 6" fill="#2ecc71" />
        </marker>
      </defs>
      <text x="112" y="18" textAnchor="middle" fontSize="12" fontWeight="700" fill="#e74c3c" fontFamily="DM Sans">Before RAG</text>
      <text x="362" y="18" textAnchor="middle" fontSize="12" fontWeight="700" fill="#2ecc71" fontFamily="DM Sans">After RAG</text>
      <line x1="240" y1="8" x2="240" y2="140" stroke="#e0e0e0" strokeWidth="1" strokeDasharray="4 4" />
      {/* Before: User → LLM → ⚠ */}
      <rect x="18" y="32" width="70" height="30" rx="10" fill="#fdf2f2" stroke="#e74c3c" strokeWidth="1.5" />
      <text x="53" y="51" textAnchor="middle" fontSize="11" fontWeight="600" fill="#e74c3c" fontFamily="DM Sans">User</text>
      <line x1="88" y1="47" x2="116" y2="47" stroke="#e74c3c" strokeWidth="2" markerEnd="url(#ragArrR)" />
      <rect x="116" y="32" width="70" height="30" rx="10" fill="#e74c3c" />
      <text x="151" y="51" textAnchor="middle" fontSize="11" fontWeight="700" fill="white" fontFamily="DM Sans">LLM</text>
      <line x1="186" y1="47" x2="206" y2="47" stroke="#e74c3c" strokeWidth="2" markerEnd="url(#ragArrR)" />
      <rect x="206" y="32" width="28" height="30" rx="8" fill="#fdf2f2" stroke="#e74c3c" strokeWidth="1.5" />
      <text x="220" y="51" textAnchor="middle" fontSize="16" fontFamily="DM Sans">⚠</text>
      <text x="112" y="88" textAnchor="middle" fontSize="10" fontWeight="600" fill="#e74c3c" fontFamily="DM Sans">Hallucination risk</text>
      <text x="112" y="103" textAnchor="middle" fontSize="10" fill="#888" fontFamily="DM Sans">answers from memory only</text>
      {/* After: User → Docs → LLM → ✓ */}
      <rect x="252" y="32" width="60" height="30" rx="10" fill="#e8f8f0" stroke="#2ecc71" strokeWidth="1.5" />
      <text x="282" y="51" textAnchor="middle" fontSize="11" fontWeight="600" fill="#2ecc71" fontFamily="DM Sans">User</text>
      <line x1="312" y1="47" x2="330" y2="47" stroke="#2ecc71" strokeWidth="2" markerEnd="url(#ragArrG)" />
      <rect x="330" y="32" width="60" height="30" rx="10" fill="#e8f8f0" stroke="#2ecc71" strokeWidth="1.5" />
      <text x="360" y="51" textAnchor="middle" fontSize="11" fontWeight="600" fill="#2ecc71" fontFamily="DM Sans">Docs</text>
      <line x1="390" y1="47" x2="408" y2="47" stroke="#2ecc71" strokeWidth="2" markerEnd="url(#ragArrG)" />
      <rect x="408" y="32" width="54" height="30" rx="10" fill="#2ecc71" />
      <text x="435" y="51" textAnchor="middle" fontSize="11" fontWeight="700" fill="white" fontFamily="DM Sans">LLM</text>
      <text x="362" y="88" textAnchor="middle" fontSize="10" fontWeight="600" fill="#2ecc71" fontFamily="DM Sans">✓ Grounded answer</text>
      <text x="362" y="103" textAnchor="middle" fontSize="10" fill="#888" fontFamily="DM Sans">70–90% fewer hallucinations</text>
    </svg>
  );
}
```

In the Stage 1 render, inside `<div className="scene-card">`, insert `<S1Diagram />` as the **first child**.

- [ ] **Step 2: Add S2Diagram (The Five Components)**

Insert this function immediately before the Stage 2 function:

```jsx
function S2Diagram() {
  const steps = [
    { label: 'Document\nLoader', icon: '📄', color: '#6c5ce7', bg: '#f5f3ff', x: 16  },
    { label: 'Chunker',          icon: '✂️',  color: '#3498db', bg: '#e0f0ff', x: 108 },
    { label: 'Embeddings',       icon: '🧮',  color: '#f39c12', bg: '#fff8e1', x: 200 },
    { label: 'Vector DB',        icon: '🗃️',  color: '#e74c3c', bg: '#fdf2f2', x: 292 },
    { label: 'LLM\nSynthesis',   icon: '🤖',  color: '#2ecc71', bg: '#e8f8f0', x: 384 },
  ];
  return (
    <svg width="476" height="110" viewBox="0 0 476 110"
      style={{ maxWidth: '100%', overflow: 'visible', marginBottom: '20px' }}
      aria-label="RAG five-component pipeline: Document Loader, Chunker, Embeddings, Vector DB, LLM Synthesis">
      <defs>
        {steps.slice(0, -1).map((s, i) => (
          <marker key={i} id={`rComp${i}`} markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0,8 3,0 6" fill={s.color} />
          </marker>
        ))}
      </defs>
      {steps.map((s, i, arr) => {
        const lines = s.label.split('\n');
        return (
          <g key={s.label}>
            <rect x={s.x} y="16" width="80" height="76" rx="10" fill={s.bg} stroke={s.color} strokeWidth="1.5" />
            <text x={s.x + 40} y="42" textAnchor="middle" fontSize="20" fontFamily="DM Sans">{s.icon}</text>
            {lines.map((line, li) => (
              <text key={li} x={s.x + 40} y={62 + li * 14} textAnchor="middle"
                fontSize="10" fontWeight="600" fill={s.color} fontFamily="DM Sans">{line}</text>
            ))}
            {i < arr.length - 1 && (
              <line x1={s.x + 80} y1="54" x2={arr[i + 1].x} y2="54"
                stroke={s.color} strokeWidth="2" markerEnd={`url(#rComp${i})`} />
            )}
          </g>
        );
      })}
    </svg>
  );
}
```

In the Stage 2 render, inside `<div className="scene-card">`, insert `<S2Diagram />` as the **first child**.

- [ ] **Step 3: Add S3Diagram (Under the Hood)**

Insert this function immediately before the Stage 3 function:

```jsx
function S3Diagram() {
  const steps = [
    { label: 'Query',   color: '#6c5ce7', bg: '#f5f3ff' },
    { label: 'Embed',   color: '#3498db', bg: '#e0f0ff' },
    { label: 'Search',  color: '#f39c12', bg: '#fff8e1' },
    { label: 'Top-K',   color: '#e74c3c', bg: '#fdf2f2' },
    { label: 'Context', color: '#6c5ce7', bg: '#f5f3ff' },
    { label: 'LLM',     color: '#6c5ce7', bg: '#6c5ce7' },
    { label: 'Answer',  color: '#2ecc71', bg: '#e8f8f0' },
  ];
  const nodeW = 60, gap = 14;
  const totalW = steps.length * nodeW + (steps.length - 1) * gap;
  return (
    <svg width={totalW} height="76" viewBox={`0 0 ${totalW} 76`}
      style={{ maxWidth: '100%', overflow: 'visible', marginBottom: '20px' }}
      aria-label="RAG query processing flow from Query through Embedding, Vector Search, Top-K retrieval, Context Assembly, LLM, to Answer">
      <defs>
        {steps.slice(0, -1).map((s, i) => (
          <marker key={i} id={`rFlow${i}`} markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0,8 3,0 6" fill={s.color} />
          </marker>
        ))}
      </defs>
      {steps.map((s, i, arr) => {
        const x = i * (nodeW + gap);
        const isLLM = s.label === 'LLM';
        return (
          <g key={s.label}>
            <rect x={x} y="18" width={nodeW} height="32" rx="10"
              fill={isLLM ? '#6c5ce7' : s.bg} stroke={s.color} strokeWidth="1.5" />
            <text x={x + nodeW / 2} y="38" textAnchor="middle"
              fontSize="11" fontWeight="600" fill={isLLM ? 'white' : s.color} fontFamily="DM Sans">{s.label}</text>
            {i < arr.length - 1 && (
              <line x1={x + nodeW} y1="34" x2={x + nodeW + gap} y2="34"
                stroke={s.color} strokeWidth="2" markerEnd={`url(#rFlow${i})`} />
            )}
          </g>
        );
      })}
    </svg>
  );
}
```

In the Stage 3 render, inside `<div className="scene-card">`, insert `<S3Diagram />` as the **first child**.

- [ ] **Step 4: Verify**

Open `guides/architectures/rag.html` in browser.
- Stage 1: Before/After RAG split SVG appears above the existing content.
- Stage 2: 5-component pipeline SVG with emoji icons appears above the component cards.
- Stage 3: 7-step query flow SVG appears above the step-by-step retrieval content.

- [ ] **Step 5: Commit**

```bash
git add guides/architectures/rag.html
git commit -m "add SVG scene diagrams to rag.html stages 1, 2, and 3"
```

---

### Task 5: workflows.html — audit S1 SVG + add S4 diagram

**Files:**
- Modify: `guides/architectures/workflows.html`

- [ ] **Step 1: Audit AssemblyLineSVG**

Find the `AssemblyLineSVG` function in `guides/architectures/workflows.html` (around line 720). Check every `<text>` element inside it — add `fontFamily="DM Sans"` to any that are missing it. The `fontFamily` attribute in JSX SVG goes directly on the `<text>` element:

```jsx
<text x={x} y="60" textAnchor="middle" fontSize="13" fontWeight="700" fill={s.color} fontFamily="DM Sans">
  {s.label}
</text>
```

Confirm station node `rx="8"` and `strokeWidth="2"` — these should already be correct. No other changes needed to this function.

- [ ] **Step 2: Add S4Diagram (Workflow vs Agent)**

Find the Stage 4 function in `guides/architectures/workflows.html` (the one with `stage-header` text "Workflow vs Agent") and insert this function immediately before it:

```jsx
function S4Diagram() {
  return (
    <svg width="480" height="168" viewBox="0 0 480 168"
      style={{ maxWidth: '100%', overflow: 'visible', marginBottom: '20px' }}
      aria-label="Workflow fixed predictable path versus Agent adaptive dynamic decision-making">
      <defs>
        <marker id="wfArrP" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0,8 3,0 6" fill="#6c5ce7" />
        </marker>
        <marker id="wfArrO" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0,8 3,0 6" fill="#f39c12" />
        </marker>
        <marker id="wfArrG" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0,8 3,0 6" fill="#2ecc71" />
        </marker>
      </defs>
      {/* Divider */}
      <line x1="240" y1="8" x2="240" y2="160" stroke="#e0e0e0" strokeWidth="1" strokeDasharray="4 4" />
      {/* Workflow: fixed path */}
      <text x="112" y="22" textAnchor="middle" fontSize="12" fontWeight="700" fill="#6c5ce7" fontFamily="DM Sans">Workflow</text>
      <text x="112" y="36" textAnchor="middle" fontSize="10" fill="#888" fontFamily="DM Sans">Predictable · Fixed</text>
      {['A', 'B', 'C', 'D'].map((lbl, i) => (
        <g key={lbl}>
          <rect x={10 + i * 52} y="48" width="40" height="36" rx="10"
            fill="#f5f3ff" stroke="#6c5ce7" strokeWidth="1.5" />
          <text x={30 + i * 52} y="71" textAnchor="middle" fontSize="14"
            fontWeight="700" fill="#6c5ce7" fontFamily="DM Sans">{lbl}</text>
          {i < 3 && (
            <line x1={50 + i * 52} y1="66" x2={60 + i * 52} y2="66"
              stroke="#6c5ce7" strokeWidth="2" markerEnd="url(#wfArrP)" />
          )}
        </g>
      ))}
      <text x="112" y="110" textAnchor="middle" fontSize="20" fontFamily="DM Sans">🔒</text>
      <text x="112" y="128" textAnchor="middle" fontSize="10" fill="#888" fontFamily="DM Sans">path fixed at design time</text>
      {/* Agent: dynamic decisions */}
      <text x="362" y="22" textAnchor="middle" fontSize="12" fontWeight="700" fill="#f39c12" fontFamily="DM Sans">Agent</text>
      <text x="362" y="36" textAnchor="middle" fontSize="10" fill="#888" fontFamily="DM Sans">Adaptive · Dynamic</text>
      <circle cx="362" cy="84" r="26" fill="#f39c12" />
      <text x="362" y="89" textAnchor="middle" fontSize="12" fontWeight="700" fill="white" fontFamily="DM Sans">Agent</text>
      {/* Outgoing branches */}
      <line x1="338" y1="70" x2="302" y2="52" stroke="#f39c12" strokeWidth="1.5" markerEnd="url(#wfArrO)" />
      <line x1="336" y1="84" x2="296" y2="84" stroke="#f39c12" strokeWidth="1.5" markerEnd="url(#wfArrO)" />
      <line x1="362" y1="110" x2="362" y2="132" stroke="#2ecc71" strokeWidth="2" markerEnd="url(#wfArrG)" />
      {/* Loop back */}
      <path d="M 387 70 Q 428 52 428 84 Q 428 114 387 98"
        fill="none" stroke="#f39c12" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#wfArrO)" />
      <text x="436" y="87" textAnchor="middle" fontSize="9" fill="#f39c12" fontFamily="DM Sans">loop</text>
      <text x="362" y="148" textAnchor="middle" fontSize="10" fill="#888" fontFamily="DM Sans">decides next step at runtime</text>
    </svg>
  );
}
```

In the Stage 4 render, inside `<div className="scene-card">`, insert `<S4Diagram />` as the **first child**.

- [ ] **Step 3: Verify**

Open `guides/architectures/workflows.html` in browser.
- Stage 1: AssemblyLineSVG animates correctly (conveyor belt, animated arrows).
- Stage 4: Workflow vs Agent comparison SVG appears above the existing comparison content. Left side shows A→B→C→D locked path, right side shows orange Agent node with branches and loop.

- [ ] **Step 4: Commit**

```bash
git add guides/architectures/workflows.html
git commit -m "audit AssemblyLineSVG and add S4 comparison diagram to workflows.html"
```

---

### Task 6: agents.html — audit S1/S3 + add S2 diagram

**Files:**
- Modify: `guides/architectures/agents.html`

- [ ] **Step 1: Audit S1 hub-and-spoke SVG**

Find the SVG inside Stage 1 (`S1` function, around line 706). Make these corrections:
1. Add `aria-label="AI Agent hub connected to Web Search, Calculator, Code Exec, and File System tools"` to the `<svg>` opening tag.
2. Check all `<text>` elements — add `fontFamily="DM Sans"` to any missing it (the existing text elements already have `fontFamily="DM Sans"` — confirm and add if any are missing).
3. The dashed lines currently use `strokeDasharray="4,3"` (comma-separated) — change to `strokeDasharray="4 3"` (space-separated) for consistency with the visual language standard. There are 4 such lines.

- [ ] **Step 2: Audit S3 ReAct loop SVG**

Find the SVG inside Stage 3 (`S3` function, around line 849). Make these corrections:
1. Add `aria-label="ReAct loop: Thought to Action to Observation, repeating until done"` to the `<svg>` opening tag.
2. Check all `<text>` elements for `fontFamily="DM Sans"` — add where missing.
3. The dashed feedback arc uses `strokeDasharray="4,3"` — change to `strokeDasharray="4 3"`.

- [ ] **Step 3: Add S2Diagram (Three Core Capabilities triangle)**

Insert this function immediately before the Stage 2 function:

```jsx
function S2Diagram() {
  const vertices = [
    { label: 'Reasoning', icon: '🧠', cx: 200, cy: 32,  color: '#6c5ce7', bg: '#f5f3ff' },
    { label: 'Tool Use',  icon: '🔧', cx: 66,  cy: 240, color: '#3498db', bg: '#e0f0ff' },
    { label: 'Memory',    icon: '🧩', cx: 334, cy: 240, color: '#f39c12', bg: '#fff8e1' },
  ];
  const center = { cx: 200, cy: 172 };
  const edgeLabels = [
    { lx: 100, ly: 118, text: "can't adapt"    },
    { lx: 300, ly: 118, text: "can't act"      },
    { lx: 200, ly: 268, text: 'forgets mid-task' },
  ];
  const edges = [
    [0, 1], [0, 2], [1, 2],
  ];
  return (
    <svg width="400" height="290" viewBox="0 0 400 290"
      style={{ maxWidth: '100%', overflow: 'visible', marginBottom: '16px' }}
      aria-label="Three core agent capabilities triangle: Reasoning at top, Tool Use at bottom-left, Memory at bottom-right, Agent at center">
      {/* Triangle edges */}
      {edges.map(([a, b], i) => (
        <line key={i}
          x1={vertices[a].cx} y1={vertices[a].cy}
          x2={vertices[b].cx} y2={vertices[b].cy}
          stroke="#e0e0e0" strokeWidth="2" strokeDasharray="4 4" />
      ))}
      {/* Edge labels */}
      {edgeLabels.map((e, i) => (
        <text key={i} x={e.lx} y={e.ly} textAnchor="middle"
          fontSize="10" fill="#ccc" fontFamily="DM Sans">{e.text}</text>
      ))}
      {/* Spokes from center to vertices */}
      {vertices.map(v => {
        const dx = v.cx - center.cx, dy = v.cy - center.cy;
        const len = Math.sqrt(dx * dx + dy * dy);
        const x1 = center.cx + (dx / len) * 28;
        const y1 = center.cy + (dy / len) * 28;
        const x2 = v.cx - (dx / len) * 34;
        const y2 = v.cy - (dy / len) * 34;
        return (
          <line key={v.label} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={v.color} strokeWidth="1.5" strokeDasharray="4 4" />
        );
      })}
      {/* Vertex nodes */}
      {vertices.map(v => (
        <g key={v.label}>
          <circle cx={v.cx} cy={v.cy} r="34" fill={v.bg} stroke={v.color} strokeWidth="2" />
          <text x={v.cx} y={v.cy - 8} textAnchor="middle" fontSize="16" fontFamily="DM Sans">{v.icon}</text>
          <text x={v.cx} y={v.cy + 10} textAnchor="middle"
            fontSize="11" fontWeight="600" fill={v.color} fontFamily="DM Sans">{v.label}</text>
        </g>
      ))}
      {/* Center Agent node */}
      <circle cx={center.cx} cy={center.cy} r="28" fill="#6c5ce7" />
      <text x={center.cx} y={center.cy + 5} textAnchor="middle"
        fontSize="12" fontWeight="700" fill="white" fontFamily="DM Sans">Agent</text>
    </svg>
  );
}
```

In the Stage 2 render (`S2` function), inside `<div className="scene-card">`, insert `<S2Diagram />` as the **first child**, before the existing `<div className="capability-grid">`.

- [ ] **Step 4: Verify**

Open `guides/architectures/agents.html` in browser.
- Stage 1: Hub-and-spoke SVG renders with `aria-label` and space-separated `strokeDasharray`.
- Stage 2: Triangle diagram (Reasoning/Tool Use/Memory vertices with Agent center) appears above the capability click-cards.
- Stage 3: ReAct loop SVG renders with `aria-label`.

- [ ] **Step 5: Commit**

```bash
git add guides/architectures/agents.html
git commit -m "audit S1/S3 SVGs and add S2 triangle diagram to agents.html"
```

---

### Task 7: agentic-ai.html — audit S1/S3 + add S6 diagram

**Files:**
- Modify: `guides/architectures/agentic-ai.html`

- [ ] **Step 1: Audit S1 interactive agent network SVG**

Find the SVG inside Stage 1 (`S1` function, around line 687). It is a dynamic SVG with `connections.map(...)` and `agents.map(...)`. Make these corrections:
1. Locate the `<svg viewBox="0 0 400 310" style={{ ... }}>` tag and add `aria-label="Interactive multi-agent network diagram"` to it.
2. Confirm the connection lines use `strokeWidth={isActive ? 3 : 1.5}` — if `1.5` is not used, change to `1.5`.
3. Confirm inactive stroke color is `'#d0d0d0'` and active is `'#6c5ce7'` — correct if different.

- [ ] **Step 2: Audit S3 product launch pipeline SVG**

Find the SVG inside Stage 3 (`S3` function, around line 857). Make these corrections:
1. Add `aria-label="Product launch pipeline: Research, Writing, Editing, Publishing agents with supervisor oversight"` to the `<svg>` opening tag.
2. The supervisor arc uses `strokeDasharray="6 4"` — confirm it is space-separated (not `"6,4"`). Change if comma-separated.
3. Confirm pipeline rect stroke widths: `strokeWidth={isActive ? 3 : 2}` — confirm both values are present.

- [ ] **Step 3: Add S6Diagram (When to Use Agentic AI)**

Find the Stage 6 function in `guides/architectures/agentic-ai.html` (the one with `stage-header` text "When to Use Agentic AI", around line 1106). Insert this function immediately before it:

```jsx
function S6Diagram() {
  const quadrants = [
    { label: 'Workflow',     x: 54,  y: 48,  color: '#6c5ce7', bg: '#f5f3ff' },
    { label: 'Agentic AI',  x: 214, y: 48,  color: '#e056a0', bg: '#fdf0f7' },
    { label: 'RAG + Agent', x: 54,  y: 158, color: '#3498db', bg: '#e0f0ff' },
    { label: 'Single Agent',x: 214, y: 158, color: '#f39c12', bg: '#fff8e1' },
  ];
  return (
    <svg width="400" height="290" viewBox="0 0 400 290"
      style={{ maxWidth: '100%', overflow: 'visible', marginBottom: '20px' }}
      aria-label="2x2 decision matrix for choosing architecture: axes are Task Complexity and Uncertainty">
      <defs>
        <marker id="axisArr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0,8 3,0 6" fill="#ccc" />
        </marker>
      </defs>
      {/* Axes */}
      <line x1="44" y1="256" x2="390" y2="256" stroke="#ccc" strokeWidth="2" markerEnd="url(#axisArr)" />
      <line x1="44" y1="256" x2="44" y2="22" stroke="#ccc" strokeWidth="2" markerEnd="url(#axisArr)" />
      {/* Axis labels */}
      <text x="217" y="276" textAnchor="middle" fontSize="11" fontWeight="600" fill="#888" fontFamily="DM Sans">Task Complexity →</text>
      <text x="14" y="140" textAnchor="middle" fontSize="11" fontWeight="600" fill="#888"
        fontFamily="DM Sans" transform="rotate(-90 14 140)">Uncertainty →</text>
      {/* Crosshair */}
      <line x1="214" y1="22" x2="214" y2="256" stroke="#e8e8e8" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="44" y1="148" x2="390" y2="148" stroke="#e8e8e8" strokeWidth="1" strokeDasharray="4 4" />
      {/* Tick labels */}
      <text x="129" y="270" textAnchor="middle" fontSize="10" fill="#bbb" fontFamily="DM Sans">Low</text>
      <text x="302" y="270" textAnchor="middle" fontSize="10" fill="#bbb" fontFamily="DM Sans">High</text>
      <text x="32" y="216" textAnchor="middle" fontSize="10" fill="#bbb" fontFamily="DM Sans">Low</text>
      <text x="32" y="68" textAnchor="middle" fontSize="10" fill="#bbb" fontFamily="DM Sans">High</text>
      {/* Quadrant boxes */}
      {quadrants.map(q => (
        <g key={q.label}>
          <rect x={q.x} y={q.y} width="148" height="88" rx="12"
            fill={q.bg} stroke={q.color} strokeWidth="2" />
          <text x={q.x + 74} y={q.y + 48} textAnchor="middle"
            fontSize="13" fontWeight="700" fill={q.color} fontFamily="DM Sans">{q.label}</text>
        </g>
      ))}
    </svg>
  );
}
```

In the Stage 6 render, inside `<div className="scene-card">` (or the outermost wrapper inside `return (<> ...)`), insert `<S6Diagram />` as the **first child**.

- [ ] **Step 4: Verify**

Open `guides/architectures/agentic-ai.html` in browser.
- Stage 1: Interactive network SVG has `aria-label`, connection strokes correct on hover/click.
- Stage 3: Animated pipeline SVG plays correctly with supervisor arc.
- Stage 6: 2×2 decision matrix SVG (Workflow / Agentic AI / RAG+Agent / Single Agent quadrants) appears above the existing content.

- [ ] **Step 5: Commit**

```bash
git add guides/architectures/agentic-ai.html
git commit -m "audit S1/S3 SVGs and add S6 decision matrix to agentic-ai.html"
```
