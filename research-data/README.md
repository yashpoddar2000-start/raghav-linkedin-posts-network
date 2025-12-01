# Research Data

Auto-saved research from the content pipeline.

## File Format

```
full-research-{topic-slug}-{date}.json
```

## Contents

Each file contains:
- `topic`: Original research topic
- `generatedAt`: Timestamp
- `totalQueries`: Number of Exa Answer queries (usually 45)
- `totalDeepResearch`: Number of deep research reports (usually 3)
- `combinedResearch`: Full combined research text (~34K chars)
- `rounds`: Individual round data (Alex queries + David reports)

## Purpose

Saved research can be reused without running expensive API calls:
- Exa Answer: ~$0.10 for 45 queries
- Exa Deep Research: ~$0.10 for 3 reports

## Current Files

| File | Topic | Queries | Date |
|------|-------|---------|------|
| `full-research-how-chick-fil-a-*` | Chick-fil-A vs McDonald's | 45 | 2025-12-01 |

