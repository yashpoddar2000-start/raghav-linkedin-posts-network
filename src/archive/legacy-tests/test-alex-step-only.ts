/**
 * Test Alex Financial Data Step Only
 * 
 * Tests just the alexFinancialDataStep in isolation to see what it returns
 * when processing Alex's tool results.
 */

import 'dotenv/config';
import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { alexRivera } from './mastra/agents/alex-rivera';

// Copy of the Alex step from the main workflow
const alexFinancialDataStep = createStep({
  id: 'alex-financial-data',
  description: 'Generate and execute strategic financial queries using Alex Rivera',
  inputSchema: z.object({
    topic: z.string(),
    runId: z.string(),
  }),
  outputSchema: z.object({
    financialData: z.string(),
    alexMetrics: z.object({
      queriesExecuted: z.number(),
      dataQuality: z.string(),
      responseLength: z.number(),
    }),
  }),
  execute: async ({ inputData }) => {
    console.log(`📊 Testing Alex Financial Data Step`);
    console.log(`🎯 Topic: ${inputData.topic}`);
    console.log(`🆔 Run ID: ${inputData.runId}\n`);

    // Call Alex Rivera
    const alexResult = await alexRivera.generate(
      `Alex, conduct financial research for viral LinkedIn content on: "${inputData.topic}"

Generate and execute 10 strategic queries. Use your QSR expertise to identify the most valuable financial data for this topic.`,
      { 
        runId: inputData.runId,
        maxSteps: 1,
        toolChoice: 'required'
      }
    );

    console.log(`🔧 Alex tool calls: ${alexResult.toolCalls?.length || 0}`);
    console.log(`🔧 Alex tool results: ${(alexResult as any).toolResults?.length || 0}`);
    
    // Extract tool results from the correct location: toolResults[0].payload.result.results
    const toolResults = (alexResult as any).toolResults;
    const toolResult = toolResults?.[0]?.payload?.result;
    console.log(`📊 Tool result exists: ${!!toolResult}`);
    
    const results = toolResult?.results || [];
    console.log(`📋 Results count: ${results.length}`);
    
    // Process Alex's tool output into structured format
    const processedFindings = results.map((result: any) => ({
      query: result.query,
      answer: result.answer,
      sources: result.sources?.map((s: any) => s.url).slice(0, 2) || []
    }));

    const financialDataText = processedFindings.map((finding: any) => 
      `- ${finding.query}: ${finding.answer}`
    ).join('\n');

    console.log(`✅ Alex step processed: ${processedFindings.length} queries`);
    console.log(`📝 Final data length: ${financialDataText.length} characters\n`);

    return {
      financialData: financialDataText,
      alexMetrics: {
        queriesExecuted: processedFindings.length,
        dataQuality: processedFindings.length >= 8 ? 'Comprehensive' : 'Basic',
        responseLength: financialDataText.length,
      },
    };
  },
});

// Simple workflow with just Alex step
const alexOnlyWorkflow = createWorkflow({
  id: 'alex-only-test',
  description: 'Test Alex financial data step only',
  inputSchema: z.object({
    topic: z.string(),
    runId: z.string(),
  }),
  outputSchema: z.object({
    financialData: z.string(),
    alexMetrics: z.object({
      queriesExecuted: z.number(),
      dataQuality: z.string(),
      responseLength: z.number(),
    }),
  }),
})
  .then(alexFinancialDataStep);

alexOnlyWorkflow.commit();

async function testAlexStepOnly() {
  console.log('🧪 TESTING ALEX FINANCIAL DATA STEP ONLY');
  console.log('=' .repeat(80));
  console.log('🎯 Goal: Test Alex step extraction of tool results');
  console.log('📊 Focus: See what structured data Alex step returns');
  console.log('=' .repeat(80) + '\n');

  const topic = "The Coming Margin Crisis: Why Most QSR Franchisees Won't Survive Their 2025–2027 Lease Renewals";
  const runId = `alex-step-test-${Date.now()}`;

  try {
    // Create and run the Alex-only workflow
    const run = await alexOnlyWorkflow.createRunAsync();
    
    const result = await run.start({
      inputData: {
        topic: topic,
        runId: runId,
      }
    });

    console.log('\n' + '='.repeat(80));
    console.log('📊 ALEX STEP WORKFLOW RESULTS');
    console.log('=' .repeat(80));

    if (result.status === 'success') {
      console.log(`✅ Status: ${result.status.toUpperCase()}`);
      console.log(`📊 Queries Executed: ${result.result.alexMetrics.queriesExecuted}`);
      console.log(`🎯 Data Quality: ${result.result.alexMetrics.dataQuality}`);
      console.log(`📝 Response Length: ${result.result.alexMetrics.responseLength} characters`);
      
      console.log('\n📋 FINANCIAL DATA SAMPLE (First 500 chars):');
      console.log('-'.repeat(60));
      console.log(result.result.financialData.substring(0, 500));
      if (result.result.financialData.length > 500) {
        console.log(`\n... [${result.result.financialData.length - 500} more characters]`);
      }
      
      console.log('\n🎯 SUCCESS - ALEX STEP IS WORKING!');
      
    } else {
      console.log(`❌ Status: ${result.status.toUpperCase()}`);
      console.log(`Error: ${(result as any).error || 'Unknown error'}`);
    }

  } catch (error) {
    console.error('\n❌ Alex step test failed:', error);
  }

  console.log('\n' + '='.repeat(80));
  console.log('✨ ALEX STEP TEST COMPLETED');
  console.log('=' .repeat(80));
}

// Run test
testAlexStepOnly();

export { testAlexStepOnly, alexOnlyWorkflow };
