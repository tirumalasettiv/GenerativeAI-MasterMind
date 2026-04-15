# Course Final Exam Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a comprehensive 50-question final exam covering all 5 modules, displayed as a visually distinct capstone section on the landing page.

**Architecture:** Self-contained HTML file at `guides/final-exam/quiz.html` following the existing two-panel quiz layout pattern. A new standalone "Final Exam" section is added to `index.html` below the 5 module sections, styled distinctly with a gradient border and trophy icon to signal it's the capstone.

**Tech Stack:** React 18 + Babel (CDN), inline CSS/JSX, no build tools.

---

### Task 1: Create `guides/final-exam/quiz.html`

**Files:**
- Create: `guides/final-exam/quiz.html`

This file follows the exact same pattern as `guides/fundamentals/quiz.html` but with:
- 50 all-new questions (10 per module), zero overlap with existing module quizzes
- Results page with per-module score breakdown
- Guide number "F.1" and title "Course Final Exam"
- Back link to `../../index.html`
- No prev/next nav arrows (standalone)
- Badge: "QUIZ"

**Questions by module (all new, no overlap with existing quizzes):**

**Module 1 — Fundamentals (10 questions):**
1. What distinguishes "generative" AI from other AI? → Creates new content rather than classifying/predicting existing data
2. Why can the same prompt produce different outputs each time? → Probabilistic token sampling introduces controlled randomness
3. What is "fine-tuning" vs prompt engineering? → Fine-tuning modifies model weights; prompt engineering crafts better inputs
4. What is a "multimodal" model? → Processes multiple data types (text, images, audio, video)
5. What does RLHF achieve in LLM training? → Aligns model outputs with human preferences and values
6. What does the "V" in VERIFY stand for? → Validate the source and cross-check claims
7. Which limitation prevents AI from knowing today's weather? → Knowledge cutoff — training data has a fixed end date
8. What is the relationship between tokens and cost? → API pricing is per-token; more tokens = higher cost for both input and output
9. Why are LLMs described as "stochastic parrots" by critics? → They reproduce statistical patterns without true understanding
10. What happens when a model's context window is exceeded? → Earlier content is dropped/truncated and the model loses access to it

**Module 2 — Prompt Engineering (10 questions):**
1. What does the "C" in COSTAR stand for? → Context — the background information the AI needs
2. What is "prompt injection"? → Malicious input that tricks AI into ignoring its system instructions
3. What is the difference between a "system prompt" and a "user prompt"? → System prompt sets behavioral rules; user prompt is the specific request
4. What does the "O" in COSTAR stand for? → Objective — the specific task you want the AI to accomplish
5. What does the "A" in COSTAR stand for? → Audience — who the output is intended for
6. When is Chain-of-Thought prompting MOST effective? → Complex multi-step reasoning, math, and logic problems
7. Why should you avoid vague instructions like "make it better"? → The AI has no criteria to optimize against; specific instructions yield specific improvements
8. What is "prompt chaining" as a technique? → Breaking a complex task into sequential smaller prompts, each feeding the next
9. When should you NOT use meta prompting? → For simple, straightforward tasks where you already know exactly what to ask
10. What does the "R" in COSTAR stand for? → Response format — the desired output structure (JSON, bullet points, essay, etc.)

**Module 3 — Context Engineering (10 questions):**
1. Name the five sources of context for an LLM → System prompt, user input, conversation history, tool results, retrieved documents
2. What is "context window utilization"? → How effectively the available context budget is used; wasted space = wasted capability
3. What is "Tier 2" in the three-tier memory hierarchy? → User Memory — personalized preferences and interaction history per individual
4. What happens when contradictory instructions appear in context? → Context clash — model behavior becomes unpredictable or inconsistent
5. Why is sub-agent isolation valuable? → Each sub-agent gets only the context it needs, preventing pollution and confusion
6. What is the difference between "Reset" and "Compact"? → Reset clears all context for a new task; Compact summarizes existing context to free space
7. What is "context poisoning"? → When tool calls introduce hallucinated or incorrect data into the context
8. Why should system prompts use principles rather than rigid scripts? → Principles let the model reason about edge cases; scripts break on unexpected inputs
9. What is "context confusion"? → When irrelevant information in context misleads the model's responses
10. What determines the "right" amount of context? → Enough to answer accurately, little enough to avoid noise — the Goldilocks principle

