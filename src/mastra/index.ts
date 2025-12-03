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
 * - alex: Financial queries via Exa Answer API
 * - david: Deep research via Exa Deep Research API
 * - marcus: Research direction guidance
 * - taylor: LinkedIn post writer
 * - james: Brutal evaluator (Wharton MBA criteria)
 */

import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';

// Production Workflows
import { completeContentPipeline } from './workflows/complete-content-pipeline';
import { researchPhase1 } from './workflows/research-phase1';
import { writingPhase2 } from './workflows/writing-phase2';

// Prompt-Only Workflows (for testing and optimization)
import { researchPhase1PromptOnly } from './workflows/prompt-only';

// Production Agents
import { 
  alex, 
  david, 
  marcus, 
  maya,
  taylor, 
  james 
} from './agents';

// Prompt-Only Agents (for testing and optimization)
import {
  alexPromptOnly,
  davidPromptOnly
} from './agents/prompt-only';

export const mastra = new Mastra({
  workflows: { 
    completeContentPipeline,
    researchPhase1,
    writingPhase2,
    // Prompt-only workflows for testing
    researchPhase1PromptOnly,
  },
  agents: { 
    alex,
    david,
    marcus,
    maya,
    taylor,
    james,
    // Prompt-only agents for testing
    alexPromptOnly,
    davidPromptOnly,
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
