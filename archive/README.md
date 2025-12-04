# Archive

This directory contains legacy and experimental code from the development process.

## Why These Files Were Archived

During development, we experimented with multiple approaches:

1. **Marcus-Led 3-Round Research** (`workflows/research-phase1.ts`)
   - Complex 3-round iterative research with Marcus as Research Director
   - Too many steps, difficult to debug
   - Superseded by simpler agentic approach

2. **Klara Single-Agent Research** (`agents/klara.ts`, `workflows/klara-research.ts`)
   - Experimental: One master agent handling both 50 queries and 3 deep research
   - Agent was overloaded, didn't work well
   - Split into specialized Query Agent and Deep Research Agent

3. **Legacy Agent System** (`agents/alex.ts`, `agents/david.ts`, `agents/marcus.ts`)
   - Original agents with complex prompts
   - Replaced by simplified agentic agents (queryAgent, deepResearchAgent)
   - New agents have internalized judgment via rich system prompts

4. **Complete Content Pipeline** (`workflows/complete-content-pipeline.ts`)
   - Monolithic workflow doing research + writing in one go
   - Hard to debug, test, and iterate
   - Split into separate research and writing workflows

5. **Prompt-Only Testing** (`agents/prompt-only/*`, `workflows/prompt-only/*`)
   - Testing framework for optimizing prompts without calling APIs
   - Useful during development, not needed in production

## Production System (What We Use Now)

**Research:**
- `agenticResearchWorkflow`: Query Agent (50 queries) → Deep Research Agent (3 reports) → Save

**Writing:**
- `simpleWritingWorkflow`: Taylor writes → James evaluates → Loop until ≥95

**Agents:**
- `queryAgent`: 50 Exa Answer queries
- `deepResearchAgent`: 3 Exa Deep Research reports
- `taylor`: LinkedIn post writer
- `james`: Brutal evaluator

## If You Need to Reference Legacy Code

All legacy code is preserved here for reference. The evolution was:

```
Iteration 1: Complete monolithic pipeline
         ↓
Iteration 2: Marcus-led 3-round research (too complex)
         ↓
Iteration 3: Klara single-agent (overloaded)
         ↓
Iteration 4: Agentic approach with specialized agents ✅ (FINAL)
```

The final agentic approach is simpler, faster, and more reliable than all previous iterations.

