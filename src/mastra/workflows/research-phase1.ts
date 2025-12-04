/**
 * PHASE 1: RESEARCH WORKFLOW (Production)
 * 
 * 3-round progressive research using Charlie Munger's mental models approach
 * 
 * Flow:
 * Round 1: Marcus analyzes topic → chooses 1st perspective → Alex + David execute
 * Round 2: Marcus reviews data → chooses 2nd perspective → Alex + David execute
 * Round 3: Marcus reviews data → chooses 3rd perspective → Alex + David execute
 * 
 * Output: 3 different mental model perspectives with real Exa API data
 */

import { createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import {
  researchRoundStep,
  combineResearchStep,
  saveResearchStep,
} from './steps';

const roundDataSchema = z.object({
  perspective: z.string(),
  alexQueries: z.string(),
  davidReport: z.string(),
  queryCount: z.number(),
});

export const researchPhase1 = createWorkflow({
  id: 'research-phase1',
  description: 'Phase 1: 3-round progressive research with Marcus directing Alex & David',
  
  inputSchema: z.object({
    topic: z.string(),
  }),
  
  outputSchema: z.object({
    researchFile: z.string(),
    combinedResearch: z.string(),
    totalQueries: z.number(),
  }),
})
  // Initialize round state with unique threadId for this research session
  .map(async ({ inputData }) => {
    const threadId = `research-${inputData.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 30)}-${Date.now()}`;
    const resourceId = 'qsr-research';
    
    console.log(`\n${'═'.repeat(80)}`);
    console.log(`RESEARCH PHASE 1: STARTING`);
    console.log(`${'═'.repeat(80)}`);
    console.log(`Topic: ${inputData.topic}`);
    console.log(`Thread ID: ${threadId}`);
    console.log(`Strategy: Charlie Munger Mental Models (3 different perspectives)`);
    console.log(`${'═'.repeat(80)}\n`);
    
    return {
      topic: inputData.topic,
      threadId,
      resourceId,
      round: 1,
      rounds: [] as { perspective: string; alexQueries: string; davidReport: string; queryCount: number }[],
    };
  })
  
  // Loop until round > 3 (3 rounds total, 3 different perspectives)
  .dountil(
    researchRoundStep,
    async ({ inputData }) => inputData.round > 3
  )
  
  // Combine all research
  .then(combineResearchStep)
  
  // Save to file
  .then(saveResearchStep)
  
  .commit();
