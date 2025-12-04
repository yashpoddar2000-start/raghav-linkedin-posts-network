/**
 * PHASE 2: WRITING WORKFLOW
 * 
 * Taylor writes, James evaluates - loop until approved or max 4 iterations
 * 
 * Flow:
 * research → init (iteration=1) → .dountil(writeEvaluateStep) → final post
 */

import { createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { writeEvaluateStep } from './steps';

export const writingPhase2 = createWorkflow({
  id: 'writing-phase2',
  description: 'Phase 2: Taylor writes, James evaluates (dountil loop)',
  
  inputSchema: z.object({
    topic: z.string(),
    research: z.string(),
  }),
  
  outputSchema: z.object({
    finalPost: z.string(),
    finalScore: z.number(),
    approved: z.boolean(),
    iterations: z.number(),
  }),
})
  // Initialize writing state
  .map(async ({ inputData }) => ({
    topic: inputData.topic,
    research: inputData.research,
    iteration: 1,
    currentPost: '',
    feedback: [] as string[],
    score: 0,
    approved: false,
  }))
  
  // Loop until approved or max 4 iterations
  .dountil(
    writeEvaluateStep,
    async ({ inputData }) => inputData.approved || inputData.iteration > 4
  )
  
  // Map to final output
  .map(async ({ inputData }) => ({
    finalPost: inputData.currentPost,
    finalScore: inputData.score,
    approved: inputData.approved,
    iterations: inputData.iteration - 1, // iteration was incremented after last loop
  }))
  
  .commit();

