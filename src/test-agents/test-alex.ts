import 'dotenv/config';
import { alexRivera } from '../mastra/agents/data-analyst';
import { QSR_RESOURCE_ID, generatePostThreadId } from '../mastra/config/qsr-memory';

/**
 * Test Alex Rivera (Data Analyst Agent)
 * 
 * Testing Alex's ability to think innovatively with VAGUE queries.
 * Can he figure out what data matters without explicit direction?
 */

async function runTest(testName: string, request: string) {
  console.log('\n' + '='.repeat(80));
  console.log(`🧪 TEST: ${testName}`);
  console.log('='.repeat(80));

  const threadId = generatePostThreadId();
  
  console.log(`\n📝 Request: "${request}"`);
  console.log('🔄 Calling Alex...\n');

  try {
    const response = await alexRivera.generate(
      [{ role: 'user', content: request }],
      {
        threadId,
        resourceId: QSR_RESOURCE_ID,
      }
    );

    console.log('\n📊 ALEX\'S RESPONSE:');
    console.log('─'.repeat(80));
    console.log(response.text);
    console.log('─'.repeat(80));

    return { success: true, response: response.text };
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    return { success: false, error };
  }
}

async function testAlex() {
  console.log('\n🧪 TESTING ALEX RIVERA (Data Analyst Agent)');
  console.log('Goal: Test innovative thinking with VAGUE queries\n');

  const tests = [
    {
      name: 'Test 1: DoorDash vs Uber Eats (P052)',
      request: 'Alex, research DoorDash vs Uber Eats.',
    },
    {
      name: 'Test 2: Wingstop Franchise Royalty Revenue',
      request: 'Alex, get data on Wingstop franchise royalty revenue.',
    },
    {
      name: 'Test 3: Chipotle, Cava, Sweetgreen Performance (P061)',
      request: 'Alex, how are Chipotle, Cava, and Sweetgreen doing?',
    },
    {
      name: 'Test 4: Shake Shack Real Estate Crisis (P015)',
      request: 'Alex, investigate Shake Shack real estate situation.',
    },
  ];

  const results = [];

  for (const test of tests) {
    const result = await runTest(test.name, test.request);
    results.push({ ...test, ...result });
    
    // Wait 2 seconds between tests
    if (tests.indexOf(test) < tests.length - 1) {
      console.log('\n⏳ Waiting 2 seconds before next test...');
      await new Promise(resolve => setTimeout(resolve, 2000));
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
  console.log('[ ] Did Alex figure out what data to find from vague requests?');
  console.log('[ ] Did Alex generate strategic queries without explicit direction?');
  console.log('[ ] Did Alex structure findings clearly?');
  console.log('[ ] Did Alex filter bad sources (LinkedIn, blogs)?');
  console.log('[ ] Did Alex stay in his lane (no analysis)?');
  console.log('[ ] Did Alex flag data gaps honestly?');
  console.log('='.repeat(80));
}

// Run test
testAlex().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

