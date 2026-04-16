# Phase 5 — Curriculum Labs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create two new lab modules (Module 6: Role Labs, Module 7: Build Labs & Capstone) with 7 content guides, 2 quizzes, and integration into the landing page and navigation chain.

**Architecture:** Each guide is a self-contained HTML file (~900-1200 lines) with inline CSS + JSX compiled in-browser by Babel. Follows the existing two-panel layout pattern. Lab guides use exercise-focused interactive patterns (prompt builders, scorecards, fillable cards, decision trees). All state is ephemeral (React `useState` only).

**Tech Stack:** React 18.2.0 + ReactDOM (CDN: unpkg.com), Babel Standalone 7.23.9, Google Fonts (DM Sans + Fraunces), `assets/guide-shared.css` for shared tokens/layout.

**Spec:** `docs/superpowers/specs/2026-04-16-phase-5-curriculum-labs-design.md`

---

## Structural Template

Every new guide follows the exact structure of `guides/fundamentals/what-is-genai.html`. The implementer MUST read that file as the structural reference. Key structural elements:

**`<head>` block (lines 1-21):** meta charset, viewport, description, theme-color, og:title, og:description, og:type, og:image (`../../assets/og-default.svg`), twitter:card, twitter:title, twitter:description, favicon (`../../favicon.svg`), title, Google Fonts link, `../../assets/guide-shared.css` link, React CDN (`https://unpkg.com/react@18/umd/react.production.min.js`), ReactDOM CDN, Babel standalone.

**`<style>` block:** Only guide-specific component styles. Layout/typography/badges/cards come from guide-shared.css.

**`<script type="text/babel">` block:**
1. Stage components (S1, S2, S3, S4, S5) as functional React components
2. SVG icon strings for sidebar steps
3. `NEXT_GUIDE` constant
4. `stages` array mapping icons → labels → components
5. `Guide()` main component with `useState(0)` for currentStage, `useRef` for contentRef
6. JSX shell: `React.Fragment` → skip-link → `.container` → `aside.sidebar` → `.main-content` → `.top-bar` → `main#main.content-area` → CurrentComponent + up-next-card on final stage
7. `ReactDOM.createRoot(document.getElementById('root')).render(<Guide />);`

**Accessibility requirements:** skip-link (`<a href="#main" className="skip-link">Skip to main content</a>`), `<aside aria-label="Guide sections">`, `<button type="button">` for step-btns with `aria-label` and `aria-current`, `<nav aria-label="Section navigation">` for arrows, `<main id="main">`, `aria-expanded` + `aria-controls` + `onKeyDown` for any disclosure cards, `role="complementary"` on up-next-card.

**Disclosure card pattern (from overview.html):** Cards with `role="button"`, `tabIndex={0}`, `onClick={toggle}`, `onKeyDown` (Enter/Space fires toggle), `aria-expanded={isOpen}`, `aria-controls={id}`, and a `.disclosure-badge` chevron SVG that rotates on expand. CSS classes: `click-card`, `disclosure-card-host`, `click-card-emoji`, `click-card-title`, `click-card-sub`, `click-card-detail`. Copy the CSS from `guides/architectures/overview.html` into the new guide's `<style>` block.

**Lab-specific interactive patterns:**

1. **Prompt builder** — Group of `<textarea>` elements bound to `useState('')`, plus a "Generate Preview" button that assembles a formatted prompt. The preview renders in a styled `<pre>` block.
2. **Scorecard/checklist** — Array of `useState(null)` values. Each row has 3 clickable status buttons (pass/partial/fail). Summary counts render at bottom.
3. **Fillable card grid** — Cards with `<input>` or `<textarea>` bound to `useState('')`. Cards visually highlight when filled (border changes from `var(--color-border)` to `var(--color-primary)`).
4. **Example toggle** — `useState(false)` controlling a `{showExample && <div>...</div>}` block with a "Show Example" / "Hide Example" button.
5. **Tabs** — `useState(0)` for active tab index. Tab buttons + content panels with `aria-selected`, `role="tab"`, `role="tabpanel"`.

**Quiz template:** Follow the exact structure of `guides/architectures/quiz.html` (compact CSS). Key elements: `QUESTIONS` array with `{id, section, question, options, correct, explanation}`, `SECTION_ICONS` object with SVG strings keyed by section prefix (e.g., `"6.1"`), `QuestionView` and `ResultsView` components, `resetQuiz` handler, `.module-complete-cta` with celebrate + continue link, `.quiz-actions` with retry button and review module anchor.

---

## Task 0: Setup worktree

- [ ] Verify `.worktrees` is gitignored
- [ ] `git worktree add .worktrees/phase-5-labs -b phase-5-labs`
- [ ] Create directories: `mkdir -p .worktrees/phase-5-labs/guides/role-labs .worktrees/phase-5-labs/guides/build-labs`
- [ ] Verify clean baseline

---

## Task 1: Create `guides/role-labs/pm-lab.html`

**Files:**
- Create: `guides/role-labs/pm-lab.html`

**NEXT_GUIDE:** `{ id: "6.2", title: "Citizen Coder Lab", module: "Module 6", href: "./citizen-coder-lab.html" }`

**Guide number:** 6.1
**Title:** PM Lab
**Badge:** USE CASE
**Meta description:** "Hands-on lab: apply AI to product management workflows. Generate user stories, build competitive analysis, draft PRDs, and transform changelogs into release notes."

**5 Stages (see spec for full content):**

| # | Label | Header | Key Interactive Element |
|---|---|---|---|
| 1 | Use Cases | Where AI Supercharges PM Work | 5 disclosure cards (user stories, competitive analysis, PRDs, release notes, meeting summaries) with task, AI value, and time-savings % |
| 2 | User Stories | From Brief to Backlog in Seconds | Prompt builder: textarea for feature brief → COSTAR template auto-fills → preview. "Show Example" toggle with e-commerce checkout → 5 user stories |
| 3 | Competitive | Build a Competitive Analysis Framework | Fillable grid: 3 competitor columns × 5 dimension rows (pricing, features, target market, strengths, weaknesses). Pre-filled example (Asana/Monday/Notion). Prompt template card |
| 4 | PRD & Release | Draft Documents That Ship | Two tabs. Tab 1 "Release Notes": changelog textarea + prompt template. Tab 2 "PRD Section": feature bullets textarea + prompt template |
| 5 | Your Turn | Apply to Your Own Work | Task picker (radio buttons from S1 tasks) + prompt textarea + auto-summary card |

