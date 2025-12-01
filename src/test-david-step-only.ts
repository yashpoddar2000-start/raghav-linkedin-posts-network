/**
 * Test David Strategic Research Step Only
 * 
 * Tests just the davidStrategicResearchStep in isolation to see what it returns
 * when processing David's tool results.
 */

import 'dotenv/config';
import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { davidPark } from './mastra/agents/david-park';

// Define David's expected output schema
const davidOutputSchema = z.object({
  strategicResearch: z.array(z.object({
    angle: z.string(),
    prompt: z.string(),
    findings: z.string(),
    length: z.number()
  })),
  summary: z.object({
    totalPrompts: z.number(),
    successfulPrompts: z.number(),
    totalLength: z.number(),
    keyMechanisms: z.array(z.string())
  })
});

// Copy of the David step from the main workflow
const davidStrategicResearchStep = createStep({
  id: 'david-strategic-research',
  description: 'Generate and execute 3 strategic research prompts using David Park',
  inputSchema: z.object({
    topic: z.string(),
    financialContext: z.string(),
  }),
  outputSchema: z.object({
    strategicResearch: z.string(),
    davidMetrics: z.object({
      researchPromptsExecuted: z.number(),
      researchDepth: z.string(),
      responseLength: z.number(),
    }),
  }),
  execute: async ({ inputData }) => {
    console.log(`🔬 Testing David Strategic Research Step`);
    console.log(`🎯 Topic: ${inputData.topic}`);
    console.log(`📊 Financial Context Length: ${inputData.financialContext.length} chars\n`);

    // Call David Park for strategic research with new approach
    const davidResult = await davidPark.generate(
      `David, you're receiving financial research context for viral LinkedIn content on: "${inputData.topic}"

FINANCIAL DATA CONTEXT (Alex's 50 Query Results):
${inputData.financialContext}

Based on this financial data, follow this workflow:

STEP 1: Analyze the financial patterns and generate 3 COMPLEMENTARY strategic research prompts covering:
1. **Management Rationale & Strategic Reasoning** - Why do companies make these strategic decisions?
2. **Operational Mechanisms & System Details** - HOW do these financial patterns work operationally?  
3. **Competitive Dynamics & Industry Transformation** - How does this compare to competitor approaches?

STEP 2-4: Execute each of the 3 research prompts separately via your Exa Deep Research tool

Use your expertise to craft expert-level research prompts that seek documented evidence and provide comprehensive strategic context explaining WHY the financial patterns exist.`,
      { 
        maxSteps: 3,
        toolChoice: 'required',
        output: davidOutputSchema
      }
    );

    console.log(`🔧 David tool calls: ${davidResult.toolCalls?.length || 0}`);
    console.log(`🔧 David tool results: ${(davidResult as any).toolResults?.length || 0}`);
    
    let combinedResearch = '';
    let researchCount = 0;
    
    // Check if David returned structured JSON object
    if (davidResult.object) {
      console.log(`✅ David returned structured JSON object`);
      console.log(`📊 Strategic Research entries: ${davidResult.object.strategicResearch?.length || 0}`);
      
      // Process David's JSON output
      const researchEntries = davidResult.object.strategicResearch || [];
      combinedResearch = researchEntries.map((entry: any, index: number) => 
        `## RESEARCH ANGLE ${index + 1}: ${entry.angle}\n\nPROMPT: ${entry.prompt}\n\nFINDINGS:\n${entry.findings}`
      ).join('\n\n');
      researchCount = researchEntries.length;
      
    } else {
      console.log(`📝 David returned text output, checking tool results...`);
      
      // Fallback: Extract from tool results if no JSON object
      const toolResults = (davidResult as any).toolResults;
      console.log(`🔍 David tool results structure:`);
      console.log(JSON.stringify(toolResults?.[0], null, 2));

      const allResults = [];
      if (toolResults && toolResults.length > 0) {
        for (const toolResult of toolResults) {
          const result = toolResult?.payload?.result;
          if (result) {
            allResults.push({
              prompt: toolResult?.payload?.args || 'Unknown prompt',
              research: result,
              length: typeof result === 'string' ? result.length : JSON.stringify(result).length
            });
          }
        }
      }

      // Combine all David research results
      combinedResearch = allResults.map((item, index) => 
        `## RESEARCH PROMPT ${index + 1} FINDINGS\n\n${item.research}`
      ).join('\n\n');
      researchCount = allResults.length;
    }

    console.log(`✅ David step processed: ${researchCount} research prompts`);
    console.log(`📝 Final research length: ${combinedResearch.length} characters\n`);

    return {
      strategicResearch: combinedResearch,
      davidMetrics: {
        researchPromptsExecuted: researchCount,
        researchDepth: combinedResearch.length > 8000 ? 'Comprehensive' : 'Basic',
        responseLength: combinedResearch.length,
      },
    };
  },
});

