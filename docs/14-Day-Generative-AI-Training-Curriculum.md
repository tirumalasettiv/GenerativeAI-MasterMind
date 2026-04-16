# 14-Day Generative AI Training Curriculum

**Format:** 1 hour per day | **Total:** 14 hours  
**Audience:** Product managers and citizen/vibe coders  
**Goal:** Achieve ~10% productivity gain + understand when to apply different AI architectures

---

## Training Structure

Each session follows a consistent format:

- **Recap** (5 min): Quick review of previous day
- **Core Content** (40 min): Theory + hands-on mix
- **Practice Task** (10 min): Start in-session, complete as homework
- **Preview** (5 min): What's coming next

---

## Day 1: What is Generative AI?

**Objective:** Understand how GenAI works at a conceptual level.

| Time | Activity |
|------|----------|
| 0-5 min | Introductions + training overview |
| 5-25 min | Theory: GenAI as "pattern prediction" – not thinking, not searching |
| 25-40 min | Demo: Same prompt, different outputs – why variation happens |
| 40-50 min | Hands-on: Log in to AI tool, run 3 exploratory prompts |
| 50-60 min | Discussion: What surprised you? Preview Day 2 |

**Homework:** Find one task you did this week that AI might help with.

---

## Day 2: Limitations & Responsible Use

**Objective:** Recognize AI limitations and use it safely.

| Time | Activity |
|------|----------|
| 0-5 min | Recap Day 1 + share homework findings |
| 5-20 min | Theory: The 3 critical limitations (hallucinations, cutoffs, context) |
| 20-35 min | Theory: VERIFY framework for responsible use |
| 35-55 min | Hands-on: "Spot the hallucination" exercise (3 outputs) |
| 55-60 min | Key takeaways + Preview Day 3 |

### VERIFY Framework

- **V**alidate outputs against trusted sources
- **E**xclude sensitive data from prompts
- **R**eview for bias and accuracy
- **I**terate prompts to improve results
- **F**lag uncertainty in AI responses
- **Y**our judgment is final

**Homework:** Find a hallucination in an AI response on any topic you know well.

---

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

---

## Day 4: Prompting Techniques Toolkit

**Objective:** Master 4 essential prompting techniques.

| Time | Activity |
|------|----------|
| 0-5 min | Recap + review homework prompts |
| 5-15 min | Technique 1: Few-shot prompting (examples in, better out) |
| 15-25 min | Technique 2: Iterative refinement (broad → narrow) |
| 25-35 min | Technique 3: Output formatting (same content, different formats) |
| 35-45 min | Technique 4: Self-critique ("What's wrong with this?") |
| 45-55 min | Hands-on: Apply one technique to your homework prompt |
| 55-60 min | Preview Day 5 |

### Technique Reference

| Technique | When to Use | Example Prompt Addition |
|-----------|-------------|------------------------|
| Few-shot | Need consistent format/style | "Here are 2 examples: [ex1], [ex2]. Now create 5 more like these." |
| Iterative | First output isn't quite right | "Make it shorter" / "Add more detail to section 2" / "Make the tone friendlier" |
| Formatting | Need specific structure | "Present as a table with columns: Feature, Benefit, Priority" |
| Self-critique | Want higher quality | "Review your response and identify 3 weaknesses, then fix them." |

**Homework:** Use all 4 techniques on one task; note which helped most.

---

## Day 5: Role Lab – Product Managers

**Objective:** Apply AI to PM-specific workflows.

| Time | Activity |
|------|----------|
| 0-5 min | Recap techniques + share findings |
| 5-15 min | PM use case overview: Where AI adds most value |
| 15-35 min | Hands-on: Generate 5 user stories from a feature brief |
| 35-55 min | Hands-on: Create competitive analysis framework |
| 55-60 min | Share outputs + Preview Day 6 |

### PM Use Cases for AI

| Task | AI Value | Time Savings |
|------|----------|--------------|
| User story generation | First draft in seconds | 70-80% |
| Competitive analysis | Structure + research prompts | 50-60% |
| PRD drafting | Outline + section drafts | 60-70% |
| Release notes | Transform changelog → customer-friendly | 70-80% |
| Meeting summaries | Extract actions + decisions | 80-90% |

