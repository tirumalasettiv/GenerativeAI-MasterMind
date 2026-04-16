# Phase 5 — Curriculum Labs Design

**Date:** 2026-04-16
**Parent plan:** `docs/superpowers/plans/2026-04-15-phase-1-foundations.md` (Phase 5 of 6)
**Goal:** Create two new lab modules (Role Labs + Build Labs & Capstone) that turn the curriculum's hands-on Days 5-6 and 10-14 into interactive guides, completing the platform's coverage of the 14-day training program.

---

## Context

Phases 1-4 built and polished the platform's conceptual content: 5 modules (30 guides), shared CSS, accessibility, meta tags, and 3 new fundamentals guides. The 14-Day Curriculum document (`docs/14-Day-Generative-AI-Training-Curriculum.md`) describes Days 5-6 (role labs) and Days 10-14 (build labs + capstone) as hands-on exercises — but no interactive guides exist for them yet.

Phase 5 creates these lab guides. Labs differ from concept guides: instead of explaining ideas, they provide exercise templates, prompt builders, checklists, and worked examples that learners work through. They use the same two-panel, 5-stage layout as existing guides but with exercise-focused content. The "USE CASE" badge (defined in `index.html` BADGE_COLORS but never used) marks all lab guides.

---

## Module Structure

### Module 6: Role Labs (`guides/role-labs/`)

| ID | Title | Badge | File | Curriculum Day |
|---|---|---|---|---|
| 6.1 | PM Lab | USE CASE | `pm-lab.html` | Day 5 |
| 6.2 | Citizen Coder Lab | USE CASE | `citizen-coder-lab.html` | Day 6 |
| 6.3 | Module 6 Quiz | QUIZ | `quiz.html` | — |

### Module 7: Build Labs & Capstone (`guides/build-labs/`)

| ID | Title | Badge | File | Curriculum Day |
|---|---|---|---|---|
| 7.1 | RAG Build | USE CASE | `rag-build.html` | Day 10 |
| 7.2 | Workflow Build | USE CASE | `workflow-build.html` | Day 11 |
| 7.3 | Agent Build | USE CASE | `agent-build.html` | Day 12 |
| 7.4 | Multi-Agent Design | USE CASE | `multi-agent-build.html` | Day 13 |
| 7.5 | Capstone | USE CASE | `capstone.html` | Day 14 |
| 7.6 | Module 7 Quiz | QUIZ | `quiz.html` | — |

**Total new files:** 9 (7 content guides + 2 quizzes)

---

## Guide Format

All lab guides follow the existing two-panel layout pattern from `guides/fundamentals/what-is-genai.html`:

- `<head>` with meta/OG tags, Google Fonts, `guide-shared.css`, React/Babel CDN
- Inline `<style>` with only guide-specific component styles
- `<script type="text/babel">` with 5 stage components, sidebar icons, NEXT_GUIDE, stages array, Guide() main component
- Accessibility: skip-link, `<aside>`, `<nav>`, `<main id="main">`, button elements with aria-label/aria-current, disclosure cards with aria-expanded/aria-controls/onKeyDown

**Lab-specific interactive patterns:**

1. **Prompt builder** — fillable text areas that construct a COSTAR-style prompt from user inputs. React `useState` tracks each field. A "Generate Preview" button assembles the fields into a formatted prompt block. Used in PM Lab (S2), Citizen Coder Lab (S2-S4), Agent Build (S3).

2. **Scorecard/checklist** — interactive checkbox list where learners mark items done/pass/fail. Each item is a `useState(null)` toggled to `'pass'`/`'partial'`/`'fail'` on click. A summary count renders at the bottom. Used in RAG Build (S4), Workflow Build (S4).

3. **Fillable card grid** — cards with editable text fields that build up a design artifact. Each card has a title, subtitle, and a `<textarea>` or `<input>` bound to state. Used in Multi-Agent Design (S2-S3), Capstone (S1, S3, S4).

4. **Decision tree** — clickable flowchart nodes that highlight a path. Clicking a node expands the next decision. The final node shows the recommended architecture with a rationale card. Used in Capstone (S2). SVG-based, reusing the decision framework from the curriculum.

5. **Example toggle** — "Show Example" button that reveals a pre-built worked example below the exercise template. Lets learners peek at an example without it dominating the screen. Used across most lab stages.

All interactive state is ephemeral (`useState` only) — nothing persists across page loads. The value is in the guided thinking process.

---

