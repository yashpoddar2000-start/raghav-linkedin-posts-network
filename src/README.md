# QSR LinkedIn Content Pipeline

## Clean Production Structure

```
src/
├── mastra/                    # Production code
│   ├── agents/                # AI Agents
│   │   ├── alex-exa.ts        # Financial queries (Exa Answer API)
│   │   ├── david-exa.ts       # Deep research (Exa Research API)
│   │   ├── strategist-exa.ts  # Research direction guidance
│   │   ├── maya-exa.ts        # Viral insights extraction
│   │   ├── taylor-exa.ts      # LinkedIn post writer
│   │   └── james-exa.ts       # Brutal evaluator (Wharton MBA)
│   │
│   ├── tools/                 # External API tools
│   │   ├── exa-answer.ts      # Bulk Exa Answer API (1-50 queries)
│   │   └── exa-deep-research.ts # Exa Deep Research API
│   │
│   ├── workflows/             # Orchestration
│   │   └── complete-content-pipeline.ts  # Main workflow
│   │
│   ├── evals/                 # Content evaluation
│   │   ├── signals/           # Viral signals
│   │   └── anti-patterns/     # Things to avoid
│   │
│   └── index.ts               # Mastra config & exports
│
├── tests/                     # Test files
│   └── test-complete-pipeline.ts
│
└── archive/                   # Legacy code (kept for reference)
    ├── legacy-agents/         # Old agent versions
    ├── legacy-workflows/      # Old workflow experiments
    └── legacy-tests/          # Old test files
```

## Main Workflow: `completeContentPipeline`

**Flow:** Topic → Research → Write → Evaluate → Approved Post

**Performance:**
- Duration: ~7 minutes end-to-end
- Cost: ~$0.20 per topic
- Success rate: Passes brutal Wharton MBA evaluation

**Phases:**
1. **Research Phase (3 rounds)**
   - Alex: 15 financial queries × 3 rounds = 45 queries
   - David: 1 deep research × 3 rounds = 3 reports
   - Strategist: Guides each round's focus
   - Auto-saves to `research-data/`

2. **Writing Phase (4 iterations max)**
   - Taylor writes from full 40K chars of research
   - James evaluates with brutal industry expert criteria
   - Feedback loop until score ≥ 75 or max iterations

## Running the Pipeline

```bash
# Run the complete pipeline
npx tsx src/tests/test-complete-pipeline.ts
```

## Research Data

All research is auto-saved to `research-data/` with format:
```
full-research-{topic-slug}-{date}.json
```

This allows reusing research without API calls.

## Key Breakthrough

**Systems Thinking Fix:** Taylor gets full 40K research (not compressed summary)
- Before: 58/100 score (compressed data)
- After: 78/100 score (full data)
- Improvement: +34%

## Next Optimizations

1. Fix query repetition (Alex asks same questions across rounds)
2. Make strategist ultra-specific with query directions
3. Pass previous queries to Alex to eliminate duplicates
