# Phase 3 — Content Consolidation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate broken RAG documentation references, retire the redundant CRAFT framework in favor of COSTAR, and medium-trim the duplicated pattern-card details in `architectures/overview.html` — without adding any new content.

**Architecture:** Three independent workstreams operating on a static React + Babel CDN site with no build tooling. WS1 deletes orphan files and removes broken references. WS2 rewrites markdown in the curriculum doc. WS3 edits one guide HTML file and appends one small CSS rule to the shared stylesheet.

**Tech Stack:** Static HTML + React 18 via CDN + Babel Standalone. No build system, no test framework, no bundler. "Tests" in this plan are verification commands (grep, file existence checks, word-count checks, visual browser checks).

**Spec:** `docs/superpowers/specs/2026-04-15-phase-3-content-consolidation-design.md`

---

## File Structure

**Deleted:**
- `docs/rag-explainer.jsx` (427-line orphan React source, never built to HTML)
- `docs/index.html` (134-line landing page for two non-existent HTML files)

**Modified:**
- `index.html` — remove two broken links in Supplementary Resources block (lines 653–654)
- `CLAUDE.md` — rewrite line 54 to drop mentions of the deleted files
- `docs/14-Day-Generative-AI-Training-Curriculum.md` — swap CRAFT for COSTAR in Day 3, syllabus overview, facilitator resources, and Key Frameworks Summary
- `guides/architectures/overview.html` — shorten pattern `detail` strings in S3 (5 items) and S4 (4 items); add two deep-dive link blocks
- `assets/guide-shared.css` — append `.deep-dive-link` component class

**Unchanged (preservation requirements):**
- `guides/prompt-engineering/costar-meta.html`
- `guides/architectures/workflows.html`, `guides/architectures/agents.html`
- `guides/architectures/overview.html` stages S1, S2, S5 (only S3 and S4 content changes)
- All fundamentals/prompt-engineering/context-engineering/mcp guides

---

## Task 0: Setup — worktree + clean baseline

**Files:**
- Worktree at `.worktrees/phase-3-consolidation`
- Branch: `phase-3-consolidation`

- [ ] **Step 1: Verify `.worktrees` is gitignored**

Run: `git check-ignore -q .worktrees && echo "ignored" || echo "NOT IGNORED"`
Expected: `ignored`

If NOT ignored, stop and escalate — do not proceed.

- [ ] **Step 2: Create worktree + branch from main**

Run:
```bash
cd /Users/tirumalasettiv/active-projects/GenerativeAI-MasterMind
git worktree add .worktrees/phase-3-consolidation -b phase-3-consolidation
cd .worktrees/phase-3-consolidation
```
Expected: `Preparing worktree ... HEAD is now at <sha>`

- [ ] **Step 3: Verify baseline files exist**

Run:
```bash
ls docs/rag-explainer.jsx docs/index.html && \
grep -c "rag-explainer\|rag-internals" index.html
```
Expected: both files listed, `2` matches in index.html.

- [ ] **Step 4: Verify no pending changes**

Run: `git status`
Expected: `nothing to commit, working tree clean`

---

## Task 1: WS1.1 — Delete orphan RAG source files

**Files:**
- Delete: `docs/rag-explainer.jsx`
- Delete: `docs/index.html`

- [ ] **Step 1: Delete the orphan JSX file**

Run: `git rm docs/rag-explainer.jsx`
Expected: `rm 'docs/rag-explainer.jsx'`

- [ ] **Step 2: Delete the standalone landing page**

Run: `git rm docs/index.html`
Expected: `rm 'docs/index.html'`

- [ ] **Step 3: Verify deletions**

Run: `ls docs/rag-explainer.jsx docs/index.html 2>&1 | grep -c "No such file"`
Expected: `2`

- [ ] **Step 4: Verify remaining docs/ contents are intact**

Run: `ls docs/ | grep -v '^\.'`
Expected output includes: `14-Day-Generative-AI-Training-Curriculum.md`, `GenAI Concepts .md`, `GenAI Concepts .pdf`, `assets`, `rag-explainer.jsx` should NOT appear, `index.html` should NOT appear, `superpowers` should appear.

- [ ] **Step 5: Commit**