## Per-Guide Stage Breakdown

### 6.1 PM Lab

**Guide number:** 6.1
**Title:** PM Lab
**Meta description:** "Hands-on lab: apply AI to product management workflows. Generate user stories, build competitive analysis, draft PRDs, and transform changelogs into release notes."
**NEXT_GUIDE:** `{ id: "6.2", title: "Citizen Coder Lab", module: "Module 6", href: "./citizen-coder-lab.html" }`

| # | Label | Header | Content |
|---|---|---|---|
| 1 | Use Cases | Where AI Supercharges PM Work | Value map table (5 rows: user stories, competitive analysis, PRDs, release notes, meeting summaries) with task, AI value, and time-savings % columns. Each row is a disclosure card with a 2-sentence explanation + example prompt snippet. |
| 2 | User Stories | From Brief to Backlog in Seconds | Prompt builder exercise. Input: paste/type a feature brief (textarea, ~3 sentences). Template fills COSTAR fields (Context=brief, Objective=user stories, Style=Agile format, Tone=technical, Audience=dev team, Response=numbered list). "Show Example" toggle reveals a worked example (e-commerce checkout feature → 5 user stories). |
| 3 | Competitive | Build a Competitive Analysis Framework | Fillable grid: 3 competitor columns × 5 dimension rows (pricing, features, target market, strengths, weaknesses). Pre-filled example for "project management tools" (Asana vs Monday vs Notion). Prompt template for asking AI to research and fill gaps. |
| 4 | PRD & Release | Draft Documents That Ship | Two tabbed exercises. Tab 1 "Release Notes": paste a changelog (example pre-filled) → prompt template to transform into customer-friendly release notes. Tab 2 "PRD Section": paste feature bullets → prompt template to expand into a PRD section with user impact, acceptance criteria, and edge cases. |
| 5 | Your Turn | Apply to Your Own Work | Reflection exercise. Learner picks one PM task from the S1 value map, writes a prompt using techniques from S2-S4. Summary card auto-generates: chosen task + prompt + expected output format. Insight box: "The best AI prompts come from real work, not exercises. The prompt you just wrote is more valuable than any example we could give you." |

**Insight texts:**
1. "AI doesn't replace PM judgment — it eliminates the blank page. Getting from zero to a first draft in seconds means you spend your time refining, not starting."
2. "The feature brief IS the context. The more specific your brief, the more specific your user stories. Garbage in, garbage out applies to AI prompts too."
3. "Competitive analysis is where AI shines brightest for PMs — it can structure your thinking even when it can't do the research (yet)."
4. "Release notes are a translation exercise: technical changelog → customer value. AI is excellent at translation when you specify the audience clearly."
5. "The best AI prompts come from real work, not exercises. The prompt you just wrote is more valuable than any example we could give you."

### 6.2 Citizen Coder Lab

**Guide number:** 6.2
**Title:** Citizen Coder Lab
**Meta description:** "Hands-on lab: use AI to build apps without deep coding. Design data models, generate UI specs, write workflow logic, and create Excel formulas from descriptions."
**NEXT_GUIDE:** `{ id: "6.3", title: "Module 6 Quiz", module: "Module 6", href: "./quiz.html", isQuiz: true }`

| # | Label | Header | Content |
|---|---|---|---|
| 1 | Use Cases | AI as Your Co-Builder | Value map table (5 rows: data model design, UI wireframe specs, workflow logic, formula writing, API integration planning) with task, AI value, and time-savings % columns. Disclosure cards with examples. |
| 2 | Data Model | From Idea to Entity-Relationship | Prompt builder: describe an app idea in plain English (textarea). COSTAR template fills (Objective=data model, Response=entity list with fields and relationships). "Show Example" toggle: "todo app with teams" → entities (User, Team, Task, Label) with relationships. |
| 3 | UI Screens | Generate Screen-by-Screen Specs | Prompt builder: list features (textarea) → prompt asks AI for screen descriptions. "Show Example": "todo app" → 4 screen specs (Dashboard, Task Detail, Team View, Settings) each with header, components, actions. |
| 4 | Logic | Plain English to Pseudo-Code | Two exercises. Tab 1 "Workflow": describe a business process → prompt generates pseudo-code steps. Example: lead enrichment pipeline. Tab 2 "Formulas": describe what you want to calculate → prompt generates Excel/Sheets formula. Example: "calculate days between order and delivery, flag if > 5 days." |
| 5 | Your Turn | Build Your Own App Spec | Learner describes their app idea, picks 2 outputs from S2-S4 (data model + UI, or UI + logic, etc.). Summary card assembles the mini-spec. Insight box about iteration. |

