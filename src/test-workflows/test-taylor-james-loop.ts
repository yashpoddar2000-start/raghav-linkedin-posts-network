/**
 * Test Taylor-James Feedback Loop
 * 
 * USAGE:
 * 1. First run Phase 1 to get research data (test-exa-research.ts)
 * 2. Then run this test with saved data
 * 
 * Or use MOCK_DATA for testing without running Phase 1
 */

import 'dotenv/config';
import { taylorJamesLoop } from '../mastra/workflows/taylor-james-loop';
import * as fs from 'fs';
import * as path from 'path';

// Try to load saved research data, fall back to mock
function loadResearchData(): { topic: string; fullResearchData: string } | null {
  const dataDir = path.join(process.cwd(), 'research-data');
  
  // Look for any full-research-*.json file
  try {
    const files = fs.readdirSync(dataDir).filter(f => f.startsWith('full-research-'));
    if (files.length > 0) {
      // Use the most recent one
      const latestFile = files.sort().reverse()[0];
      const data = JSON.parse(fs.readFileSync(path.join(dataDir, latestFile), 'utf-8'));
      console.log(`📂 Loaded research from: ${latestFile}`);
      return {
        topic: data.topic,
        fullResearchData: data.combinedResearch,
      };
    }
  } catch (err) {
    console.log(`⚠️ Could not load saved research: ${err}`);
  }
  
  return null;
}

// Mock data for testing without running Phase 1
const MOCK_RESEARCH = `
# COMPLETE RESEARCH: Why McDonald's franchise owners are leaving despite record profits

## ROUND 1 - BROAD EXPLORATION

### ALEX FINANCIAL DATA (15 queries):
• McDonald's 2023 revenue: $25.494 billion (9.97% increase from 2022's $23.18 billion)
• Corporate net income: $8.469 billion (2023) vs $7.55 billion (2022) - 12.2% growth
• Average franchisee profit: $150,000-$260,000 annually (down from $280,000-$320,000 in 2019)
• Franchise fee: $45,000 initial + 5% ongoing royalty (increased from 4% in 2024)
• Average store revenue: $3.966 million (up from $3.2M in 2019 but costs rose faster)
• Operating costs: $500,000-$1.8 million annually (up 35% since 2019)
• Industry benchmark: 6-9% net margins (McDonald's franchisees at lower end: 6-7%)
• 95% of McDonald's revenue comes from franchise operations (rent + royalties)
• Marketing spend: $445 million corporate (franchisees pay additional 4% of sales)
• Food cost inflation: 12% increase 2022-2024
• Labor costs: Minimum wage increases hitting hardest in CA, NY, WA

### DAVID STRATEGIC RESEARCH (Round 1):
**CORPORATE PROFIT MECHANISMS:** McDonald's asset-light model means corporate owns real estate, franchisees pay rent. As property values rise, corporate benefits while franchisees face higher occupancy costs. Real estate appreciation accounts for ~40% of McDonald's stock gains.

**FRANCHISEE PRESSURE POINTS:** 
1) Rent escalation clauses in leases (tied to revenue, not profit)
2) Technology mandates: $150,000+ for new POS systems, digital menu boards
3) Remodeling requirements: $300,000-$500,000 every 7-10 years
4) Supply chain markups: Corporate benefits from supplier rebates not shared with franchisees

**EXIT TRIGGERS:** Survey data shows 87% "no confidence" vote correlates with:
- California's $20/hour minimum wage (April 2024)
- 1,700 location ownership changes in 2024 (vs ~400 typical)
- Legal disputes: Age discrimination, racial bias, wrongful termination suits
- E. coli outbreak costs ($5M+ in legal exposure per location)

## ROUND 2 - FOCUSED ON CALIFORNIA CRISIS

### ALEX FINANCIAL DATA (15 queries focused on CA):
• California minimum wage impact: $20/hour = ~$250,000 annual increase per location
• California franchisee profit margins: 3-5% (vs 6-10% national average)
• California operational costs: 40% higher than Texas equivalents
• Food price increases: California McDonald's prices up 12% in 2024 vs 6% nationally
• Franchisee retention: California has 2.3x higher exit rate than national average
• Compliance costs: California-specific regulations add estimated $75,000 annually

### DAVID STRATEGIC RESEARCH (Round 2):
**THE CALIFORNIA MECHANISM:** Unlike other minimum wage increases, California's AB 1228 specifically targeted "fast food chains with 60+ locations." This created a two-tier labor market where McDonald's must pay $20/hour while local competitors pay $16/hour, creating competitive disadvantage.

**LEGAL BATTLES EMERGING:**
- Prominent franchisee lawsuit: Claims corporate attempted "systematic ouster"
- 40+ Black former franchisees filed discrimination suit alleging steering toward underperforming locations
- E. coli lawsuits seeking $5M+ damages per affected location

## ROUND 3 - INDUSTRY CONTEXT

### ALEX FINANCIAL DATA (15 queries for benchmarks):
• McDonald's franchisee margins (6-7%) vs Chick-fil-A (18-22%) vs Subway (8-12%)
• McDonald's rent burden: 25-30% of revenue vs industry average 15-20%
• Historical context: McDonald's franchisee margins were 12-15% in 2010-2015
• Corporate margin evolution: McDonald's corporate margins improved from 25% (2015) to 33% (2023)
• Comparison: Chick-fil-A averages $4.2M revenue, $3.4M costs, $800K profit per location
• Store valuations: McDonald's locations selling for 4-6x annual profit (down from 8-10x in 2019)

### DAVID STRATEGIC RESEARCH (Round 3):
**ROOT CAUSE ANALYSIS:** McDonald's corporate success comes from three mechanisms franchisees can't control:
1) Real estate appreciation (corporate owns land, franchisees pay escalating rent)
2) Supplier rebates (corporate negotiates, keeps most benefits)
3) Technology licensing fees (franchisees pay for corporate-developed systems)

**INDUSTRY COMPARISON:**
- Chick-fil-A: Corporate takes higher royalty (15%) but provides more support, selective franchisee approval
- McDonald's: Lower corporate support, high real estate burden, accepts more franchisees
- Historical: McDonald's franchisee economics declined 60% since 2015 while corporate profits doubled

**THE SUSTAINABILITY CRISIS:** Current trajectory unsustainable because:
- Franchisee margins compressed below viable levels
- Corporate dependency on real estate appreciation
- Labor cost inflation outpacing menu price increases
- Brand reputation risk from franchisee quality degradation
`;

