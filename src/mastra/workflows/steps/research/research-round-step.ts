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
    promptOnly: z.boolean(),
    round: z.number(),
    guidance: z.string(),
    rounds: z.array(roundDataSchema),
  }),
  
  outputSchema: z.object({
    topic: z.string(),
    promptOnly: z.boolean(),
    round: z.number(),
    guidance: z.string(),
    rounds: z.array(roundDataSchema),
  }),
  
  execute: async ({ inputData }) => {
    const { topic, promptOnly, round, guidance, rounds } = inputData;
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`RESEARCH ROUND ${round}`);
    console.log(`${'='.repeat(60)}`);
    
    // ===== ALEX: 15 Financial Queries =====
    console.log(`\n📊 ALEX Round ${round}: ${promptOnly ? 'Generating prompts...' : 'Executing queries...'}`);
    
    let alexQueries = '';
    let queryCount = 0;
    
    if (promptOnly) {
      // PROMPT-ONLY MODE: Just generate queries, don't call tool
      const alexPrompt = guidance
        ? `Research topic: "${topic}"\nFocus on: ${guidance}\n\nGenerate exactly 15 financial research queries. Return ONLY a JSON array of query strings.`
        : `Research topic: "${topic}"\nRound 1: Broad exploration\n\nGenerate exactly 15 financial research queries. Return ONLY a JSON array of query strings.`;
      
      const alexResult = await alex.generate(alexPrompt, { maxSteps: 1 });
      
      // Try to parse queries from response
      try {
        const match = alexResult.text?.match(/\[[\s\S]*\]/);
        if (match) {
          const queries = JSON.parse(match[0]);
          alexQueries = queries.map((q: string, i: number) => `${i + 1}. ${q}`).join('\n');
          queryCount = queries.length;
        } else {
          alexQueries = alexResult.text || 'No queries generated';
        }
      } catch (e) {
        alexQueries = alexResult.text || 'No queries generated';
      }
      
      console.log(`   ✅ ${queryCount} queries generated (PROMPT-ONLY)`);
      
    } else {
      // NORMAL MODE: Generate and execute
      const alexPrompt = guidance
        ? `Research topic: "${topic}"\nFocus on: ${guidance}\n\nGenerate 15 financial research queries and call the exa-bulk-answer tool.`
        : `Research topic: "${topic}"\nRound 1: Broad exploration\n\nGenerate 15 financial research queries and call the exa-bulk-answer tool.`;
      
      const alexResult = await alex.generate(alexPrompt, { maxSteps: 2 });
      
      // Extract Alex's tool results
      const alexToolResults = (alexResult as any).toolResults || [];
      const alexExaResult = alexToolResults[0]?.result || alexToolResults[0]?.payload?.result;
      
      if (alexExaResult?.results) {
        alexQueries = alexExaResult.results.map((r: any) => 
          `Q: ${r.query}\nA: ${r.answer || 'No answer'}`
        ).join('\n\n');
        queryCount = alexExaResult.summary?.successful || alexExaResult.results.length;
      } else {
        alexQueries = alexResult.text || 'No data retrieved';
      }
      
      console.log(`   ✅ ${queryCount} queries executed`);
    }
    
    // ===== DAVID: Deep Research =====
    console.log(`\n🔬 DAVID Round ${round}: ${promptOnly ? 'Generating prompt...' : 'Deep research...'}`);
    
    let davidReport = '';
    
    if (promptOnly) {
      // PROMPT-ONLY MODE: Just generate the research prompt, don't call tool
      const davidPrompt = guidance
        ? `Research topic: "${topic}"\nFocus: ${guidance}\n\nGenerate ONE short deep research prompt (100-200 chars) for Exa Deep Research API. Return ONLY the prompt string.`
        : `Research topic: "${topic}"\nRound 1: Broad strategic research\n\nGenerate ONE short deep research prompt (100-200 chars) for Exa Deep Research API. Return ONLY the prompt string.`;
      
      const davidResult = await david.generate(davidPrompt, { maxSteps: 1 });
      davidReport = `PROMPT: ${davidResult.text || 'No prompt generated'}`;
      
      console.log(`   ✅ Prompt generated (PROMPT-ONLY)`);
      
    } else {
      // NORMAL MODE: Generate and execute
      const davidPrompt = guidance
        ? `Research topic: "${topic}"\nFocus: ${guidance}\n\nCreate a SHORT research prompt (100-200 chars) and call exa-deep-research.\nExample: "Summarize why McDonald's franchisees are leaving in 2024. Include management statements."`
        : `Research topic: "${topic}"\nRound 1: Broad strategic research\n\nCreate a SHORT research prompt (100-200 chars) and call exa-deep-research.\nExample: "Summarize why McDonald's franchisees are leaving in 2024. Include management statements."`;
      
      const davidResult = await david.generate(davidPrompt, { maxSteps: 2 });
      
      // Extract David's tool results
      const davidToolResults = (davidResult as any).toolResults || [];
      const davidExaResult = davidToolResults[0]?.result || davidToolResults[0]?.payload?.result;
      
      davidReport = davidExaResult?.report || davidResult.text || 'No research retrieved';
      
      console.log(`   ✅ Research complete (${davidReport.length} chars)`);
    }
    
    // ===== MARCUS: Analysis & Guidance =====
    console.log(`\n🧠 MARCUS Round ${round}: ${promptOnly ? 'Analyzing prompts...' : 'Analyzing...'}`);
    
    const marcusPrompt = promptOnly
      ? `Research topic: "${topic}"
Round ${round} complete (PROMPT-ONLY MODE).

ALEX'S QUERIES:
${alexQueries.substring(0, 5000)}

DAVID'S RESEARCH PROMPT:
${davidReport.substring(0, 5000)}

Analyze these PROMPTS and provide SPECIFIC guidance for round ${round + 1}.
Be detailed and actionable. What financial metrics should Alex focus on? What mechanisms should David research?`
      : `Research topic: "${topic}"
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
      promptOnly,
      round: round + 1,  // Increment for next iteration
      guidance: newGuidance,
      rounds: accumulatedRounds,
    };
  },
});

