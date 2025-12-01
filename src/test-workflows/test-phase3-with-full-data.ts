/**
 * Test Phase 3 with FULL Research Data
 * 
 * THE BIG FIX: Pass 40K chars of research data to Taylor
 * Instead of just Maya's 1.4K summary
 * 
 * This should dramatically increase James's score
 */

import 'dotenv/config';
import { phase3WritingWorkflow } from '../mastra/workflows/phase-3-writing-workflow';
import * as fs from 'fs';
import * as path from 'path';

// Load saved Maya insights
const insightsPath = path.join(process.cwd(), 'research-data', 'maya-insights-mcdonalds.json');
const savedData = JSON.parse(fs.readFileSync(insightsPath, 'utf-8'));

// MOCK FULL RESEARCH DATA (representing our 40K chars from Phase 1)
// In real workflow, this would come from exa-research-workflow output
const FULL_RESEARCH_DATA = `
# COMPLETE RESEARCH: Why McDonald's franchise owners are leaving despite record profits

## ROUND 1 - BROAD EXPLORATION (June 2024)

### ALEX FINANCIAL DATA (15 queries):
• McDonald's 2023 revenue: $25.494 billion (9.97% increase from 2022's $23.18 billion)
• Corporate net income: $8.469 billion (2023) vs $7.55 billion (2022) - 12.2% growth
• Average franchisee profit: $150,000-$260,000 annually (down from $280,000-$320,000 in 2019)
• Franchise fee: $45,000 initial + 5% ongoing royalty (increased from 4% in 2024)
• Average store revenue: $3.966 million (up from $3.2M in 2019 but costs rose faster)
• Operating costs: $500,000-$1.8 million annually (up 35% since 2019 due to labor/rent)
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
• Marketing fees: California franchisees pay same 4% rate on higher revenue base
• Utility costs: 80% of operators report "significant concern" over energy bills
• Compliance costs: California-specific regulations add estimated $75,000 annually

### DAVID STRATEGIC RESEARCH (Round 2):
**THE CALIFORNIA MECHANISM:** Unlike other minimum wage increases, California's AB 1228 specifically targeted "fast food chains with 60+ locations." This created a two-tier labor market where McDonald's must pay $20/hour while local competitors pay $16/hour, creating competitive disadvantage.

**LEGAL BATTLES EMERGING:**
- Prominent franchisee lawsuit: Claims corporate attempted "systematic ouster"
- 40+ Black former franchisees filed discrimination suit alleging steering toward underperforming locations
- E. coli lawsuits seeking $5M+ damages per affected location
- Age discrimination cases from terminated managers (cost-cutting pressure)

**CORPORATE RESPONSE STRATEGY:** Increased inspections and oversight "for quality control" but franchisees report this as retaliation. New grading systems correlate with lease renewal decisions, creating exit pressure for underperformers.

## ROUND 3 - PRECISION DATA & INDUSTRY CONTEXT

### ALEX FINANCIAL DATA (15 queries for benchmarks):
• McDonald's franchisee margins (6-7%) vs Chick-fil-A (18-22%) vs Subway (8-12%)
• McDonald's rent burden: 25-30% of revenue vs industry average 15-20%
• Historical context: McDonald's franchisee margins were 12-15% in 2010-2015
• Corporate margin evolution: McDonald's corporate margins improved from 25% (2015) to 33% (2023)
• Unit economics breakdown: Avg location revenue $3.966M, costs $3.7-3.8M, profit $150-260K
• Comparison: Chick-fil-A averages $4.2M revenue, $3.4M costs, $800K profit per location
• McDonald's royalty burden: 9% total (5% franchise + 4% marketing) vs CFA 15% but on higher profits
• Store valuations: McDonald's locations selling for 4-6x annual profit (down from 8-10x in 2019)

### DAVID STRATEGIC RESEARCH (Round 3):
**ROOT CAUSE ANALYSIS:** McDonald's corporate success comes from three mechanisms franchisees can't control:
1) Real estate appreciation (corporate owns land, franchisees pay escalating rent)
2) Supplier rebates (corporate negotiates, keeps most benefits)
3) Technology licensing fees (franchisees pay for corporate-developed systems)

**INDUSTRY COMPARISON REVEALS THE GAP:**
- Chick-fil-A: Corporate takes higher royalty (15%) but provides more support, selective franchisee approval
- McDonald's: Lower corporate support, high real estate burden, accepts more franchisees (diluting territory value)
- Starbucks: Company-owned model avoids franchisee conflict entirely

**THE SUSTAINABILITY CRISIS:** Current trajectory unsustainable because:
- Franchisee margins compressed below viable levels (6-7% vs 12-15% historically)
- Corporate dependency on real estate appreciation (can't last indefinitely)
- Labor cost inflation outpacing menu price increases (customer resistance)
- Brand reputation risk from franchisee quality degradation under financial pressure

**2024 TURNING POINT INDICATORS:**
- Franchisee retention at 15-year low
- Corporate stock multiple at premium to peers despite operational challenges
- Legal exposure mounting from discrimination, food safety, labor disputes
- Market saturation limiting growth options for struggling franchisees

## KEY INSIGHTS FROM RESEARCH:
1. **The Squeeze Mechanism:** Corporate owns assets (real estate, IP), franchisees bear operating risk
2. **Historical Deterioration:** Franchisee economics declined 60% since 2015 while corporate profits doubled
3. **California as Canary:** $20 minimum wage revealed how thin margins really were
4. **Industry Context:** McDonald's franchisee model least favorable among major chains
5. **Systemic Risk:** Model works for corporate but unsustainable for franchisees long-term
`;

