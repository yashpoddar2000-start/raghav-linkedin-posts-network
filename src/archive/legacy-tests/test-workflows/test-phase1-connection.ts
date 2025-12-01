/**
 * Test 1: Phase 1 Connection Test
 * 
 * Verifies:
 * - Alex test agent generates structured financial data
 * - David test agent generates strategic research
 * - Strategist test agent provides pivot decisions
 * - Data flows correctly between all 3 rounds
 * - Final output contains accumulated data from all rounds
 */

import 'dotenv/config';
import { Mastra } from '@mastra/core';
import { phase1StrategicResearchWorkflow } from '../mastra/workflows/phase-1-strategic-research';

async function testPhase1Connection() {
  console.log('\n' + '='.repeat(70));
  console.log('🧪 TEST 1: Phase 1 Strategic Research Connection Test');
  console.log('='.repeat(70));

  const mastra = new Mastra({
    workflows: { phase1StrategicResearchWorkflow },
  });

  const testInput = {
    topic: 'Why McDonald\'s franchise owners are leaving the system despite record profits',
    runId: `test-phase1-${Date.now()}`,
  };

  console.log(`\n📋 Test Input:`);
  console.log(`   Topic: ${testInput.topic}`);
  console.log(`   Run ID: ${testInput.runId}`);

  try {
    console.log(`\n⏳ Executing Phase 1 workflow...`);
    const startTime = Date.now();

    const run = await mastra.getWorkflow('phase1StrategicResearchWorkflow').createRunAsync();
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
      hasAlexFindings: Array.isArray(result.result?.allAlexFindings) && result.result.allAlexFindings.length === 3,
      hasDavidResearch: Array.isArray(result.result?.allDavidResearch) && result.result.allDavidResearch.length === 3,
      hasStrategistAnalysis: Array.isArray(result.result?.allStrategistAnalysis) && result.result.allStrategistAnalysis.length === 2,
      hasFinalNarrative: typeof result.result?.finalNarrative === 'string' && result.result.finalNarrative.length > 0,
      isReadyForPhase2: result.result?.readyForPhase2 === true,
    };

    let passedTests = 0;
    const totalTests = Object.keys(tests).length;

    console.log(`\n✅ Validation Checks:`);
    for (const [testName, passed] of Object.entries(tests)) {
      const status = passed ? '✅' : '❌';
      console.log(`   ${status} ${testName}`);
      if (passed) passedTests++;
    }

    console.log(`\n📊 Data Summary:`);
    console.log(`   Alex Rounds: ${result.result?.allAlexFindings?.length || 0}`);
    console.log(`   David Rounds: ${result.result?.allDavidResearch?.length || 0}`);
    console.log(`   Strategist Analyses: ${result.result?.allStrategistAnalysis?.length || 0}`);
    console.log(`   Total Queries: ${result.result?.totalQueries || 0}`);
    console.log(`   Final Narrative: ${result.result?.finalNarrative?.substring(0, 100) || 'N/A'}...`);

    console.log(`\n⏱️ Duration: ${duration}s`);
    console.log(`📊 Tests Passed: ${passedTests}/${totalTests}`);

    const testPassed = passedTests === totalTests;
    console.log(`\n${'='.repeat(70)}`);
    console.log(testPassed 
      ? '✅ TEST 1 PASSED: Phase 1 connections working correctly!'
      : '❌ TEST 1 FAILED: Some connections not working');
    console.log('='.repeat(70) + '\n');

    return testPassed;

  } catch (error) {
    console.error('\n❌ TEST FAILED WITH ERROR:');
    console.error(error);
    return false;
  }
}

// Run test
testPhase1Connection()
  .then(passed => {
    process.exit(passed ? 0 : 1);
  })
  .catch(err => {
    console.error('Test execution error:', err);
    process.exit(1);
  });

