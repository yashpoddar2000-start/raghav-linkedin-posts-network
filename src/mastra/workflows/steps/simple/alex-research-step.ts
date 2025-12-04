/**
 * Alex Research Step - Simple Single-Shot Mode
 * 
 * Alex generates 50 diverse queries and executes them all at once.
 * No rounds, no iterations - just comprehensive data gathering.
 */

import { createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { alex } from '../../../agents/alex';

// Helper for detailed logging
function logStep(step: string, details: string) {
  console.log(`\n${'─'.repeat(70)}`);
  console.log(`📊 ALEX: ${step}`);
  console.log(`${'─'.repeat(70)}`);
  console.log(details);
}

export const alexResearchStep = createStep({
  id: 'alex-research',
  description: 'Alex generates and executes 50 financial queries in one shot',
  
  inputSchema: z.object({
    topic: z.string(),
  }),
  
  outputSchema: z.object({
    topic: z.string(),
    alexData: z.string(),
    queryCount: z.number(),
    successful: z.number(),
  }),
  
  execute: async ({ inputData }) => {
    const { topic } = inputData;
    
    console.log('\n' + '═'.repeat(70));
    console.log('STEP 1: ALEX - Financial Data Research');
    console.log('═'.repeat(70));
    console.log(`Topic: ${topic}`);
    console.log(`Target: 50 diverse queries across multiple dimensions`);
    
    // Prompt Alex to generate and execute 50 queries
    const alexPrompt = `Research topic: "${topic}"

YOUR TASK: Generate and execute 50 comprehensive financial queries about this topic.

QUERY STRATEGY - Cover these dimensions:
1. REVENUE & SALES (10 queries)
   - Revenue per store, total revenue, same-store sales growth
   - Revenue breakdown by segment, revenue trends over time
   
2. COSTS & MARGINS (10 queries)
   - Labor costs %, food costs %, occupancy costs
   - Operating margins, profit margins, cost trends
   
3. UNIT ECONOMICS (10 queries)
   - Profit per store, investment per store, payback period
   - Franchise fees, royalty rates, initial investment
   
4. OPERATIONAL METRICS (10 queries)
   - Store count, drive-thru %, digital sales %
   - Service time, throughput, customer satisfaction
   
5. COMPETITIVE & MARKET DATA (10 queries)
   - Market share, growth rate, advertising spend
   - Brand perception, customer loyalty, expansion plans

CRITICAL RULES:
- Each query MUST be different - no semantic duplicates
- Include specific time periods (2023, 2024, Q1 2024, etc.)
- Mix TYPE 1 (specific metrics) and TYPE 2 (contextual summaries)
- Cover BOTH companies/entities mentioned in the topic
- Include industry benchmarks and comparisons

Generate exactly 50 queries, then CALL the exa-bulk-answer tool with all 50.`;

    logStep('Generating 50 queries...', `Prompt: ${alexPrompt.substring(0, 500)}...`);
    
    const startTime = Date.now();
    
    const alexResult = await alex.generate(alexPrompt, {
      maxSteps: 2, // Allow tool call
    });
    
    const duration = Math.round((Date.now() - startTime) / 1000);
    
    // Extract results from tool call
    let alexData = '';
    let queryCount = 0;
    let successful = 0;
    
    const toolResults = (alexResult as any).toolResults || [];
    const exaResult = toolResults[0]?.result;
    
    if (exaResult?.results) {
      // Format the results as structured data
      alexData = exaResult.results.map((r: any) => 
        `Q: ${r.query}\nA: ${r.answer || 'No answer'}\nSources: ${r.sources?.map((s: any) => s.url).slice(0, 2).join(', ') || 'None'}`
      ).join('\n\n');
      
      queryCount = exaResult.results.length;
      successful = exaResult.summary?.successful || queryCount;
      
      logStep('Queries executed', `
Total queries: ${queryCount}
Successful: ${successful}
Duration: ${duration}s
Data size: ${alexData.length} characters`);
    } else {
      // Fallback to text response
      alexData = alexResult.text || 'No data retrieved';
      logStep('Warning: No tool results', alexResult.text?.substring(0, 500) || 'Empty response');
    }
    
    console.log('\n✅ Alex research complete');
    console.log(`   Queries: ${queryCount} | Successful: ${successful} | Duration: ${duration}s`);
    
    return {
      topic,
      alexData,
      queryCount,
      successful,
    };
  },
});

