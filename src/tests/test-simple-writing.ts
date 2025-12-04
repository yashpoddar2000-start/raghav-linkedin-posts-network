/**
 * Test Simple Writing Workflow
 * 
 * Uses saved research data to test Taylor + James loop
 */

import 'dotenv/config';
import { simpleWritingWorkflow, loadResearchFile } from '../mastra/workflows/simple-writing';
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
  const researchData = await loadResearchFile(researchFile);
  console.log(`Research data: ${researchData.length} characters`);

  console.log(`\nWorkflow: Taylor writes → James evaluates → Loop until approved (max 4)`);
  console.log(`Approval threshold: Score >= 95 (BRUTAL MODE)`);
  console.log(`\nStarting...`);

  const startTime = Date.now();

  try {
    // Run the workflow directly using the map function
    const run = await simpleWritingWorkflow.createRunAsync();
    const result = await run.start({
      inputData: { researchData },
    });

    const duration = Math.round((Date.now() - startTime) / 1000);

    console.log('\n' + '██'.repeat(35));
    console.log('█ RESULTS');
    console.log('██'.repeat(35));

    if (result.status === 'success' && result.result) {
      const { finalPost, score, iterations, approved, evaluationHistory } = result.result;

      console.log(`\nStatus: ${approved ? '✅ APPROVED' : '⚠️ BEST ATTEMPT'}`);
      console.log(`Score: ${score}/100`);
      console.log(`Iterations: ${iterations}`);
      console.log(`Duration: ${duration}s`);

      console.log(`\n${'─'.repeat(70)}`);
      console.log('FINAL POST:');
      console.log('─'.repeat(70));
      console.log(finalPost);
      console.log('─'.repeat(70));

      console.log(`\nPost length: ${finalPost.length} characters`);

      // Save the post
      const outputDir = path.join(process.cwd(), 'outputs');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().split('T')[0];
      const outputFile = path.join(outputDir, `post-${timestamp}.json`);
      
      fs.writeFileSync(outputFile, JSON.stringify({
        generatedAt: new Date().toISOString(),
        researchFile: files[0],
        finalPost,
        score,
        iterations,
        approved,
        evaluationHistory,
      }, null, 2));

      console.log(`\n💾 Saved to: ${outputFile}`);

    } else if (result.status === 'failed') {
      console.error('Workflow failed:', result.error);
    }

    console.log('\n✅ Test complete!');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

testSimpleWriting();




 * 
 * Uses saved research data to test Taylor + James loop
 */

import 'dotenv/config';
import { simpleWritingWorkflow, loadResearchFile } from '../mastra/workflows/simple-writing';
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
  const researchData = await loadResearchFile(researchFile);
  console.log(`Research data: ${researchData.length} characters`);

  console.log(`\nWorkflow: Taylor writes → James evaluates → Loop until approved (max 4)`);
  console.log(`Approval threshold: Score >= 95 (BRUTAL MODE)`);
  console.log(`\nStarting...`);

  const startTime = Date.now();

  try {
    // Run the workflow directly using the map function
    const run = await simpleWritingWorkflow.createRunAsync();
    const result = await run.start({
      inputData: { researchData },
    });

    const duration = Math.round((Date.now() - startTime) / 1000);

    console.log('\n' + '██'.repeat(35));
    console.log('█ RESULTS');
    console.log('██'.repeat(35));

    if (result.status === 'success' && result.result) {
      const { finalPost, score, iterations, approved, evaluationHistory } = result.result;

      console.log(`\nStatus: ${approved ? '✅ APPROVED' : '⚠️ BEST ATTEMPT'}`);
      console.log(`Score: ${score}/100`);
      console.log(`Iterations: ${iterations}`);
      console.log(`Duration: ${duration}s`);

      console.log(`\n${'─'.repeat(70)}`);
      console.log('FINAL POST:');
      console.log('─'.repeat(70));
      console.log(finalPost);
      console.log('─'.repeat(70));

      console.log(`\nPost length: ${finalPost.length} characters`);

      // Save the post
      const outputDir = path.join(process.cwd(), 'outputs');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().split('T')[0];
      const outputFile = path.join(outputDir, `post-${timestamp}.json`);
      
      fs.writeFileSync(outputFile, JSON.stringify({
        generatedAt: new Date().toISOString(),
        researchFile: files[0],
        finalPost,
        score,
        iterations,
        approved,
        evaluationHistory,
      }, null, 2));

      console.log(`\n💾 Saved to: ${outputFile}`);

    } else if (result.status === 'failed') {
      console.error('Workflow failed:', result.error);
    }

    console.log('\n✅ Test complete!');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

testSimpleWriting();



