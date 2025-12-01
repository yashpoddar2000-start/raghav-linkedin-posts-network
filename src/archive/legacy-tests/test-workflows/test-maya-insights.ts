/**
 * Test Maya Economic Insight Extraction
 * 
 * Tests Maya with different research data to validate:
 * 1. She can process ALL data (40K+ chars)
 * 2. She extracts specific, surprising insights
 * 3. She produces viral-worthy content
 * 
 * Multiple test cases with different topics and data volumes.
 */

import 'dotenv/config';
import { mayaExa } from '../mastra/agents/exa-agents/maya-exa';

// ============================================================================
// TEST CASE 1: McDonald's Franchise Research (Real Data Sample)
// ============================================================================

const TEST_DATA_MCDONALDS = `
# ROUND 1 RESEARCH - McDonald's Franchise Analysis

## ALEX FINANCIAL DATA (15 queries):
Q: What was McDonald's total revenue in 2023?
A: $25.494 billion

Q: How much did McDonald's franchise owners earn on average in 2023?
A: McDonald's franchise owners made an average annual profit of approximately $189,000 in 2023.

Q: What are the operating costs for a McDonald's franchise in 2024?
A: The annual cost of operations and inventory can range from $500,000 to $1.8 million.

Q: What is the average franchise fee for McDonald's in 2024?
A: $45,000 franchise fee

Q: How does McDonald's revenue growth in 2023 compare to 2022?
A: McDonald's annual revenue for 2023 was $25.494 billion, a 9.97% increase from 2022.

Q: What are the average sales per franchise for McDonald's in 2024?
A: Average annual sales volume is $3.966 million per location.

Q: How do McDonald's profit margins compare to Burger King's in 2023?
A: Burger King's profit margins decreased to 54%, while McDonald's operating margins remained higher.

Q: What was the net income for McDonald's in 2023?
A: $8.469 billion net income

Q: What are the industry benchmarks for fast-food franchise profit margins in 2023?
A: Average net profit margin for fast-food restaurants typically ranges from 6% to 9%.

Q: How much do McDonald's franchise owners pay in royalties and fees in 2023?
A: 5% of gross sales for new locations, and 4% for existing locations.

Q: What percentage of McDonald's franchise owners reported dissatisfaction in 2023?
A: 87% of McDonald's franchisees supported a vote of "no confidence" on the CEO in a 2022 survey.

Q: How many McDonald's franchise owners have left the franchise system in 2023?
A: Approximately 400 franchisees left McDonald's in 2023 due to rising costs.

Q: How have rising rent costs impacted the profitability of McDonald's franchise owners?
A: Rising rent and operational costs have squeezed profit margins significantly.

Q: What percentage of revenue do McDonald's franchise owners spend on supply chain costs?
A: McDonald's franchisees pay a 4% service fee on gross sales.

Q: What is the average profit margin for McDonald's franchises in 2024?
A: The profit margin for McDonald's franchise owners is typically between 6% to 10% after all costs.

## DAVID STRATEGIC RESEARCH (Round 1):
Despite McDonald's reporting record profits in 2024, with a gross profit of approximately $14.71 billion and total systemwide sales exceeding $130 billion, a significant number of franchise owners are choosing to exit the system.

ECONOMIC PRESSURES: Franchisees cite rising operational costs as primary drivers of dissatisfaction. Notably, increased rent and minimum wage hikes have squeezed profit margins. A franchisee in California closed two outlets due to profit losses attributed to wage increases.

OPERATIONAL DISAGREEMENTS: Many franchisees express dissatisfaction with McDonald's aggressive rent and remodeling strategies, which they argue diminish cash flow and profitability. Some franchisees have initiated lawsuits against McDonald's.

STRATEGIC RESTRUCTURING: McDonald's ongoing strategic restructuring involves closing underperforming locations, which sometimes results in franchisee exits.

## ROUND 2 RESEARCH - Focused on Costs and Legal Issues

## ALEX FINANCIAL DATA (15 queries):
Q: What are the average operational costs for McDonald's franchise owners in 2023?
A: The annual cost of operations and inventory can range from $500,000 to $1.8 million.

Q: What is the average wage paid to employees at McDonald's franchises in 2023?
A: The average wage for McDonald's crew members is approximately $14 per hour.

Q: How have food supply costs changed for McDonald's franchises from 2022 to 2024?
A: The average price of a McDonald's meal rose by 9% due to inflationary pressures.

Q: How much have utility costs increased for McDonald's franchise owners in 2023?
A: 80% of restaurant operators are concerned about rising utility costs, with bills increasing significantly.

Q: What is the average annual revenue for McDonald's franchise owners in 2024?
A: $3.966 million average annual sales volume.

Q: What is the average net income for McDonald's franchise owners in 2023?
A: Net profit typically ranges from $150,000 to $260,000 per year.

Q: How have labor costs impacted the profitability of McDonald's franchises in 2023?
A: Labor costs are a significant portion of operating expenses, especially in markets with higher minimum wages.

Q: What are the key factors driving franchisee dissatisfaction at McDonald's in 2023?
A: Key factors include increased operating costs, mandatory technology investments, aggressive remodeling requirements, and rising rent.

## DAVID STRATEGIC RESEARCH (Round 2):
MAJOR LEGAL CASES IN 2024:
- Multiple lawsuits filed related to E. coli outbreak seeking damages exceeding $5 million
- A prominent franchisee filed lawsuit claiming McDonald's sought to oust him from the system
- Over 40 Black former franchise owners sued McDonald's alleging systemic racial discrimination
- Age discrimination and wrongful termination lawsuits

FRANCHISEE CONCERNS:
- Financial pressures from declining sales and increased competition
- Frustration over mandated promotional activities they cannot afford
- Food safety concerns from E. coli outbreak
- Store closures and protests affecting morale

## ROUND 3 RESEARCH - Precision Data

## ALEX FINANCIAL DATA (15 queries):
Q: What was the average rent cost for McDonald's franchise owners in 2022 vs 2024?
A: Average rent ranged from $0 to $313,000 depending on location.

Q: How many McDonald's franchise owners have left due to rising costs?
A: Approximately 400 franchisees left McDonald's in 2023.

Q: What percentage of franchisees reported rent increases affected satisfaction?
A: 29% cited rising utility costs as having large impact, 26% highlighted rent increases.

Q: How do McDonald's franchisee retention rates in 2023 compare to previous years?
A: Retention improved for crew members but franchisee exits increased.

Q: What are legal dispute rates among McDonald's franchise owners in 2023?
A: Legal dispute rates are high with multiple class-action lawsuits and individual cases.

## DAVID STRATEGIC RESEARCH (Round 3):
IMPACT ON MORALE AND RETENTION:
- Despite McDonald's high overall retention rate of ~95%, specific cases of franchisees suing show underlying dissatisfaction
- Disputes over franchise rights, employment practices, racial discrimination, and operational safety
- Lawsuits claiming wrongful termination, systemic pressure to exit, and discriminatory practices

KEY TENSION: Corporate profitability ($8.5B net income) vs Franchisee struggles ($150-260K profit, 400 exits)
`;

