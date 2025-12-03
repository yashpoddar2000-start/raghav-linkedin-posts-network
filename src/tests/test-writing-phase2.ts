/**
 * Test: Writing Phase 2 Workflow
 * 
 * Tests Taylor/James writing loop using saved research data (no Exa API calls)
 */

import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { mastra } from '../mastra';

async function testWritingPhase2() {
  console.log('\n' + '='.repeat(70));
  console.log('TEST: Writing Phase 2 Workflow');
  console.log('='.repeat(70));
  
  // Load saved research data
  const researchFile = 'research-chick-fil-a-vs-mcdonald-s-revenue-per-store-2025-12-03.json';
  const researchPath = path.join(process.cwd(), 'research-data', researchFile);
  
  console.log(`\nLoading research from: ${researchFile}`);
  
  const researchData = JSON.parse(fs.readFileSync(researchPath, 'utf-8'));
  const topic = researchData.topic;
  const research = researchData.combinedResearch;
  
  console.log(`Topic: ${topic}`);
  console.log(`Research: ${research.length} characters`);
  
  const startTime = Date.now();
  
  try {
    // Get workflow and create run
    const workflow = mastra.getWorkflow('writingPhase2');
    const run = await workflow.createRunAsync();
    
    // Start the workflow
    const result = await run.start({
      inputData: { topic, research },
    });
    
    const duration = Math.round((Date.now() - startTime) / 1000);
    
    console.log('\n' + '='.repeat(70));
    console.log('RESULTS');
    console.log('='.repeat(70));
    console.log(`Status: ${result.status}`);
    console.log(`Duration: ${duration} seconds`);
    
    if (result.status === 'success' && result.result) {
      console.log(`Final Score: ${result.result.finalScore}/100`);
      console.log(`Approved: ${result.result.approved ? 'YES' : 'NO'}`);
      console.log(`Iterations: ${result.result.iterations}`);
      console.log(`Post Length: ${result.result.finalPost?.length || 0} chars`);
      
      // Print the final post
      console.log('\n' + '='.repeat(70));
      console.log('FINAL POST:');
      console.log('='.repeat(70));
      console.log(result.result.finalPost);
    } else if (result.status === 'failed') {
      console.error('Workflow failed:', result.error);
    }
    
    console.log('\n✅ Test complete!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

testWritingPhase2();