**Homework:** Draft release notes for a recent/upcoming feature using AI.

---

## Day 6: Role Lab – Citizen Coders

**Objective:** Apply AI to app building and automation design.

| Time | Activity |
|------|----------|
| 0-5 min | Recap + PMs share release notes |
| 5-15 min | Citizen coder use case overview: AI as your co-builder |
| 15-35 min | Hands-on: Describe app idea → get data model |
| 35-55 min | Hands-on: Generate UI screen descriptions |
| 55-60 min | Cross-role share-out + Preview Day 7 |

### Citizen Coder Use Cases for AI

| Task | AI Value | Time Savings |
|------|----------|--------------|
| Data model design | Entity relationships from description | 60-70% |
| UI wireframe specs | Screen-by-screen descriptions | 50-60% |
| Workflow logic | Plain English → pseudo-code | 70-80% |
| Formula writing | Excel/Sheets formulas from description | 80-90% |
| API integration planning | Endpoint mapping + data flow | 50-60% |

**Homework:** Create workflow logic in plain English for a simple automation.

---

## Day 7: AI Architectures – Basic LLM & RAG

**Objective:** Understand when plain chat vs. RAG is appropriate.

| Time | Activity |
|------|----------|
| 0-5 min | Recap + share automation logic |
| 5-10 min | Intro: The AI capability spectrum (5 architectures overview) |
| 10-25 min | Architecture 1: Basic LLM – how it works, best uses, limits |
| 25-45 min | Architecture 2: RAG – retrieval + generation, components |
| 45-55 min | Exercise: Match 5 scenarios to Basic LLM or RAG |
| 55-60 min | Preview Day 8 |

### The AI Capability Spectrum

```
Simple ◄─────────────────────────────────────────────► Complex

  Basic LLM     │      RAG       │   AI Workflow   │   AI Agent    │  Agentic AI
     Chat       │                │                 │               │
                │                │                 │               │
  Single prompt │ + Knowledge    │ + Multi-step    │ + Tool use    │ + Autonomous
  Single turn   │   retrieval    │   orchestration │ + Decisions   │   goal pursuit
```

### Architecture 1: Basic LLM Chat

**What it is:** Direct conversation with an AI model using only its training knowledge.

```
┌──────────┐    prompt    ┌─────────┐    response    ┌──────────┐
│   User   │ ──────────► │   LLM   │ ─────────────► │  Output  │
└──────────┘              └─────────┘                └──────────┘
```

**Best for:**
- Drafting content, brainstorming, explaining concepts
- Tasks where general knowledge is sufficient
- Quick, one-off questions

**Limitations:** No access to your data, knowledge cutoff, can hallucinate facts

### Architecture 2: RAG (Retrieval-Augmented Generation)

**What it is:** LLM + your own knowledge base. AI retrieves relevant documents before generating answers.

```
┌──────────┐    query     ┌─────────────┐
│   User   │ ──────────► │  Retriever  │
└──────────┘              └──────┬──────┘
                                 │ search
                                 ▼
                          ┌─────────────┐
                          │  Knowledge  │ (PDFs, docs, wikis,
                          │    Base     │  databases, APIs)
                          └──────┬──────┘
                                 │ relevant chunks
                                 ▼
┌──────────┐   response   ┌─────────────┐
│  Output  │ ◄─────────── │     LLM     │ ◄── query + context
└──────────┘              └─────────────┘
```

**Best for:**
- Q&A over company documents, policies, product specs
- Customer support with accurate, sourced answers
- Research across large document collections

**Key Components:**

| Component | What It Does | Example Tools |
|-----------|--------------|---------------|
| Document Loader | Ingests your files | LangChain, LlamaIndex |
| Chunker | Splits docs into searchable pieces | Recursive, semantic splitting |
| Embeddings | Converts text to searchable vectors | OpenAI, Cohere, local models |
| Vector Database | Stores and retrieves chunks | Pinecone, Chroma, Weaviate |
| LLM | Generates answer from retrieved context | GPT-4, Claude, Llama |

**Homework:** Identify one use case in your work suited for RAG.

---

## Day 8: AI Architectures – Workflows & Agents

**Objective:** Distinguish between orchestrated workflows and autonomous agents.

