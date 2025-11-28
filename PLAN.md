# QSR Research Network - V1 Build Plan

## What We're Building

An agent network that emulates a 5-person research team at a top-tier business magazine. Goal: Generate viral QSR insights with forensic depth.

**Input:** Topic question ("Why is Chipotle refusing to franchise?")  
**Output:** Viral-worthy post (0.85+ quality score)

---

## The Research Team

| Human Role | Agent | Tool | Responsibility |
|------------|-------|------|----------------|
| **Research Director** | Routing Agent | - | Orchestrates team with JUDGMENT (not workflow). Decides: continue/pivot/abandon |
| **Data Analyst** | Data Analyst Agent | Exa Answer API | Finds exact metrics (30 queries): "$550K profit/store", "23% occupancy" |
| **Industry Researcher** | Industry Researcher Agent | Exa Deep Research API | Investigates WHY (3 angles): mechanisms, management rationale, implications |
| **Economist** | Economist Agent | - | Synthesizes into forensic analysis. Creates "aha moments" with math |
| **Senior Editor** | Brutal Evaluator Agent | - | Quality gate. Two tests: emotional intelligence + social capital |

---

## Key Principles

1. **JUDGMENT, NOT WORKFLOW** - Director makes smart decisions based on data quality
2. **DATA-DRIVEN ABANDONMENT** - Boring topics (1.2x gap) get killed fast
3. **FUNCTIONAL SPECIALIZATION** - Agents do tasks (not patterns), works for ANY industry
4. **ITERATION UNTIL GREAT** - Brutal evaluator feedback loop drives retries
5. **INSIGHT IS THE HOOK** - Let numbers create hook naturally, not "Did you know?" tactics

---

## Network Flow

```
User Input: "Why Chipotle refusing to franchise?"
    ↓
Research Director → "Let's investigate this anomaly"
    ↓
Data Analyst Agent → 30 Exa Answer queries
    ↓ (Evaluate: Shocking? 3x+ gap? Contrarian decision?)
    ↓ YES → Continue | NO → Abandon
    ↓
Industry Researcher Agent → Generate 3 deep research prompts (different angles)
    ↓
Economist Agent → Synthesize into forensic breakdown
    ↓
Write Draft
    ↓
Brutal Evaluator Agent → Score + Feedback
    ↓ (0.85+ = APPROVED)
    ↓ NO → Loop (need more data? different angle? pivot?)
    ↓ YES → Post Ready
```

---

## V1 Build Steps

1. **Setup shared memory** (LibSQL + vector store)
2. **Load 56 viral posts** into context (training data)
3. **Build agents one-by-one:**
   - Data Analyst Agent (with exaAnswerTool)
   - Industry Researcher Agent (with exaDeepResearchTool)
   - Economist Agent (synthesis)
   - Brutal Evaluator Agent (quality gate)
   - Research Director (routing orchestrator)
4. **Test with 1 topic** → Iterate until 0.85+ score
5. **Success = V1 Complete**

---

## Success Criteria

- ✅ Generates 1 post scoring 0.85+ (viral-worthy)
- ✅ Makes smart routing decisions (abandon boring, go deep on gold)
- ✅ Brutal evaluator passes both tests (emotional + social capital)
- ✅ Total iterations ≤ 5 per post

---

## What's Next (Post-V1)

- V1.5: Generate 5-10 posts sequentially
- V2: Batch generation (30 posts)
- V3: Topic generation agent (automated ideas)