**Insight texts:**
1. "You don't need to code to build — you need to describe clearly. AI turns clear descriptions into technical specifications that developers (or no-code tools) can implement."
2. "A data model is the skeleton of your app. Get this right and everything else — screens, logic, APIs — follows naturally."
3. "The best UI specs describe what the user DOES, not what the screen LOOKS like. Focus on actions and flows, not pixel positions."
4. "Pseudo-code is just structured thinking. If you can describe a process in steps, you can generate the logic — AI handles the syntax."
5. "You just went from 'I have an idea' to 'I have a spec' in 15 minutes. That's what AI-powered building looks like."

### 7.1 RAG Build

**Guide number:** 7.1
**Title:** RAG Build
**Meta description:** "Hands-on lab: build a RAG-powered Q&A system. Upload documents, configure retrieval, write system prompts, test with real questions, and refine for accuracy."
**NEXT_GUIDE:** `{ id: "7.2", title: "Workflow Build", module: "Module 7", href: "./workflow-build.html" }`

| # | Label | Header | Content |
|---|---|---|---|
| 1 | Overview | What You'll Build | RAG architecture diagram (SVG, simplified from Module 5 RAG guide — shows User → Retriever → Knowledge Base → LLM → Output). Tool comparison cards: ChatGPT file upload (easiest), Dify.ai (more control), custom LangChain (most flexible). Each card shows: setup time, customization level, best for. |
| 2 | Documents | Prepare Your Knowledge Base | Checklist exercise: document selection tips (3-5 docs, 2-10 pages each, text-heavy). Chunking strategy overview (3 disclosure cards: fixed-size, paragraph-based, semantic). System prompt template with fillable fields: role, knowledge scope, answer style, citation format. |
| 3 | Build | Configure and Connect | Step-by-step build instructions presented as a numbered visual checklist (not interactive checkboxes — instructional). Tool-specific tabs (ChatGPT / Dify / LangChain) each with 4-step walkthrough. System prompt builder: learner fills in template fields from S2, sees assembled prompt. |
| 4 | Test | Run Your Test Suite | Interactive scorecard: 10 pre-suggested question types (factual, comparative, multi-doc, edge case, out-of-scope, etc.). Each row: question type + example + result toggle (correct/partial/wrong). Summary stats render at bottom: X correct, Y partial, Z wrong. Refinement tips based on failure patterns. |
| 5 | Results | Document and Improve | Three fillable cards: "What worked" (textarea), "What failed" (textarea), "3 improvements" (3 input fields). Deep-dive link back to `guides/architectures/rag.html` for the conceptual foundation. |

**Insight texts:**
1. "RAG doesn't make AI smarter — it makes AI informed. The quality of your answers is bounded by the quality of your documents."
2. "Chunking is the most underrated part of RAG. Too large and the LLM gets confused; too small and it loses context. Start with 500-token chunks and adjust."
3. "Your system prompt is the personality of your Q&A bot. 'You are a helpful assistant' is not enough — specify the domain, the citation style, and what to say when it doesn't know."
4. "Test with questions you KNOW the answer to. You can't evaluate accuracy on questions where you'd need the RAG system to find the answer."
5. "A RAG system is never 'done' — it's always 'good enough for now.' The best systems improve continuously based on real user questions."

### 7.2 Workflow Build

**Guide number:** 7.2
**Title:** Workflow Build
**Meta description:** "Hands-on lab: build a multi-step AI workflow. Map your process, connect triggers and AI nodes, test end-to-end, and debug common failures."
**NEXT_GUIDE:** `{ id: "7.3", title: "Agent Build", module: "Module 7", href: "./agent-build.html" }`

