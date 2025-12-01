/**
 * Test Exa Research Workflow
 * 
 * Tests the linear 3-round research flow with real Exa APIs.
 * Expected: 45 Exa Answer calls + 3 Exa Deep Research calls
 */

import 'dotenv/config';
import { Mastra } from '@mastra/core';
import { exaResearchWorkflow } from '../mastra/workflows/exa-research-workflow';

async function testExaResearch() {
  console.log('\n' + '='.repeat(70));
  console.log('🧪 TEST: Exa Research Workflow');
  console.log('='.repeat(70));
  console.log('Expected: 45 queries + 3 deep research (3 rounds)');
  console.log('NO retries, NO loops, LINEAR flow');
  console.log('='.repeat(70) + '\n');

  const mastra = new Mastra({
    workflows: { exaResearchWorkflow },
  });

  const testInput = {
    topic: "Why McDonald's franchise owners are leaving despite record profits",
  };

  console.log(`📋 Topic: ${testInput.topic}\n`);

  try {
    const startTime = Date.now();
    
    const run = await mastra.getWorkflow('exaResearchWorkflow').createRunAsync();
    const result = await run.start({
      inputData: testInput,
    });

    const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(2);

    console.log('\n' + '='.repeat(70));
    console.log('📊 RESULTS');
    console.log('='.repeat(70));

    if (result.status === 'success') {
      console.log(`✅ Status: SUCCESS`);
      console.log(`⏱️ Duration: ${duration} minutes`);
      console.log(`📊 Total Queries: ${result.result.totalQueries}`);
      console.log(`🔬 Total Research: ${result.result.totalResearch}`);
      
      console.log('\n📝 Final Summary:');
      console.log(result.result.finalSummary);

      console.log('\n📦 Data per Round:');
      result.result.allFindings.forEach(finding => {
        console.log(`  Round ${finding.round}: ${finding.alexData.length} chars Alex, ${finding.davidReport.length} chars David`);
      });

      // Check Maya's viral insights
      if (result.result.viralInsights) {
        console.log('\n' + '='.repeat(70));
        console.log('🧠 MAYA\'S VIRAL INSIGHTS');
        console.log('='.repeat(70));
        console.log(`📊 Shocking Stats: ${result.result.viralInsights.shockingStats.length}`);
        console.log(`🔥 Viral Angles: ${result.result.viralInsights.viralAngles.length}`);
        
        if (result.result.viralInsights.shockingStats.length > 0) {
          console.log('\n📊 TOP SHOCKING STAT:');
          console.log(`   "${result.result.viralInsights.shockingStats[0].stat}"`);
        }
        
        if (result.result.viralInsights.viralAngles.length > 0) {
          console.log('\n🔥 TOP VIRAL HOOK:');
          console.log(`   "${result.result.viralInsights.viralAngles[0].hook}"`);
        }
        
        if (result.result.viralInsights.narrativeSummary) {
          console.log('\n📖 NARRATIVE:');
          console.log(`   ${result.result.viralInsights.narrativeSummary.substring(0, 300)}...`);
        }
      }

      console.log('\n' + '='.repeat(70));
      console.log('✅ TEST PASSED');
      console.log('='.repeat(70));
      return true;
    } else {
      console.log(`❌ Status: ${result.status}`);
      console.log(`Error: ${(result as any).error || 'Unknown'}`);
      return false;
    }

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error);
    return false;
  }
}

// Run test
testExaResearch()
  .then(passed => {
    process.exit(passed ? 0 : 1);
  })
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });

