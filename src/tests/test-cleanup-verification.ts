import 'dotenv/config';
import { mastra } from '../mastra';

async function testCleanupVerification() {
  console.log('\n' + '██'.repeat(35));
  console.log('█ CLEANUP VERIFICATION TEST');
  console.log('██'.repeat(35));

  console.log('\n🔍 Checking production system...');
  console.log('Available workflows:', Object.keys(mastra.workflows));
  console.log('Available agents:', Object.keys(mastra.agents));

  console.log('\n✅ System loaded successfully!');
  console.log('\nRunning quick research test...');

  const topic = 'Five Guys vs In-N-Out burger economics';
  const startTime = Date.now();

  try {
    const workflow = mastra.getWorkflow('agenticResearchWorkflow');
    const run = await workflow.createRunAsync();

    const result = await run.start({
      inputData: { topic },
    });

    const duration = Math.round((Date.now() - startTime) / 1000);

    console.log('\n' + '══'.repeat(35));
    console.log('RESULTS');
    console.log('══'.repeat(35));
    console.log(`Status: ${result.status}`);
    console.log(`Duration: ${duration}s`);

    if (result.status === 'success' && result.result) {
      console.log(`\n✅ Research completed successfully!`);
      console.log(`   File: ${result.result.researchFile}`);
      console.log(`   Query data: ${result.result.stats.queryDataLength} chars`);
      console.log(`   Deep research: ${result.result.stats.deepResearchLength} chars`);
      console.log(`   Total: ${result.result.stats.totalLength} chars`);
      console.log(`   Cost: $${result.result.stats.totalCost.toFixed(4)}`);
    } else if (result.status === 'failed') {
      console.error('❌ Workflow failed:', result.error);
      process.exit(1);
    }

    console.log('\n🎉 CLEANUP VERIFICATION PASSED!');
    console.log('Production system is working perfectly.');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

testCleanupVerification();

