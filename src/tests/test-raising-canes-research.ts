import 'dotenv/config';
import { mastra } from '../mastra';

async function testRaisingCanesResearch() {
  console.log('\n' + '██'.repeat(35));
  console.log('█ RESEARCH: Raising Cane\'s Menu Simplicity Economics');
  console.log('██'.repeat(35));

  const topic = 'Raising Cane\'s one-item menu economics vs diversified QSR chains';
  
  console.log(`\nTopic: ${topic}`);
  console.log(`\nExpected duration: ~5-10 minutes`);
  console.log('──────────────────────────────────────────────────────────────────────');

  const startTime = Date.now();

  try {
    const workflow = mastra.getWorkflow('agenticResearchWorkflow');
    const run = await workflow.createRunAsync();

    const result = await run.start({
      inputData: { topic },
    });

    const duration = Math.round((Date.now() - startTime) / 1000);

    console.log('\n' + '██'.repeat(35));
    console.log('█ RESULTS');
    console.log('██'.repeat(35));
    console.log(`Status: ${result.status}`);
    console.log(`Duration: ${duration}s`);

    if (result.status === 'success' && result.result) {
      console.log(`\nFile saved: ${result.result.researchFile}`);
      console.log(`\nStats:`);
      console.log(`  Query data: ${result.result.stats.queryDataLength} characters`);
      console.log(`  Deep research: ${result.result.stats.deepResearchLength} characters`);
      console.log(`  Total: ${result.result.stats.totalLength} characters`);
      console.log(`  Reports: ${result.result.stats.reportCount}`);
      console.log(`  Cost: $${result.result.stats.totalCost.toFixed(4)}`);

      console.log(`\n──────────────────────────────────────────────────────────────────────`);
      console.log(`RESEARCH PREVIEW (first 2000 chars):`);
      console.log(`──────────────────────────────────────────────────────────────────────`);
      console.log(result.result.combinedResearch?.substring(0, 2000) || 'No research');
      console.log(`\n...[truncated]...`);
    } else if (result.status === 'failed') {
      console.error('Workflow failed:', result.error);
    }

    console.log('\n✅ Test complete!');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

testRaisingCanesResearch();