// ============================================================================
// TEST CASE 2: Shorter Data Set (Chipotle)
// ============================================================================

const TEST_DATA_CHIPOTLE = `
# Chipotle Guacamole Economics Research

## KEY FINANCIAL DATA:
- Chipotle's guacamole generates over $1 billion annually
- Guacamole add-on costs $3.25 average, costs ~$0.50 to make
- 85% gross margin on guacamole vs 25% on base items
- Average Chipotle order: $12.50, with guac: $15.75
- 40% of customers add guacamole

## STRATEGIC INSIGHTS:
- Chipotle uses premium positioning: "real ingredients" messaging
- No franchising = 100% control over ingredient quality
- Avocado sourcing from Mexico partnership locks in supply
- Competitors (Qdoba) offer free guac but lower perceived quality

## STAKEHOLDER IMPACTS:
- Chipotle shareholders: $1B+ high-margin revenue stream
- Customers: Pay premium but perceive value
- Avocado farmers: Stable large-scale buyer
- Competitors: Forced into price wars or quality positioning
`;

// ============================================================================
// TEST FUNCTIONS
// ============================================================================

async function testMayaWithFullData() {
  console.log('\n' + '='.repeat(70));
  console.log('🧪 TEST 1: Maya with FULL McDonald\'s Research Data');
  console.log('='.repeat(70));
  console.log(`Data size: ${TEST_DATA_MCDONALDS.length} characters (~${Math.round(TEST_DATA_MCDONALDS.length/4)} tokens)\n`);

  try {
    const result = await mayaExa.generate(
      `Analyze this research data and extract viral economic insights:

${TEST_DATA_MCDONALDS}

Return your analysis as JSON with shockingStats, viralAngles, stakeholderImpacts, economicInsights, keyNumbers, and narrativeSummary.`
    );

    console.log('📊 MAYA\'S RAW OUTPUT:');
    console.log('-'.repeat(70));
    console.log(result.text);
    console.log('-'.repeat(70));

    // Try to parse JSON
    try {
      const jsonMatch = result.text?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        console.log('\n✅ PARSED INSIGHTS:');
        console.log(`📊 Shocking Stats: ${parsed.shockingStats?.length || 0}`);
        console.log(`🔥 Viral Angles: ${parsed.viralAngles?.length || 0}`);
        console.log(`👥 Stakeholder Impacts: ${Object.keys(parsed.stakeholderImpacts || {}).length} categories`);
        console.log(`💡 Economic Insights: ${parsed.economicInsights?.length || 0}`);
        
        if (parsed.shockingStats?.length > 0) {
          console.log('\n🔥 TOP SHOCKING STAT:');
          console.log(`   "${parsed.shockingStats[0].stat}"`);
          console.log(`   Context: ${parsed.shockingStats[0].context}`);
        }

        if (parsed.viralAngles?.length > 0) {
          console.log('\n📱 TOP VIRAL ANGLE:');
          console.log(`   Angle: ${parsed.viralAngles[0].angle}`);
          console.log(`   Hook: "${parsed.viralAngles[0].hook}"`);
        }

        if (parsed.narrativeSummary) {
          console.log('\n📖 NARRATIVE SUMMARY:');
          console.log(`   ${parsed.narrativeSummary}`);
        }

        return { success: true, insights: parsed };
      }
    } catch (parseError) {
      console.log('⚠️ Could not parse JSON, but Maya responded');
    }

    return { success: true, raw: result.text };

  } catch (error) {
    console.error('❌ TEST 1 FAILED:', error);
    return { success: false, error };
  }
}

