# QSR LinkedIn Content Pipeline

A Mastra workflow for generating high-quality, research-backed LinkedIn posts about the QSR (Quick Service Restaurant) industry.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set environment variables in .env
OPENAI_API_KEY=your-key
EXA_API_KEY=your-key

# Run the pipeline
npx tsx src/tests/test-complete-pipeline.ts
```

## 📊 Results

**Pipeline Performance:**
- ⏱️ Duration: ~7 minutes end-to-end
- 💰 Cost: ~$0.20 per topic
- ✅ Passes brutal Wharton MBA evaluator (78/100)
- 💾 Research auto-saved for reuse

**Sample Output:** (Chick-fil-A vs McDonald's topic)
- 45 Exa Answer queries executed
- 3 Exa Deep Research reports
- 34K characters of research
- Approved post in 3 iterations

## 🏗️ Architecture

```
Topic → Research (3 rounds) → Taylor writes → James evaluates → Loop until approved
           ↓                        ↓                ↓
    Auto-saved locally      Full 40K research    Feedback for revision
```

### Agents

| Agent | Role | Model |
|-------|------|-------|
| **Alex** | Financial queries via Exa Answer API | GPT-4o-mini |
| **David** | Deep research via Exa Research API | GPT-4o-mini |
| **Strategist** | Guides research direction | GPT-4o-mini |
| **Taylor** | LinkedIn post writer | GPT-4o-mini |
| **James** | Brutal evaluator (Wharton MBA) | GPT-4o |

### Key Insight

**Systems Thinking Breakthrough:** Taylor gets full 40K research (not compressed summary)
- Before: 58/100 score (Maya compressed 40K → 1.4K)
- After: 78/100 score (Taylor gets full context)
- Improvement: **+34%**

## 📁 Project Structure

```
├── src/
│   ├── mastra/              # Production code
│   │   ├── agents/          # 6 specialized agents
│   │   ├── tools/           # Exa API integrations
│   │   ├── workflows/       # Main pipeline
│   │   └── evals/           # Content evaluation
│   │
│   ├── tests/               # Test runner
│   └── archive/             # Legacy experiments
│
├── research-data/           # Auto-saved research (reusable)
├── data/                    # Training data (Raghav's posts)
└── docs/                    # Analysis documents
```

## 🔧 Configuration

**Environment Variables:**
```bash
OPENAI_API_KEY=sk-...       # Required for agents
EXA_API_KEY=...             # Required for research
```

**Research Settings:**
- 15 queries per round × 3 rounds = 45 total
- Deep research timeout: 240 seconds
- Feedback loop: max 4 iterations
- Auto-approve threshold: 75/100

## 📈 Known Optimizations

Current areas for improvement:
1. **Query repetition:** ~20/45 queries are duplicates across rounds
2. **Strategist guidance:** Too vague, should give specific query directions
3. **Context passing:** Alex should see previous queries to avoid duplicates

**Expected gains:** Score 85-90+ with same or fewer queries

## 🗂️ Research Data

All research auto-saves to `research-data/`:
```
full-research-{topic-slug}-{date}.json
```

This allows:
- Reusing research without API calls
- Debugging pipeline issues
- A/B testing different writing prompts

## 📚 Evolution

This project evolved through multiple approaches:

1. **Agent Network** (original) - Shared memory, routing agent
2. **Complex Workflows** - Multi-phase with Maya synthesis
3. **Simple Workflow** (current) - Direct research → write → evaluate

The current approach won because:
- ✅ Simpler debugging
- ✅ Full research context to writer
- ✅ Clear feedback loop
- ✅ Auto-save at each step

## 🚀 Next Steps

1. Fix query repetition (pass previous queries to Alex)
2. Make strategist ultra-specific
3. Add more topics and tune prompts
4. Deploy as API endpoint

---

Built with [Mastra](https://mastra.ai) 🤖