| # | Label | Header | Content |
|---|---|---|---|
| 1 | Overview | What You'll Build | Workflow pipeline diagram (SVG: Trigger → Step 1 → Step 2 → Step 3 → Output, with LLM icons on AI steps). Tool cards: n8n (open source, self-host), Make/Integromat (visual, cloud), Zapier (easiest, limited AI), Power Automate (enterprise). |
| 2 | Map | Design Your Flow | Two example workflows as interactive step-lists: PM "Weekly Competitor Monitor" (6 steps) and Coder "Lead Enrichment" (6 steps). Each step is a card showing: step name, type (trigger/AI/code/output), input, output. Below: fillable 5-7 step template for learner's own workflow. |
| 3 | Build | Wire Up Your Nodes | Step-by-step instructions: (1) Create trigger, (2) Add first processing node, (3) Add AI node with prompt, (4) Add output node. Prompt template for AI nodes: "You are a [role]. Given this input: {{previous_step_output}}, [task]. Output format: [format]." Tabbed by tool (n8n / Make / Zapier). |
| 4 | Test | End-to-End Debugging | Interactive checklist: 6 common failure points (trigger doesn't fire, wrong data format, AI prompt too vague, rate limit hit, output malformed, missing error handling). Each item is a disclosure card with symptoms, diagnosis, and fix. Scorecard: learner marks each test pass/fail. |
| 5 | Results | Document Your Flow | Summary card: learner's workflow name + step count + tool used. Three fillable fields: "What worked," "What broke," "3 improvements." Deep-dive link to `guides/architectures/workflows.html`. |

**Insight texts:**
1. "Workflows turn 'I do this manually every week' into 'this runs automatically every week.' The first workflow you automate will save you more time than you expect."
2. "Map before you build. Drawing your 5-7 steps on paper (or in a card layout) catches logic errors before you wire up nodes and wonder why nothing works."
3. "The AI node prompt is the most important part of your workflow. A vague prompt produces vague output — and every downstream step inherits that vagueness."
4. "Most workflow failures aren't AI failures — they're data format mismatches. Step 2 outputs JSON but Step 3 expects plain text. Always check the data shape between nodes."
5. "Your first workflow will be ugly. That's fine. Ship it, run it for a week, then improve based on real failures — not hypothetical ones."

### 7.3 Agent Build

**Guide number:** 7.3
**Title:** Agent Build
**Meta description:** "Hands-on lab: build an AI agent with tool use. Define goals, write system prompts, select tools, test with real queries, and analyze failure modes."
**NEXT_GUIDE:** `{ id: "7.4", title: "Multi-Agent Design", module: "Module 7", href: "./multi-agent-build.html" }`

| # | Label | Header | Content |
|---|---|---|---|
| 1 | Overview | What You'll Build | Agent loop diagram (SVG: User → Agent Brain → Tools → Decide → Continue/Stop → Output). Two example designs as cards: PM "Market Research Agent" (goal, tools, output) and Coder "Code Helper Agent" (goal, tools, output). Comparison: when agent > workflow (dynamic decisions, unknown steps, tool selection). |
| 2 | Define | Design Your Agent | Three fillable cards: (1) Goal — what the agent accomplishes (textarea), (2) Tools — checklist of available tools (web search, calculator, database, file reader, APIs, code interpreter — clickable toggles), (3) Constraints — what the agent should NOT do (textarea). "Show Example" with pre-filled market research agent. |
| 3 | Prompt | Write the System Prompt | Structured prompt builder with 5 sections: Role ("You are a..."), Goal ("Your task is to..."), Tools ("You have access to..."), Constraints ("Never... Always..."), Output Format ("Respond with..."). Each section is a textarea. Assembled prompt preview renders below. |
| 4 | Test | Run Three Queries | Interactive test logger: 3 rows, each with: Query (textarea), Response summary (textarea), Rating (1-5 clickable circles), Notes (textarea). Summary bar: average rating + pass/fail count. Tips for improving based on common scores. |
| 5 | Failures | Analyze and Improve | Failure categorization exercise: 5 failure types as clickable cards (Loops — agent repeats same action, Wrong Tool — picks inappropriate tool, Hallucination — makes up results, Scope Creep — goes beyond the goal, Gives Up — stops too early). Learner selects which failures they observed, each reveals a fix strategy. |

**Insight texts:**
1. "An agent is a workflow that can improvise. That's its power and its risk — it might find a creative solution, or it might go in circles."
2. "The goal is the most important part of agent design. Vague goals produce wandering agents. 'Research X and summarize with sources' beats 'help me with X.'"
3. "A good agent system prompt reads like onboarding instructions for a new employee: here's your role, here are your tools, here's what done looks like, here's what to avoid."
4. "Three queries isn't enough to trust an agent — but it's enough to find the obvious failure modes. Fix those before scaling up."
5. "Every agent failure teaches you something about the gap between what you asked for and what the agent understood. The fix is almost always a clearer prompt."

### 7.4 Multi-Agent Design

**Guide number:** 7.4
**Title:** Multi-Agent Design
**Meta description:** "Hands-on lab: design a multi-agent AI system. Choose collaboration patterns, define agent roles, write prompts, design handoff protocols, and plan testing."
**NEXT_GUIDE:** `{ id: "7.5", title: "Capstone", module: "Module 7", href: "./capstone.html" }`

| # | Label | Header | Content |
|---|---|---|---|
| 1 | Patterns | Four Ways Agents Collaborate | 4 disclosure cards, each with an SVG diagram: (1) Supervisor — one agent coordinates others (org chart SVG), (2) Debate — agents argue positions (back-and-forth SVG), (3) Pipeline — sequential handoff (assembly line SVG), (4) Swarm — parallel work, merged results (hub-and-spoke SVG). Each card includes: when to use, example, tradeoff (reliability vs flexibility). |
| 2 | Roles | Define Your Agent Team | 3-agent team builder: three fillable cards, each with: Name (input), Specialty (input), Tools (checklist toggles from same set as Agent Build), Input (what this agent receives — input), Output (what this agent produces — input). "Show Example" reveals pre-filled "Product Launch Team" (Strategist → Copywriter → Reviewer). |
| 3 | Prompts | Write Each Agent's Instructions | Three prompt builder sections (one per agent from S2): Role, Specialty Context, Input Format, Task, Output Format, Constraints. Each section is a textarea. Assembled prompts render side by side. |
| 4 | Handoffs | Design the Communication Protocol | Handoff builder: visual cards connecting Agent 1 → Agent 2 → Agent 3 (matching the order from S2). Each connection card has: what info passes (textarea), format (dropdown: plain text / JSON / structured report), decision point (textarea: "When does this agent hand off?"). Feedback loop toggle: does Agent 3 send back to Agent 1? If yes, shows revision criteria field. |
| 5 | Test Plan | How to Validate Your Design | Test plan template: (1) Manual test instructions — "Copy Agent 1's output, paste as Agent 2's input in a separate chat window." (2) Three test scenario fields (textarea each). (3) Expected behavior for each (textarea). (4) Tips for what to look for (common multi-agent failures: miscommunication, lost context, infinite revision loops). Deep-dive link to `guides/architectures/agentic-ai.html`. |

**Insight texts:**
1. "Multi-agent systems aren't about having more agents — they're about having the RIGHT agents. Three focused specialists beat ten generalists."
2. "Agent roles should be as distinct as job titles. If you can't explain what makes Agent 2 different from Agent 1 in one sentence, they should be the same agent."
3. "The system prompt is the agent's job description. Write it like you're onboarding a contractor: clear scope, explicit deliverables, defined handoff points."
4. "The handoff protocol IS the architecture. Poorly defined handoffs create agents that talk past each other — like a relay race where nobody knows when to pass the baton."
5. "Manual testing with copy-paste between chat windows is crude but effective. If your design doesn't work manually, automation won't fix it — it'll just fail faster."

### 7.5 Capstone

**Guide number:** 7.5
**Title:** Capstone
**Meta description:** "Design your AI-powered solution from scratch. Choose a problem, select an architecture, design components, plan implementation, and build your pitch — all in one interactive canvas."
**NEXT_GUIDE:** `{ id: "7.6", title: "Module 7 Quiz", module: "Module 7", href: "./quiz.html", isQuiz: true }`

| # | Label | Header | Content |
|---|---|---|---|
| 1 | Problem | Choose Your Challenge | Three fillable cards: (1) Problem Statement — "What repetitive task do you want to improve?" (textarea), (2) Current Process — "How do you do this today?" (textarea), (3) Time Estimate — two number inputs: "Minutes today" and "Target minutes" with auto-calculated savings %. Insight about picking the right problem (repetitive, text-heavy, imperfect-is-OK). |
| 2 | Architecture | Pick Your Pattern | Interactive decision tree (SVG flowchart, based on the curriculum's Architecture Decision Framework). 5 clickable decision nodes: "Need your own data?" → Yes/No → "Need multiple steps?" → etc. Clicking each answer highlights the path and grays out irrelevant branches. Final node is one of 5 architectures with a 2-sentence rationale card. A "Why this fits" summary auto-generates from the path chosen. |
| 3 | Solution | Design Your Components | Fillable component cards: (1) Data Sources — "What data does your solution need?" (textarea), (2) Tools & Integrations — checklist toggles (same tool set from earlier labs: web search, database, APIs, file upload, no-code platform, code interpreter), (3) AI Prompts Needed — 3 prompt description fields (input + textarea each: prompt name + what it does). Cards highlight as learner fills them. |
| 4 | Plan | Map Your Implementation | 3-week timeline with editable milestone cards. Week 1: "Build the core" (textarea). Week 2: "Test and refine" (textarea). Week 3-4: "Deploy and measure" (textarea). Success metrics field: "How will you know it worked?" (textarea). Each week card has a visual progress indicator (empty → filled as text is entered). |
| 5 | Pitch | Your 3-Minute Summary | Auto-assembled pitch card that pulls from S1-S4: Problem (from S1), Architecture (from S2 decision), Components (from S3), Timeline (from S4), Expected savings (from S1 time estimate). Styled as a presentation slide with sections. Below: "What to say" coaching — 3 bullet points for structuring a verbal pitch (hook, demo, ask). |

**Insight texts:**
1. "Pick a problem you actually have — not one that sounds impressive. The best capstone projects solve real annoyances, not hypothetical grand challenges."
2. "The decision tree isn't prescriptive — it's a starting point. If your gut says 'agent' but the tree says 'workflow,' trust the tree for now. You can upgrade later."
3. "Three prompts is a design constraint, not a limitation. If your solution needs more than 3 AI prompts, it might be too complex for a first iteration. Simplify."
4. "Week 1 is the only week that matters right now. If you can't build the core in a week, scope down until you can. Ship something small, then iterate."
5. "You just went from 'I should use AI for something' to 'Here's my architecture, components, and timeline.' That's the real skill — not prompting, but designing AI solutions."

---

## Quiz Specifications

### Module 6 Quiz (15 questions)

**Guide number:** 6.3
**Title:** Module 6 Quiz
**File:** `guides/role-labs/quiz.html`
**Back link:** `../../index.html`

Questions span sections "6.1 PM Lab" (8 questions) and "6.2 Citizen Coder Lab" (7 questions). SECTION_ICONS entries needed for keys "6.1" and "6.2".

**Questions:**

1. (6.1) Which PM task typically sees the highest time savings (80-90%) from AI assistance? → Meeting summaries — extracting actions and decisions from transcripts is highly structured and repetitive.
2. (6.1) What is the most important input when generating user stories with AI? → A specific feature brief — the more detailed the context, the more relevant the user stories.
3. (6.1) Why should you specify "Audience: dev team" in a COSTAR prompt for user stories? → It tells the AI to use technical language and include acceptance criteria that developers need, rather than marketing-friendly descriptions.
4. (6.1) When using AI for competitive analysis, what is AI best at? → Structuring the framework and dimensions for comparison — the actual competitive data still needs human research and verification.
5. (6.1) What makes AI particularly effective at transforming changelogs into release notes? → It's a translation task: technical details → customer value. AI excels when the source material is complete and the output format is well-defined.
6. (6.1) In a PRD-drafting prompt, why include "edge cases" in the response format? → AI often generates optimistic happy-path descriptions; explicitly requesting edge cases forces consideration of failure modes and boundary conditions.
7. (6.1) What is the key difference between using AI for "first draft" vs "final output" in PM work? → First drafts require less prompt precision and benefit from AI speed; final outputs need careful prompt engineering and human review for accuracy and tone.
8. (6.1) Why does the PM Lab recommend starting with a specific work task rather than a generic exercise? → Real tasks provide natural context and constraints that make prompts more specific, and the output is immediately useful rather than theoretical.
9. (6.2) What should a citizen coder provide to get the best data model from AI? → A plain-English description of what the app does and who uses it — entities and relationships emerge from use cases, not technical specifications.
10. (6.2) Why focus on user ACTIONS rather than screen APPEARANCE when generating UI specs? → Actions define functionality and flow; appearance is a design decision. AI can describe functional screens but shouldn't dictate visual design.
11. (6.2) What is pseudo-code, and why is it useful for citizen coders? → Structured English that describes logic step-by-step without programming syntax. It bridges the gap between "what I want" and "what the code does."
12. (6.2) When generating Excel formulas with AI, what information produces the best results? → Column names, example data, and a plain-English description of the desired calculation — the more specific the context, the more accurate the formula.
13. (6.2) Why does the lab recommend picking 2 outputs (data model + UI, or UI + logic) rather than all 4? → Building a complete spec in one session is overwhelming. Two complementary outputs create a useful partial spec that can be extended later.
14. (6.2) What is the biggest risk when using AI to generate workflow logic? → The AI may produce logic that looks correct but handles edge cases incorrectly. Human review of the logic flow is essential before implementation.
15. (6.2) How does API integration planning differ from other citizen coder tasks in terms of AI reliability? → API planning requires knowledge of specific endpoint formats and authentication methods that may have changed since the AI's training cutoff — always verify against current API docs.

### Module 7 Quiz (15 questions)

**Guide number:** 7.6
**Title:** Module 7 Quiz
**File:** `guides/build-labs/quiz.html`
**Back link:** `../../index.html`

Questions span sections "7.1 RAG Build" (3), "7.2 Workflow Build" (3), "7.3 Agent Build" (3), "7.4 Multi-Agent Design" (3), "7.5 Capstone" (3). SECTION_ICONS entries needed for keys "7.1" through "7.5".

**Questions:**

1. (7.1) What is the recommended starting chunk size when building a RAG system? → ~500 tokens — small enough for precision, large enough for context. Adjust based on testing.
2. (7.1) Why should you test RAG with questions you already know the answer to? → You can only evaluate accuracy when you have ground truth. Testing with unknown questions means you can't tell if the answer is correct.
3. (7.1) What is the most common reason a RAG system returns irrelevant results? → Poor chunking strategy — documents split at wrong boundaries lose context that the retriever needs to find relevant passages.
4. (7.2) What causes most workflow failures? → Data format mismatches between steps — one node outputs JSON but the next expects plain text, or field names don't match.
5. (7.2) Why should you "map before you build" when creating AI workflows? → Drawing the flow on paper catches logic errors and missing steps before you invest time wiring up nodes in a tool.
6. (7.2) What makes the AI node prompt the most critical part of a workflow? → Every downstream step inherits the quality of the AI output. A vague prompt produces vague results that cascade through the entire pipeline.
7. (7.3) What distinguishes an AI agent from an AI workflow? → Agents make dynamic decisions about which tools to use and what steps to take; workflows follow predefined paths regardless of the input.
8. (7.3) What is the most common cause of agent "looping" (repeating the same action)? → Unclear success criteria in the system prompt — the agent doesn't know what "done" looks like, so it keeps trying.
9. (7.3) Why does the lab recommend testing with exactly 3 queries? → Three queries is the minimum to expose obvious failure modes (happy path, edge case, out-of-scope) without investing too much time before fixing issues.
10. (7.4) When should you use a Supervisor pattern vs a Pipeline pattern for multi-agent collaboration? → Supervisor when tasks can be assigned dynamically based on results; Pipeline when the sequence is known and each agent's output feeds the next.
11. (7.4) What is the most critical design element in a multi-agent system? → The handoff protocol — defining what information passes between agents, in what format, and when. Poor handoffs cause agents to talk past each other.
12. (7.4) Why does the lab recommend manual testing (copy-paste between chat windows) before automation? → If the design doesn't work with manual handoffs, automation won't fix it. Manual testing validates the agent roles and handoff protocol before adding complexity.
13. (7.5) Why does the Capstone recommend scoping to "build the core in Week 1"? → If the core can't be built in a week, the project is too complex for a first iteration. Ship something small, learn from real usage, then iterate.
14. (7.5) What is the purpose of the Architecture Decision Tree in the Capstone? → It provides a structured, repeatable way to match a use case to the right architecture — preventing the common mistake of choosing the most exciting architecture instead of the most appropriate one.
15. (7.5) Why limit the solution design to exactly 3 AI prompts? → It's a design constraint that forces simplicity. If a solution needs more than 3 prompts, it's likely too complex for a first iteration and should be scoped down.

---

## Navigation Chain Updates

### NEXT_GUIDE chain (non-quiz guides)

| Guide | NEXT_GUIDE |
|---|---|
| 6.1 PM Lab | `{ id: "6.2", title: "Citizen Coder Lab", module: "Module 6", href: "./citizen-coder-lab.html" }` |
| 6.2 Citizen Coder Lab | `{ id: "6.3", title: "Module 6 Quiz", module: "Module 6", href: "./quiz.html", isQuiz: true }` |
| 7.1 RAG Build | `{ id: "7.2", title: "Workflow Build", module: "Module 7", href: "./workflow-build.html" }` |
| 7.2 Workflow Build | `{ id: "7.3", title: "Agent Build", module: "Module 7", href: "./agent-build.html" }` |
| 7.3 Agent Build | `{ id: "7.4", title: "Multi-Agent Design", module: "Module 7", href: "./multi-agent-build.html" }` |
| 7.4 Multi-Agent Design | `{ id: "7.5", title: "Capstone", module: "Module 7", href: "./capstone.html" }` |
| 7.5 Capstone | `{ id: "7.6", title: "Module 7 Quiz", module: "Module 7", href: "./quiz.html", isQuiz: true }` |

### Quiz `.module-complete-cta` targets

| Quiz | Current Target | New Target |
|---|---|---|
| Module 5 (`guides/architectures/quiz.html`) | Final Exam | Module 6 first guide: `{ id: "6.1", title: "PM Lab", module: "Module 6", href: "../role-labs/pm-lab.html" }` |
| Module 6 (`guides/role-labs/quiz.html`) | N/A (new) | Module 7 first guide: `{ id: "7.1", title: "RAG Build", module: "Module 7", href: "../build-labs/rag-build.html" }` |
| Module 7 (`guides/build-labs/quiz.html`) | N/A (new) | Final Exam: `{ title: "Course Final Exam", href: "../final-exam/quiz.html" }` |

---

## Landing Page Updates (`index.html`)

### MODULES array additions

After the Module 5 block (line ~89), add:

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

### Meta description update

Change "Five modules" to "Seven modules" in:
- `<meta name="description">` (line 6)
- `<meta property="og:description">` (line 9)
- `<meta name="twitter:description">` (line 14)

---

## CLAUDE.md Updates

Update the "Five Modules" section (rename to "Seven Modules") to add:

```
6. **Role Labs** (`guides/role-labs/`) — 3 guides: pm-lab, citizen-coder-lab, quiz
7. **Build Labs & Capstone** (`guides/build-labs/`) — 6 guides: rag-build, workflow-build, agent-build, multi-agent-build, capstone, quiz
```

---

## Final Exam

**No changes.** The existing 50-question final exam covers Modules 1-5 (conceptual foundations). Lab modules test applied skills through their own quizzes. Expanding the final exam to include Modules 6-7 is deferred to Phase 6 if desired.

---

## File Inventory

| Type | Files | Count |
|---|---|---|
| **Create (Module 6)** | `guides/role-labs/pm-lab.html`, `guides/role-labs/citizen-coder-lab.html`, `guides/role-labs/quiz.html` | 3 |
| **Create (Module 7)** | `guides/build-labs/rag-build.html`, `guides/build-labs/workflow-build.html`, `guides/build-labs/agent-build.html`, `guides/build-labs/multi-agent-build.html`, `guides/build-labs/capstone.html`, `guides/build-labs/quiz.html` | 6 |
| **Modify** | `index.html` (MODULES array + meta descriptions) | 1 |
| **Modify** | `guides/architectures/quiz.html` (module-complete-cta target) | 1 |
| **Modify** | `CLAUDE.md` (module list) | 1 |
| **Total** | | **12** |

---

## Verification Plan

1. **All 9 new HTML files exist** under `guides/role-labs/` (3) and `guides/build-labs/` (6)
2. **Each new guide loads without JSX errors** in browser
3. **NEXT_GUIDE chain:** PM Lab → Citizen Coder → Quiz(M6) → RAG Build → Workflow → Agent → Multi-Agent → Capstone → Quiz(M7) → Final Exam
4. **Module 5 quiz** `.module-complete-cta` now points to PM Lab (not Final Exam)
5. **index.html** shows 7 modules + Final Exam section
6. **Meta descriptions** say "Seven modules"
7. **CLAUDE.md** lists all 7 modules with correct guide counts
8. **Module 6 quiz** has 15 questions with sections "6.1 PM Lab" and "6.2 Citizen Coder Lab"
9. **Module 7 quiz** has 15 questions with sections "7.1" through "7.5"
10. **USE CASE badge** renders with the correct color (`#f39c12`) on all lab guides
11. **Interactive elements** work: prompt builders assemble text, scorecards toggle, fillable cards accept input, decision tree highlights path
12. **Disclosure cards** in all guides have proper keyboard accessibility (Enter/Space, aria-expanded)

---

## Out of Scope

- Final Exam expansion (Phase 6 if desired)
- Per-module OG images (Phase 6)
- Mobile responsive breakpoints (Phase 6)
- Persistent state / local storage for lab exercises (YAGNI — screenshot/copy is sufficient)
- Real API integrations in build labs (labs teach the design process, not the tooling)