```bash
git commit -m "$(cat <<'EOF'
remove orphan RAG documentation files

docs/rag-explainer.jsx was a 427-line React source that was never
compiled to HTML. docs/index.html was a standalone landing page
for two non-existent HTML files. Both are dead weight that the
canonical guides/architectures/rag.html already subsumes.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: WS1.2 — Remove broken RAG links from landing page

**Files:**
- Modify: `index.html:636-658` (Resources column of footer)

- [ ] **Step 1: Read the current Resources block**

Run the Read tool on `index.html` for lines 636–658. Current state (for reference):
```jsx
                  <div>
                    <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: "#a0a0b0", margin: 0, marginBottom: 12 }}>RESOURCES</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <a href="docs/rag-explainer.html" style={{ fontSize: 13, color: "#3d3d4d", textDecoration: "none" }}>RAG Explainer</a>
                      <a href="docs/rag-internals.html" style={{ fontSize: 13, color: "#3d3d4d", textDecoration: "none" }}>RAG Under the Hood</a>
                      <a href="guides/final-exam/quiz.html" style={{ fontSize: 13, color: "#6c5ce7", textDecoration: "none", fontWeight: 600 }}>Final Exam</a>
                    </div>
                  </div>
```

The Resources column still has the Final Exam link after the two RAG ones are removed, so the column stays — we just delete two lines.

- [ ] **Step 2: Remove the two broken `<a>` tags**

Use Edit on `index.html`:

`old_string`:
```
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <a href="docs/rag-explainer.html" style={{ fontSize: 13, color: "#3d3d4d", textDecoration: "none" }}>RAG Explainer</a>
                      <a href="docs/rag-internals.html" style={{ fontSize: 13, color: "#3d3d4d", textDecoration: "none" }}>RAG Under the Hood</a>
                      <a href="guides/final-exam/quiz.html" style={{ fontSize: 13, color: "#6c5ce7", textDecoration: "none", fontWeight: 600 }}>Final Exam</a>
                    </div>
```

`new_string`:
```
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <a href="guides/final-exam/quiz.html" style={{ fontSize: 13, color: "#6c5ce7", textDecoration: "none", fontWeight: 600 }}>Final Exam</a>
                    </div>
```

- [ ] **Step 3: Verify the two references are gone**

Run: `grep -n "rag-explainer\|rag-internals" index.html`
Expected: no output (exit code 1).

- [ ] **Step 4: Verify Final Exam link still present**

Run: `grep -n "guides/final-exam/quiz.html" index.html | head -5`
Expected: at least one match returns (the footer link).

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "$(cat <<'EOF'
remove broken RAG links from landing page footer

The RAG Explainer and RAG Under the Hood links pointed to
docs/rag-explainer.html and docs/rag-internals.html, which were
never built. The canonical RAG guide lives at
guides/architectures/rag.html (Module 5.3).

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: WS1.3 — Update CLAUDE.md to drop deleted filenames

**Files:**
- Modify: `CLAUDE.md:54`

- [ ] **Step 1: Rewrite the Docs section sentence**

Use Edit on `CLAUDE.md`:

`old_string`:
```
### Docs (`docs/`)
Supplementary content: RAG explainer pages (`rag-explainer.html`, `rag-internals.html`), a curriculum markdown, and the master `GenAI Concepts .md` reference document. The `docs/assets/` images are referenced from the GenAI Concepts markdown.
```

`new_string`:
```
### Docs (`docs/`)
Supplementary content: a 14-day curriculum markdown (`14-Day-Generative-AI-Training-Curriculum.md`) and the master `GenAI Concepts .md` reference document. The `docs/assets/` images are referenced from the GenAI Concepts markdown.
```

- [ ] **Step 2: Verify no references to deleted files remain anywhere**

Run: `grep -rn "rag-explainer\|rag-internals" .`
Expected: no output (exit code 1). All WS1 references are now cleaned.

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "$(cat <<'EOF'
update CLAUDE.md to reflect removed RAG explainer pages

The Docs section referenced two HTML files that never existed
and have now been fully purged from the project.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: WS2.1 — Rewrite curriculum Day 3 (CRAFT → COSTAR)

**Files:**
- Modify: `docs/14-Day-Generative-AI-Training-Curriculum.md:61-83`

- [ ] **Step 1: Replace the Day 3 block**

Use Edit on `docs/14-Day-Generative-AI-Training-Curriculum.md`:

`old_string`:
```
## Day 3: The CRAFT Prompting Framework

**Objective:** Write structured prompts that get better results.

| Time | Activity |
|------|----------|
| 0-5 min | Recap + share hallucination examples |
| 5-25 min | Theory: CRAFT framework (Context, Role, Ask, Format, Tone) |
| 25-40 min | Demo: Transform vague prompt → CRAFT prompt (live) |
| 40-55 min | Hands-on: Rewrite 3 vague prompts using CRAFT |
| 55-60 min | Share best transformations + Preview Day 4 |

