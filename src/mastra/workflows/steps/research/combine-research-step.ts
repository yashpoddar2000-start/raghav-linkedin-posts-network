/**
 * Combine Research Step
 * 
 * Takes accumulated rounds array and combines into one formatted document
 */

import { createStep } from '@mastra/core/workflows';
import { z } from 'zod';

// Schema for round data (must match research-round-step output)
const roundDataSchema = z.object({
  alexQueries: z.string(),
  davidReport: z.string(),
  queryCount: z.number(),
});

export const combineResearchStep = createStep({
  id: 'combine-research',
  description: 'Combines all research rounds into one document',
  
  inputSchema: z.object({
    topic: z.string(),
    promptOnly: z.boolean(),
    round: z.number(),
    guidance: z.string(),
    rounds: z.array(roundDataSchema),
  }),
  
  outputSchema: z.object({
    combinedResearch: z.string(),
    totalQueries: z.number(),
    topic: z.string(),
  }),
  
  execute: async ({ inputData }) => {
    const { topic, rounds } = inputData;
    
    console.log(`\n📚 Combining ${rounds.length} research rounds...`);
    
    const totalQueries = rounds.reduce((sum, r) => sum + r.queryCount, 0);
    
    // Build combined research document
    let combinedResearch = `# COMPLETE RESEARCH: ${topic}\n\n`;
    
    const roundLabels = ['BROAD EXPLORATION', 'FOCUSED INVESTIGATION', 'PRECISION COMPLETION'];
    
    rounds.forEach((round, index) => {
      const label = roundLabels[index] || `ROUND ${index + 1}`;
      combinedResearch += `## ROUND ${index + 1} - ${label}\n`;
      combinedResearch += `### Financial Data (${round.queryCount} queries):\n`;
      combinedResearch += `${round.alexQueries}\n\n`;
      combinedResearch += `### Strategic Research:\n`;
      combinedResearch += `${round.davidReport}\n\n`;
    });
    
    combinedResearch += `---\nTotal: ${totalQueries} queries, ${rounds.length} deep research reports\n`;
    
    console.log(`   ✅ Combined research: ${combinedResearch.length} characters`);
    
    return {
      combinedResearch,
      totalQueries,
      topic,
    };
  },
});
