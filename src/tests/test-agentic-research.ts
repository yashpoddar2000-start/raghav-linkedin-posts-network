/**
 * Test: Agentic Research Workflow
 * 
 * Tests the simple 2-agent research workflow:
 * Topic → Query Agent (50 queries) → Deep Research Agent (3 reports) → Save
 * 
 * Expected: ~5-10 minutes
 * - Query Agent: ~1-2 min for 50 queries
 * - Deep Research Agent: ~3-8 min for 3 reports (60-180s each)
 */

import 'dotenv/config';
import { mastra } from '../mastra';

async function testAgenticResearch() {
  console.log('\n' + '██'.repeat(35));
  console.log('█ TEST: AGENTIC RESEARCH WORKFLOW');
  console.log('██'.repeat(35));
  
  const topic = "Raising Cane's one-item menu (chicken fingers) vs full-menu QSR restaurants: How does extreme menu simplicity outperform chains with 40-80 items in revenue per store, speed, throughput, and unit economics?";
  
  console.log(`\nTopic: ${topic}`);
  console.log(`\nWorkflow Architecture:`);
  console.log(`  1. Query Agent: 50 Exa Answer queries`);
  console.log(`  2. Deep Research Agent: 3 strategic deep research prompts`);
  console.log(`  3. Combine & Save: Merge all data`);
  console.log(`\nExpected duration: ~5-10 minutes`);
  console.log('─'.repeat(70));
  
  const startTime = Date.now();
  
  try {
    const workflow = mastra.getWorkflow('agenticResearchWorkflow');
    const run = await workflow.createRunAsync();
    
    const result = await run.start({
      inputData: { topic },
    });
    
    const duration = Math.round((Date.now() - startTime) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    
    console.log('\n' + '██'.repeat(35));
    console.log('█ RESULTS');
    console.log('██'.repeat(35));
    
    console.log(`\nStatus: ${result.status}`);
    console.log(`Duration: ${minutes}m ${seconds}s`);
    
    if (result.status === 'success' && result.result) {
      const { researchFile, stats, combinedResearch } = result.result;
      
      console.log(`\nFile saved: ${researchFile}`);
      console.log(`\nStats:`);
      console.log(`  Query data: ${stats.queryDataLength.toLocaleString()} characters`);
      console.log(`  Deep research: ${stats.deepResearchLength.toLocaleString()} characters`);
      console.log(`  Total: ${stats.totalLength.toLocaleString()} characters`);
      console.log(`  Reports: ${stats.reportCount}`);
      console.log(`  Cost: $${stats.totalCost.toFixed(4)}`);
      
      console.log('\n' + '─'.repeat(70));
      console.log('RESEARCH PREVIEW (first 2000 chars):');
      console.log('─'.repeat(70));
      console.log(combinedResearch.substring(0, 2000));
      console.log('\n...[truncated]...');
      
    } else if (result.status === 'failed') {
      console.error('\n❌ Workflow failed:', result.error);
    }
    
    console.log('\n✅ Test complete!');
    
  } catch (error) {
    console.error('\n❌ Test error:', error);
    process.exit(1);
  }
}

testAgenticResearch();