### CRAFT Framework

| Component | Description | Example |
|-----------|-------------|---------|
| **C**ontext | Background information | "We're launching a B2B SaaS product next quarter..." |
| **R**ole | Who should AI act as | "Act as a senior product marketing manager..." |
| **A**sk | Specific task | "Write 5 email subject lines for..." |
| **F**ormat | Desired output structure | "Present as a numbered list with explanations..." |
| **T**one | Communication style | "Use a professional but approachable tone..." |

**Homework:** Write one CRAFT prompt for a real work task.
```

`new_string`:
```
## Day 3: The COSTAR Prompting Framework

**Objective:** Write structured prompts that get better results.

**Interactive guide:** `guides/prompt-engineering/costar-meta.html`

| Time | Activity |
|------|----------|
| 0-5 min | Recap + share hallucination examples |
| 5-25 min | Theory: COSTAR framework (Context, Objective, Style, Tone, Audience, Response) |
| 25-40 min | Demo: Transform vague prompt → COSTAR prompt (live) |
| 40-55 min | Hands-on: Rewrite 3 vague prompts using COSTAR |
| 55-60 min | Share best transformations + Preview Day 4 |

### COSTAR Framework

| Component | Description | Example |
|-----------|-------------|---------|
| **C**ontext | Background information | "We're launching a B2B SaaS product next quarter..." |
| **O**bjective | The specific goal | "Generate 5 email subject lines that drive clicks..." |
| **S**tyle | Writing style | "Concise, punchy, modern marketing voice..." |
| **T**one | Communication tone | "Professional but approachable..." |
| **A**udience | Who will read the output | "Mid-market IT decision-makers..." |
| **R**esponse | Desired output structure | "Numbered list, each ≤10 words, with a one-line rationale..." |

**Homework:** Write one COSTAR prompt for a real work task.
```

- [ ] **Step 2: Verify Day 3 now teaches COSTAR**

Run: `grep -n "Day 3" docs/14-Day-Generative-AI-Training-Curriculum.md | head -5`
Expected: the `## Day 3: The COSTAR Prompting Framework` heading appears.

Run: `grep -c "COSTAR" docs/14-Day-Generative-AI-Training-Curriculum.md`
Expected: at least `4` (title, activity, section heading, homework).

- [ ] **Step 3: Commit**

```bash
git add docs/14-Day-Generative-AI-Training-Curriculum.md
git commit -m "$(cat <<'EOF'
rewrite curriculum Day 3 to teach COSTAR instead of CRAFT

The shipped interactive guide teaches COSTAR (Context, Objective,
Style, Tone, Audience, Response). Curriculum Day 3 was out of sync,
still describing the older CRAFT framework. Day 3 now references
the guide directly so facilitators can open it during the session.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: WS2.2 — Update curriculum syllabus table + facilitator resources

**Files:**
- Modify: `docs/14-Day-Generative-AI-Training-Curriculum.md:676`
- Modify: `docs/14-Day-Generative-AI-Training-Curriculum.md:708`

- [ ] **Step 1: Update syllabus overview table row for Day 3**

Use Edit on `docs/14-Day-Generative-AI-Training-Curriculum.md`:

`old_string`: `| 3 | CRAFT Prompting Framework | Theory + Practice |`

`new_string`: `| 3 | COSTAR Prompting Framework | Theory + Practice |`

- [ ] **Step 2: Update facilitator resources list item**

Use Edit on `docs/14-Day-Generative-AI-Training-Curriculum.md`:

`old_string`: `- [ ] CRAFT Framework card (printable)`

`new_string`: `- [ ] COSTAR Framework card (printable)`

- [ ] **Step 3: Verify both locations updated**

Run: `grep -n "COSTAR Prompting Framework\|COSTAR Framework card" docs/14-Day-Generative-AI-Training-Curriculum.md`
Expected: exactly 3 lines (Day 3 heading, syllabus table, facilitator card). If only 2, re-check.

- [ ] **Step 4: Commit**

```bash
git add docs/14-Day-Generative-AI-Training-Curriculum.md
git commit -m "$(cat <<'EOF'
update curriculum syllabus and facilitator resources for COSTAR

The 14-day overview table and facilitator resources list both
named CRAFT. Now aligned with Day 3 and the shipped interactive
guide.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: WS2.3 — Replace CRAFT table with COSTAR in Key Frameworks Summary

