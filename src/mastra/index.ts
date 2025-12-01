/**
 * Mastra Configuration - Production Ready
 * 
 * Clean setup for the QSR LinkedIn Content Pipeline
 * 
 * Main Workflow: completeContentPipeline
 * - Topic → Research (45 queries + 3 deep) → Taylor → James → Approved Post
 * - ~7 min end-to-end, ~$0.20/topic
 * - Research auto-saved to research-data/
 * 
 * Agents:
 * - alexExa: Financial queries via Exa Answer API
 * - davidExa: Deep research via Exa Deep Research API
 * - strategistExa: Research direction guidance
 * - taylorExa: LinkedIn post writer
 * - jamesExa: Brutal evaluator (Wharton MBA criteria)
 */

import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';

// Production Workflow
import { completeContentPipeline } from './workflows/complete-content-pipeline';

// Production Agents
import { 
  alexExa, 
  davidExa, 
  strategistExa, 
  mayaExa,
  taylorExa, 
  jamesExa 
} from './agents';

export const mastra = new Mastra({
  workflows: { 
    completeContentPipeline,
  },
  agents: { 
    alexExa,
    davidExa,
    strategistExa,
    mayaExa,
    taylorExa,
    jamesExa,
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