async function testPhase3WithFullData() {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 TEST: Phase 3 with FULL Research Data');
  console.log('='.repeat(70));
  console.log('THE BIG FIX: Taylor gets 40K chars instead of 1.4K summary');
  console.log('Expected: Higher James score due to analytical depth');
  console.log('='.repeat(70));
  console.log(`📋 Topic: ${savedData.topic}`);
  console.log(`📊 Maya insights: ${JSON.stringify(savedData.viralInsights).length} chars`);
  console.log(`📚 Full research: ${FULL_RESEARCH_DATA.length} chars`);
  console.log(`🔍 Total data for Taylor: ${JSON.stringify(savedData.viralInsights).length + FULL_RESEARCH_DATA.length} chars\n`);

  const startTime = Date.now();

  try {
    const run = await phase3WritingWorkflow.createRunAsync();
    
    const result = await run.start({
      inputData: {
        topic: savedData.topic,
        viralInsights: savedData.viralInsights,
        fullResearchData: FULL_RESEARCH_DATA, // THE KEY CHANGE
      },
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log('\n' + '='.repeat(70));
    console.log('📊 RESULTS');
    console.log('='.repeat(70));

    if (result.status === 'success') {
      console.log(`✅ Status: SUCCESS`);
      console.log(`⏱️ Duration: ${duration}s`);
      console.log(`📝 Iterations: ${result.result.iterations}`);
      console.log(`📊 Final Score: ${result.result.finalScore}/100`);
      console.log(`✅ Approved: ${result.result.approved ? 'YES' : 'NO (best effort)'}`);

      // Compare to previous run (58/100)
      const improvement = result.result.finalScore - 58;
      console.log(`📈 Score improvement: ${improvement > 0 ? '+' : ''}${improvement} points vs previous run`);

      // Show iteration history
      console.log('\n' + '-'.repeat(70));
      console.log('📜 FEEDBACK LOOP HISTORY:');
      console.log('-'.repeat(70));
      result.result.history.forEach((h, i) => {
        console.log(`\n  Iteration ${h.iteration}:`);
        console.log(`    Score: ${h.score}/100 | Verdict: ${h.verdict}`);
        if (h.feedback && h.feedback.length < 200) {
          console.log(`    Feedback: ${h.feedback}`);
        } else if (h.feedback) {
          console.log(`    Feedback: ${h.feedback.substring(0, 150)}...`);
        }
      });

      // Show final post
      console.log('\n' + '='.repeat(70));
      console.log('📱 FINAL LINKEDIN POST WITH FULL DATA:');
      console.log('='.repeat(70));
      console.log(result.result.finalPost);
      console.log('='.repeat(70));

      // Post stats
      const postLength = result.result.finalPost.length;
      const lineCount = result.result.finalPost.split('\n').length;
      console.log(`\n📏 Post Stats:`);
      console.log(`   Length: ${postLength} characters`);
      console.log(`   Lines: ${lineCount}`);

      // Success criteria
      if (result.result.finalScore >= 75) {
        console.log('\n🎉 SUCCESS: Passed James\'s brutal evaluation!');
      } else if (result.result.finalScore > 58) {
        console.log('\n📈 IMPROVEMENT: Better than previous run, but still needs work');
      } else {
        console.log('\n⚠️ NO IMPROVEMENT: Still same score as before');
      }

      console.log('\n' + '='.repeat(70));
      console.log('✅ TEST PASSED');
      console.log('='.repeat(70));
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
testPhase3WithFullData()
  .then(passed => process.exit(passed ? 0 : 1))
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