async function testMayaWithShortData() {
  console.log('\n' + '='.repeat(70));
  console.log('🧪 TEST 2: Maya with SHORTER Chipotle Data');
  console.log('='.repeat(70));
  console.log(`Data size: ${TEST_DATA_CHIPOTLE.length} characters (~${Math.round(TEST_DATA_CHIPOTLE.length/4)} tokens)\n`);

  try {
    const result = await mayaExa.generate(
      `Analyze this research data and extract viral economic insights:

${TEST_DATA_CHIPOTLE}

Return your analysis as JSON with shockingStats, viralAngles, stakeholderImpacts, economicInsights, keyNumbers, and narrativeSummary.`
    );

    console.log('📊 MAYA\'S OUTPUT:');
    console.log('-'.repeat(70));
    
    // Try to parse JSON
    try {
      const jsonMatch = result.text?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        console.log(`📊 Shocking Stats: ${parsed.shockingStats?.length || 0}`);
        console.log(`🔥 Viral Angles: ${parsed.viralAngles?.length || 0}`);
        
        if (parsed.shockingStats?.length > 0) {
          console.log('\n🔥 TOP SHOCKING STAT:');
          console.log(`   "${parsed.shockingStats[0].stat}"`);
        }

        if (parsed.viralAngles?.length > 0) {
          console.log('\n📱 TOP VIRAL HOOK:');
          console.log(`   "${parsed.viralAngles[0].hook}"`);
        }

        return { success: true, insights: parsed };
      }
    } catch {
      console.log(result.text?.substring(0, 500));
    }

    return { success: true };

  } catch (error) {
    console.error('❌ TEST 2 FAILED:', error);
    return { success: false, error };
  }
}

