/**
 * Test Complete Content Pipeline
 * 
 * Full end-to-end: Topic → Research (saved) → Taylor → James → Approved Post
 */

import 'dotenv/config';
import { completeContentPipeline } from '../mastra/workflows/complete-content-pipeline';

async function testCompletePipeline() {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 COMPLETE CONTENT PIPELINE TEST');
  console.log('='.repeat(70));
  console.log('Full flow: Topic → Research → Taylor → James → Post');
  console.log('Expected: ~7-10 minutes, research saved locally');
  console.log('='.repeat(70));

  const topic = "How Chick-fil-A makes more revenue per store than McDonald's while being closed on Sundays";
  console.log(`\n📋 Topic: ${topic}\n`);

  try {
    const run = await completeContentPipeline.createRunAsync();
    const result = await run.start({
      inputData: { topic },
    });

    if (result.status === 'success') {
      console.log('\n' + '='.repeat(70));
      console.log('📊 FINAL RESULTS');
      console.log('='.repeat(70));
      console.log(`✅ Approved: ${result.result.approved ? 'YES 🎉' : 'NO'}`);
      console.log(`📊 Final Score: ${result.result.finalScore}/100`);
      console.log(`📝 Iterations: ${result.result.totalIterations}`);
      console.log(`💾 Research saved: ${result.result.researchFile}`);
      console.log(`\n📈 Stats:`);
      console.log(`   Queries: ${result.result.stats.totalQueries}`);
      console.log(`   Deep Research: ${result.result.stats.totalDeepResearch}`);
      console.log(`   Research: ${result.result.stats.researchCharacters} chars`);
      console.log(`   Post: ${result.result.stats.postCharacters} chars`);
      console.log(`   Duration: ${result.result.stats.durationSeconds}s`);

      console.log('\n' + '='.repeat(70));
      console.log('📱 FINAL POST:');
      console.log('='.repeat(70));
      console.log(result.result.finalPost);
      console.log('='.repeat(70));

      return true;
    } else {
      console.error('❌ Pipeline failed:', result);
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error);
    return false;
  }
}

testCompletePipeline()
  .then(passed => process.exit(passed ? 0 : 1))
  .catch(err => {
    console.error('Fatal:', err);
    process.exit(1);
  });

