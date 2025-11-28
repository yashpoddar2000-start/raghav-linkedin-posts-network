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

---

## Real-World Research Team Scenario

*This scenario guides how our agents should interact. Before AI, this is how a 6-person research team worked.*

### The Team ($10K/month retainer)

- **Marcus Chen** - Research Director (CEO) - 15 years business journalism, ex-WSJ
- **Alex Rivera** - Senior Data Analyst - Former Goldman Sachs, obsessed with numbers
- **David Park** - Industry Research Specialist - Ex-McKinsey, finds the "why"
- **Maya Patel** - Economist/Business Analyst - PhD Economics, calculates implications
- **James Wilson** - Senior Editor - 30 years editing, brutally honest

### Workflow: "Chipotle Franchise Investigation"

**Monday 9am - Topic Assignment**

Marcus: "Team, investigate why Chipotle refuses to franchise. Everyone else does it - McDonald's 95%, Subway 100%. This smells like a story. Alex, start pulling numbers."

**Monday 11am - Initial Data Pull**

Alex (Slack): "Marcus, give me until 3pm for the full dataset - querying revenue/store, operating income, franchise economics for comparables..."

Marcus: "Good. Focus on the $$ gap. If they franchised, what would they make vs now?"

**Monday 3pm - Data Discovery**

Alex (bursts into office): "MARCUS! Chipotle makes $1.9B operating income owning stores. If franchised at 8% royalty, they'd make $700M. That's $1.2 BILLION annual difference!"

Marcus: "That's the hook. But WHY? What's the mechanism? David, dig into this."

**Monday 4pm - Strategy Investigation**

David: "On it. Three angles: 1) Management statements 2) Operational advantages of ownership 3) Franchisee economics impact. Brief by tomorrow morning."

**Tuesday 10am - Strategy Findings**

David: "Found it. Q2 2023 earnings - CEO Brian Niccol: 'control is everything.' They need uniform training, choreographed crews, fresh ingredients. Franchisees won't maintain discipline. Plus centralized purchasing with 100+ suppliers saves 2-3% food costs - $226M annually they'd lose."

Marcus: "Operational control AND purchasing power. Maya, economic implications? What does this mean for shareholders?"

**Tuesday 2pm - Economic Analysis**

Maya: "Here's the breakdown. Franchising = 77% margin but only $700M income. Owned = 17% margin but $1.9B income. It's not about margin % - it's absolute cash to shareholders. Chipotle generates $2.1B operating cash flow. Can self-fund 300+ stores/year AND return $1.5B to shareholders. They don't NEED franchise capital."

Marcus: "Gold. Write it up: Hook ($1.2B gap) → mechanism (control + purchasing) → economics (margin vs absolute cash) → punchline (don't need capital). David, draft it."

**Wednesday 10am - First Draft Review**

James (editor): "Solid, but missing franchisee perspective. WHY would investors care? Unit economics need to be higher. Purchasing power section buried."

Marcus: "Fair. Alex, get franchisee ROI data - investment costs, profits, payback. Compare to McDonald's and Subway."

Alex (30 min later): "Chipotle store: $862K profit/year, $1M investment, 25% ROIC, 3-year payback. Industry avg: $300K profit, $1.5M investment, 15% ROIC, 5-year payback. No rational investor would franchise when owned gives double returns."

**Wednesday 3pm - Revised Draft**

James (v2): "NOW we're talking. Flows perfectly: contrarian decision ($1.2B gap) → mechanism (control + purchasing) → unit economics (25% ROIC) → shareholder impact ($1.5B returns). Add context on cash flow."

Maya: "Done. Added: 'Franchising is financing for capital-constrained businesses. Chipotle generates 25% ROIC and $2.1B cash flow.'"

James: "Perfect. **APPROVED**. Killer piece."

### Key Insights for Agent Design

1. **Marcus orchestrates** - Gives direction, not instructions
2. **Alex owns query strategy** - Knows what data matters for the story
3. **Iteration is natural** - James spots gaps → Marcus assigns follow-up
4. **Each person specialized** - Data, strategy, economics, quality
5. **Communication is conversational** - "MARCUS! Look at this" not formal reports
6. **Director manages budget** - Decides when to call Alex again for more data

