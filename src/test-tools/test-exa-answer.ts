import 'dotenv/config';
import { exaAnswerTool } from '../mastra/tools/exa-answer';

/**
 * Test Exa Answer API Tool
 * 
 * Purpose: Understand what format Exa returns data in
 * - How are answers structured?
 * - How are sources cited?
 * - What level of detail do we get?
 */

async function testExaAnswer() {
  console.log('🔍 Testing Exa Answer API Tool\n');
  console.log('='.repeat(80));
  console.log('TEST 1: Simple financial query');
  console.log('='.repeat(80));

  try {
    // Test 1: Simple query - one metric
    const result1 = await exaAnswerTool.execute({
      context: {
        queries: [
          "What is Chipotle's operating income in 2024?",
          "What is Chipotle's revenue per store in 2024?",
          "What percentage of Chipotle stores are franchised in 2024?",
        ],
        batchOptions: {
          maxRetries: 2,
          timeoutMs: 30000,
          maxConcurrency: 3,
        },
      },
    });

    console.log('\n📊 RESULTS:\n');
    
    result1.results.forEach((r, i) => {
      console.log(`\nQUERY ${i + 1}: "${r.query}"`);
      if (r.error) {
        console.log(`❌ ERROR: ${r.error}`);
      } else {
        console.log(`✅ ANSWER: ${r.answer}`);
        console.log(`📚 SOURCES (${r.sources.length}):`);
        r.sources.slice(0, 3).forEach((s, idx) => {
          console.log(`   ${idx + 1}. ${s.title}`);
          console.log(`      URL: ${s.url}`);
          if (s.publishedDate) console.log(`      Published: ${s.publishedDate}`);
        });
      }
    });

    console.log('\n' + '='.repeat(80));
    console.log('SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total Queries: ${result1.summary.totalQueries}`);
    console.log(`Successful: ${result1.summary.successful}`);
    console.log(`Failed: ${result1.summary.failed}`);
    console.log(`Execution Time: ${result1.summary.executionTimeMs}ms`);

    // Test 2: Comparative queries
    console.log('\n\n' + '='.repeat(80));
    console.log('TEST 2: Comparative queries (Taco Bell vs Pizza Hut)');
    console.log('='.repeat(80));

    const result2 = await exaAnswerTool.execute({
      context: {
        queries: [
          "What is Taco Bell's profit per store in 2024?",
          "What is Pizza Hut's profit per store in 2024?",
          "What is Taco Bell's average square footage per location?",
          "What is Pizza Hut's average square footage per location?",
        ],
        batchOptions: {
          maxRetries: 2,
          timeoutMs: 30000,
          maxConcurrency: 4,
        },
      },
    });

    console.log('\n📊 COMPARATIVE RESULTS:\n');
    
    const tacoQueries = result2.results.filter(r => r.query.includes('Taco Bell'));
    const pizzaQueries = result2.results.filter(r => r.query.includes('Pizza Hut'));

    console.log('TACO BELL DATA:');
    tacoQueries.forEach(r => {
      console.log(`  ${r.query}`);
      console.log(`  → ${r.answer}`);
    });

    console.log('\nPIZZA HUT DATA:');
    pizzaQueries.forEach(r => {
      console.log(`  ${r.query}`);
      console.log(`  → ${r.answer}`);
    });

    console.log('\n' + '='.repeat(80));
    console.log('✅ Tests complete!');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Stack:', error.stack);
    }
  }
}

// Run tests
testExaAnswer().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

