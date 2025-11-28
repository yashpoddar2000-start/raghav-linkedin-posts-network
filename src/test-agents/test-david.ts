import 'dotenv/config';
import { davidPark } from '../mastra/agents/david-park';
import { QSR_RESOURCE_ID, generatePostThreadId } from '../mastra/config/qsr-memory';

/**
 * Test David Park (Industry Research Specialist Agent)
 * 
 * Testing David's ability to craft expert deep research prompts from vague directions.
 * Can he structure comprehensive research requests that reveal mechanisms?
 */

async function runTest(testName: string, request: string) {
  console.log('\n' + '='.repeat(80));
  console.log(`🧪 TEST: ${testName}`);
  console.log('='.repeat(80));

  const threadId = generatePostThreadId();
  
  console.log(`\n📝 Request: "${request}"`);
  console.log('🔄 Calling David...\n');

  try {
    const response = await davidPark.generate(
      [{ role: 'user', content: request }],
      {
        threadId,
        resourceId: QSR_RESOURCE_ID,
      }
    );

    console.log('\n📊 DAVID\'S RESPONSE:');
    console.log('─'.repeat(80));
    console.log(response.text);
    console.log('─'.repeat(80));

    return { success: true, response: response.text };
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    return { success: false, error };
  }
}

async function testDavid() {
  console.log('\n🧪 TESTING DAVID PARK (Industry Research Specialist)');
  console.log('Goal: Test expert prompt crafting with VAGUE research directions\n');

  const tests = [
    {
      name: 'Test 1: Management Rationale (Chipotle Franchise)',
      request: 'David, investigate why Chipotle management refuses to franchise.',
    },
    {
      name: 'Test 2: Competitive Mechanisms (DoorDash vs Uber Eats)',
      request: 'David, research how DoorDash beat Uber Eats.',
    },
    {
      name: 'Test 3: Economic Mechanisms (Shake Shack Real Estate)',
      request: 'David, look into Shake Shack\'s real estate problems.',
    },
  ];

  const results = [];

  for (const test of tests) {
    const result = await runTest(test.name, test.request);
    results.push({ ...test, ...result });
    
    // Wait 3 seconds between tests (Exa Deep Research takes time)
    if (tests.indexOf(test) < tests.length - 1) {
      console.log('\n⏳ Waiting 3 seconds before next test...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  // Summary
  console.log('\n\n' + '='.repeat(80));
  console.log('📋 TEST SUMMARY');
  console.log('='.repeat(80));

  results.forEach((r, idx) => {
    console.log(`\n${idx + 1}. ${r.name}`);
    console.log(`   Request: "${r.request}"`);
    console.log(`   Status: ${r.success ? '✅ PASSED' : '❌ FAILED'}`);
  });

  console.log('\n' + '='.repeat(80));
  console.log('🎯 EVALUATION CRITERIA:');
  console.log('─'.repeat(80));
  console.log('[ ] Did David craft expert prompts (not generic)?');
  console.log('[ ] Did David include all 3 components (objectives, methodology, output)?');
  console.log('[ ] Did David use exaDeepResearchTool correctly?');
  console.log('[ ] Did David present findings cleanly (minimal commentary)?');
  console.log('[ ] Did David stay in his lane (no analysis/recommendations)?');
  console.log('[ ] Was research comprehensive (mechanisms, quotes, evidence)?');
  console.log('[ ] Were prompts under 4096 characters?');
  console.log('[ ] Did research return in reasonable time (<120 seconds)?');
  console.log('='.repeat(80));
}

// Run tests
testDavid().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

