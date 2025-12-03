/**
 * PHASE 1: RESEARCH WORKFLOW
 * 
 * 3-round progressive research using dountil loop
 * 
 * Flow:
 * init (round=1) → .dountil(researchRoundStep) → combine → save
 * 
 * Each round: Alex (15 queries) → David (1 deep research) → Marcus (guidance)
 */

import { createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import {
  researchRoundStep,
  combineResearchStep,
  saveResearchStep,
} from './steps';

export const researchPhase1 = createWorkflow({
  id: 'research-phase1',
  description: 'Phase 1: 3-round progressive research with dountil loop',
  
  inputSchema: z.object({
    topic: z.string(),
    promptOnly: z.boolean().optional().default(false),
  }),
  
  outputSchema: z.object({
    researchFile: z.string(),
    combinedResearch: z.string(),
    totalQueries: z.number(),
  }),
})
  // Initialize round state
  .map(async ({ inputData }) => ({
    topic: inputData.topic,
    promptOnly: inputData.promptOnly || false,
    round: 1,
    guidance: '',
    rounds: [] as { alexQueries: string; davidReport: string; queryCount: number }[],
  }))
  
  // Loop until round > 3
  .dountil(
    researchRoundStep,
    async ({ inputData }) => inputData.round > 3
  )
  
  // Combine all research
  .then(combineResearchStep)
  
  // Save to file
  .then(saveResearchStep)
  
  .commit();
