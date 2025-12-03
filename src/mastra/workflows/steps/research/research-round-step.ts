/**
 * Research Round Step
 * 
 * Executes ONE complete research round:
 * 1. Alex: 15 financial queries via Exa Answer API
 * 2. David: 1 deep research via Exa Deep Research API
 * 3. Marcus: Analysis and guidance for next round
 * 
 * Returns accumulated data with round incremented
 */

import { createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { alex } from '../../../agents/alex';
import { david } from '../../../agents/david';
import { marcus } from '../../../agents/marcus';

// Schema for round data
const roundDataSchema = z.object({
  alexQueries: z.string(),
  davidReport: z.string(),
  queryCount: z.number(),
});

export const researchRoundStep = createStep({
  id: 'research-round',
  description: 'Executes one complete research round (Alex + David + Marcus)',
  
  inputSchema: z.object({
    topic: z.string(),
    round: z.number(),
    guidance: z.string(),
    rounds: z.array(roundDataSchema),
  }),
  
  outputSchema: z.object({
    topic: z.string(),
    round: z.number(),
    guidance: z.string(),
    rounds: z.array(roundDataSchema),
  }),
  
  execute: async ({ inputData }) => {
    const { topic, round, guidance, rounds } = inputData;
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`RESEARCH ROUND ${round}`);
    console.log(`${'='.repeat(60)}`);
    
    // ===== ALEX: 15 Financial Queries =====
    console.log(`\n📊 ALEX Round ${round}: Executing queries...`);
    
    const alexPrompt = guidance
      ? `Research topic: "${topic}"\nFocus on: ${guidance}\n\nGenerate 15 financial research queries and call the exa-bulk-answer tool.`
      : `Research topic: "${topic}"\nRound 1: Broad exploration\n\nGenerate 15 financial research queries and call the exa-bulk-answer tool.`;
    
    const alexResult = await alex.generate(alexPrompt, { maxSteps: 2 });
    
    // Extract Alex's tool results
    const alexToolResults = (alexResult as any).toolResults || [];
    const alexExaResult = alexToolResults[0]?.result || alexToolResults[0]?.payload?.result;
    
    let alexQueries = '';
    let queryCount = 0;
    
    if (alexExaResult?.results) {
      alexQueries = alexExaResult.results.map((r: any) => 
        `Q: ${r.query}\nA: ${r.answer || 'No answer'}`
      ).join('\n\n');
      queryCount = alexExaResult.summary?.successful || alexExaResult.results.length;
    } else {
      alexQueries = alexResult.text || 'No data retrieved';
    }
    
    console.log(`   ✅ ${queryCount} queries executed`);
    
    // ===== DAVID: Deep Research =====
    console.log(`\n🔬 DAVID Round ${round}: Deep research...`);
    
    const davidPrompt = guidance
      ? `Research topic: "${topic}"\nFocus: ${guidance}\n\nCreate a SHORT research prompt (100-200 chars) and call exa-deep-research.\nExample: "Summarize why McDonald's franchisees are leaving in 2024. Include management statements."`
      : `Research topic: "${topic}"\nRound 1: Broad strategic research\n\nCreate a SHORT research prompt (100-200 chars) and call exa-deep-research.\nExample: "Summarize why McDonald's franchisees are leaving in 2024. Include management statements."`;
    
    const davidResult = await david.generate(davidPrompt, { maxSteps: 2 });
    
    // Extract David's tool results
    const davidToolResults = (davidResult as any).toolResults || [];
    const davidExaResult = davidToolResults[0]?.result || davidToolResults[0]?.payload?.result;
    
    const davidReport = davidExaResult?.report || davidResult.text || 'No research retrieved';
    
    console.log(`   ✅ Research complete (${davidReport.length} chars)`);
    
    // ===== MARCUS: Analysis & Guidance =====
    console.log(`\n🧠 MARCUS Round ${round}: Analyzing...`);
    
    const marcusPrompt = `Research topic: "${topic}"
Round ${round} complete.

ALEX'S FINANCIAL DATA:
${alexQueries.substring(0, 5000)}

DAVID'S STRATEGIC RESEARCH:
${davidReport.substring(0, 5000)}

Analyze these findings and provide SPECIFIC guidance for round ${round + 1}.
Be detailed and actionable. What financial metrics should Alex focus on? What mechanisms should David research?`;
    
    const marcusResult = await marcus.generate(marcusPrompt);
    const newGuidance = marcusResult.text || 'Focus on key metrics and strategic angles';
    
    console.log(`   ✅ Guidance: ${newGuidance.substring(0, 100)}...`);
    
    // ===== Accumulate Round Data =====
    const newRoundData = {
      alexQueries,
      davidReport,
      queryCount,
    };
    
    const accumulatedRounds = [...rounds, newRoundData];
    
    console.log(`\n✅ Round ${round} complete. Total rounds: ${accumulatedRounds.length}`);
    
    return {
      topic,
      round: round + 1,  // Increment for next iteration
      guidance: newGuidance,
      rounds: accumulatedRounds,
    };
  },
});