async function testTaylorJamesLoop() {
  console.log('\n' + '='.repeat(70));
  console.log('🔄 TEST: Taylor-James Feedback Loop (4 iterations)');
  console.log('='.repeat(70));
  console.log('FLOW: Research → Taylor → James → Iterate');
  console.log('TARGET: Pass brutal Wharton MBA evaluator');
  console.log('='.repeat(70));

  // Try to load saved data, fall back to mock
  const savedData = loadResearchData();
  
  let inputData;
  if (savedData) {
    inputData = savedData;
    console.log(`✅ Using REAL research data (${savedData.fullResearchData.length} chars)`);
  } else {
    inputData = {
      topic: "Why McDonald's franchise owners are leaving despite record profits",
      fullResearchData: MOCK_RESEARCH,
    };
    console.log(`📋 Using MOCK research data (${MOCK_RESEARCH.length} chars)`);
    console.log(`💡 Run test-exa-research.ts first to get real data`);
  }

  console.log(`\n📋 Topic: ${inputData.topic}`);
  console.log(`📊 Research data: ${inputData.fullResearchData.length} characters\n`);

  const startTime = Date.now();

  try {
    const run = await taylorJamesLoop.createRunAsync();
    const result = await run.start({ inputData });

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log('\n' + '='.repeat(70));
    console.log('📊 FINAL RESULTS');
    console.log('='.repeat(70));

    if (result.status === 'success') {
      console.log(`✅ Status: SUCCESS`);
      console.log(`⏱️ Duration: ${duration}s`);
      console.log(`📝 Total Iterations: ${result.result.totalIterations}`);
      console.log(`📊 Final Score: ${result.result.finalScore}/100`);
      console.log(`✅ Approved: ${result.result.approved ? 'YES 🎉' : 'NO (best effort)'}`);

      // Show score progression
      console.log('\n' + '-'.repeat(70));
      console.log('📈 SCORE PROGRESSION:');
      console.log('-'.repeat(70));
      result.result.history.forEach((h) => {
        const bar = '█'.repeat(Math.floor(h.score / 5));
        console.log(`  Iteration ${h.iteration}: ${h.score}/100 ${bar} | ${h.verdict}`);
        if (h.recommendations.length > 0) {
          console.log(`    → ${h.recommendations[0].substring(0, 60)}...`);
        }
      });

      // Show final post
      console.log('\n' + '='.repeat(70));
      console.log('📱 FINAL LINKEDIN POST:');
      console.log('='.repeat(70));
      console.log(result.result.finalPost);
      console.log('='.repeat(70));

      // Stats
      console.log(`\n📏 Post Stats:`);
      console.log(`   Length: ${result.result.finalPost.length} characters`);
      console.log(`   Lines: ${result.result.finalPost.split('\n').length}`);

      // Verdict
      if (result.result.approved) {
        console.log('\n🎉 SUCCESS: Passed the brutal Wharton MBA evaluator!');
      } else if (result.result.finalScore > 58) {
        console.log(`\n📈 IMPROVEMENT: Score increased (was 58, now ${result.result.finalScore})`);
      } else {
        console.log('\n⚠️ Still needs work on analytical depth');
      }

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
testTaylorJamesLoop()
  .then(passed => process.exit(passed ? 0 : 1))
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });

