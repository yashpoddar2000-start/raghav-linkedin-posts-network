/**
 * David Research Step - Simple Single-Shot Mode
 * 
 * David sees Alex's data, identifies gaps, and generates 3 deep research prompts.
 * Executes all 3 prompts sequentially via Exa Deep Research API.
 */

import { createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { david } from '../../../agents/david';

// Helper for detailed logging
function logStep(step: string, details: string) {
  console.log(`\n${'─'.repeat(70)}`);
  console.log(`🔬 DAVID: ${step}`);
  console.log(`${'─'.repeat(70)}`);
  console.log(details);
}

export const davidResearchStep = createStep({
  id: 'david-research',
  description: 'David generates and executes 3 deep research prompts based on Alex\'s data',
  
  inputSchema: z.object({
    topic: z.string(),
    alexData: z.string(),
    queryCount: z.number(),
    successful: z.number(),
  }),
  
  outputSchema: z.object({
    topic: z.string(),
    alexData: z.string(),
    davidData: z.string(),
    reportCount: z.number(),
    totalCost: z.number(),
  }),
  
  execute: async ({ inputData }) => {
    const { topic, alexData, queryCount, successful } = inputData;
    
    console.log('\n' + '═'.repeat(70));
    console.log('STEP 2: DAVID - Strategic Deep Research');
    console.log('═'.repeat(70));
    console.log(`Topic: ${topic}`);
    console.log(`Alex's data: ${alexData.length} characters from ${queryCount} queries`);
    console.log(`Target: 3 deep research reports to fill gaps`);
    
    // Create prompts for David - each with EXPLICIT different angles
    const davidPrompts = [
      `Research topic: "${topic}"

ALEX'S DATA (what we already know):
${alexData.substring(0, 8000)}
${alexData.length > 8000 ? '\n...[data continues]...' : ''}

YOUR TASK: Generate DEEP RESEARCH PROMPT #1 of 3
MANDATORY ANGLE: OPERATIONAL MECHANISMS

Focus ONLY on: HOW do the companies' operational systems create these results?
- Drive-thru design and throughput optimization
- Kitchen systems and food prep efficiency
- Staff training and service models
- Technology and digital ordering systems
- Store layout and customer flow

Generate ONE expert deep research prompt (800-1500 chars) using the 3-COMPONENT TEMPLATE:
1. Research Objectives (4-6 bullets about OPERATIONAL mechanisms)
2. Methodology (sources, time range, what to find)
3. Output Format (exact sections)

Then CALL the exa-deep-research tool with your prompt.`,

      `Research topic: "${topic}"

ALEX'S DATA PREVIEW:
${alexData.substring(0, 4000)}...

YOUR TASK: Generate DEEP RESEARCH PROMPT #2 of 3
MANDATORY ANGLE: FRANCHISE & BUSINESS MODEL ECONOMICS

Focus ONLY on: WHO captures value and HOW does the business model create returns?
- Franchise fee structures and royalty economics
- Real estate ownership models (who owns the land?)
- Franchisee profitability and take-home pay
- Corporate vs franchisee value capture
- Capital requirements and ROI comparisons

Generate ONE expert deep research prompt (800-1500 chars) with the 3-COMPONENT TEMPLATE.
Then CALL the exa-deep-research tool.`,

      `Research topic: "${topic}"

ALEX'S DATA PREVIEW:
${alexData.substring(0, 4000)}...

YOUR TASK: Generate DEEP RESEARCH PROMPT #3 of 3 (FINAL)
MANDATORY ANGLE: COMPETITIVE STRATEGY & FUTURE IMPLICATIONS

Focus ONLY on: WHERE is the industry going and WHO wins/loses?
- Strategic positioning differences
- Expansion strategies and growth plans
- Competitive responses and market dynamics
- Consumer behavior trends
- Non-obvious insights (what will surprise LinkedIn readers?)

Generate ONE expert deep research prompt (800-1500 chars) with the 3-COMPONENT TEMPLATE.
Then CALL the exa-deep-research tool.`
    ];
    
    const reports: string[] = [];
    let totalCost = 0;
    
    // Execute each deep research prompt
    for (let i = 0; i < 3; i++) {
      console.log(`\n${'─'.repeat(50)}`);
      console.log(`📝 DEEP RESEARCH ${i + 1}/3`);
      console.log(`${'─'.repeat(50)}`);
      
      const startTime = Date.now();
      
      try {
        const result = await david.generate(davidPrompts[i], {
          maxSteps: 2, // Allow tool call
        });
        
        const duration = Math.round((Date.now() - startTime) / 1000);
        
        // Extract the research report from tool results
        const toolResults = (result as any).toolResults || [];
        const researchResult = toolResults[0]?.result;
        
        if (researchResult?.report) {
          reports.push(`## DEEP RESEARCH REPORT ${i + 1}\n\n${researchResult.report}`);
          totalCost += researchResult.cost?.total || 0;
          
          console.log(`   ✅ Report ${i + 1} complete`);
          console.log(`   📊 Length: ${researchResult.report.length} chars`);
          console.log(`   💰 Cost: $${(researchResult.cost?.total || 0).toFixed(4)}`);
          console.log(`   ⏱️ Duration: ${duration}s`);
        } else {
          // Fallback to text response
          reports.push(`## DEEP RESEARCH REPORT ${i + 1}\n\n${result.text || 'No report generated'}`);
          console.log(`   ⚠️ Report ${i + 1}: Using text fallback (${(result.text?.length || 0)} chars)`);
        }
        
      } catch (error: any) {
        console.log(`   ❌ Report ${i + 1} failed: ${error.message}`);
        reports.push(`## DEEP RESEARCH REPORT ${i + 1}\n\nFailed: ${error.message}`);
      }
    }
    
    // Combine all reports
    const davidData = reports.join('\n\n' + '═'.repeat(50) + '\n\n');
    
    console.log('\n✅ David research complete');
    console.log(`   Reports: ${reports.length} | Total cost: $${totalCost.toFixed(4)}`);
    console.log(`   Data size: ${davidData.length} characters`);
    
    return {
      topic,
      alexData,
      davidData,
      reportCount: reports.length,
      totalCost,
    };
  },
});