async function testMayaViralQuality() {
  console.log('\n' + '='.repeat(70));
  console.log('🧪 TEST 3: Viral Quality Check');
  console.log('='.repeat(70));
  console.log('Testing if Maya produces ACTUALLY viral content...\n');

  const VIRAL_CRITERIA = [
    'Contains specific numbers (not vague)',
    'Has contrast/tension (X vs Y)',
    'Would stop someone scrolling',
    'Makes reader feel smarter',
    'Shareable to look sophisticated'
  ];

  try {
    const result = await mayaExa.generate(
      `Analyze this research and give me your SINGLE BEST viral angle:

KEY DATA:
- McDonald's corporate profit: $8.469 BILLION (2023)
- Average franchisee profit: $150,000-$260,000/year
- 400 franchisees LEFT the system in 2023
- 87% of franchisees voted "no confidence" in CEO
- Franchisees pay: 5% royalty + 4% marketing fee + rent up to $313,000
- Operating costs: $500K-$1.8M annually
- Average store revenue: $3.966M
- Net profit margin: 6-10%

Give me ONE viral hook that would go viral on LinkedIn. Just the hook, nothing else.`
    );

    console.log('📱 MAYA\'S VIRAL HOOK:');
    console.log('-'.repeat(70));
    console.log(result.text);
    console.log('-'.repeat(70));

    // Check viral criteria
    const hook = result.text || '';
    console.log('\n📊 VIRAL QUALITY CHECK:');
    
    const hasNumbers = /\d/.test(hook);
    const hasContrast = /but|while|despite|yet|however/i.test(hook);
    const isShort = hook.length < 300;
    
    console.log(`   ✓ Contains specific numbers: ${hasNumbers ? '✅' : '❌'}`);
    console.log(`   ✓ Has contrast/tension: ${hasContrast ? '✅' : '❌'}`);
    console.log(`   ✓ Is concise (<300 chars): ${isShort ? '✅' : '❌'}`);
    console.log(`   Length: ${hook.length} characters`);

    return { success: true, hook, hasNumbers, hasContrast, isShort };

  } catch (error) {
    console.error('❌ TEST 3 FAILED:', error);
    return { success: false, error };
  }
}

// ============================================================================
// RUN ALL TESTS
// ============================================================================

async function runAllTests() {
  console.log('\n' + '='.repeat(70));
  console.log('🧪 MAYA ECONOMIC INSIGHT EXTRACTION - TEST SUITE');
  console.log('='.repeat(70));
  console.log('Running 3 tests to validate Maya\'s insight quality...\n');

  const results = {
    test1: await testMayaWithFullData(),
    test2: await testMayaWithShortData(),
    test3: await testMayaViralQuality(),
  };

  console.log('\n' + '='.repeat(70));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(70));
  console.log(`Test 1 (Full Data): ${results.test1.success ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Test 2 (Short Data): ${results.test2.success ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Test 3 (Viral Quality): ${results.test3.success ? '✅ PASSED' : '❌ FAILED'}`);
  
  const allPassed = results.test1.success && results.test2.success && results.test3.success;
  console.log(`\nOverall: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);

  return allPassed;
}

// Run tests
runAllTests()
  .then(passed => process.exit(passed ? 0 : 1))
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });

