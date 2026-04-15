# Phase 3 — Content Consolidation Design

**Date:** 2026-04-15
**Parent plan:** `docs/superpowers/plans/2026-04-15-phase-1-foundations.md` (Phase 3 of 6)
**Goal:** Eliminate broken references, retire redundant framework framing, and trim overview duplication — without adding new content.

---

## Context

The platform shipped Phase 1 (shared CSS extraction, accessibility baseline, meta/OG) and Phase 2 (text overflow + navigation polish) to `main`. Phase 3 is the consolidation phase: reduce redundancy so the shipped material is coherent. It is *not* a content-addition phase (Phase 4 adds new guides).

Three workstreams surfaced during brainstorming. Each is independent and mergeable alone.

---

## Workstream 1 — RAG documentation cleanup

### Problem

`docs/rag-explainer.html` and `docs/rag-internals.html` do not exist but are linked from:

1. `index.html:653-654` — "Supplementary Resources" sidebar on the landing page
2. `docs/index.html:115,123` — a 134-line standalone landing page built to host the two missing HTML files

Additionally, `docs/rag-explainer.jsx` (427 lines) is an orphan React source file that was never compiled to HTML. `CLAUDE.md:54` also references the two missing files as if they were production assets.

`guides/architectures/rag.html` (1493 lines, 6 stages) is the canonical RAG guide and subsumes the content the orphan JSX would have delivered.

### Changes

| File | Action | Notes |
|---|---|---|
| `docs/rag-explainer.jsx` | Delete | Orphan; never built |
| `docs/index.html` | Delete | Landing page for two non-existent guides |
| `index.html` | Modify lines 653–654 | Remove the two `<a>` tags (RAG Explainer, RAG Under the Hood). If the containing "Supplementary Resources" block becomes empty, delete the block entirely |
| `CLAUDE.md` | Modify line 54 | Rewrite the sentence to drop the two filenames; keep the mention of the curriculum markdown and `GenAI Concepts .md` |

### Success criteria

- `grep -r "rag-explainer\|rag-internals" .` returns zero matches after this workstream
- Landing page renders without the two broken links
- No functional RAG content is lost (`architectures/rag.html` is the sole source)

### Risk

Low. All removals are of non-functional references.

---

## Workstream 2 — Retire CRAFT, consolidate on COSTAR

### Problem

`docs/14-Day-Generative-AI-Training-Curriculum.md` Day 3 teaches the **CRAFT** framework (5 letters: Context, Role, Ask, Format, Tone). But `guides/prompt-engineering/costar-meta.html` is the actual interactive guide learners use, and it teaches **COSTAR** (6 letters: Context, Objective, Style, Tone, Audience, Response).

The curriculum doc is out of sync with the shipped guide. Teaching both creates cognitive cost for negligible benefit — the frameworks differ in letter choice, not substance.

### Changes (one file: `docs/14-Day-Generative-AI-Training-Curriculum.md`)

1. **Day 3 section (lines 61–83)**
   - Section title: `## Day 3: The CRAFT Prompting Framework` → `## Day 3: The COSTAR Prompting Framework`
   - Rewrite the objective line to reference COSTAR
   - Rewrite agenda table rows on lines 68–70 that mention CRAFT
   - Replace the CRAFT framework table (lines 73–81) with a COSTAR framework table: rows for Context / Objective / Style / Tone / Audience / Response, with descriptions and examples that match the shipped guide
   - Add an inline link to `guides/prompt-engineering/costar-meta.html` so facilitators can open the interactive guide during the session
   - Homework line (line 83): `one CRAFT prompt` → `one COSTAR prompt`

2. **Syllabus overview table (line 676)**
   - Cell: `CRAFT Prompting Framework` → `COSTAR Prompting Framework`

3. **Facilitator Resources (line 708)**
   - List item: `CRAFT Framework card (printable)` → `COSTAR Framework card (printable)`

4. **Key Frameworks Summary section (lines 717–)**
   - Replace the CRAFT table with a COSTAR table
   - Add one-line footnote after the table: *"CRAFT (Context, Role, Ask, Format, Tone) is a similar 5-letter variant you may encounter elsewhere; COSTAR covers the same ground plus Audience + Response."*

### Success criteria

- `grep -n "CRAFT\|C\.R\.A\.F\.T" docs/14-Day-Generative-AI-Training-Curriculum.md` returns only the single footnote line
- Day 3's agenda, homework, and framework table all reference COSTAR
- The COSTAR table in the curriculum matches the framework taught in `costar-meta.html` (same 6 letters, same meaning)
- At least one link to `guides/prompt-engineering/costar-meta.html` appears in Day 3

### Out of scope

- Edits to `costar-meta.html` itself (it already teaches COSTAR correctly)
- CRAFT content anywhere else (it only lives in this one doc)

### Risk

Low. Single-file markdown edit with clear find/replace targets.

---

## Workstream 3 — Trim `architectures/overview.html` (medium trim of S3 + S4)

### Problem

`guides/architectures/overview.html` is a five-stage navigator across architecture patterns. S1 (Spectrum), S2 (Simple — LLM/RAG tabs), and S5 (Choosing — decision matrix) are unique navigator/comparison content that does not live in any individual architecture guide.

S3 (Orchestrated Pipelines) and S4 (Autonomous Agents), however, use click-expand cards whose `detail` fields contain 2–3 sentences of implementation-level explanation. That depth is re-taught at greater length in `workflows.html` (S3's content) and `agents.html` (S4's content). Overview duplicates ~40 lines of explanation per stage.

### Changes (two files)

#### 3.1 `guides/architectures/overview.html` — S3 "Orchestrated Pipelines"

