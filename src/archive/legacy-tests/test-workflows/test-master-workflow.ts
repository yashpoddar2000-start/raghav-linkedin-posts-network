/**
 * Test 2: Master Workflow End-to-End Test
 * 
 * Verifies:
 * - Phase 1 completes and passes data to Phase 2
 * - Phase 2 completes and passes data to Phase 3
 * - Phase 3 completes with James feedback loop
 * - Final content is generated and scored
 * - All agent chains communicate correctly
 */

import 'dotenv/config';
import { Mastra } from '@mastra/core';
import { masterContentWorkflow } from '../mastra/workflows/master-content-workflow';

async function testMasterWorkflow() {
  console.log('\n' + '='.repeat(70));
  console.log('🧪 TEST 2: Master Workflow End-to-End Test');
  console.log('='.repeat(70));

  const mastra = new Mastra({
    workflows: { masterContentWorkflow },
  });

  const testInput = {
    topic: 'The hidden economics of Chipotle\'s $1B guacamole empire',
    runId: `test-master-${Date.now()}`,
  };

  console.log(`\n📋 Test Input:`);
  console.log(`   Topic: ${testInput.topic}`);
  console.log(`   Run ID: ${testInput.runId}`);

  try {
    console.log(`\n⏳ Executing Master workflow (all 3 phases)...`);
    const startTime = Date.now();

    const run = await mastra.getWorkflow('masterContentWorkflow').createRunAsync();
    const result = await run.start({
      inputData: testInput,
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(`\n${'='.repeat(70)}`);
    console.log(`📊 TEST RESULTS`);
    console.log(`${'='.repeat(70)}`);

    // Validate results
    const tests = {
      workflowCompleted: result.status === 'success',
      phase1Complete: result.result?.phase1Complete === true,
      phase2Complete: result.result?.phase2Complete === true,
      phase3Complete: result.result?.phase3Complete === true,
      hasFinalContent: typeof result.result?.finalContent === 'string' && result.result.finalContent.length > 50,
      hasJamesScore: typeof result.result?.jamesScore === 'number' && result.result.jamesScore > 0,
      hasJamesVerdict: ['APPROVED', 'NEEDS_REVISION', 'REJECT', 'ACCEPTABLE', 'NEEDS_WORK'].includes(result.result?.jamesVerdict || ''),
      hasEconomicInsights: result.result?.keyInsightsCount > 0,
    };

    let passedTests = 0;
    const totalTests = Object.keys(tests).length;

    console.log(`\n✅ Validation Checks:`);
    for (const [testName, passed] of Object.entries(tests)) {
      const status = passed ? '✅' : '❌';
      console.log(`   ${status} ${testName}`);
      if (passed) passedTests++;
    }

    console.log(`\n📊 Phase 1 Summary:`);
    console.log(`   Research Queries: ${result.result?.totalResearchQueries || 0}`);
    console.log(`   Research Prompts: ${result.result?.totalResearchPrompts || 0}`);

    console.log(`\n📊 Phase 2 Summary:`);
    console.log(`   Economic Completeness: ${result.result?.economicCompleteness || 0}%`);
    console.log(`   Key Insights: ${result.result?.keyInsightsCount || 0}`);

    console.log(`\n📊 Phase 3 Summary:`);
    console.log(`   James Score: ${result.result?.jamesScore || 0}/100`);
    console.log(`   James Verdict: ${result.result?.jamesVerdict || 'N/A'}`);
    console.log(`   Revisions: ${result.result?.revisionsCompleted || 0}`);
    console.log(`   Publish Ready: ${result.result?.publishReady ? 'YES' : 'NO'}`);

    console.log(`\n📝 Final Content Preview:`);
    const content = result.result?.finalContent || '';
    console.log(`   ${content.substring(0, 200)}...`);
    console.log(`   (${content.length} characters total)`);

    console.log(`\n⏱️ Duration: ${duration}s`);
    console.log(`📊 Tests Passed: ${passedTests}/${totalTests}`);

    const testPassed = passedTests === totalTests;
    console.log(`\n${'='.repeat(70)}`);
    console.log(testPassed 
      ? '✅ TEST 2 PASSED: Master workflow end-to-end working!'
      : '❌ TEST 2 FAILED: Some phases not completing correctly');
    console.log('='.repeat(70) + '\n');

    return testPassed;

  } catch (error) {
    console.error('\n❌ TEST FAILED WITH ERROR:');
    console.error(error);
    return false;
  }
}

// Run test
testMasterWorkflow()
  .then(passed => {
    process.exit(passed ? 0 : 1);
  })
  .catch(err => {
    console.error('Test execution error:', err);
    process.exit(1);
  });