**Files:**
- Modify: `docs/14-Day-Generative-AI-Training-Curriculum.md:717-728`

- [ ] **Step 1: Replace the CRAFT table with a COSTAR table + footnote**

Use Edit on `docs/14-Day-Generative-AI-Training-Curriculum.md`:

`old_string`:
```
## Key Frameworks Summary

### CRAFT (Prompting)

| Letter | Meaning |
|--------|---------|
| C | Context |
| R | Role |
| A | Ask |
| F | Format |
| T | Tone |
```

`new_string`:
```
## Key Frameworks Summary

### COSTAR (Prompting)

| Letter | Meaning |
|--------|---------|
| C | Context |
| O | Objective |
| S | Style |
| T | Tone |
| A | Audience |
| R | Response |

> Note: CRAFT (Context, Role, Ask, Format, Tone) is a similar 5-letter variant you may encounter elsewhere; COSTAR covers the same ground plus Audience + Response.
```

- [ ] **Step 2: Verify only the footnote line mentions CRAFT**

Run: `grep -n "CRAFT\|C\.R\.A\.F\.T" docs/14-Day-Generative-AI-Training-Curriculum.md`
Expected: exactly one match — the `> Note:` footnote line (around line 728 post-edit).

If more than one match, locate the stray reference and update it. If zero matches, the footnote itself is missing — re-read the target file and re-apply the edit.

- [ ] **Step 3: Verify COSTAR appears in at least 4 distinct sections**

Run: `grep -c "COSTAR" docs/14-Day-Generative-AI-Training-Curriculum.md`
Expected: at least `7` (Day 3 heading, agenda row, demo row, hands-on row, section heading, homework, syllabus table, facilitator card, Key Frameworks heading, COSTAR framework table header).

- [ ] **Step 4: Commit**

```bash
git add docs/14-Day-Generative-AI-Training-Curriculum.md
git commit -m "$(cat <<'EOF'
replace CRAFT summary table with COSTAR + explanatory footnote

Key Frameworks Summary now lists COSTAR's 6 components matching
the guide. A one-line footnote preserves awareness of the CRAFT
variant for facilitators who encounter it elsewhere, without
teaching a redundant framework.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: WS3.1 — Append `.deep-dive-link` to shared CSS

**Files:**
- Modify: `assets/guide-shared.css` (append at end)

- [ ] **Step 1: Read the current end of the shared CSS**

Run the Read tool on `assets/guide-shared.css` with `offset` near the end of the file to see the last 20 lines. This confirms where to append.

- [ ] **Step 2: Append the deep-dive-link block**

Use Edit on `assets/guide-shared.css`. Append the following block to the very end of the file (find the current last non-blank line, add a blank line after it, then this block):

```css
/* ---------- Deep-dive link (used by architectures/overview.html) ---------- */
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

Use a unique anchor for the Edit `old_string` — grab the last existing rule in the file (read it first so the anchor is exact), append the new block after it.

- [ ] **Step 3: Verify the class was added**

Run: `grep -c "\.deep-dive-link" assets/guide-shared.css`
Expected: `3` (1 rule, 1 descendant `a`, 1 `:hover` descendant).

- [ ] **Step 4: Verify no other CSS was disturbed**

Run: `git diff --stat assets/guide-shared.css`
Expected: only added lines, zero removed lines.

- [ ] **Step 5: Commit**

```bash
git add assets/guide-shared.css
git commit -m "$(cat <<'EOF'
add .deep-dive-link component to shared CSS

Styles a callout block linking to a deeper guide on a topic,
used by architectures/overview.html to point into workflows.html
and agents.html where the overview intentionally stays high-level.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: WS3.2 — Shorten S3 pattern details + add workflows deep-dive link

**Files:**
- Modify: `guides/architectures/overview.html:832-853` (patterns array)
- Modify: `guides/architectures/overview.html:~906` (after click-grid closes, inside scene-card)

- [ ] **Step 1: Shorten the 5 pattern `detail` strings**

Use Edit on `guides/architectures/overview.html`:

`old_string`:
```
      const patterns = [
        {
          id: 'chaining', emoji: '\uD83C\uDFED', title: 'Prompt Chaining', sub: 'Assembly Line',
          detail: 'Each step transforms the output of the previous step. Example: Outline an article, then write each section, then edit for tone. Each step is a separate LLM call with a focused instruction.'
        },
        {
          id: 'routing', emoji: '\uD83C\uDFA9', title: 'Routing', sub: 'Sorting Hat',
          detail: 'A classifier examines the input and sends it to the right specialized handler. Example: A support system routes billing questions to one prompt, technical issues to another, and feedback to a third.'
        },
        {
          id: 'parallel', emoji: '\uD83D\uDEE3\uFE0F', title: 'Parallelization', sub: 'Multi-Lane Highway',
          detail: 'Multiple LLM calls run simultaneously on different aspects of the same task. Example: Analyze a document for sentiment, extract entities, and summarize key points all at once, then merge results.'
        },
        {
          id: 'orchestrator', emoji: '\uD83D\uDCCB', title: 'Orchestrator-Workers', sub: 'Project Manager',
          detail: 'A central LLM breaks a task into subtasks and delegates to specialized workers. Example: A coding assistant decomposes "build a web app" into frontend, backend, and database tasks, assigns each to a worker, then integrates.'
        },
        {
          id: 'evaluator', emoji: '\uD83D\uDD0D', title: 'Evaluator-Optimizer', sub: 'QA Inspector',
          detail: 'One LLM generates output, another evaluates it, and the cycle repeats until quality thresholds are met. Example: Generate marketing copy, evaluate for brand voice, regenerate if needed.'
        }
      ];