**Insight texts (one per stage):**
1. "AI doesn't replace PM judgment — it eliminates the blank page. Getting from zero to a first draft in seconds means you spend your time refining, not starting."
2. "The feature brief IS the context. The more specific your brief, the more specific your user stories. Garbage in, garbage out applies to AI prompts too."
3. "Competitive analysis is where AI shines brightest for PMs — it can structure your thinking even when it can't do the research (yet)."
4. "Release notes are a translation exercise: technical changelog → customer value. AI is excellent at translation when you specify the audience clearly."
5. "The best AI prompts come from real work, not exercises. The prompt you just wrote is more valuable than any example we could give you."

- [ ] **Step 1:** Read `guides/fundamentals/what-is-genai.html` as the structural template
- [ ] **Step 2:** Create the full `guides/role-labs/pm-lab.html` file following the template structure, with all 5 stages implemented as described above
- [ ] **Step 3:** Verify the file loads in a browser (check for JSX syntax errors)
- [ ] **Step 4:** Verify NEXT_GUIDE is set correctly
- [ ] **Step 5:** Commit

---

## Task 2: Create `guides/role-labs/citizen-coder-lab.html`

**Files:**
- Create: `guides/role-labs/citizen-coder-lab.html`

**NEXT_GUIDE:** `{ id: "6.3", title: "Module 6 Quiz", module: "Module 6", href: "./quiz.html", isQuiz: true }`

**Guide number:** 6.2
**Title:** Citizen Coder Lab
**Badge:** USE CASE
**Meta description:** "Hands-on lab: use AI to build apps without deep coding. Design data models, generate UI specs, write workflow logic, and create Excel formulas from descriptions."

**5 Stages:**

| # | Label | Header | Key Interactive Element |
|---|---|---|---|
| 1 | Use Cases | AI as Your Co-Builder | 5 disclosure cards (data model design, UI specs, workflow logic, formula writing, API planning) with task, AI value, time-savings % |
| 2 | Data Model | From Idea to Entity-Relationship | Prompt builder: app idea textarea → COSTAR template (Objective=data model, Response=entity list). "Show Example": "todo app with teams" → entities (User, Team, Task, Label) |
| 3 | UI Screens | Generate Screen-by-Screen Specs | Prompt builder: features list textarea → prompt for screen descriptions. "Show Example": "todo app" → 4 screen specs (Dashboard, Task Detail, Team View, Settings) |
| 4 | Logic | Plain English to Pseudo-Code | Two tabs. Tab 1 "Workflow": business process textarea → pseudo-code prompt. Example: lead enrichment. Tab 2 "Formulas": calculation description → Excel formula prompt. Example: "days between order and delivery" |
| 5 | Your Turn | Build Your Own App Spec | App idea textarea + two-output picker (checkboxes: data model, UI, logic, formulas — pick 2) + auto-summary card |

**Insight texts:**
1. "You don't need to code to build — you need to describe clearly. AI turns clear descriptions into technical specifications that developers (or no-code tools) can implement."
2. "A data model is the skeleton of your app. Get this right and everything else — screens, logic, APIs — follows naturally."
3. "The best UI specs describe what the user DOES, not what the screen LOOKS like. Focus on actions and flows, not pixel positions."
4. "Pseudo-code is just structured thinking. If you can describe a process in steps, you can generate the logic — AI handles the syntax."
5. "You just went from 'I have an idea' to 'I have a spec' in 15 minutes. That's what AI-powered building looks like."

- [ ] **Step 1:** Read `guides/fundamentals/what-is-genai.html` as the structural template
- [ ] **Step 2:** Create the full `guides/role-labs/citizen-coder-lab.html` file
- [ ] **Step 3:** Verify the file loads in a browser
- [ ] **Step 4:** Verify NEXT_GUIDE is set correctly
- [ ] **Step 5:** Commit

---

## Task 3: Create `guides/build-labs/rag-build.html`

**Files:**
- Create: `guides/build-labs/rag-build.html`

**NEXT_GUIDE:** `{ id: "7.2", title: "Workflow Build", module: "Module 7", href: "./workflow-build.html" }`

**Guide number:** 7.1
**Title:** RAG Build
**Badge:** USE CASE
**Meta description:** "Hands-on lab: build a RAG-powered Q&A system. Upload documents, configure retrieval, write system prompts, test with real questions, and refine for accuracy."

**5 Stages:**

| # | Label | Header | Key Interactive Element |
|---|---|---|---|
| 1 | Overview | What You'll Build | RAG architecture SVG (User → Retriever → Knowledge Base → LLM → Output). 3 tool comparison cards (ChatGPT file upload, Dify.ai, LangChain) each with setup time, customization, best-for |
| 2 | Documents | Prepare Your Knowledge Base | Document selection checklist. 3 chunking strategy disclosure cards (fixed-size, paragraph-based, semantic). System prompt template with fillable fields: role (input), knowledge scope (input), answer style (input), citation format (input) |
| 3 | Build | Configure and Connect | 3 tabs (ChatGPT / Dify / LangChain) each with 4-step walkthrough. System prompt builder: assembles fields from S2 into a preview block |
| 4 | Test | Run Your Test Suite | Interactive scorecard: 10 rows (factual, comparative, multi-doc, edge case, out-of-scope, ambiguous, follow-up, multi-hop, temporal, opinion). Each row: type + example + 3 status buttons (correct/partial/wrong). Summary stats at bottom |
| 5 | Results | Document and Improve | 3 fillable cards: "What worked" (textarea), "What failed" (textarea), "3 improvements" (3 inputs). Deep-dive link to `../architectures/rag.html` |

**Insight texts:**
1. "RAG doesn't make AI smarter — it makes AI informed. The quality of your answers is bounded by the quality of your documents."
2. "Chunking is the most underrated part of RAG. Too large and the LLM gets confused; too small and it loses context. Start with 500-token chunks and adjust."
3. "Your system prompt is the personality of your Q&A bot. 'You are a helpful assistant' is not enough — specify the domain, the citation style, and what to say when it doesn't know."
4. "Test with questions you KNOW the answer to. You can't evaluate accuracy on questions where you'd need the RAG system to find the answer."
5. "A RAG system is never 'done' — it's always 'good enough for now.' The best systems improve continuously based on real user questions."

- [ ] **Step 1:** Read `guides/fundamentals/what-is-genai.html` as the structural template
- [ ] **Step 2:** Create the full `guides/build-labs/rag-build.html` file
- [ ] **Step 3:** Verify the file loads in a browser
- [ ] **Step 4:** Verify NEXT_GUIDE is set correctly
- [ ] **Step 5:** Commit

---

## Task 4: Create `guides/build-labs/workflow-build.html`

**Files:**
- Create: `guides/build-labs/workflow-build.html`

**NEXT_GUIDE:** `{ id: "7.3", title: "Agent Build", module: "Module 7", href: "./agent-build.html" }`

