/**
 * Test Phase 3: Writing + Evaluation Workflow
 * 
 * Uses saved Maya insights to test the feedback loop:
 * 1. Taylor writes initial post
 * 2. James evaluates
 * 3. If needs revision, Taylor rewrites (max 2 revisions)
 * 4. Final output with history
 */

import 'dotenv/config';
import { phase3WritingWorkflow } from '../mastra/workflows/phase-3-writing-workflow';
import * as fs from 'fs';
import * as path from 'path';

// Load saved Maya insights
const insightsPath = path.join(process.cwd(), 'research-data', 'maya-insights-mcdonalds.json');
const savedData = JSON.parse(fs.readFileSync(insightsPath, 'utf-8'));

async function testPhase3() {
  console.log('\n' + '='.repeat(70));
  console.log('🧪 TEST: Phase 3 Writing + Evaluation Workflow');
  console.log('='.repeat(70));
  console.log('FEEDBACK LOOP DESIGN:');
  console.log('  1. Taylor writes initial post');
  console.log('  2. James evaluates brutally');
  console.log('  3. If NEEDS_REVISION, Taylor revises (max 2 times)');
  console.log('  4. Final output with full history');
  console.log('='.repeat(70));
  console.log(`📋 Topic: ${savedData.topic}`);
  console.log(`📊 Using ${savedData.viralInsights.shockingStats.length} shocking stats`);
  console.log(`🔥 Using ${savedData.viralInsights.viralAngles.length} viral angles\n`);

  const startTime = Date.now();

  try {
    const run = await phase3WritingWorkflow.createRunAsync();
    
    const result = await run.start({
      inputData: {
        topic: savedData.topic,
        viralInsights: savedData.viralInsights,
      },
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log('\n' + '='.repeat(70));
    console.log('📊 RESULTS');
    console.log('='.repeat(70));

    if (result.status === 'success') {
      console.log(`✅ Status: SUCCESS`);
      console.log(`⏱️ Duration: ${duration}s`);
      console.log(`📝 Iterations: ${result.result.iterations}`);
      console.log(`📊 Final Score: ${result.result.finalScore}/100`);
      console.log(`✅ Approved: ${result.result.approved ? 'YES' : 'NO (best effort)'}`);

      // Show iteration history
      console.log('\n' + '-'.repeat(70));
      console.log('📜 FEEDBACK LOOP HISTORY:');
      console.log('-'.repeat(70));
      result.result.history.forEach((h, i) => {
        console.log(`\n  Iteration ${h.iteration}:`);
        console.log(`    Score: ${h.score}/100 | Verdict: ${h.verdict}`);
        if (h.feedback) {
          console.log(`    Feedback: ${h.feedback.substring(0, 100)}...`);
        }
      });

      // Show final post
      console.log('\n' + '='.repeat(70));
      console.log('📱 FINAL LINKEDIN POST:');
      console.log('='.repeat(70));
      console.log(result.result.finalPost);
      console.log('='.repeat(70));

      // Post stats
      const postLength = result.result.finalPost.length;
      const lineCount = result.result.finalPost.split('\n').length;
      console.log(`\n📏 Post Stats:`);
      console.log(`   Length: ${postLength} characters`);
      console.log(`   Lines: ${lineCount}`);

      console.log('\n' + '='.repeat(70));
      console.log('✅ TEST PASSED');
      console.log('='.repeat(70));
      return true;
    } else {
      console.log(`❌ Status: FAILED`);
      console.log(`Error:`, result);
      return false;
    }

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error);
    return false;
  }
}

// Run test
testPhase3()
  .then(passed => process.exit(passed ? 0 : 1))
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });

