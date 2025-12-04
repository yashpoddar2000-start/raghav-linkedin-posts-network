/**
 * Save Research Step
 * 
 * Saves combined research to local file
 */

import { createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { saveResearchData } from '../../../utils/storage';

export const saveResearchStep = createStep({
  id: 'save-research',
  description: 'Saves combined research to local file',
  
  inputSchema: z.object({
    combinedResearch: z.string(),
    totalQueries: z.number(),
    topic: z.string(),
  }),
  
  outputSchema: z.object({
    researchFile: z.string(),
    combinedResearch: z.string(),
    totalQueries: z.number(),
  }),
  
  execute: async ({ inputData }) => {
    const { topic, combinedResearch, totalQueries } = inputData;
    
    console.log(`\n💾 Saving research...`);
    
    const researchFile = saveResearchData(topic, {
      topic,
      generatedAt: new Date().toISOString(),
      totalQueries,
      totalDeepResearch: 3,
      combinedResearch,
    });
    
    return {
      researchFile,
      combinedResearch,
      totalQueries,
    };
  },
});