**Module 4 — MCP (10 questions):**
1. What three primitives can an MCP server expose? → Tools, Resources, and Prompts
2. What transport protocols does MCP support? → stdio for local processes, HTTP/SSE for remote servers
3. How does the MCP "host" differ from the MCP "client"? → Host is the application (e.g., Claude Code); client manages connections to servers within the host
4. What is "tool poisoning" in MCP? → Malicious tool descriptions that trick the LLM into unsafe actions
5. What is the advantage of MCP "resources" over "tools"? → Resources provide data without executing code; tools perform actions with side effects
6. Why do MCP tool calls consume more tokens than equivalent code? → JSON schemas + round-trip conversations add overhead vs a single code execution
7. What problem does project-scoped MCP configuration solve? → Limits which servers load per project, preventing irrelevant tools from consuming tokens
8. With MCP, integrating N tools across M platforms requires how many implementations? → N + M (each tool builds one server, each platform builds one client)
9. What is the primary risk of loading too many MCP servers? → Context pollution — tool definitions consume tokens before the conversation even starts
10. How does "code mode" differ from traditional MCP tool calling? → LLM generates code executed once in a sandbox instead of multiple round-trip tool calls

**Module 5 — Architectures (10 questions):**
1. In the architecture spectrum, which is the "bicycle"? → LLM Chat — simplest, direct conversation with no external tools
2. What primary benefit does RAG provide over LLM Chat? → Grounds responses in actual documents, reducing hallucinations 70-90%
3. What are the 5 components of a RAG pipeline? → Document Loader, Chunker, Embeddings, Vector Database, LLM Synthesis
4. Why is chunk size a critical RAG design decision? → Too large adds noise; too small loses context; directly impacts retrieval quality
5. What is the ReAct loop? → Thought → Action → Observation cycle repeated until goal achieved
6. What distinguishes a Workflow from an Agent? → Workflow follows fixed predetermined steps; Agent dynamically decides next action
7. Which workflow pattern uses a feedback loop? → Evaluator-Optimizer — generates, evaluates, revises until quality threshold met
8. Which multi-agent pattern accounts for ~70% of production deployments? → Supervisor — central orchestrator decomposes and delegates to specialists
9. What are the three core capabilities every AI agent needs? → Reasoning, Tool Use, and Memory/Context
10. What is the "Golden Rule" of architecture selection? → Start simple, measure results, upgrade only when data tells you to

- [ ] **Step 1:** Create `guides/final-exam/` directory
- [ ] **Step 2:** Create `guides/final-exam/quiz.html` with full quiz implementation (all 50 questions, sidebar, question view, results view with per-module breakdown, all CSS)
- [ ] **Step 3:** Verify file opens in browser and all interactions work

### Task 2: Update `index.html` with Final Exam section

**Files:**
- Modify: `index.html`

Add a visually distinct "Final Exam" section below the modules grid. This is NOT a 6th module — it's a standalone capstone section with:
- Gradient border card with trophy icon
- Title: "Course Final Exam"
- Subtitle: "50 questions across all 5 modules"
- Single CTA button linking to `guides/final-exam/quiz.html`
- Styled distinctly from module sections (elevated design, gradient accents)

- [ ] **Step 1:** Add the Final Exam section JSX after the modules grid `</div>` and before the footer in `index.html`
- [ ] **Step 2:** Verify landing page renders the new section correctly

### Task 3: Commit

- [ ] **Step 1:** Stage and commit both files