| Time | Activity |
|------|----------|
| 0-5 min | Recap + share RAG use cases |
| 5-25 min | Architecture 3: AI Workflow – chained steps, deterministic flow |
| 25-45 min | Architecture 4: AI Agent – tool use, dynamic decisions |
| 45-55 min | Exercise: "Is this a workflow or an agent?" (5 scenarios) |
| 55-60 min | Preview Day 9 |

### Architecture 3: AI Workflow (Orchestrated Pipelines)

**What it is:** Multiple AI steps chained together, each with a specific job. Deterministic flow with AI-powered steps.

```
┌─────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌────────┐
│ Trigger │───►│   Step 1    │───►│   Step 2    │───►│   Step 3    │───►│ Output │
└─────────┘    │  (Extract)  │    │ (Transform) │    │  (Generate) │    └────────┘
               └─────────────┘    └─────────────┘    └─────────────┘
                     │                  │                  │
                     ▼                  ▼                  ▼
                   [LLM]            [LLM/Code]           [LLM]
```

**Best for:**
- Repeatable, multi-step processes
- Document processing pipelines
- Content generation with consistent structure

**Key Characteristics:**

| Aspect | Description |
|--------|-------------|
| Flow | Predefined, linear or branching |
| Control | Human-designed sequence |
| Reliability | High – same input = same path |
| Flexibility | Low – can't adapt to unexpected inputs |

**Common Tools:** n8n, Make (Integromat), Zapier, Power Automate, LangChain

### Architecture 4: AI Agent

**What it is:** AI that can use tools and make decisions within a single task. It plans steps, executes them, and adapts based on results.

```
                         ┌─────────────────────────────────────┐
                         │            AGENT LOOP               │
                         │  ┌─────────┐      ┌──────────────┐ │
┌──────┐    task         │  │         │      │    Tools     │ │
│ User │ ──────────────► │  │   LLM   │◄────►│ - Search     │ │
└──────┘                 │  │ (Brain) │      │ - Calculator │ │
                         │  │         │      │ - Database   │ │
                         │  └────┬────┘      │ - APIs       │ │
                         │       │           └──────────────┘ │
                         │       ▼                            │
                         │  ┌─────────┐                       │
                         │  │ Decide: │ ──► Continue/Stop     │
                         │  │ Done?   │                       │
                         │  └─────────┘                       │
                         └───────────────┬────────────────────┘
                                         │ result
                                         ▼
                                   ┌──────────┐
                                   │  Output  │
                                   └──────────┘
```

**Best for:**
- Tasks requiring research + synthesis
- Problems needing multiple tool calls
- Situations where the exact steps aren't known in advance

**Key Characteristics:**

| Aspect | Description |
|--------|-------------|
| Flow | Dynamic – agent decides next step |
| Control | Goal-directed, AI chooses tools |
| Reliability | Medium – can get stuck or loop |
| Flexibility | High – adapts to task requirements |

**Common Tools:** OpenAI Assistants API, LangChain Agents, AutoGen, CrewAI

**Homework:** Sketch a workflow OR agent design for a repetitive task you do.

---

## Day 9: AI Architectures – Agentic AI & Decision Framework

**Objective:** Understand multi-agent systems and choose the right architecture.

| Time | Activity |
|------|----------|
| 0-5 min | Recap + share workflow/agent sketches |
| 5-25 min | Architecture 5: Agentic AI – multi-agent collaboration patterns |
| 25-40 min | Decision framework: Flowchart for choosing architecture |
| 40-55 min | Exercise: Apply framework to 3 complex scenarios |
| 55-60 min | Preview Day 10 (first lab!) |

### Architecture 5: Agentic AI (Multi-Agent Systems)

**What it is:** Multiple specialized AI agents collaborating autonomously toward a complex goal. Agents can delegate, critique each other, and work in parallel.

