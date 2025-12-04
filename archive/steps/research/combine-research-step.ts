/**
 * Combine Research Step
 * 
 * Takes accumulated rounds array and combines into one formatted document
 * Now includes mental model perspectives in the output
 */

import { createStep } from '@mastra/core/workflows';
import { z } from 'zod';

// Schema for round data (must match research-round-step output)
const roundDataSchema = z.object({
  perspective: z.string(),
  alexQueries: z.string(),
  davidReport: z.string(),
  queryCount: z.number(),
});

export const combineResearchStep = createStep({
  id: 'combine-research',
  description: 'Combines all research rounds into one document with perspectives',
  
  inputSchema: z.object({
    topic: z.string(),
    threadId: z.string(),
    resourceId: z.string(),
    round: z.number(),
    rounds: z.array(roundDataSchema),
  }),
  
  outputSchema: z.object({
    combinedResearch: z.string(),
    totalQueries: z.number(),
    topic: z.string(),
  }),
  
  execute: async ({ inputData }) => {
    const { topic, rounds } = inputData;
    
    console.log(`\n${'═'.repeat(80)}`);
    console.log(`COMBINING ${rounds.length} RESEARCH ROUNDS`);
    console.log(`${'═'.repeat(80)}`);
    
    const totalQueries = rounds.reduce((sum, r) => sum + r.queryCount, 0);
    const perspectives = rounds.map(r => r.perspective);
    
    // Build combined research document
    let combinedResearch = `# COMPLETE RESEARCH: ${topic}\n\n`;
    combinedResearch += `## Research Strategy: Charlie Munger Mental Models\n`;
    combinedResearch += `Perspectives Explored: ${perspectives.join(' → ')}\n`;
    combinedResearch += `Total Queries: ${totalQueries}\n`;
    combinedResearch += `Total Deep Research Reports: ${rounds.length}\n\n`;
    
    rounds.forEach((round, index) => {
      combinedResearch += `${'─'.repeat(80)}\n`;
      combinedResearch += `## ROUND ${index + 1}: ${round.perspective.toUpperCase()}\n`;
      combinedResearch += `${'─'.repeat(80)}\n\n`;
      
      combinedResearch += `### Financial Data (${round.queryCount} queries):\n`;
      combinedResearch += `${round.alexQueries}\n\n`;
      
      combinedResearch += `### Strategic Research:\n`;
      combinedResearch += `${round.davidReport}\n\n`;
    });
    
    combinedResearch += `${'═'.repeat(80)}\n`;
    combinedResearch += `## RESEARCH SUMMARY\n`;
    combinedResearch += `${'═'.repeat(80)}\n`;
    combinedResearch += `- Topic: ${topic}\n`;
    combinedResearch += `- Perspectives: ${perspectives.join(', ')}\n`;
    combinedResearch += `- Total Queries: ${totalQueries}\n`;
    combinedResearch += `- Total Reports: ${rounds.length}\n`;
    combinedResearch += `- Total Characters: ${combinedResearch.length + 200}\n`;
    
    console.log(`   ✅ Combined research: ${combinedResearch.length} characters`);
    console.log(`   📊 Perspectives: ${perspectives.join(' → ')}`);
    console.log(`   🔢 Total queries: ${totalQueries}`);
    
    return {
      combinedResearch,
      totalQueries,
      topic,
    };
  },
});