The 5 workflow-pattern click-cards are defined in a `patterns` array around lines 832–853. For each card, shorten the `detail` field to a single sentence of ≤20 words that captures the analogy only — not the implementation.

Example transformation (chaining pattern):

- *Before:* `"Each step transforms the output of the previous step. Example: Outline an article, then write each section, then edit for tone. Each step is a separate LLM call with a focused instruction."`
- *After:* `"Each step transforms the output of the previous step — like stations on an assembly line."`

Apply the same treatment to: routing, parallelization, orchestrator-workers, evaluator-optimizer.

After the 5-card grid (after the `click-grid` div closes, inside the existing `scene-card`), add:

```jsx
<div className="deep-dive-link">
  See each pattern broken down step-by-step in <a href="workflows.html">Guide 5.4: Workflows →</a>
</div>
```

#### 3.2 `guides/architectures/overview.html` — S4 "Autonomous Agents"

Apply the same treatment to S4's agent pillar click-cards (inspect the S4 function around line 917+ to locate the pillar array — identical structure to S3). Each pillar's detail becomes ≤20 words focused on analogy.

Add the deep-dive link block:

```jsx
<div className="deep-dive-link">
  Deep dive into each pillar in <a href="agents.html">Guide 5.5: Agents →</a>
</div>
```

#### 3.3 `assets/guide-shared.css` — new component class

Append to the Shared components section:

```css
.deep-dive-link {
  margin-top: 20px;
  padding: 12px 16px;
  background: var(--color-primary-faint);
  border-left: 3px solid var(--color-primary);
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--color-text-body);
}
.deep-dive-link a {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
}
.deep-dive-link a:hover { text-decoration: underline; }
```

### Preservation requirements (must NOT change)

- S1 (Spectrum) — no edits
- S2 (Simple — LLM Chat / RAG / Compare tabs) — no edits
- S5 (Choosing — decision matrix / gate cards) — no edits
- Click-card interactive behavior in S3 and S4 (expand/collapse, keyboard, aria-expanded) — preserved exactly
- Card titles, emojis, sub-labels — preserved (only `detail` text shortens)

### Success criteria

- Each of the 10 shortened card details (5 in S3, ~5 in S4) is ≤20 words
- Both `.deep-dive-link` blocks render at the bottom of their respective stages and route correctly
- `architectures/workflows.html` is reachable via the S3 deep-dive link; `architectures/agents.html` via S4's
- Stages S1, S2, S5 show zero content diff (verified by line-range diff)
- Interactive click-expand behavior on S3/S4 cards still works (spec-reviewer to manually test)

### Risk

Low-medium. The risk is accidental damage to the interactive click-card machinery. Mitigation: only touch the `detail` string values in the pattern arrays, and add the new link blocks after the existing grid — never edit the card rendering JSX.

---

## Out of scope (explicit)

The following items from the Phase 3 scope notes in the master plan are deliberately excluded, per brainstorming decisions:

- **SVG reuse across fundamentals guides.** Investigation showed `limitations.html` and `verify-framework.html` already have their own distinct icon vocabulary (ghost, calendar, brain, shield) — no duplication of the parrot/librarian SVGs exists. Reusing them would be content addition, not consolidation.
- **`costar-meta.html` edits.** The guide already teaches COSTAR correctly; no changes needed there.
- **New content anywhere.** Embeddings / Safety / Evaluation guides are Phase 4. CRAFT vs COSTAR comparison as a full section in `costar-meta.html` is out — the one-line footnote in the curriculum doc is sufficient.
- **Overview S1, S2, S5.** Unique navigator content with no duplication.
- **Any changes to `workflows.html` or `agents.html`.** The deep-dive links target them as-is.

---

## File inventory

| Type | Files | Count |
|---|---|---|
| **Delete** | `docs/rag-explainer.jsx`, `docs/index.html` | 2 |
| **Modify (WS1)** | `index.html`, `CLAUDE.md` | 2 |
| **Modify (WS2)** | `docs/14-Day-Generative-AI-Training-Curriculum.md` | 1 |
| **Modify (WS3)** | `guides/architectures/overview.html`, `assets/guide-shared.css` | 2 |
| **Total touched** | | **7** |

---

## Verification plan

1. **WS1 grep:** `grep -r "rag-explainer\|rag-internals" .` → zero matches
2. **WS1 visual:** Landing page (`index.html`) loads; "Supplementary Resources" section is clean or removed
3. **WS2 grep:** `grep -n "CRAFT" docs/14-Day-Generative-AI-Training-Curriculum.md` → only the footnote line
4. **WS2 content:** Day 3 COSTAR table columns match `costar-meta.html` framework definition exactly
5. **WS3 word count:** Each shortened `detail` field in overview S3/S4 is ≤20 words (manual count via diff review)
6. **WS3 navigation:** Click the S3 deep-dive link → lands on `workflows.html`; S4 → `agents.html`
7. **WS3 behavior preservation:** Click-expand cards on S3 and S4 still open/close; keyboard Enter/Space still activates
8. **WS3 diff:** Lines covering S1/S2/S5 function bodies show zero changes
9. **No regressions:** Spot-check 3 unrelated guides (fundamentals/what-is-genai, prompt-engineering/costar-meta, mcp/fundamentals) — no style regressions from the shared CSS addition

---

## Execution notes

Workstreams are independent — they can be executed in parallel subagents or sequentially in any order. Recommended order for reviewer cognitive load: WS1 → WS2 → WS3 (simplest to most code-heavy).

Phase 3 merges to `main` when all three workstreams pass two-stage review and the final reviewer approves.