```
┌──────────────────────────────────────────────────────────────────┐
│                     MULTI-AGENT SYSTEM                           │
│                                                                  │
│    ┌─────────────┐         ┌─────────────┐         ┌──────────┐ │
│    │ Orchestrator│────────►│   Agent 1   │────────►│  Agent 2 │ │
│    │   Agent     │         │ (Researcher)│         │ (Writer) │ │
│    └──────┬──────┘         └─────────────┘         └────┬─────┘ │
│           │                                             │       │
│           │                ┌─────────────┐              │       │
│           └───────────────►│   Agent 3   │◄─────────────┘       │
│                            │  (Reviewer) │                      │
│                            └─────────────┘                      │
│                                   │                             │
│                            ┌──────▼──────┐                      │
│                            │   Approve   │                      │
│                            │  or Revise  │                      │
│                            └─────────────┘                      │
└──────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
                             ┌──────────┐
                             │  Output  │
                             └──────────┘
```

**Best for:**
- Complex projects requiring multiple expertise areas
- Tasks benefiting from review/critique cycles
- Simulating team collaboration

**Common Patterns:**

| Pattern | Description | Example |
|---------|-------------|---------|
| Supervisor | One agent coordinates others | Project manager agent assigns tasks |
| Debate | Agents argue different positions | Pros vs. cons agents for decisions |
| Pipeline | Agents hand off sequentially | Research → Write → Edit → Publish |
| Swarm | Agents work in parallel, merge results | Multiple researchers consolidate findings |

**Common Tools:** CrewAI, AutoGen, LangGraph, OpenAI Swarm

### Architecture Decision Framework

```
                    ┌─────────────────────────┐
                    │ What's your use case?   │
                    └───────────┬─────────────┘
                                │
                    ┌───────────▼─────────────┐
                    │ Need your own data?     │
                    └───────────┬─────────────┘
                          │           │
                         No          Yes
                          │           │
                          ▼           ▼
                    ┌─────────┐ ┌─────────────┐
                    │Basic LLM│ │ RAG         │
                    └─────────┘ └──────┬──────┘
                                       │
                          ┌────────────▼────────────┐
                          │ Need multiple steps?    │
                          └────────────┬────────────┘
                                 │           │
                                No          Yes
                                 │           │
                                 ▼           ▼
                           ┌─────────┐ ┌────────────┐
                           │  RAG    │ │ Steps known│
                           │  Only   │ │ in advance?│
                           └─────────┘ └─────┬──────┘
                                        │         │
                                       Yes        No
                                        │         │
                                        ▼         ▼
                                  ┌──────────┐ ┌─────────┐
                                  │ Workflow │ │ Agent   │
                                  └──────────┘ └────┬────┘
                                                    │
                                       ┌────────────▼────────────┐
                                       │ Need multiple experts/  │
                                       │ perspectives?           │
                                       └────────────┬────────────┘
                                              │           │
                                             No          Yes
                                              │           │
                                              ▼           ▼
                                        ┌─────────┐ ┌──────────┐
                                        │ Single  │ │ Agentic  │
                                        │ Agent   │ │ (Multi)  │
                                        └─────────┘ └──────────┘
```

**Homework:** Using the decision framework, pick architecture for your capstone idea.

---

## Day 10: Lab – Build a RAG Prototype

**Objective:** Create a working Q&A system over documents.

| Time | Activity |
|------|----------|
| 0-5 min | Recap + confirm capstone architecture choices |
| 5-15 min | Tool intro: ChatGPT file upload / Dify.ai / similar |
| 15-35 min | Hands-on: Upload docs, configure system prompt |
| 35-55 min | Hands-on: Test with 10 questions, document results |
| 55-60 min | Share: What worked? What failed? Preview Day 11 |

### Lab Instructions

| Step | Task | Time |
|------|------|------|
| 1 | Upload 3-5 product documents (specs, FAQs, guides) | 5 min |
| 2 | Configure the system prompt for helpful responses | 10 min |
| 3 | Test with 10 questions, note which work/fail | 15 min |
| 4 | Refine: adjust chunking, prompt, or add more docs | 15 min |

**Deliverable:** Working Q&A bot + list of 3 improvements needed

**Homework:** Refine your RAG bot – improve prompt or add documents.

---

## Day 11: Lab – Build an AI Workflow

**Objective:** Create an automated multi-step pipeline.

| Time | Activity |
|------|----------|
| 0-5 min | Recap + share RAG improvements |
| 5-15 min | Tool intro: n8n / Make / Zapier basics |
| 15-40 min | Hands-on: Build 5-step workflow (trigger → AI steps → output) |
| 40-55 min | Hands-on: Test and debug |
| 55-60 min | Share screenshots of working flows + Preview Day 12 |