```

`new_string`:
```
      const patterns = [
        {
          id: 'chaining', emoji: '\uD83C\uDFED', title: 'Prompt Chaining', sub: 'Assembly Line',
          detail: 'Each step transforms the output of the previous step \u2014 like stations on an assembly line.'
        },
        {
          id: 'routing', emoji: '\uD83C\uDFA9', title: 'Routing', sub: 'Sorting Hat',
          detail: 'A classifier sends the input to the right specialist \u2014 like a sorting hat picking the best handler.'
        },
        {
          id: 'parallel', emoji: '\uD83D\uDEE3\uFE0F', title: 'Parallelization', sub: 'Multi-Lane Highway',
          detail: 'Multiple LLM calls run at once on different aspects \u2014 like a multi-lane highway processing in parallel.'
        },
        {
          id: 'orchestrator', emoji: '\uD83D\uDCCB', title: 'Orchestrator-Workers', sub: 'Project Manager',
          detail: 'A central LLM breaks tasks apart and delegates to specialized workers \u2014 like a project manager coordinating a team.'
        },
        {
          id: 'evaluator', emoji: '\uD83D\uDD0D', title: 'Evaluator-Optimizer', sub: 'QA Inspector',
          detail: 'One LLM generates, another critiques, and they iterate until quality is met \u2014 like a writer with a QA reviewer.'
        }
      ];
