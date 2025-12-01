/**
 * Test Phase 1 Research Workflow
 * 
 * Tests the complete research workflow that coordinates Alex and David
 * to produce comprehensive QSR research dataset for viral content creation.
 * 
 * Topic: "The Coming Margin Crisis: Why Most QSR Franchisees Won't Survive Their 2025–2027 Lease Renewals"
 */

import 'dotenv/config';
import { mastra } from './mastra';

async function testPhase1ResearchWorkflow() {
  console.log('🚀 PHASE 1 RESEARCH WORKFLOW TEST');
  console.log('=' .repeat(80));
  console.log('🎯 Testing Alex + David coordination via workflow');
  console.log('📊 50 strategic queries + 3 deep research prompts');
  console.log('🔬 Complete research synthesis for viral content');
  console.log('=' .repeat(80) + '\n');

  // Research topic for testing
  const researchTopic = "The Coming Margin Crisis: Why Most QSR Franchisees Won't Survive Their 2025–2027 Lease Renewals";
  const runId = `phase1-research-${Date.now()}`;

  console.log(`📋 Research Topic: ${researchTopic}`);
  console.log(`🆔 Run ID: ${runId}\n`);

  try {
    // Get the Phase 1 research workflow
    const workflow = mastra.getWorkflow('phase1ResearchWorkflow');
    console.log('✅ Workflow retrieved successfully\n');

    // Create a workflow run
    const run = await workflow.createRunAsync();
    console.log('✅ Workflow run created\n');

    // Start the workflow with streaming to see progress
    console.log('🚀 Starting Phase 1 Research Workflow...\n');
    
    const stream = await run.stream({
      inputData: {
        topic: researchTopic,
        runId: runId,
      }
    });

    console.log('📡 Streaming workflow execution:\n');
    
    // Monitor workflow progress
    for await (const chunk of stream) {
      if (chunk.type === 'step-start') {
        console.log(`\n🔄 STEP STARTED: ${chunk.payload.stepId}`);
        console.log(`   Description: ${chunk.payload.description || 'Processing...'}`);
      } else if (chunk.type === 'step-finish') {
        console.log(`✅ STEP COMPLETED: ${chunk.payload.stepId}`);
        console.log(`   Duration: ${chunk.payload.duration || 'Unknown'}ms`);
      } else if (chunk.type === 'tool-call') {
        console.log(`🛠️  TOOL CALLED: ${chunk.payload.toolName}`);
      } else if (chunk.type === 'finish') {
        console.log(`\n🎉 WORKFLOW COMPLETE!`);
        console.log(`   Total Duration: ${chunk.payload.duration || 'Unknown'}ms`);
      }
    }

    // Get final workflow state
    const finalResult = await stream.getWorkflowState();
    
    console.log('\n' + '='.repeat(80));
    console.log('📊 PHASE 1 RESEARCH WORKFLOW RESULTS');
    console.log('=' .repeat(80));
    
    if (finalResult.status === 'success') {
      const result = finalResult.result;
      
      console.log(`✅ Status: ${finalResult.status.toUpperCase()}`);
      console.log(`📊 Financial Data: ${result.qualityMetrics.alexDataLength} characters`);
      console.log(`🔬 Strategic Research: ${result.qualityMetrics.davidResearchLength} characters`);
      console.log(`📈 Total Research Scope: ${result.qualityMetrics.totalResearchScope} characters`);
      console.log(`🎯 Ready for Maya: ${result.readyForMaya ? 'YES' : 'NO'}`);
      
      console.log('\n📋 SYNTHESIS REPORT:');
      console.log('-'.repeat(60));
      console.log(result.synthesisReport);
      
      console.log('\n📊 RESEARCH QUALITY BREAKDOWN:');
      console.log(`   Financial Data Quality: ${result.qualityMetrics.alexDataLength > 5000 ? 'Comprehensive' : 'Basic'}`);
      console.log(`   Strategic Research Depth: ${result.qualityMetrics.davidResearchLength > 8000 ? 'Comprehensive' : 'Basic'}`);
      console.log(`   Overall Research Scope: ${result.qualityMetrics.totalResearchScope} total characters`);
      
    } else {
      console.log(`❌ Status: ${finalResult.status.toUpperCase()}`);
      console.log(`Error: ${finalResult.error || 'Unknown error'}`);
    }

  } catch (error) {
    console.error('\n❌ Workflow test failed:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
  }

  console.log('\n' + '='.repeat(80));
  console.log('✨ PHASE 1 WORKFLOW TEST COMPLETED');
  console.log('🎯 Next: Use results for Maya → Taylor → James content pipeline');
  console.log('=' .repeat(80));
}

// Run test if executed directly
testPhase1ResearchWorkflow();

export { testPhase1ResearchWorkflow };
