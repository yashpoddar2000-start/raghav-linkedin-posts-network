/**
 * Mastra Configuration - Production Ready
 * 
 * Clean QSR LinkedIn Content Pipeline
 * 
 * RESEARCH: agenticResearchWorkflow
 * - Topic → Query Agent (50 queries) → Deep Research Agent (3 reports) → Save JSON
 * - ~5-10 min, ~$0.20-$0.35/topic
 * - Output: research-data/research-{topic}-{date}.json
 * 
 * WRITING: simpleWritingWorkflow
 * - Research JSON → Taylor writes → James evaluates → Loop until ≥95 (max 4 iterations)
 * - Output: outputs/post-{date}.json
 * 
 * Production Agents:
 * - queryAgent: 50 financial/operational queries (Exa Answer API)
 * - deepResearchAgent: 3 strategic deep research reports (Exa Deep Research API)
 * - taylor: LinkedIn post writer (GPT-5, viral post patterns)
 * - james: Brutal evaluator (GPT-5, Wharton MBA criteria, ≥95 to pass)
 */

import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';

// Production Workflows
import { agenticResearchWorkflow } from './workflows/agentic-research';
import { simpleWritingWorkflow } from './workflows/simple-writing';

// Production Agents
import { queryAgent } from './agents/query-agent';
import { deepResearchAgent } from './agents/deep-research-agent';
import { taylor } from './agents/taylor';
import { james } from './agents/james';

export const mastra = new Mastra({
  workflows: { 
    'agentic-research': agenticResearchWorkflow,  // Research: 50 queries + 3 deep reports
    'simple-writing': simpleWritingWorkflow,      // Writing: Taylor + James loop
  },
  agents: { 
    queryAgent,        // 50 queries across 5 dimensions
    deepResearchAgent, // 3 strategic deep research reports
    taylor,            // LinkedIn post writer
    james,             // Brutal evaluator (≥95 to pass)
  },
  storage: new LibSQLStore({
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  telemetry: {
    enabled: false, 
  },
  observability: {
    default: { enabled: true }, 
  },
});