### Example Workflows

**Product Managers – Weekly Competitor Monitor:**
```
Trigger (weekly) → Fetch competitor webpage → Extract key info (AI) → 
Compare to last week (AI) → Format report → Send to Slack/Email
```

**Citizen Coders – Lead Enrichment Pipeline:**
```
New form submission → Extract company name → Research company (AI) → 
Score lead (AI) → Add to spreadsheet → Notify sales if high score
```

### Lab Instructions

| Step | Task | Time |
|------|------|------|
| 1 | Map your workflow (5-7 steps) | 10 min |
| 2 | Build trigger + first 2 nodes | 15 min |
| 3 | Add AI nodes with prompts | 15 min |
| 4 | Test end-to-end, debug | 5 min |

**Deliverable:** Working automation + screenshot of flow

**Homework:** Run your workflow on real data; note improvements needed.

---

## Day 12: Lab – Build an AI Agent

**Objective:** Create an agent that uses tools to complete a research task.

| Time | Activity |
|------|----------|
| 0-5 min | Recap + share workflow results |
| 5-15 min | Tool intro: ChatGPT plugins / Claude tools / AgentGPT |
| 15-35 min | Hands-on: Define agent goal, write system prompt |
| 35-55 min | Hands-on: Test with 3 different queries, log results |
| 55-60 min | Discussion: Where did agent excel/struggle? Preview Day 13 |

### Example Agent Designs

**Product Managers – Market Research Agent:**
```
Goal: "Research [topic] and provide a summary with sources"
Tools: Web search, document reader, calculator
Output: Structured report with citations
```

**Citizen Coders – Code Helper Agent:**
```
Goal: "Help me build [feature] by researching best practices"
Tools: Web search, code interpreter, file reader
Output: Implementation plan with code snippets
```

### Lab Instructions

| Step | Task | Time |
|------|------|------|
| 1 | Define agent goal and available tools | 10 min |
| 2 | Write system prompt defining agent behavior | 15 min |
| 3 | Test with 3 different queries | 15 min |
| 4 | Document: What worked? Where did it struggle? | 5 min |

**Deliverable:** Agent system prompt + test results log

**Homework:** Document your agent's failure modes and ideas to fix them.

---

## Day 13: Lab – Design a Multi-Agent System

**Objective:** Architect a collaborative AI team.

| Time | Activity |
|------|----------|
| 0-5 min | Recap + share agent learnings |
| 5-15 min | Patterns review: Supervisor, Debate, Pipeline, Swarm |
| 15-40 min | Hands-on: Design 3-agent system (roles, prompts, handoffs) |
| 40-55 min | (Optional) Manual test: Copy outputs between chat windows |
| 55-60 min | Share designs + Preview Day 14 (capstone!) |

### Example Multi-Agent Designs

**Product Managers – Product Launch Team:**
```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Strategist │────►│   Copywriter │────►│   Reviewer  │
│    Agent    │     │    Agent     │     │    Agent    │
└─────────────┘     └──────────────┘     └─────────────┘
     │                                          │
     └──────────────── Revise? ◄────────────────┘
```

**Citizen Coders – Content Factory:**
```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Researcher │────►│    Writer    │────►│   Editor    │
│    Agent    │     │    Agent     │     │    Agent    │
└─────────────┘     └──────────────┘     └─────────────┘
```

### Lab Instructions

| Step | Task | Time |
|------|------|------|
| 1 | Define 3 agent roles and their specialties | 10 min |
| 2 | Write system prompt for each agent | 20 min |
| 3 | Define handoff protocol (what info passes between) | 10 min |
| 4 | (Optional) Test manually by copying outputs between chats | 5 min |

**Deliverable:** Multi-agent design document with all prompts

**Homework:** Finalize your capstone solution design.

---

## Day 14: Capstone & Wrap-Up

**Objective:** Present your AI-powered solution and commit to implementation.

| Time | Activity |
|------|----------|
| 0-5 min | Recap full journey: Day 1 → Day 14 |
| 5-15 min | Final prep: Complete Solution Design Canvas |
| 15-45 min | Presentations: 3-min pitch per participant |
| 45-55 min | Wrap-up: Key frameworks, resources distributed |
| 55-60 min | Public commitment: "I will implement ___ by ___" |