```

Note: `\u2014` is the em-dash escape used elsewhere in this file (grep confirms this is the convention).

- [ ] **Step 2: Insert the deep-dive link after the click-grid, inside scene-card**

The target location is after the `Common tools` row and before the closing `</div>` of the `scene-card` div. Current state (line ~898–906):

```jsx
              <div style={{ marginTop: '24px', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#888' }}>Common tools:</span>
                {['N8N', 'Make', 'Zapier', 'LangChain', 'Prefect'].map(tool => (
                  <span key={tool} className="stat-badge" style={{ fontSize: '13px', padding: '6px 12px' }}>
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <InsightBlock>
```

Use Edit on `guides/architectures/overview.html`:

`old_string`:
```
              <div style={{ marginTop: '24px', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#888' }}>Common tools:</span>
                {['N8N', 'Make', 'Zapier', 'LangChain', 'Prefect'].map(tool => (
                  <span key={tool} className="stat-badge" style={{ fontSize: '13px', padding: '6px 12px' }}>
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <InsightBlock>
            Workflows trade flexibility for reliability.
```

`new_string`:
```
              <div style={{ marginTop: '24px', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#888' }}>Common tools:</span>
                {['N8N', 'Make', 'Zapier', 'LangChain', 'Prefect'].map(tool => (
                  <span key={tool} className="stat-badge" style={{ fontSize: '13px', padding: '6px 12px' }}>
                    {tool}
                  </span>
                ))}
              </div>
              <div className="deep-dive-link">
                See each pattern broken down step-by-step in <a href="workflows.html">Guide 5.4: AI Workflows &rarr;</a>
              </div>
            </div>
          </div>
          <InsightBlock>
            Workflows trade flexibility for reliability.
```

- [ ] **Step 3: Verify S3 pattern details are all ≤20 words**

Run this Python snippet (or manual count via diff review):
```bash
python3 -c "
import re
with open('guides/architectures/overview.html') as f:
    content = f.read()
# Extract detail strings between 'like stations on an assembly line' block onwards
patterns_block = re.search(r'const patterns = \[(.*?)\];', content, re.DOTALL).group(1)
details = re.findall(r\"detail: '([^']+)'\", patterns_block)
for d in details:
    words = len(d.split())
    print(f'{words:3d} words: {d[:60]}...')
    assert words <= 20, f'TOO LONG: {d}'
print('OK: all 5 details <= 20 words')
"
```
Expected: 5 lines of `NN words: ...` and `OK: all 5 details <= 20 words`.

- [ ] **Step 4: Verify deep-dive link renders in source**

Run: `grep -n "deep-dive-link" guides/architectures/overview.html`
Expected: at least one match line showing the new `<div className="deep-dive-link">`.

Run: `grep -n "workflows.html" guides/architectures/overview.html`
Expected: at least one match line containing the new `<a href="workflows.html">`.

- [ ] **Step 5: Open the guide in a browser and verify S3 manually**

Visit: `file:///Users/tirumalasettiv/active-projects/GenerativeAI-MasterMind/.worktrees/phase-3-consolidation/guides/architectures/overview.html`

Click the Pipelines sidebar step (step 3). Confirm:
- Each of the 5 pattern cards expands/collapses on click
- Each pattern's detail is a single short sentence
- The "Guide 5.4: AI Workflows →" deep-dive link appears below the tools row
- Clicking the link opens `workflows.html`

If any check fails, stop and re-read the edit.

- [ ] **Step 6: Commit**

```bash
git add guides/architectures/overview.html
git commit -m "$(cat <<'EOF'
trim S3 pattern details and link to Guide 5.4 for depth

The 5 workflow-pattern click-cards in architectures/overview.html
had 2-3 sentence details that duplicated workflows.html. Each
detail is now a single ≤20-word sentence capturing the analogy
only; a new deep-dive link routes learners to workflows.html for
the full breakdown.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: WS3.3 — Shorten S4 collab details + add agents deep-dive link

**Files:**
- Modify: `guides/architectures/overview.html:921-938` (collabs array)
- Modify: `guides/architectures/overview.html:~1010–1017` (after Frameworks row, inside scene-card)

- [ ] **Step 1: Shorten the 4 collab `detail` strings**

Use Edit on `guides/architectures/overview.html`:

`old_string`:
```
      const collabs = [
        {
          id: 'pipeline', emoji: '\u27A1\uFE0F', title: 'Pipeline', sub: 'Sequential handoff',
          detail: 'Agent A finishes its work and hands results to Agent B, who hands to Agent C. Like an assembly line where each specialist adds their expertise in order. Example: Researcher gathers data, Analyst interprets it, Writer creates the report.'
        },
        {
          id: 'supervisor', emoji: '\uD83D\uDC51', title: 'Supervisor', sub: 'Boss delegates tasks',
          detail: 'A manager agent breaks down work and assigns tasks to specialized worker agents, then synthesizes their outputs. Example: A lead agent assigns code review, testing, and documentation to three separate agents and combines results.'
        },
        {
          id: 'debate', emoji: '\uD83E\uDD3C', title: 'Debate', sub: 'Adversarial refinement',
          detail: 'Multiple agents argue different perspectives, and a judge agent selects the best answer or synthesizes a consensus. Example: A legal analysis where one agent argues for and another against, and a judge writes the balanced opinion.'
        },
        {
          id: 'swarm', emoji: '\uD83D\uDC1D', title: 'Swarm', sub: 'Self-organizing team',
          detail: 'Agents dynamically claim tasks and coordinate without a central controller, like a bee colony. Example: A customer service swarm where available agents pick up tickets based on their expertise and current load.'
        }
      ];
```

`new_string`:
```
      const collabs = [
        {
          id: 'pipeline', emoji: '\u27A1\uFE0F', title: 'Pipeline', sub: 'Sequential handoff',
          detail: 'Agent A hands results to Agent B to Agent C \u2014 like an assembly line of specialists.'
        },
        {
          id: 'supervisor', emoji: '\uD83D\uDC51', title: 'Supervisor', sub: 'Boss delegates tasks',
          detail: 'A manager agent breaks work apart and assigns tasks to specialized worker agents.'
        },
        {
          id: 'debate', emoji: '\uD83E\uDD3C', title: 'Debate', sub: 'Adversarial refinement',
          detail: 'Agents argue opposing perspectives and a judge agent synthesizes the final answer.'
        },
        {
          id: 'swarm', emoji: '\uD83D\uDC1D', title: 'Swarm', sub: 'Self-organizing team',
          detail: 'Agents dynamically claim tasks without a central controller \u2014 like a self-organizing bee colony.'
        }
      ];
```

- [ ] **Step 2: Insert the deep-dive link after the Frameworks row, inside the scene-card**

Current state (around lines 1010–1020):

```jsx
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#888' }}>Frameworks:</span>
                {['CrewAI', 'LangGraph', 'AutoGen', 'OpenAI Swarm'].map(fw => (
                  <span key={fw} className="stat-badge" style={{ fontSize: '13px', padding: '6px 12px' }}>
                    {fw}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <InsightBlock>
            Multi-agent systems dramatically outperform single agents
```

Use Edit on `guides/architectures/overview.html`:

`old_string`:
```
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#888' }}>Frameworks:</span>
                {['CrewAI', 'LangGraph', 'AutoGen', 'OpenAI Swarm'].map(fw => (
                  <span key={fw} className="stat-badge" style={{ fontSize: '13px', padding: '6px 12px' }}>
                    {fw}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <InsightBlock>
            Multi-agent systems dramatically outperform single agents
```

`new_string`:
```
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#888' }}>Frameworks:</span>
                {['CrewAI', 'LangGraph', 'AutoGen', 'OpenAI Swarm'].map(fw => (
                  <span key={fw} className="stat-badge" style={{ fontSize: '13px', padding: '6px 12px' }}>
                    {fw}
                  </span>
                ))}
              </div>
              <div className="deep-dive-link">
                Deep dive into single-agent and multi-agent patterns in <a href="agents.html">Guide 5.5: AI Agents &rarr;</a>
              </div>
            </div>
          </div>
          <InsightBlock>
            Multi-agent systems dramatically outperform single agents
```

- [ ] **Step 3: Verify S4 collab details are all ≤20 words**

Run this Python snippet:
```bash
python3 -c "
import re
with open('guides/architectures/overview.html') as f:
    content = f.read()
collabs_block = re.search(r'const collabs = \[(.*?)\];', content, re.DOTALL).group(1)
details = re.findall(r\"detail: '([^']+)'\", collabs_block)
for d in details:
    words = len(d.split())
    print(f'{words:3d} words: {d[:60]}...')
    assert words <= 20, f'TOO LONG: {d}'
print('OK: all 4 details <= 20 words')
"
```
Expected: 4 lines of `NN words: ...` and `OK: all 4 details <= 20 words`.

- [ ] **Step 4: Verify both deep-dive links are now present**

Run: `grep -c "deep-dive-link" guides/architectures/overview.html`
Expected: `2`.

Run: `grep -n "Guide 5.4\|Guide 5.5" guides/architectures/overview.html`
Expected: 2 matches — one for each deep-dive link.

- [ ] **Step 5: Verify S1, S2, S5 are untouched**

Run: `git diff guides/architectures/overview.html | grep '^-' | head -30`
Inspect the output manually. Confirmed: every `-` line (removal) is either:
- part of the old `patterns` array (S3)
- part of the old `collabs` array (S4)
- none of them touch S1 (Spectrum), S2 (Simple), or S5 (Choosing)

If any `-` line is outside the S3/S4 arrays (aside from the two insertions of the deep-dive-link div), stop and revert — that is an accidental edit.

- [ ] **Step 6: Open the guide in a browser and verify S4 manually**

Visit: `file:///Users/tirumalasettiv/active-projects/GenerativeAI-MasterMind/.worktrees/phase-3-consolidation/guides/architectures/overview.html`

Click the Agents sidebar step (step 4). Confirm:
- ReAct loop still renders (Thought → Action → Observation → repeat)
- All 4 collab cards expand/collapse on click
- Each collab detail is a single short sentence
- Cornell Study stat still appears below the cards
- Frameworks row still appears
- The "Guide 5.5: AI Agents →" deep-dive link appears below Frameworks
- Clicking the link opens `agents.html`

Also click Stages 1, 2, 5 to confirm no visual regressions.

- [ ] **Step 7: Commit**

```bash
git add guides/architectures/overview.html
git commit -m "$(cat <<'EOF'
trim S4 collab details and link to Guide 5.5 for depth

The 4 multi-agent collaboration click-cards duplicated depth
already covered in agents.html. Each detail is now a single
≤20-word sentence; a deep-dive link routes learners to Guide 5.5.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Final verification sweep

**Files:** None modified. Verification only.

- [ ] **Step 1: Confirm all WS1 references are purged**

Run: `grep -rn "rag-explainer\|rag-internals" . --exclude-dir=.worktrees --exclude-dir=.git`
Expected: no output.

- [ ] **Step 2: Confirm CRAFT appears only in the one footnote**

Run: `grep -rn "CRAFT\|C\.R\.A\.F\.T" docs/`
Expected: exactly one hit — the `> Note:` footnote line in the curriculum doc.

Run: `grep -rn "CRAFT" guides/ assets/ index.html CLAUDE.md`
Expected: no output (CRAFT must only live in the curriculum doc's single footnote).

- [ ] **Step 3: Confirm deep-dive links point to correct guides**

Run: `grep -A1 'deep-dive-link' guides/architectures/overview.html | grep 'href='`
Expected: one line containing `href="workflows.html"` and one containing `href="agents.html"`.

- [ ] **Step 4: Confirm no unintended files changed**

Run: `git diff main --stat`
Expected: exactly this set of changes:
- `CLAUDE.md` (modified, ~2 lines changed)
- `assets/guide-shared.css` (modified, added lines only)
- `docs/14-Day-Generative-AI-Training-Curriculum.md` (modified)
- `docs/index.html` (deleted)
- `docs/rag-explainer.jsx` (deleted)
- `docs/superpowers/plans/2026-04-15-phase-3-content-consolidation.md` (the plan itself, if committed to the branch)
- `docs/superpowers/specs/2026-04-15-phase-3-content-consolidation-design.md` (the spec — should already be on main from earlier commit)
- `guides/architectures/overview.html` (modified)
- `index.html` (modified, 2 lines removed)

If any other file appears in the diff, stop and investigate.

- [ ] **Step 5: Full browser smoke test**

Open each of these file URLs and click through each one briefly:
- `file:///.../.worktrees/phase-3-consolidation/index.html` — scroll to footer; confirm Resources column has only "Final Exam"
- `file:///.../.worktrees/phase-3-consolidation/guides/architectures/overview.html` — click through all 5 stages (S1 Spectrum, S2 Simple, S3 Pipelines, S4 Agents, S5 Choosing); confirm S1/S2/S5 unchanged, S3/S4 have shortened details and deep-dive links
- `file:///.../.worktrees/phase-3-consolidation/guides/architectures/workflows.html` — confirm still loads (link target)
- `file:///.../.worktrees/phase-3-consolidation/guides/architectures/agents.html` — confirm still loads (link target)
- `file:///.../.worktrees/phase-3-consolidation/guides/prompt-engineering/costar-meta.html` — confirm still loads and still teaches COSTAR (unchanged)

- [ ] **Step 6: Log completion**

Run: `git log --oneline main..HEAD`
Expected: one commit per task (roughly 7-9 commits depending on whether some tasks merged commits).

---

## Success criteria (from spec)

All must pass at Task 10:

- [x] `grep -r "rag-explainer\|rag-internals" .` returns zero matches (Task 10 Step 1)
- [x] Landing page footer renders without broken RAG links (Task 10 Step 5)
- [x] `grep -n "CRAFT" docs/14-Day-Generative-AI-Training-Curriculum.md` returns only the footnote line (Task 10 Step 2)
- [x] Day 3 COSTAR table columns match `costar-meta.html`'s 6-component framework exactly (Task 4)
- [x] `guides/prompt-engineering/costar-meta.html` appears as a link in the Day 3 block (Task 4)
- [x] Each S3/S4 shortened detail is ≤20 words (Tasks 8 and 9 Steps 3)
- [x] Both deep-dive links route to their correct target guides (Task 10 Step 3)
- [x] S3/S4 click-card expand/collapse behavior preserved (Tasks 8 and 9 Step 6)
- [x] S1, S2, S5 show zero content diff (Task 9 Step 5)
- [x] `costar-meta.html`, `workflows.html`, `agents.html` unchanged (Task 10 Step 4)

---

## Execution notes

- Total new commits: ~9 (one per task from Task 1 to Task 9; Task 0 and Task 10 don't commit).
- Workstreams are independent. A safe alternative order is WS1 (Tasks 1-3) → WS2 (Tasks 4-6) → WS3 (Tasks 7-9). No dependencies between workstreams.
- If running via subagent-driven-development, dispatch each numbered task to a fresh implementer subagent with the full task text as the prompt. Spec-reviewer checks "does the work match this task's steps"; code-quality reviewer checks "is the change clean and minimal."
- After Task 10 passes, use `superpowers:finishing-a-development-branch` to merge `phase-3-consolidation` back into `main` and clean up the worktree.
