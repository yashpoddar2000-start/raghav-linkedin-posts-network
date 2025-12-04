/**
 * Test Simple Writing Workflow
 * 
 * Uses saved research data + voice example to test Taylor + James loop.
 * Now uses the dountil version with EI/SC scoring (need both >=8).
 */

import 'dotenv/config';
import { mastra } from '../mastra';
import * as fs from 'fs';
import * as path from 'path';

async function testSimpleWriting() {
  console.log('\n' + '██'.repeat(35));
  console.log('█ TEST: SIMPLE WRITING WORKFLOW');
  console.log('██'.repeat(35));

  // Find the most recent research file
  const researchDir = path.join(process.cwd(), 'research-data');
  const files = fs.readdirSync(researchDir)
    .filter(f => f.endsWith('.json'))
    .sort((a, b) => {
      const statA = fs.statSync(path.join(researchDir, a));
      const statB = fs.statSync(path.join(researchDir, b));
      return statB.mtime.getTime() - statA.mtime.getTime();
    });

  if (files.length === 0) {
    console.error('❌ No research files found in research-data/');
    console.log('Run test-agentic-research.ts first to generate research data.');
    process.exit(1);
  }

  const researchFile = path.join(researchDir, files[0]);
  console.log(`\nUsing research file: ${files[0]}`);

  // Load research data
  const researchData = JSON.parse(fs.readFileSync(researchFile, 'utf-8'));
  const research = researchData.combinedResearch || '';
  
  // Load voice example
  const voiceExamplePath = path.join(process.cwd(), 'data/posts/voice-example.txt');
  const voiceExample = fs.readFileSync(voiceExamplePath, 'utf-8');

  console.log(`Research data: ${research.length} characters`);
  console.log(`Voice example: ${voiceExample.length} characters`);

  console.log(`\nWorkflow: Taylor writes → James evaluates → Loop until BOTH scores >=8`);
  console.log(`Max iterations: 5`);
  console.log(`\nStarting...`);

  const startTime = Date.now();

  try {
    const workflow = mastra.getWorkflow('simple-writing');
    if (!workflow) {
      throw new Error('Workflow "simple-writing" not found');
    }

    const run = await workflow.createRunAsync();
    const result = await run.start({
      inputData: {
        research,
        voice_example: voiceExample,
        critique_history: [],
        current_ei_score: 0,
        current_sc_score: 0,
        iteration: 0,
      },
    });

    const duration = Math.round((Date.now() - startTime) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;

    console.log('\n' + '██'.repeat(35));
    console.log('█ RESULTS');
    console.log('██'.repeat(35));

    if (result.status === 'success' && result.result) {
      const output = result.result;

      console.log(`\nStatus: ${result.status.toUpperCase()}`);
      console.log(`Iterations: ${output.iteration}`);
      console.log(`Final EI Score: ${output.current_ei_score}/10`);
      console.log(`Final SC Score: ${output.current_sc_score}/10`);
      console.log(`Duration: ${minutes}m ${seconds}s`);

      const approved = output.current_ei_score >= 8 && output.current_sc_score >= 8;
      console.log(`\nApproval: ${approved ? '✅ PASSED' : '⚠️ DID NOT PASS'}`);

      console.log(`\n${'─'.repeat(70)}`);
      console.log('FINAL POST:');
      console.log('─'.repeat(70));
      console.log(output.draft);
      console.log('─'.repeat(70));

      console.log(`\nPost length: ${output.draft?.length || 0} characters`);

      // Show critique history
      console.log(`\n${'─'.repeat(70)}`);
      console.log('CRITIQUE HISTORY:');
      console.log('─'.repeat(70));
      for (const critique of output.critique_history) {
        console.log(`\n--- Iteration ${critique.iteration} ---`);
        console.log(`EI: ${critique.ei_score}/10, SC: ${critique.sc_score}/10`);
        console.log(`\nCritique: ${critique.critique.substring(0, 300)}...`);
        console.log(`\nFixes required: ${critique.fixes.length}`);
        critique.fixes.forEach((fix, i) => console.log(`  ${i + 1}. ${fix.substring(0, 150)}${fix.length > 150 ? '...' : ''}`));
      }

      // Save the post
      const outputDir = path.join(process.cwd(), 'outputs');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const outputFile = path.join(outputDir, `post-${timestamp}.txt`);
      const fullOutputFile = path.join(outputDir, `post-${timestamp}-full.json`);
      
      fs.writeFileSync(outputFile, output.draft || 'No draft generated');
      fs.writeFileSync(fullOutputFile, JSON.stringify(output, null, 2));

      console.log(`\n💾 Saved to:`);
      console.log(`   Post: ${outputFile}`);
      console.log(`   Full output: ${fullOutputFile}`);

    } else if (result.status === 'failed') {
      console.error('\n❌ Workflow failed:', result.error);
    } else if (result.status === 'suspended') {
      console.log('\n⏸️ Workflow suspended');
    }

    console.log('\n✅ Test complete!');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

testSimpleWriting();