**Guide number:** 7.2
**Title:** Workflow Build
**Badge:** USE CASE
**Meta description:** "Hands-on lab: build a multi-step AI workflow. Map your process, connect triggers and AI nodes, test end-to-end, and debug common failures."

**5 Stages:**

| # | Label | Header | Key Interactive Element |
|---|---|---|---|
| 1 | Overview | What You'll Build | Workflow pipeline SVG (Trigger → Step 1 → Step 2 → Step 3 → Output, LLM icons on AI steps). 4 tool cards (n8n, Make/Integromat, Zapier, Power Automate) with type, hosting, AI support |
| 2 | Map | Design Your Flow | 2 example workflows as step-card lists: PM "Weekly Competitor Monitor" (6 steps) and Coder "Lead Enrichment" (6 steps). Each step: name, type badge (trigger/AI/code/output), input, output. Below: fillable 5-step template (5 inputs for step names + type dropdowns) |
| 3 | Build | Wire Up Your Nodes | 3 tabs (n8n / Make / Zapier) each with 4-step walkthrough. Prompt template card for AI nodes: "You are a [role]. Given this input: {{previous_step_output}}, [task]. Output format: [format]." with fillable fields |
| 4 | Test | End-to-End Debugging | 6 disclosure cards for common failures (trigger doesn't fire, wrong data format, AI prompt too vague, rate limit hit, output malformed, missing error handling). Each has symptoms, diagnosis, fix. Scorecard: 6 rows, pass/fail toggle |
| 5 | Results | Document Your Flow | 3 fillable inputs (workflow name, step count, tool used) + 3 textareas ("what worked," "what broke," "3 improvements"). Deep-dive link to `../architectures/workflows.html` |

**Insight texts:**
1. "Workflows turn 'I do this manually every week' into 'this runs automatically every week.' The first workflow you automate will save you more time than you expect."
2. "Map before you build. Drawing your 5-7 steps on paper (or in a card layout) catches logic errors before you wire up nodes and wonder why nothing works."
3. "The AI node prompt is the most important part of your workflow. A vague prompt produces vague output — and every downstream step inherits that vagueness."
4. "Most workflow failures aren't AI failures — they're data format mismatches. Step 2 outputs JSON but Step 3 expects plain text. Always check the data shape between nodes."
5. "Your first workflow will be ugly. That's fine. Ship it, run it for a week, then improve based on real failures — not hypothetical ones."

- [ ] **Step 1:** Read `guides/fundamentals/what-is-genai.html` as the structural template
- [ ] **Step 2:** Create the full `guides/build-labs/workflow-build.html` file
- [ ] **Step 3:** Verify the file loads in a browser
- [ ] **Step 4:** Verify NEXT_GUIDE is set correctly
- [ ] **Step 5:** Commit

---

## Task 5: Create `guides/build-labs/agent-build.html`

**Files:**
- Create: `guides/build-labs/agent-build.html`

**NEXT_GUIDE:** `{ id: "7.4", title: "Multi-Agent Design", module: "Module 7", href: "./multi-agent-build.html" }`

**Guide number:** 7.3
**Title:** Agent Build
**Badge:** USE CASE
**Meta description:** "Hands-on lab: build an AI agent with tool use. Define goals, write system prompts, select tools, test with real queries, and analyze failure modes."

**5 Stages:**

| # | Label | Header | Key Interactive Element |
|---|---|---|---|
| 1 | Overview | What You'll Build | Agent loop SVG (User → Agent Brain → Tools → Decide → Continue/Stop → Output). 2 example cards: PM "Market Research Agent" (goal, tools, output) and Coder "Code Helper Agent" (goal, tools, output). When-to-use comparison: agent vs workflow (3-row table: decision type, path predictability, adaptation need) |
| 2 | Define | Design Your Agent | 3 fillable cards: (1) Goal textarea, (2) Tools — 6 clickable toggles (web search, calculator, database, file reader, APIs, code interpreter), (3) Constraints textarea. "Show Example" toggle with pre-filled market research agent |
| 3 | Prompt | Write the System Prompt | 5-section prompt builder: Role textarea ("You are a..."), Goal textarea ("Your task is to..."), Tools textarea ("You have access to..."), Constraints textarea ("Never... Always..."), Output Format textarea ("Respond with..."). Assembled preview renders in a styled `<pre>` block below |
| 4 | Test | Run Three Queries | 3 test rows, each with: Query textarea, Response summary textarea, Rating (1-5 clickable circles using `useState`), Notes textarea. Summary bar: average rating + how many rated ≥4 |
| 5 | Failures | Analyze and Improve | 5 clickable failure cards: Loops, Wrong Tool, Hallucination, Scope Creep, Gives Up. Each has emoji + title + 1-sentence description. Click toggles `useState` selection state + reveals fix strategy paragraph. Multiple can be selected |

**Insight texts:**
1. "An agent is a workflow that can improvise. That's its power and its risk — it might find a creative solution, or it might go in circles."
2. "The goal is the most important part of agent design. Vague goals produce wandering agents. 'Research X and summarize with sources' beats 'help me with X.'"
3. "A good agent system prompt reads like onboarding instructions for a new employee: here's your role, here are your tools, here's what done looks like, here's what to avoid."
4. "Three queries isn't enough to trust an agent — but it's enough to find the obvious failure modes. Fix those before scaling up."
5. "Every agent failure teaches you something about the gap between what you asked for and what the agent understood. The fix is almost always a clearer prompt."

- [ ] **Step 1:** Read `guides/fundamentals/what-is-genai.html` as the structural template
- [ ] **Step 2:** Create the full `guides/build-labs/agent-build.html` file
- [ ] **Step 3:** Verify the file loads in a browser
- [ ] **Step 4:** Verify NEXT_GUIDE is set correctly
- [ ] **Step 5:** Commit

---

## Task 6: Create `guides/build-labs/multi-agent-build.html`

**Files:**
- Create: `guides/build-labs/multi-agent-build.html`

**NEXT_GUIDE:** `{ id: "7.5", title: "Capstone", module: "Module 7", href: "./capstone.html" }`

**Guide number:** 7.4
**Title:** Multi-Agent Design
**Badge:** USE CASE
**Meta description:** "Hands-on lab: design a multi-agent AI system. Choose collaboration patterns, define agent roles, write prompts, design handoff protocols, and plan testing."

**5 Stages:**

| # | Label | Header | Key Interactive Element |
|---|---|---|---|
| 1 | Patterns | Four Ways Agents Collaborate | 4 disclosure cards with SVG diagrams: (1) Supervisor — org chart SVG, (2) Debate — back-and-forth SVG, (3) Pipeline — assembly line SVG, (4) Swarm — hub-and-spoke SVG. Each card: when to use, example, tradeoff |
| 2 | Roles | Define Your Agent Team | 3 agent builder cards, each with: Name (input), Specialty (input), Tools (6 clickable toggles same as Agent Build), Input (input), Output (input). "Show Example" toggle: "Product Launch Team" (Strategist → Copywriter → Reviewer) |
| 3 | Prompts | Write Each Agent's Instructions | 3 prompt builder sections (one per agent). Each has: Role textarea, Specialty Context textarea, Input Format textarea, Task textarea, Output Format textarea, Constraints textarea. Side-by-side assembled previews |
| 4 | Handoffs | Design the Communication Protocol | 2 handoff cards (Agent 1→2 and Agent 2→3). Each card: what passes (textarea), format (3 radio buttons: plain text / JSON / structured report), decision point (textarea: "When does this agent hand off?"). Feedback loop toggle (`useState(false)`): if on, shows revision criteria textarea |
| 5 | Test Plan | How to Validate Your Design | Instructions text block for manual testing. 3 test scenario rows: each with scenario textarea + expected behavior textarea. Tips section with 3 common multi-agent failures as disclosure cards. Deep-dive link to `../architectures/agentic-ai.html` |

**Insight texts:**
1. "Multi-agent systems aren't about having more agents — they're about having the RIGHT agents. Three focused specialists beat ten generalists."
2. "Agent roles should be as distinct as job titles. If you can't explain what makes Agent 2 different from Agent 1 in one sentence, they should be the same agent."
3. "The system prompt is the agent's job description. Write it like you're onboarding a contractor: clear scope, explicit deliverables, defined handoff points."
4. "The handoff protocol IS the architecture. Poorly defined handoffs create agents that talk past each other — like a relay race where nobody knows when to pass the baton."
5. "Manual testing with copy-paste between chat windows is crude but effective. If your design doesn't work manually, automation won't fix it — it'll just fail faster."

- [ ] **Step 1:** Read `guides/fundamentals/what-is-genai.html` as the structural template
- [ ] **Step 2:** Create the full `guides/build-labs/multi-agent-build.html` file
- [ ] **Step 3:** Verify the file loads in a browser
- [ ] **Step 4:** Verify NEXT_GUIDE is set correctly
- [ ] **Step 5:** Commit

---

## Task 7: Create `guides/build-labs/capstone.html`

**Files:**
- Create: `guides/build-labs/capstone.html`

**NEXT_GUIDE:** `{ id: "7.6", title: "Module 7 Quiz", module: "Module 7", href: "./quiz.html", isQuiz: true }`

**Guide number:** 7.5
**Title:** Capstone
**Badge:** USE CASE
**Meta description:** "Design your AI-powered solution from scratch. Choose a problem, select an architecture, design components, plan implementation, and build your pitch — all in one interactive canvas."

**5 Stages:**

| # | Label | Header | Key Interactive Element |
|---|---|---|---|
| 1 | Problem | Choose Your Challenge | 3 fillable cards: (1) Problem Statement textarea ("What repetitive task do you want to improve?"), (2) Current Process textarea ("How do you do this today?"), (3) Time Estimate — 2 number inputs ("Minutes today" + "Target minutes") with auto-calculated savings % displayed |
| 2 | Architecture | Pick Your Pattern | Interactive SVG decision tree. 5 clickable decision nodes with Yes/No branches: "Need your own data?" → "Need multiple steps?" → "Steps known in advance?" → "Need multiple experts?" → result. Click highlights path, grays out irrelevant branches. Final node shows architecture name + 2-sentence rationale card. `useState` tracks the path array and selected architecture |
| 3 | Solution | Design Your Components | 3 fillable cards: (1) Data Sources textarea, (2) Tools & Integrations — 6 clickable toggles (web search, database, APIs, file upload, no-code platform, code interpreter), (3) AI Prompts — 3 prompt fields, each with name input + description textarea. Cards highlight when filled (border color change) |
| 4 | Plan | Map Your Implementation | 3 week cards with textareas: Week 1 "Build the core", Week 2 "Test and refine", Week 3-4 "Deploy and measure". Success metrics textarea. Visual indicator on each card (subtle left-border color changes from gray to green when text is entered) |
| 5 | Pitch | Your 3-Minute Summary | Auto-assembled pitch card that reads state from S1-S4: Problem (S1 textarea), Architecture (S2 selection), Components (S3 data), Timeline (S4 data), Savings (S1 time calc). Styled as presentation slide. Below: 3 coaching bullets (Hook, Demo, Ask). All state must be lifted to the Guide() component level so S5 can read it |

**Important implementation note:** Because S5 reads state from S1-S4, all fillable state (problem, process, timeToday, timeTarget, architecture, dataSources, tools, prompts, weeks, metrics) must be declared as `useState` in the `Guide()` component and passed as props to each stage component. This is different from other guides where stages are independent.

**Insight texts:**
1. "Pick a problem you actually have — not one that sounds impressive. The best capstone projects solve real annoyances, not hypothetical grand challenges."
2. "The decision tree isn't prescriptive — it's a starting point. If your gut says 'agent' but the tree says 'workflow,' trust the tree for now. You can upgrade later."
3. "Three prompts is a design constraint, not a limitation. If your solution needs more than 3 AI prompts, it might be too complex for a first iteration. Simplify."
4. "Week 1 is the only week that matters right now. If you can't build the core in a week, scope down until you can. Ship something small, then iterate."
5. "You just went from 'I should use AI for something' to 'Here's my architecture, components, and timeline.' That's the real skill — not prompting, but designing AI solutions."

- [ ] **Step 1:** Read `guides/fundamentals/what-is-genai.html` as the structural template
- [ ] **Step 2:** Create the full `guides/build-labs/capstone.html` file with lifted state in Guide() component
- [ ] **Step 3:** Verify the file loads in a browser — especially test that S5 correctly reads state entered in S1-S4
- [ ] **Step 4:** Verify NEXT_GUIDE is set correctly
- [ ] **Step 5:** Commit

---

## Task 8: Create `guides/role-labs/quiz.html` (Module 6 Quiz)

**Files:**
- Create: `guides/role-labs/quiz.html`

**Guide number:** 6.3
**Title:** Module 6 Quiz
**Back link:** `../../index.html`

The implementer MUST read `guides/architectures/quiz.html` as the quiz structural template. Follow its exact pattern for CSS, component structure, and rendering.

**Module-complete CTA:** Points to Module 7 first guide:
```jsx
<a href="../build-labs/rag-build.html" className="continue-btn">
  Continue to Module 7: Build Labs →
</a>
```

**Quiz actions:**
```jsx
<div className="quiz-actions" role="group" aria-label="Quiz actions">
  <button type="button" className="action-btn" onClick={onRetry} aria-label="Retry this quiz">↻ Retry quiz</button>
  <a href="../../index.html#module-6" className="action-btn" aria-label="Review Module 6">📖 Review module</a>
</div>
```

**SECTION_ICONS:** 2 entries needed for keys `"6.1"` and `"6.2"`. Create simple SVG icon strings:
- `"6.1"`: briefcase/clipboard icon (PM theme)
- `"6.2"`: code/terminal icon (coder theme)

**15 Questions (full objects):**

```js
const QUESTIONS = [
  {
    id: 1,
    section: "6.1 PM Lab",
    question: "Which PM task typically sees the highest time savings (80-90%) from AI assistance?",
    options: [
      "Competitive analysis",
      "PRD drafting",
      "Meeting summaries",
      "User story generation"
    ],
    correct: 2,
    explanation: "Meeting summaries — extracting actions and decisions from transcripts — see 80-90% time savings because the task is highly structured and repetitive, making it ideal for AI automation."
  },
  {
    id: 2,
    section: "6.1 PM Lab",
    question: "What is the most important input when generating user stories with AI?",
    options: [
      "A list of competitor features",
      "A specific feature brief with context",
      "The sprint deadline",
      "The team's velocity metrics"
    ],
    correct: 1,
    explanation: "A specific feature brief provides the context AI needs to generate relevant user stories. The more detailed the brief, the more specific and useful the stories. Garbage in, garbage out applies to AI prompts too."
  },
  {
    id: 3,
    section: "6.1 PM Lab",
    question: "Why should you specify 'Audience: dev team' in a COSTAR prompt for user stories?",
    options: [
      "It makes the AI write faster",
      "It ensures the AI uses technical language and includes acceptance criteria",
      "It reduces the number of tokens used",
      "It prevents hallucination"
    ],
    correct: 1,
    explanation: "Specifying the audience tells the AI to use technical language and include acceptance criteria that developers need, rather than producing marketing-friendly descriptions that lack implementation detail."
  },
  {
    id: 4,
    section: "6.1 PM Lab",
    question: "When using AI for competitive analysis, what is AI best at?",
    options: [
      "Finding real-time competitor pricing",
      "Predicting competitor strategy",
      "Structuring the framework and dimensions for comparison",
      "Identifying competitor weaknesses"
    ],
    correct: 2,
    explanation: "AI excels at structuring the comparison framework — defining dimensions, organizing information, and creating consistent evaluation criteria. The actual competitive data still needs human research and verification."
  },
  {
    id: 5,
    section: "6.1 PM Lab",
    question: "What makes AI particularly effective at transforming changelogs into release notes?",
    options: [
      "AI can access the latest version of the software",
      "It's a translation task with complete source material and a well-defined output format",
      "AI understands code better than humans",
      "Release notes don't need to be accurate"
    ],
    correct: 1,
    explanation: "Release notes are a translation exercise: technical changelog → customer value. AI excels when the source material is complete and the output format is well-defined — both are true for changelog-to-release-note conversion."
  },
  {
    id: 6,
    section: "6.1 PM Lab",
    question: "In a PRD-drafting prompt, why include 'edge cases' in the response format?",
    options: [
      "It makes the document longer",
      "Edge cases are required by Agile methodology",
      "AI tends to generate optimistic happy-path descriptions without explicit prompting for edge cases",
      "It improves the AI's understanding of the feature"
    ],
    correct: 2,
    explanation: "AI often generates optimistic happy-path descriptions. Explicitly requesting edge cases in the response format forces consideration of failure modes and boundary conditions that are critical for robust product design."
  },
  {
    id: 7,
    section: "6.1 PM Lab",
    question: "What is the key difference between using AI for 'first draft' vs 'final output' in PM work?",
    options: [
      "First drafts use cheaper AI models",
      "Final outputs require more tokens",
      "First drafts need less prompt precision; final outputs need careful engineering and human review",
      "There is no meaningful difference"
    ],
    correct: 2,
    explanation: "First drafts benefit from AI's speed and require less prompt precision — you'll refine them anyway. Final outputs need careful prompt engineering and thorough human review for accuracy and tone."
  },
  {
    id: 8,
    section: "6.1 PM Lab",
    question: "Why does the PM Lab recommend starting with a specific work task rather than a generic exercise?",
    options: [
      "Generic exercises are too easy",
      "Real tasks provide natural context that makes prompts more specific and output immediately useful",
      "It saves time during the lab",
      "Generic exercises cause more hallucinations"
    ],
    correct: 1,
    explanation: "Real tasks provide natural context and constraints that make prompts more specific. The output is immediately useful rather than theoretical, reinforcing the value of AI-assisted workflows."
  },
  {
    id: 9,
    section: "6.2 Citizen Coder Lab",
    question: "What should a citizen coder provide to get the best data model from AI?",
    options: [
      "A database schema diagram",
      "SQL table definitions",
      "A plain-English description of what the app does and who uses it",
      "A list of API endpoints"
    ],
    correct: 2,
    explanation: "A plain-English description of the app's purpose and users is the best input. Entities and relationships emerge naturally from use cases, not from technical specifications. AI bridges the gap between 'what I want' and 'how to structure it.'"
  },
  {
    id: 10,
    section: "6.2 Citizen Coder Lab",
    question: "Why focus on user ACTIONS rather than screen APPEARANCE when generating UI specs?",
    options: [
      "Actions are easier for AI to generate",
      "Appearance can't be described in text",
      "Actions define functionality and flow; appearance is a separate design decision",
      "Users don't care about appearance"
    ],
    correct: 2,
    explanation: "Actions define functionality and flow, which is what matters for building an app. Appearance is a design decision that comes later. AI can describe functional screens effectively but shouldn't dictate visual design."
  },
  {
    id: 11,
    section: "6.2 Citizen Coder Lab",
    question: "What is pseudo-code, and why is it useful for citizen coders?",
    options: [
      "Compiled code that runs faster than regular code",
      "Code written in Python specifically for beginners",
      "Structured English that describes logic step-by-step without programming syntax",
      "AI-generated code that needs human debugging"
    ],
    correct: 2,
    explanation: "Pseudo-code is structured English that describes logic step-by-step without programming syntax. It bridges the gap between 'what I want' and 'what the code does,' making it ideal for non-programmers working with AI."
  },
  {
    id: 12,
    section: "6.2 Citizen Coder Lab",
    question: "When generating Excel formulas with AI, what information produces the best results?",
    options: [
      "The spreadsheet's file name and size",
      "Column names, example data, and a plain-English description of the desired calculation",
      "The version of Excel being used",
      "A screenshot of the spreadsheet"
    ],
    correct: 1,
    explanation: "Column names, example data, and a plain-English description of the desired calculation give AI the specific context it needs to generate accurate formulas. The more specific the context, the more accurate the formula."
  },
  {
    id: 13,
    section: "6.2 Citizen Coder Lab",
    question: "Why does the lab recommend picking 2 outputs (data model + UI, or UI + logic) rather than all 4?",
    options: [
      "AI can only handle 2 tasks at a time",
      "Building a complete spec in one session is overwhelming; two complementary outputs create a useful partial spec",
      "The other outputs aren't important",
      "It reduces API costs"
    ],
    correct: 1,
    explanation: "Building a complete spec in one session is overwhelming. Two complementary outputs create a useful partial spec that can be extended later, keeping the exercise focused and achievable."
  },
  {
    id: 14,
    section: "6.2 Citizen Coder Lab",
    question: "What is the biggest risk when using AI to generate workflow logic?",
    options: [
      "The logic will be too slow to execute",
      "The AI may produce logic that looks correct but handles edge cases incorrectly",
      "Workflow logic can't be expressed in pseudo-code",
      "AI-generated logic is always wrong"
    ],
    correct: 1,
    explanation: "AI may produce logic that looks correct at first glance but handles edge cases incorrectly. Human review of the logic flow is essential before implementation to catch subtle errors."
  },
  {
    id: 15,
    section: "6.2 Citizen Coder Lab",
    question: "How does API integration planning differ from other citizen coder tasks in terms of AI reliability?",
    options: [
      "AI is more reliable for API planning than other tasks",
      "API planning doesn't need AI assistance",
      "API planning requires knowledge of specific endpoints that may have changed since the AI's training cutoff",
      "APIs are too simple for AI to help with"
    ],
    correct: 2,
    explanation: "API planning requires knowledge of specific endpoint formats and authentication methods that may have changed since the AI's training cutoff. Always verify AI-generated API information against current documentation."
  }
];
```

**Results recommendation text (use in ResultsView):**
- ≥90%: "Outstanding! You've mastered applying AI to role-specific workflows. You understand when AI adds the most value and how to craft effective prompts for PM and citizen coder tasks."
- ≥70%: "Good understanding of applied AI workflows! Review the questions you missed — focus on understanding WHY certain approaches work better for specific roles."
- <70%: "Consider revisiting the PM Lab and Citizen Coder Lab guides. Focus on the value-map tables and prompt-building exercises to build intuition for when and how AI helps most."

- [ ] **Step 1:** Read `guides/architectures/quiz.html` as the quiz structural template
- [ ] **Step 2:** Create the full `guides/role-labs/quiz.html` file with all 15 questions, SECTION_ICONS, and module-complete-cta pointing to `../build-labs/rag-build.html`
- [ ] **Step 3:** Verify the file loads in a browser
- [ ] **Step 4:** Verify quiz has 15 questions and results render correctly
- [ ] **Step 5:** Commit

---

## Task 9: Create `guides/build-labs/quiz.html` (Module 7 Quiz)

**Files:**
- Create: `guides/build-labs/quiz.html`

**Guide number:** 7.6
**Title:** Module 7 Quiz
**Back link:** `../../index.html`

The implementer MUST read `guides/architectures/quiz.html` as the quiz structural template.

**Module-complete CTA:** Points to Final Exam:
```jsx
<a href="../final-exam/quiz.html" className="continue-btn">
  Continue to the Final Exam →
</a>
```

**Quiz actions:**
```jsx
<div className="quiz-actions" role="group" aria-label="Quiz actions">
  <button type="button" className="action-btn" onClick={onRetry} aria-label="Retry this quiz">↻ Retry quiz</button>
  <a href="../../index.html#module-7" className="action-btn" aria-label="Review Module 7">📖 Review module</a>
</div>
```

**SECTION_ICONS:** 5 entries for keys `"7.1"` through `"7.5"`. Create simple SVG icon strings:
- `"7.1"`: search/magnifier icon (RAG theme)
- `"7.2"`: gear/flow icon (workflow theme)
- `"7.3"`: robot icon (agent theme)
- `"7.4"`: people/group icon (multi-agent theme)
- `"7.5"`: graduation cap icon (capstone theme)

**15 Questions (full objects):**

```js
const QUESTIONS = [
  {
    id: 1,
    section: "7.1 RAG Build",
    question: "What is the recommended starting chunk size when building a RAG system?",
    options: [
      "50 tokens",
      "500 tokens",
      "5,000 tokens",
      "The entire document as one chunk"
    ],
    correct: 1,
    explanation: "~500 tokens is the recommended starting point — small enough for precision in retrieval, large enough to maintain context within each chunk. Adjust based on testing with your specific documents."
  },
  {
    id: 2,
    section: "7.1 RAG Build",
    question: "Why should you test RAG with questions you already know the answer to?",
    options: [
      "It's faster than testing with unknown questions",
      "Known answers let you evaluate accuracy — you can't judge correctness on questions where you don't know the right answer",
      "It prevents the RAG system from hallucinating",
      "Known questions are easier for the system to handle"
    ],
    correct: 1,
    explanation: "You can only evaluate accuracy when you have ground truth to compare against. Testing with unknown questions means you can't tell whether the system's answer is correct, partially correct, or completely wrong."
  },
  {
    id: 3,
    section: "7.1 RAG Build",
    question: "What is the most common reason a RAG system returns irrelevant results?",
    options: [
      "The LLM is too small",
      "The embedding model is outdated",
      "Poor chunking strategy — documents split at wrong boundaries lose context",
      "The vector database is too slow"
    ],
    correct: 2,
    explanation: "Poor chunking strategy is the most common culprit. Documents split at wrong boundaries lose the context that the retriever needs to find relevant passages. Fixing chunking often improves results more than upgrading the LLM."
  },
  {
    id: 4,
    section: "7.2 Workflow Build",
    question: "What causes most workflow failures?",
    options: [
      "AI models being too slow",
      "Insufficient API rate limits",
      "Data format mismatches between steps",
      "Network connectivity issues"
    ],
    correct: 2,
    explanation: "Data format mismatches between steps are the most common failure — one node outputs JSON but the next expects plain text, or field names don't match. Always check the data shape between nodes."
  },
  {
    id: 5,
    section: "7.2 Workflow Build",
    question: "Why should you 'map before you build' when creating AI workflows?",
    options: [
      "Mapping is required by workflow tools",
      "It creates better documentation",
      "Drawing the flow on paper catches logic errors before you invest time wiring up nodes",
      "It makes the workflow run faster"
    ],
    correct: 2,
    explanation: "Drawing the flow on paper catches logic errors and missing steps before you invest time wiring up nodes in a tool. It's much easier to rearrange boxes on paper than to rewire connected nodes in a workflow platform."
  },
  {
    id: 6,
    section: "7.2 Workflow Build",
    question: "What makes the AI node prompt the most critical part of a workflow?",
    options: [
      "It uses the most compute resources",
      "Every downstream step inherits the quality of the AI output — vague prompts cascade",
      "It's the hardest to configure",
      "AI nodes are the most expensive"
    ],
    correct: 1,
    explanation: "Every downstream step inherits the quality of the AI output. A vague prompt produces vague results that cascade through the entire pipeline, compounding errors at each step."
  },
  {
    id: 7,
    section: "7.3 Agent Build",
    question: "What distinguishes an AI agent from an AI workflow?",
    options: [
      "Agents are faster than workflows",
      "Agents use more expensive models",
      "Agents make dynamic decisions about tools and steps; workflows follow predefined paths",
      "Workflows can't use AI models"
    ],
    correct: 2,
    explanation: "Agents make dynamic decisions about which tools to use and what steps to take based on intermediate results. Workflows follow predefined paths regardless of the input — the sequence is fixed at design time."
  },
  {
    id: 8,
    section: "7.3 Agent Build",
    question: "What is the most common cause of agent 'looping' (repeating the same action)?",
    options: [
      "A bug in the AI model",
      "Too many available tools",
      "Unclear success criteria in the system prompt",
      "Insufficient compute resources"
    ],
    correct: 2,
    explanation: "Unclear success criteria in the system prompt means the agent doesn't know what 'done' looks like, so it keeps trying. Explicitly defining completion conditions in the prompt is the most effective fix."
  },
  {
    id: 9,
    section: "7.3 Agent Build",
    question: "Why does the lab recommend testing with exactly 3 queries?",
    options: [
      "More queries would be too expensive",
      "Three is the minimum to expose obvious failure modes without over-investing before fixing issues",
      "AI agents can only handle 3 queries per session",
      "It matches the number of tools available"
    ],
    correct: 1,
    explanation: "Three queries is the minimum to expose obvious failure modes — a happy path, an edge case, and an out-of-scope request — without investing too much time before fixing the issues you discover."
  },
  {
    id: 10,
    section: "7.4 Multi-Agent Design",
    question: "When should you use a Supervisor pattern vs a Pipeline pattern?",
    options: [
      "Supervisor for small teams, Pipeline for large teams",
      "Supervisor when tasks are assigned dynamically; Pipeline when the sequence is known and fixed",
      "Supervisor for simple tasks, Pipeline for complex tasks",
      "They are interchangeable"
    ],
    correct: 1,
    explanation: "Use Supervisor when tasks can be assigned dynamically based on results — the orchestrator decides what to do next. Use Pipeline when the sequence is known and each agent's output feeds the next agent in a fixed order."
  },
  {
    id: 11,
    section: "7.4 Multi-Agent Design",
    question: "What is the most critical design element in a multi-agent system?",
    options: [
      "The number of agents",
      "The AI model used for each agent",
      "The handoff protocol — what passes between agents, in what format, and when",
      "The total number of tools available"
    ],
    correct: 2,
    explanation: "The handoff protocol defines what information passes between agents, in what format, and when. Poor handoffs cause agents to talk past each other, losing context and producing incoherent results."
  },
  {
    id: 12,
    section: "7.4 Multi-Agent Design",
    question: "Why does the lab recommend manual testing (copy-paste between chat windows) before automation?",
    options: [
      "Automated testing is too expensive",
      "Manual testing is faster",
      "If the design doesn't work with manual handoffs, automation won't fix it",
      "Chat windows provide better AI responses"
    ],
    correct: 2,
    explanation: "If the design doesn't work with manual handoffs, automation won't fix it — it'll just fail faster. Manual testing validates the agent roles and handoff protocol before adding the complexity of automation."
  },
  {
    id: 13,
    section: "7.5 Capstone",
    question: "Why does the Capstone recommend scoping to 'build the core in Week 1'?",
    options: [
      "Week 1 has the most available time",
      "If the core can't be built in a week, the project is too complex for a first iteration",
      "AI projects always take exactly one week",
      "It aligns with sprint planning"
    ],
    correct: 1,
    explanation: "If the core can't be built in a week, the project is too complex for a first iteration. Ship something small, learn from real usage, then iterate. Scoping to Week 1 forces simplicity."
  },
  {
    id: 14,
    section: "7.5 Capstone",
    question: "What is the purpose of the Architecture Decision Tree in the Capstone?",
    options: [
      "To recommend the cheapest architecture",
      "To provide a structured way to match use cases to architectures, preventing the 'most exciting' bias",
      "To rank architectures by difficulty",
      "To eliminate the need for prototyping"
    ],
    correct: 1,
    explanation: "The decision tree provides a structured, repeatable way to match a use case to the right architecture — preventing the common mistake of choosing the most exciting architecture instead of the most appropriate one for the problem."
  },
  {
    id: 15,
    section: "7.5 Capstone",
    question: "Why limit the solution design to exactly 3 AI prompts?",
    options: [
      "AI models can only process 3 prompts per request",
      "It's a design constraint that forces simplicity — more than 3 means the solution is likely too complex",
      "Three is the industry standard",
      "It reduces API costs"
    ],
    correct: 1,
    explanation: "It's a design constraint that forces simplicity. If a solution needs more than 3 AI prompts, it's likely too complex for a first iteration and should be scoped down. Simplicity enables faster shipping and learning."
  }
];
```

**Results recommendation text:**
- ≥90%: "Excellent! You've mastered the principles of building AI systems. From RAG prototypes to multi-agent architectures, you understand both the design patterns and the practical pitfalls."
- ≥70%: "Strong understanding of AI system building! Review the sections where you scored below 100%, particularly the failure modes and debugging strategies."
- <70%: "Consider revisiting the build lab guides. Focus on the hands-on exercises — building intuition for failure modes and debugging is the key skill these labs teach."

- [ ] **Step 1:** Read `guides/architectures/quiz.html` as the quiz structural template
- [ ] **Step 2:** Create the full `guides/build-labs/quiz.html` file with all 15 questions, SECTION_ICONS for "7.1"-"7.5", and module-complete-cta pointing to `../final-exam/quiz.html`
- [ ] **Step 3:** Verify the file loads in a browser
- [ ] **Step 4:** Verify quiz has 15 questions and results render correctly
- [ ] **Step 5:** Commit

---

## Task 10: Integration — Update `index.html` + `guides/architectures/quiz.html` + `CLAUDE.md`

**Files:**
- Modify: `index.html` (MODULES array + meta descriptions)
- Modify: `guides/architectures/quiz.html` (module-complete-cta)
- Modify: `CLAUDE.md` (module list)

### 10a: `index.html` — MODULES array

After the Module 5 closing `}` in the MODULES array (the line with `],` after the Module 5 quiz entry), add the Module 6 and Module 7 blocks:

```js
{
  id: 6,
  name: "Role Labs",
  category: "role-labs",
  guides: [
    { id: "6.1", title: "PM Lab", path: "guides/role-labs/pm-lab.html", badge: "USE CASE", available: true, emoji: "📋", desc: "Apply AI to product management workflows" },
    { id: "6.2", title: "Citizen Coder Lab", path: "guides/role-labs/citizen-coder-lab.html", badge: "USE CASE", available: true, emoji: "💻", desc: "Use AI to build apps without deep coding" },
    { id: "6.3", title: "Module 6 Quiz", path: "guides/role-labs/quiz.html", badge: "QUIZ", available: true, emoji: "📝", desc: "Test your applied AI skills" },
  ]
},
{
  id: 7,
  name: "Build Labs & Capstone",
  category: "build-labs",
  guides: [
    { id: "7.1", title: "RAG Build", path: "guides/build-labs/rag-build.html", badge: "USE CASE", available: true, emoji: "🔍", desc: "Build a RAG-powered Q&A system" },
    { id: "7.2", title: "Workflow Build", path: "guides/build-labs/workflow-build.html", badge: "USE CASE", available: true, emoji: "🔄", desc: "Create a multi-step AI automation" },
    { id: "7.3", title: "Agent Build", path: "guides/build-labs/agent-build.html", badge: "USE CASE", available: true, emoji: "🤖", desc: "Design an AI agent with tool use" },
    { id: "7.4", title: "Multi-Agent Design", path: "guides/build-labs/multi-agent-build.html", badge: "USE CASE", available: true, emoji: "👥", desc: "Architect a collaborative agent team" },
    { id: "7.5", title: "Capstone", path: "guides/build-labs/capstone.html", badge: "USE CASE", available: true, emoji: "🎓", desc: "Design your AI solution from scratch" },
    { id: "7.6", title: "Module 7 Quiz", path: "guides/build-labs/quiz.html", badge: "QUIZ", available: true, emoji: "📝", desc: "Test your build lab knowledge" },
  ]
},
```

### 10b: `index.html` — Meta descriptions

Change "Five modules" to "Seven modules" in these 3 locations:
- `<meta name="description">` (line 6)
- `<meta property="og:description">` (line 9)
- `<meta name="twitter:description">` (line 14)

### 10c: `guides/architectures/quiz.html` — Module-complete CTA

Find the `.module-complete-cta` section (around line 165-173). Change:

Current:
```jsx
<div className="celebrate-text">Module 5 Complete</span>
</div>
<a href="../final-exam/quiz.html" className="continue-btn">
  Continue to the Final Exam →
</a>
```

New:
```jsx
<span className="celebrate-text">Module 5 Complete</span>
</div>
<a href="../role-labs/pm-lab.html" className="continue-btn">
  Continue to Module 6: Role Labs →
</a>
```

Also update the review module link if present to keep `#module-5`.

### 10d: `CLAUDE.md` — Module list

Find the "### Five Modules" section header and rename to "### Seven Modules".

After the line for Module 5 (`5. **Architectures**...`), and before the Final Exam line, add:

```
6. **Role Labs** (`guides/role-labs/`) — 3 guides: pm-lab, citizen-coder-lab, quiz
7. **Build Labs & Capstone** (`guides/build-labs/`) — 6 guides: rag-build, workflow-build, agent-build, multi-agent-build, capstone, quiz
```

- [ ] **Step 1:** Read current state of all 3 files to find exact edit locations
- [ ] **Step 2:** Apply MODULES array additions to `index.html`
- [ ] **Step 3:** Apply meta description changes to `index.html`
- [ ] **Step 4:** Apply module-complete-cta change to `guides/architectures/quiz.html`
- [ ] **Step 5:** Apply module list update to `CLAUDE.md`
- [ ] **Step 6:** Verify: `grep -c "role-labs\|build-labs" index.html` shows the new entries
- [ ] **Step 7:** Commit

---

## Task 11: Final verification sweep

- [ ] **Step 1:** All 9 new HTML files exist: `ls guides/role-labs/ guides/build-labs/`
- [ ] **Step 2:** `index.html` shows 7 modules (count MODULES entries)
- [ ] **Step 3:** NEXT_GUIDE chain verification:
  - `grep "NEXT_GUIDE" guides/role-labs/pm-lab.html` → citizen-coder-lab
  - `grep "NEXT_GUIDE" guides/role-labs/citizen-coder-lab.html` → quiz.html (isQuiz)
  - `grep "NEXT_GUIDE" guides/build-labs/rag-build.html` → workflow-build
  - `grep "NEXT_GUIDE" guides/build-labs/workflow-build.html` → agent-build
  - `grep "NEXT_GUIDE" guides/build-labs/agent-build.html` → multi-agent-build
  - `grep "NEXT_GUIDE" guides/build-labs/multi-agent-build.html` → capstone
  - `grep "NEXT_GUIDE" guides/build-labs/capstone.html` → quiz.html (isQuiz)
- [ ] **Step 4:** Module 5 quiz CTA: `grep "role-labs" guides/architectures/quiz.html` → confirms link
- [ ] **Step 5:** Module 6 quiz CTA: `grep "build-labs" guides/role-labs/quiz.html` → confirms link to rag-build
- [ ] **Step 6:** Module 7 quiz CTA: `grep "final-exam" guides/build-labs/quiz.html` → confirms link
- [ ] **Step 7:** Quiz question counts: Module 6 = 15, Module 7 = 15
- [ ] **Step 8:** Meta descriptions: `grep "Seven modules" index.html` → 3 matches
- [ ] **Step 9:** CLAUDE.md: `grep "Seven Modules\|Role Labs\|Build Labs" CLAUDE.md` → confirms
- [ ] **Step 10:** Browser smoke test: open each new guide, verify loads without JSX errors

---

## Execution Notes

- **Tasks 1-7** create new files and are independent — can run sequentially per subagent-driven-development rules.
- **Tasks 8-9** create quizzes and are independent of each other but independent of Tasks 1-7.
- **Task 10** is integration — depends on Tasks 1-9 being committed (so file paths resolve).
- **Task 11** is verification — depends on everything else.
- **Model selection:**
  - Tasks 1-7 (creative guide creation): **sonnet** model — substantial creative + code generation (~900-1200 lines each)
  - Tasks 8-9 (quiz creation): **sonnet** model — requires crafting full quiz structure
  - Task 10 (mechanical integration): **haiku** model — straightforward edits to 3 files
  - Task 11 (verification): **haiku** model — grep commands and file checks
- The implementer for each guide task MUST read `guides/fundamentals/what-is-genai.html` first as the structural template.
- The implementer for each quiz task MUST read `guides/architectures/quiz.html` first as the quiz template.
