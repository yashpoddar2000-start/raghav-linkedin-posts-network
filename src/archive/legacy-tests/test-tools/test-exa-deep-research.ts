import 'dotenv/config';
import { exaDeepResearchTool } from '../mastra/tools/exa-deep-research';

/**
 * Test Exa Deep Research API Tool
 * 
 * Purpose: Understand what format deep research returns
 * - How detailed are the reports?
 * - What structure do they follow?
 * - How much context do we get?
 */

async function testExaDeepResearch() {
  console.log('🔬 Testing Exa Deep Research API Tool\n');
  console.log('='.repeat(80));
  console.log('TEST: Investigating Chipotle franchise decision mechanisms');
  console.log('='.repeat(80));

  try {
    const prompt = `Analyze why Chipotle operates all stores as company-owned rather than franchising.

Research Objectives:
1. Find management's official rationale for not franchising
2. Identify operational advantages of company ownership for Chipotle
3. Compare Chipotle's control mechanisms to typical franchise models
4. Explain how ownership impacts:
   - Food quality and consistency
   - Supply chain management
   - Employee training and culture
   - Customer experience

Output Format:
Provide a structured analysis with:
- Management's stated reasons (from earnings calls, interviews)
- Operational control mechanisms
- Supply chain advantages
- Economic implications of ownership vs franchising

Focus on finding specific evidence, quotes, and documented strategies.`;

    console.log('\n📝 RESEARCH PROMPT:');
    console.log(prompt);
    console.log('\n' + '='.repeat(80));
    console.log('🔬 Starting research (this takes 60-120 seconds)...\n');

    const result = await exaDeepResearchTool.execute({
      context: {
        prompt,
        researchOptions: {
          model: 'exa-research-fast',
          maxTimeoutMs: 120000,
          pollIntervalMs: 5000,
          maxRetries: 2,
        },
      },
    });

    if (result.success) {
      console.log('\n' + '='.repeat(80));
      console.log('✅ RESEARCH COMPLETE');
      console.log('='.repeat(80));
      
      console.log('\n📊 RESEARCH METADATA:');
      console.log(`Research ID: ${result.researchId}`);
      console.log(`Execution Time: ${Math.floor(result.executionTimeMs / 1000)} seconds`);
      console.log(`Cost: $${result.cost.total.toFixed(4)}`);
      console.log(`  - Searches: ${result.cost.searches}`);
      console.log(`  - Pages: ${result.cost.pages.toFixed(1)}`);
      console.log(`  - Reasoning Tokens: ${result.cost.reasoningTokens}`);

      console.log('\n' + '='.repeat(80));
      console.log('📄 RESEARCH REPORT:');
      console.log('='.repeat(80));
      console.log(result.report);
      console.log('\n' + '='.repeat(80));

    } else {
      console.log('\n❌ RESEARCH FAILED');
      console.log(`Error: ${result.error}`);
    }

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Stack:', error.stack);
    }
  }
}

// Run test
testExaDeepResearch().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

