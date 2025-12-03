/**
 * Test: Research Phase 1 Workflow (PROMPT-ONLY)
 * 
 * Tests the 3-round progressive research workflow in prompt-only mode
 * 
 * Purpose: Optimize prompts before running expensive Exa API calls
 * 
 * Usage: npx tsx src/tests/test-research-prompt-only.ts
 */

import 'dotenv/config';
import { mastra } from '../mastra';

async function testResearchPromptOnly() {
  console.log('\n' + '='.repeat(70));
  console.log('TEST: Research Phase 1 Workflow (PROMPT-ONLY)');
  console.log('='.repeat(70));
  console.log('\n💡 Running in PROMPT-ONLY mode - NO Exa API calls will be made');
  console.log('💡 This is for testing and optimizing prompts\n');
  
  const topic = 'Chick-fil-A vs McDonald\'s revenue per store';
  console.log(`Topic: ${topic}\n`);
  
  const startTime = Date.now();
  
  try {
    // Get workflow and create run
    const workflow = mastra.getWorkflow('researchPhase1PromptOnly');
    const run = await workflow.createRunAsync();
    
    // Start the workflow
    const result = await run.start({
      inputData: { topic },
    });
    
    const duration = Math.round((Date.now() - startTime) / 1000);
    
    console.log('\n' + '='.repeat(70));
    console.log('RESULTS');
    console.log('='.repeat(70));
    console.log(`Status: ${result.status}`);
    console.log(`Duration: ${duration} seconds`);
    
    if (result.status === 'success' && result.result) {
      console.log(`\n${result.result.summary}`);
      
      console.log('\n' + '='.repeat(70));
      console.log('NEXT STEPS');
      console.log('='.repeat(70));
      console.log('1. Review the generated prompts above');
      console.log('2. Optimize Alex/David system prompts in:');
      console.log('   - src/mastra/agents/prompt-only/alex-prompt-only.ts');
      console.log('   - src/mastra/agents/prompt-only/david-prompt-only.ts');
      console.log('3. Re-run this test to verify improvements');
      console.log('4. Once satisfied, copy prompts to production agents:');
      console.log('   - src/mastra/agents/alex.ts');
      console.log('   - src/mastra/agents/david.ts');
      
    } else if (result.status === 'failed') {
      console.error('\n❌ Workflow failed:', result.error);
      process.exit(1);
    }
    
    console.log('\n✅ Test complete!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

testResearchPromptOnly();

