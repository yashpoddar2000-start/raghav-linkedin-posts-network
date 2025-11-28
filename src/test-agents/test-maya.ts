import 'dotenv/config';
import { mayaPatel } from '../mastra/agents/maya-patel';
import { QSR_RESOURCE_ID, generatePostThreadId } from '../mastra/config/qsr-memory';

/**
 * Test Maya Patel (Economist Agent)
 * 
 * Testing Maya's ability to synthesize Alex's data + David's research into economic insights.
 * Uses REAL outputs from our Alex and David tests.
 */

async function runTest(testName: string, alexData: string, davidResearch: string, request: string) {
  console.log('\n' + '='.repeat(80));
  console.log(`🧪 TEST: ${testName}`);
  console.log('='.repeat(80));

  const threadId = generatePostThreadId();
  
  console.log('\n📊 CONTEXT PROVIDED TO MAYA:\n');
  console.log('─'.repeat(80));
  console.log('ALEX\'S DATA:');
  console.log(alexData.substring(0, 500) + '...\n');
  console.log('─'.repeat(80));
  console.log('DAVID\'S RESEARCH:');
  console.log(davidResearch.substring(0, 500) + '...\n');
  console.log('─'.repeat(80));
  
  console.log(`\n📝 Request to Maya: "${request}"`);
  console.log('🔄 Calling Maya...\n');

  try {
    // Simulate conversation history by providing Alex's and David's outputs first
    const messages = [
      { role: 'assistant' as const, content: `DATA ANALYST FINDINGS:\n\n${alexData}` },
      { role: 'assistant' as const, content: `RESEARCH FINDINGS:\n\n${davidResearch}` },
      { role: 'user' as const, content: request },
    ];

    const response = await mayaPatel.generate(messages, {
      threadId,
      resourceId: QSR_RESOURCE_ID,
    });

    console.log('\n📊 MAYA\'S ECONOMIC ANALYSIS:');
    console.log('─'.repeat(80));
    console.log(response.text);
    console.log('─'.repeat(80));

    return { success: true, response: response.text };
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    return { success: false, error };
  }
}