// Simple workflow with just David step
const davidOnlyWorkflow = createWorkflow({
  id: 'david-only-test',
  description: 'Test David strategic research step only',
  inputSchema: z.object({
    topic: z.string(),
    financialContext: z.string(),
  }),
  outputSchema: z.object({
    strategicResearch: z.string(),
    davidMetrics: z.object({
      researchPromptsExecuted: z.number(),
      researchDepth: z.string(),
      responseLength: z.number(),
    }),
  }),
})
  .then(davidStrategicResearchStep);

davidOnlyWorkflow.commit();

async function testDavidStepOnly() {
  console.log('🧪 TESTING DAVID STRATEGIC RESEARCH STEP ONLY');
  console.log('=' .repeat(80));
  console.log('🎯 Goal: Test David step extraction of tool results');
  console.log('📊 Focus: See what structured research data David step returns');
  console.log('=' .repeat(80) + '\n');

  const topic = "The Coming Margin Crisis: Why Most QSR Franchisees Won't Survive Their 2025–2027 Lease Renewals";
  
  // Mock financial context (what Alex's 50 queries would provide)
  const financialContext = `Alex's 50 Query Results for QSR Lease Renewal Crisis:

- What is the average profit margin for QSR franchisees in 2024?: 6-9% typical range
- What is the average lease cost as percentage of revenue for QSRs?: 5-8% of total sales
- What is the average occupancy cost for QSR franchisees in 2024?: 5.2% of sales median
- What is the average lease term for QSR franchisees?: 20 years typical
- What is the average commercial lease increase annually?: 2-3% typical increases
- What is the average EBITDA margin for QSR franchisees?: 34.56% (Restaurant Brands)
- What is the average labor cost for QSRs in 2024?: Rose 6.3% in 2024
- What is the average utility cost for QSRs?: ~5% of sales
- What is the average franchise royalty rate for QSRs?: 4-8% of gross sales
- What percentage of QSR franchisees face lease renewals 2025-2027?: Data not available
- What is the average rent increase on lease renewal for QSRs?: Data not available
- What is the average franchisee profit per store for McDonald's?: $3.2M gross sales
- What is the average franchisee profit per store for Burger King?: $200K profit
- What is the average store investment cost for QSR franchisees?: $515K-$1M range
- What is the average payback period for QSR franchisees?: 3-5 years typical
[... 35 more financial queries covering unit economics, competitive data, operational costs, industry trends]

KEY FINANCIAL PATTERNS:
- Profit margins (6-9%) vs lease costs (5-8%) = tight margin pressure
- Labor costs rising (6.3%) while lease increases (2-3%) = cost squeeze
- High EBITDA (34%) but franchisee level data gaps
- Long lease terms (20 years) create renewal risk exposure`;

  try {
    // Create and run the David-only workflow
    const run = await davidOnlyWorkflow.createRunAsync();
    
    const result = await run.start({
      inputData: {
        topic: topic,
        financialContext: financialContext,
      }
    });

    console.log('\n' + '='.repeat(80));
    console.log('📊 DAVID STEP WORKFLOW RESULTS');
    console.log('=' .repeat(80));

    if (result.status === 'success') {
      console.log(`✅ Status: ${result.status.toUpperCase()}`);
      console.log(`🔬 Research Prompts Executed: ${result.result.davidMetrics.researchPromptsExecuted}`);
      console.log(`🎯 Research Depth: ${result.result.davidMetrics.researchDepth}`);
      console.log(`📝 Response Length: ${result.result.davidMetrics.responseLength} characters`);
      
      // Show if David returned 3 research angles
      if (result.result.davidMetrics.researchPromptsExecuted === 3) {
        console.log(`🎉 SUCCESS: David executed all 3 research angles!`);
      } else {
        console.log(`⚠️  David executed ${result.result.davidMetrics.researchPromptsExecuted}/3 research angles`);
      }
      
      console.log('\n📋 STRATEGIC RESEARCH SAMPLE (First 800 chars):');
      console.log('-'.repeat(60));
      console.log(result.result.strategicResearch.substring(0, 800));
      if (result.result.strategicResearch.length > 800) {
        console.log(`\n... [${result.result.strategicResearch.length - 800} more characters]`);
      }
      
      console.log('\n🎯 SUCCESS - DAVID STEP IS WORKING!');
      
    } else {
      console.log(`❌ Status: ${result.status.toUpperCase()}`);
      console.log(`Error: ${(result as any).error || 'Unknown error'}`);
    }

  } catch (error) {
    console.error('\n❌ David step test failed:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
  }

  console.log('\n' + '='.repeat(80));
  console.log('✨ DAVID STEP TEST COMPLETED');
  console.log('=' .repeat(80));
}

// Run test
testDavidStepOnly();

export { testDavidStepOnly, davidOnlyWorkflow };
