
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
// import { weatherWorkflow } from './workflows/weather-workflow';
// import { weatherAgent } from './agents/weather-agent';
// import { toolCallAppropriatenessScorer, completenessScorer, translationScorer } from './scorers/weather-scorer';
import { routingAgent } from './agents/report-network';

// Phase 1 Research Workflow (Original)
import { phase1ResearchWorkflow } from './workflows/phase-1-research';

// NEW: 3-Phase Content Creation Workflows
import { phase1StrategicResearchWorkflow } from './workflows/phase-1-strategic-research';
import { phase2EconomicAnalysisWorkflow } from './workflows/phase-2-economic-analysis';
import { phase3WritingEvaluationWorkflow } from './workflows/phase-3-writing-evaluation';
import { masterContentWorkflow } from './workflows/master-content-workflow';

// QSR Research Network Agents (Original)
import { alexRivera } from './agents/alex-rivera';
import { davidPark } from './agents/david-park';
import { mayaPatel } from './agents/maya-patel';
import { jamesWilson } from './agents/james-wilson';
import { marcusChen } from './agents/marcus-chen';

// NEW: Test Agents (for workflow testing without external APIs)
import { 
  alexTest, 
  davidTest, 
  strategistTest, 
  mayaTest, 
  jamesTest 
} from './agents/test-agents';

export const mastra = new Mastra({
  workflows: { 
    // Original
    phase1ResearchWorkflow,
    
    // NEW: 3-Phase Content Workflows
    phase1StrategicResearchWorkflow,
    phase2EconomicAnalysisWorkflow,
    phase3WritingEvaluationWorkflow,
    masterContentWorkflow,
  },
  agents: { 
    // weatherAgent, 
    routingAgent,
    
    // QSR Research Network (Original)
    alexRivera,
    davidPark, 
    mayaPatel,
    jamesWilson,
    marcusChen,
    
    // Test Agents (NEW)
    alexTest,
    davidTest,
    strategistTest,
    mayaTest,
    jamesTest,
  },
  // scorers: { toolCallAppropriatenessScorer, completenessScorer, translationScorer },
  storage: new LibSQLStore({
    // stores observability, scores, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  telemetry: {
    // Telemetry is deprecated and will be removed in the Nov 4th release
    enabled: false, 
  },
  observability: {
    // Enables DefaultExporter and CloudExporter for AI tracing
    default: { enabled: true }, 
  },
});
