import 'dotenv/config';
import { taylorKim } from './mastra/agents/taylor-kim';
import { QSR_RESOURCE_ID, generatePostThreadId } from './mastra/config/qsr-memory';

async function testTaylorWithMayaAnalysis() {
  console.log('🧪 Testing Taylor with Maya\'s Best Economic Analysis...\n');
  
  const testRunId = `taylor-maya-test-${Date.now()}`;
  const threadId = generatePostThreadId();
  
  try {
    console.log('🎯 Using Maya\'s sophisticated economic analysis from brutal run');
    console.log(`📊 RunId: ${testRunId}`);
    console.log('='.repeat(80));

    // Maya's BEST economic analysis (from brutal-1764580023741.json)
    const mayaAnalysis = `## ECONOMIC ANALYSIS

### Calculations

1. **Revenue and Operating Income:**
   - Total Revenue (2024): $11.314 billion
   - Operating Income (2024): $1.916 billion
   - Profit Margin: 13.56%

2. **Store Metrics:**
   - Average Unit Volume: $3.19 million
   - Store Count: 3,726
   - Expansion Rate: 304 new restaurants
   - Franchised Stores: 0%

3. **Same-Store Sales Growth:**
   - Growth Rate: 7.4%

### Comparative Models

- **Current Model (Owned):**
  - Operating Income: $1.916 billion
  - Margin: 13.56%
  - Expansion: 304 new stores

- **Hypothetical Franchised Model:**
  - Revenue from Franchising: 3,726 stores × $3.19M × 8% = $949.5 million
  - Operating Income (Franchised): ~$700 million
  - Margin: 77%

### Economic Insights

- **Margin Paradox:**
  - Franchising offers a higher margin (77%) but results in lower absolute income compared to the owned model.
  - Absolute cash flow is more critical for shareholder returns than margin percentage.

- **Strategic Positioning:**
  - Chipotle's focus on digital transformation, high-quality ingredients, and sustainability initiatives strengthens its competitive edge over Qdoba and Moe's.
  - The company's strategic partnerships and technological investments enhance supply chain resilience and operational efficiency.

### Stakeholder Impacts

- **Shareholders:**
  - Franchising would result in approximately $1.2 billion less in operating income annually.
  - Current model supports robust cash flow and self-funded expansion.

- **Franchisees:**
  - No franchising means potential franchisees miss out on a high-margin opportunity, but Chipotle retains control and quality.

### Universal Principles

- **Franchising as Financing:**
  - Franchising is a tool for capital-constrained businesses. Chipotle's strong cash flow and high ROIC negate the need for franchising.

- **Format Determines Profitability:**
  - Operational efficiencies and strategic positioning are more critical than brand alone in determining profitability.

### Conclusion

Chipotle's strategic decisions, focusing on owned operations, digital innovation, and sustainability, provide a competitive advantage and robust financial performance. The analysis highlights the importance of absolute cash flow over margin percentage and the strategic benefits of maintaining control over operations.`;

    console.log('\n🎯 TESTING UPDATED TAYLOR PROMPT:');
    console.log('✅ Quality over quantity viral signal approach');
    console.log('✅ Raghav formatting specs (1700-2500 chars, 35-60 lines)');  
    console.log('✅ No emoji, no bold formatting, no em dashes');
    console.log('✅ Evaluation-focused writing (0.80+ signal execution)');
    console.log('\n' + '='.repeat(80));

    const taylorResponse = await taylorKim.generate([{ 
      role: 'user', 
      content: `Taylor, create a viral LinkedIn post from Maya's economic analysis using runId "${testRunId}":

${mayaAnalysis}

Transform this into viral LinkedIn content that matches Raghav's voice and passes our evaluation criteria.` 
    }],
    {
      threadId,
      resourceId: QSR_RESOURCE_ID,
      toolChoice: 'required', // FORCE Taylor to use tools
      maxSteps: 10, // Allow multi-step tool workflow  
      onStepFinish: ({ text, toolCalls, toolResults }) => {
        console.log(`📋 Step completed:`);
        if (toolCalls && toolCalls.length > 0) {
          console.log(`🔧 Tools called:`, toolCalls.length);
          console.log(`🔍 Tool details:`, JSON.stringify(toolCalls, null, 2));
        }
        if (toolResults && toolResults.length > 0) {
          console.log(`📊 Tool results:`, toolResults.length);
          console.log(`🔍 Result preview:`, JSON.stringify(toolResults.slice(0, 1), null, 2));
        }
        if (text) {
          console.log(`💬 Text so far: ${text.substring(0, 100)}...`);
        }
      }
    });
    
    console.log('\n📊 TAYLOR\'S VIRAL LINKEDIN POST:');
    console.log('='.repeat(80));
    console.log(taylorResponse.text);
    console.log('='.repeat(80));
    
    // Analyze the output
    console.log('\n🔍 POST ANALYSIS:');
    const charCount = taylorResponse.text.length;
    const lineCount = taylorResponse.text.split('\n').length;
    
    console.log(`📏 Length: ${charCount} characters, ${lineCount} lines`);
    console.log(`📊 Target: 1700-2500 characters, 35-60 lines`);
    console.log(`✅ Length Check: ${charCount >= 1700 && charCount <= 2500 ? 'PASS' : 'NEEDS ADJUSTMENT'}`);
    
    // Check for forbidden formatting
    const hasBoldFormatting = taylorResponse.text.includes('**');
    const hasEmDashes = taylorResponse.text.includes('—');
    const hasEmojis = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F700}-\u{1F77F}]|[\u{1F780}-\u{1F7FF}]|[\u{1F800}-\u{1F8FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(taylorResponse.text);
    
    console.log(`🚫 Formatting Check:`);
    console.log(`   Bold (**): ${hasBoldFormatting ? '❌ FOUND' : '✅ CLEAN'}`);
    console.log(`   Em dashes (—): ${hasEmDashes ? '❌ FOUND' : '✅ CLEAN'}`);
    console.log(`   Emojis: ${hasEmojis ? '❌ FOUND' : '✅ CLEAN'}`);
    
    console.log('\n💡 NEXT STEPS:');
    console.log('1. Review Taylor\'s viral signal execution');
    console.log('2. Run viral evaluation to check signal scores');  
    console.log('3. Compare with previous Taylor attempt (had ** formatting errors)');
    console.log('4. Test with James\'s evaluation if quality looks good');
    
  } catch (error) {
    console.error('❌ Taylor test failed:', error);
  }
}

// Run the Taylor + Maya test
testTaylorWithMayaAnalysis();