async function testMaya() {
  console.log('\n🧪 TESTING MAYA PATEL (Economist Agent)');
  console.log('Goal: Test economic synthesis using REAL data from Alex and David tests\n');

  // Test 1: Chipotle Franchise Decision
  const test1AlexData = `## KEY METRICS FOUND

Financial Data:
- Chipotle operating income: $1.9B (2024) [Source: 10-K]
- Chipotle revenue/store: $3.2M [Source: Q3 2024 10-Q]
- Chipotle profit/store: $862K [Source: Calculated from 10-Q data]

Comparative Benchmarks:
- Industry franchise royalty: 8% [Source: NRA Report]
- McDonald's: 95% franchised [Source: McDonald's 10-K]
- Subway: 100% franchised [Source: Franchise disclosure]
- Chipotle: 0% franchised [Source: Chipotle 10-K]

## QUERIES EXECUTED
Total: 3 queries`;

  const test1DavidResearch = `## MANAGEMENT RATIONALE FINDINGS

### Strategic Rationale Stated by Leadership
Chipotle's official communications consistently emphasize the company's commitment to owning and operating all its restaurants in the U.S. This approach is driven by a desire to maintain strict control over quality, operational standards, and customer experience. The company believes that direct ownership allows for better oversight and ensures that its high standards are upheld across all locations.

### Ownership Model Advantages
The primary advantage articulated by management is the ability to maintain high-quality standards and operational consistency. By owning all stores, Chipotle can enforce strict quality controls, ensure consistency in customer experience, and uphold its brand reputation. This model also allows for more direct management of restaurant operations, which is viewed as critical to the company's strategic priorities.

Industry analyses confirm that Chipotle does not franchise in the U.S., choosing instead to expand through company-owned stores.`;

  // Test 2: DoorDash vs Uber Eats
  const test2AlexData = `## KEY METRICS FOUND

### Market Share & Growth
- DoorDash Market Share: 60.7% (2024) [Source: Earnest Analytics]
- Uber Eats Market Share: 23% (2024) [Source: Second Measure]
- DoorDash Growth Rate: 24.2% increase in revenue (2024)

### Financial Data
- DoorDash Revenue: $10.72B (2024) [Source: Macrotrends]
- Uber Eats Revenue: $13.7B (2024) [Source: Business of Apps]
- DoorDash Gross Margin: 48.31% (2024)
- Uber Eats Delivery Margin: 18.7% (Q4 2024)

## QUERIES EXECUTED
Total: 22 queries`;

  const test2DavidResearch = `## COMPETITIVE ADVANTAGE FINDINGS

### Delivery Performance Metrics
DoorDash has consistently outperformed Uber Eats in key delivery performance metrics. DoorDash's on-time delivery rate is approximately 95%, compared to Uber Eats' 90%.

### Operational Model Differences
DoorDash employs a more focused operational model with dedicated drivers, whereas Uber Eats utilizes a multi-vertical approach, sharing resources with its ride-hailing service. This specialization allows DoorDash to optimize delivery times and improve customer satisfaction.

### Strategic Partnerships and Exclusivity
DoorDash has secured exclusive partnerships with several major restaurant chains, including Chipotle and The Cheesecake Factory. These agreements provide DoorDash with a competitive moat.

### Early Market Entry and Compounding Effects
DoorDash's early entry into suburban markets allowed it to capture significant market share before Uber Eats expanded beyond urban centers.`;

  // Test 3: Shake Shack Real Estate
  const test3AlexData = `## KEY METRICS FOUND

Real Estate Data:
- Shake Shack average square footage: 3,000 to 3,500 sq ft (2024)
- Shake Shack occupancy cost: 21.4% of sales (FY 2024) [Source: Annual Report]
- Shake Shack total stores: 329 company-owned (FY 2024)
- Shake Shack new openings: 43 locations (FY 2024)

Expansion Plans:
- Target: 1,500 company-operated units long-term

## QUERIES EXECUTED
Total: 15 queries`;

  const test3DavidResearch = `## SHAKE SHACK'S REAL ESTATE CHALLENGES

### Real Estate Challenges
High costs associated with new store development have been significant, with the company aiming to reduce build costs to approximately $2.2 million per unit in 2025, down from $2.4 million in 2024. Market saturation in certain regions has posed difficulties, compounded by inflation and shifting consumer behaviors.

### Store Closures
Shake Shack documented closures of 9 locations in California, Texas, and Ohio (2020-2024). Closures were driven by changing trade areas, cannibalization, and need to reposition strategically.

### Competitive Comparison
Shake Shack's real estate strategy aligns with fast-casual competitors facing similar high vacancy rates and economic pressures. Industry has moved toward flexible lease terms and smaller store formats to mitigate risks.`;

  const tests = [
    {
      name: 'Test 1: Chipotle Franchise Economic Analysis',
      alexData: test1AlexData,
      davidResearch: test1DavidResearch,
      request: 'Maya, analyze the economics of Chipotle\'s franchise decision. What are the implications?',
    },
    {
      name: 'Test 2: DoorDash vs Uber Eats Economic Dynamics',
      alexData: test2AlexData,
      davidResearch: test2DavidResearch,
      request: 'Maya, synthesize the economic factors behind DoorDash\'s dominance over Uber Eats.',
    },
    {
      name: 'Test 3: Shake Shack Real Estate Economics',
      alexData: test3AlexData,
      davidResearch: test3DavidResearch,
      request: 'Maya, what are the economic implications of Shake Shack\'s real estate situation?',
    },
  ];

  const results = [];

  for (const test of tests) {
    const result = await runTest(test.name, test.alexData, test.davidResearch, test.request);
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
    console.log(`   Status: ${r.success ? '✅ PASSED' : '❌ FAILED'}`);
  });

  console.log('\n' + '='.repeat(80));
  console.log('🎯 EVALUATION CRITERIA:');
  console.log('─'.repeat(80));
  console.log('[ ] Did Maya calculate gaps/percentages from Alex\'s data?');
  console.log('[ ] Did Maya build comparative models (current vs alternative)?');
  console.log('[ ] Did Maya create non-obvious economic insights?');
  console.log('[ ] Did Maya quantify stakeholder impacts?');
  console.log('[ ] Did Maya extract universal principles?');
  console.log('[ ] Did Maya synthesize (not gather new data)?');
  console.log('[ ] Did Maya show her calculations transparently?');
  console.log('[ ] Did Maya use economic reasoning (not just repeat data)?');
  console.log('='.repeat(80));
}

// Run tests
testMaya().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

