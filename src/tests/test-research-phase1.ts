/**
 * Test: Research Phase 1 Workflow
 * 
 * Tests the 3-round progressive research workflow with dountil loop
 */

import 'dotenv/config';
import { mastra } from '../mastra';

async function testResearchPhase1() {
  console.log('\n' + '='.repeat(70));
  console.log('TEST: Research Phase 1 Workflow');
  console.log('='.repeat(70));
  
  const topic = 'Chick-fil-A vs McDonald\'s revenue per store';
  console.log(`\nTopic: ${topic}`);
  
  const startTime = Date.now();
  
  try {
    // Get workflow and create run
    const workflow = mastra.getWorkflow('researchPhase1');
    const run = await workflow.createRunAsync();
    
    // Start the workflow
    const result = await run.start({
      inputData: { topic },
    });
    
    const duration = Math.round((Date.now() - startTime) / 1000);
    
    console.log('\n' + '='.repeat(70));
    console.log('RESULTS');
    console.log('='.repeat(70));
    console.log(`Status: ${result.status}`);
    console.log(`Duration: ${duration} seconds`);
    
    if (result.status === 'success' && result.result) {
      console.log(`Research File: ${result.result.researchFile}`);
      console.log(`Total Queries: ${result.result.totalQueries}`);
      console.log(`Research Length: ${result.result.combinedResearch?.length || 0} chars`);
      
      // Print first 500 chars of research
      console.log('\n--- Research Preview (first 500 chars) ---');
      console.log(result.result.combinedResearch?.substring(0, 500) || 'No research');
    } else if (result.status === 'failed') {
      console.error('Workflow failed:', result.error);
    }
    
    console.log('\n✅ Test complete!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

testResearchPhase1();