### Solution Design Canvas

```
┌─────────────────────────────────────────────────────────────────┐
│ SOLUTION DESIGN CANVAS                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Problem: ________________________________________________       │
│                                                                 │
│ Current process: ________________________________________       │
│                                                                 │
│ Time today: ___ min | Target time: ___ min | Savings: ___%      │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ Architecture chosen:                                            │
│ [ ] Basic LLM  [ ] RAG  [ ] Workflow  [ ] Agent  [ ] Agentic    │
│                                                                 │
│ Why: ____________________________________________________       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ Components:                                                     │
│                                                                 │
│ Data sources: ___________________________________________       │
│                                                                 │
│ Tools/integrations: _____________________________________       │
│                                                                 │
│ AI prompts needed:                                              │
│   1. ____________________________________________________       │
│   2. ____________________________________________________       │
│   3. ____________________________________________________       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ Implementation plan:                                            │
│                                                                 │
│ Week 1: _________________________________________________       │
│                                                                 │
│ Week 2: _________________________________________________       │
│                                                                 │
│ Week 3-4: _______________________________________________       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ Success metrics: ________________________________________       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Post-Training:** 30-day tracking template to measure results.

---

## Quick Reference: 14-Day Overview

| Day | Topic | Type |
|-----|-------|------|
| 1 | What is Generative AI? | Theory |
| 2 | Limitations & Responsible Use | Theory |
| 3 | COSTAR Prompting Framework | Theory + Practice |
| 4 | Prompting Techniques Toolkit | Practice |
| 5 | Role Lab – Product Managers | Practice |
| 6 | Role Lab – Citizen Coders | Practice |
| 7 | Architectures: Basic LLM & RAG | Theory |
| 8 | Architectures: Workflows & Agents | Theory |
| 9 | Architectures: Agentic AI & Decisions | Theory |
| 10 | Lab: RAG Prototype | Build |
| 11 | Lab: AI Workflow | Build |
| 12 | Lab: AI Agent | Build |
| 13 | Lab: Multi-Agent Design | Build |
| 14 | Capstone & Wrap-Up | Present |

---

## Materials Checklist

### Participant Requirements by Day

| Day | Materials Needed |
|-----|------------------|
| 1-4 | AI tool access (ChatGPT/Claude/Copilot) |
| 5-6 | Sample briefs, feature docs |
| 7-9 | Architecture handouts (provided) |
| 10 | 3-5 documents to upload for RAG |
| 11 | n8n/Make/Zapier account |
| 12 | AI tool with plugins/tools enabled |
| 13 | Multi-agent design template |
| 14 | Solution Design Canvas |

### Facilitator Resources

- [ ] COSTAR Framework card (printable)
- [ ] VERIFY Framework card (printable)
- [ ] Architecture Decision Flowchart (printable)
- [ ] Tool Comparison Guide
- [ ] Solution Design Canvas (printable)
- [ ] 30-day Tracking Template

---

## Key Frameworks Summary

### CRAFT (Prompting)

| Letter | Meaning |
|--------|---------|
| C | Context |
| R | Role |
| A | Ask |
| F | Format |
| T | Tone |

### VERIFY (Responsible Use)

| Letter | Meaning |
|--------|---------|
| V | Validate outputs |
| E | Exclude sensitive data |
| R | Review for bias |
| I | Iterate prompts |
| F | Flag uncertainty |
| Y | Your judgment final |

### Architecture Selection

| Architecture | Use When |
|--------------|----------|
| Basic LLM | General knowledge tasks, no custom data needed |
| RAG | Need answers from your own documents |
| Workflow | Repeatable multi-step process, steps known |
| Agent | Dynamic task, steps discovered during execution |
| Agentic | Multiple expertise areas, review cycles needed |

---

## Success Metrics

**Training Success:**
- Participants complete all 14 days
- Each participant delivers capstone presentation
- 100% have implementation plan

**Post-Training Success (30-day):**
- ≥15% time savings on identified workflow
- At least one AI solution actively used
- Participants can explain architecture choice rationale

---

*Last Updated: Feb 2026*
