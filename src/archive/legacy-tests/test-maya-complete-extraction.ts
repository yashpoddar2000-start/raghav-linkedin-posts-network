import 'dotenv/config';
import { mayaPatel } from './mastra/agents/maya-patel';
import { QSR_RESOURCE_ID, generatePostThreadId } from './mastra/config/qsr-memory';

async function testMayaCompleteExtraction() {
  console.log('🔥 Testing Maya Complete Data Extraction (Updated Instructions)...\n');
  
  const testRunId = "brutal-1764580023741";
  const threadId = generatePostThreadId();
  
  try {
    console.log('🎯 VALIDATION TARGET: Maya must use 100% of Alex and David data');
    console.log('📊 Alex provided 8 specific financial metrics');
    console.log('🔬 David provided 2 strategic research outputs with:');
    console.log('   - 174.1% digital sales growth');
    console.log('   - 88% brand recognition');
    console.log('   - 8M → 40M loyalty members');
    console.log('   - RFID technology systems');
    console.log('   - Lumachain AI partnership');
    console.log('   - Supply chain investments ($5M farmer support)');
    console.log('   - Strategic partnerships (U.S. Soccer, Sony, Riot Games)');
    console.log('='.repeat(80));

    console.log('\n🧠 Maya with UPDATED instructions: Extract EVERYTHING from Alex and David');
    
    const mayaResponse = await mayaPatel.generate([{ 
      role: 'user', 
      content: `Maya, using runId "${testRunId}", load Alex and David's research and create a comprehensive economic analysis.

Remember: Alex and David are your research team. Your economic work must be built on the foundation of ALL their research. Extract EVERYTHING they provided - every number, every finding, every mechanism.` 
    }],
    {
      threadId,
      resourceId: QSR_RESOURCE_ID,
    });
    
    console.log('\n📊 Maya\'s Complete Data Extraction Response:');
    console.log('='.repeat(100));
    console.log(mayaResponse.text);
    console.log('='.repeat(100));
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('\n🔍 EXTRACTION VALIDATION CHECKLIST:');
    console.log('='.repeat(80));
    
    console.log('\n📊 ALEX DATA USAGE (All 8 metrics):');
    console.log('   ✅ $11.314 billion revenue?');
    console.log('   ✅ $1.916B operating income?');
    console.log('   ✅ 13.56% profit margin?'); 
    console.log('   ✅ $3.19M average unit volume?');
    console.log('   ✅ 3,726 store count?');
    console.log('   ✅ 304 expansion rate?');
    console.log('   ✅ 7.4% same-store growth?');
    console.log('   ✅ 0% franchised stores?');
    
    console.log('\n🔬 DAVID DATA USAGE (Specific findings):');
    console.log('   ✅ 174.1% digital sales growth (exact number)?');
    console.log('   ✅ 88% brand recognition (specific metric)?');
    console.log('   ✅ 8M → 40M loyalty members (precise data)?');
    console.log('   ✅ RFID technology (named system)?');
    console.log('   ✅ Lumachain AI partnership (exact company)?');
    console.log('   ✅ $5M young farmer support (specific investment)?');
    console.log('   ✅ U.S. Soccer/Sony partnerships (named companies)?');
    
    console.log('\n💯 SUCCESS CRITERIA:');
    console.log('   - Maya references ALL 8 Alex metrics with exact numbers');
    console.log('   - Maya uses ALL David\'s specific findings with company names');
    console.log('   - Economic analysis built on complete research foundation');
    console.log('   - No wasted research data from the team');
    
  } catch (error) {
    console.error('❌ Maya complete extraction test failed:', error);
  }
}

// Run the complete extraction test
testMayaCompleteExtraction();

import { mayaPatel } from './mastra/agents/maya-patel';
import { QSR_RESOURCE_ID, generatePostThreadId } from './mastra/config/qsr-memory';

async function testMayaCompleteExtraction() {
  console.log('🔥 Testing Maya Complete Data Extraction (Updated Instructions)...\n');
  
  const testRunId = "brutal-1764580023741";
  const threadId = generatePostThreadId();
  
  try {
    console.log('🎯 VALIDATION TARGET: Maya must use 100% of Alex and David data');
    console.log('📊 Alex provided 8 specific financial metrics');
    console.log('🔬 David provided 2 strategic research outputs with:');
    console.log('   - 174.1% digital sales growth');
    console.log('   - 88% brand recognition');
    console.log('   - 8M → 40M loyalty members');
    console.log('   - RFID technology systems');
    console.log('   - Lumachain AI partnership');
    console.log('   - Supply chain investments ($5M farmer support)');
    console.log('   - Strategic partnerships (U.S. Soccer, Sony, Riot Games)');
    console.log('='.repeat(80));

    console.log('\n🧠 Maya with UPDATED instructions: Extract EVERYTHING from Alex and David');
    
    const mayaResponse = await mayaPatel.generate([{ 
      role: 'user', 
      content: `Maya, using runId "${testRunId}", load Alex and David's research and create a comprehensive economic analysis.

Remember: Alex and David are your research team. Your economic work must be built on the foundation of ALL their research. Extract EVERYTHING they provided - every number, every finding, every mechanism.` 
    }],
    {
      threadId,
      resourceId: QSR_RESOURCE_ID,
    });
    
    console.log('\n📊 Maya\'s Complete Data Extraction Response:');
    console.log('='.repeat(100));
    console.log(mayaResponse.text);
    console.log('='.repeat(100));
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('\n🔍 EXTRACTION VALIDATION CHECKLIST:');
    console.log('='.repeat(80));
    
    console.log('\n📊 ALEX DATA USAGE (All 8 metrics):');
    console.log('   ✅ $11.314 billion revenue?');
    console.log('   ✅ $1.916B operating income?');
    console.log('   ✅ 13.56% profit margin?'); 
    console.log('   ✅ $3.19M average unit volume?');
    console.log('   ✅ 3,726 store count?');
    console.log('   ✅ 304 expansion rate?');
    console.log('   ✅ 7.4% same-store growth?');
    console.log('   ✅ 0% franchised stores?');
    
    console.log('\n🔬 DAVID DATA USAGE (Specific findings):');
    console.log('   ✅ 174.1% digital sales growth (exact number)?');
    console.log('   ✅ 88% brand recognition (specific metric)?');
    console.log('   ✅ 8M → 40M loyalty members (precise data)?');
    console.log('   ✅ RFID technology (named system)?');
    console.log('   ✅ Lumachain AI partnership (exact company)?');
    console.log('   ✅ $5M young farmer support (specific investment)?');
    console.log('   ✅ U.S. Soccer/Sony partnerships (named companies)?');
    
    console.log('\n💯 SUCCESS CRITERIA:');
    console.log('   - Maya references ALL 8 Alex metrics with exact numbers');
    console.log('   - Maya uses ALL David\'s specific findings with company names');
    console.log('   - Economic analysis built on complete research foundation');
    console.log('   - No wasted research data from the team');
    
  } catch (error) {
    console.error('❌ Maya complete extraction test failed:', error);
  }
}

// Run the complete extraction test
testMayaCompleteExtraction();
