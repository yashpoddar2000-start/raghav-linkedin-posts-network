import 'dotenv/config';
import { mayaPatel } from './mastra/agents/maya-patel';
import { QSR_RESOURCE_ID, generatePostThreadId } from './mastra/config/qsr-memory';

async function testMayaCompleteExtractionFinal() {
  console.log('🔥 FINAL TEST: Maya Complete Data Extraction (Updated Instructions)...\n');
  
  const testRunId = "brutal-1764580023741";
  const threadId = generatePostThreadId();
  
  try {
    console.log('🎯 TESTING: Maya with EXPLICIT extraction mandate');
    console.log('📊 Expected: Maya extracts ALL specifics from David before analyzing');
    console.log('🔬 Target: 100% utilization of David\'s specific data points');
    console.log('='.repeat(80));

    console.log('\n🧠 Maya with NO HINTS - just her updated extraction instructions:');
    
    const mayaResponse = await mayaPatel.generate([{ 
      role: 'user', 
      content: `Maya, create an economic analysis using runId "${testRunId}".` 
    }],
    {
      threadId,
      resourceId: QSR_RESOURCE_ID,
    });
    
    console.log('\n📊 Maya\'s Complete Response:');
    console.log('='.repeat(100));
    console.log(mayaResponse.text);
    console.log('='.repeat(100));
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('\n🔍 SPECIFIC DATA EXTRACTION VALIDATION:');
    console.log('='.repeat(80));
    
    const responseText = mayaResponse.text.toLowerCase();
    
    console.log('\n📊 ALEX DATA (Expect 8/8):');
    console.log(`   ✅ $11.314 billion: ${responseText.includes('11.314') ? 'FOUND' : 'MISSING'}`);
    console.log(`   ✅ $1.916 billion: ${responseText.includes('1.916') ? 'FOUND' : 'MISSING'}`);
    console.log(`   ✅ 13.56%: ${responseText.includes('13.56') ? 'FOUND' : 'MISSING'}`);
    console.log(`   ✅ 3,726 stores: ${responseText.includes('3,726') || responseText.includes('3726') ? 'FOUND' : 'MISSING'}`);
    console.log(`   ✅ $3.19 million: ${responseText.includes('3.19') ? 'FOUND' : 'MISSING'}`);
    console.log(`   ✅ 7.4% growth: ${responseText.includes('7.4') ? 'FOUND' : 'MISSING'}`);
    console.log(`   ✅ 304 expansion: ${responseText.includes('304') ? 'FOUND' : 'MISSING'}`);
    console.log(`   ✅ 0% franchised: ${responseText.includes('0%') ? 'FOUND' : 'MISSING'}`);
    
    console.log('\n🔬 DAVID SPECIFICS (Target Numbers):');
    console.log(`   ✅ 174.1% digital growth: ${responseText.includes('174.1') ? 'FOUND' : 'MISSING'}`);
    console.log(`   ✅ 88% brand recognition: ${responseText.includes('88%') ? 'FOUND' : 'MISSING'}`);
    console.log(`   ✅ 8M → 40M loyalty: ${responseText.includes('8 million') && responseText.includes('40 million') ? 'FOUND' : 'MISSING'}`);
    console.log(`   ✅ 30% daily sales: ${responseText.includes('30%') ? 'FOUND' : 'MISSING'}`);
    console.log(`   ✅ Lumachain company: ${responseText.includes('lumachain') ? 'FOUND' : 'MISSING'}`);
    console.log(`   ✅ RFID technology: ${responseText.includes('rfid') ? 'FOUND' : 'MISSING'}`);
    console.log(`   ✅ $5M investment: ${responseText.includes('5 million') || responseText.includes('$5') ? 'FOUND' : 'MISSING'}`);
    
    console.log('\n💯 OVERALL ASSESSMENT:');
    const alexCount = [
      responseText.includes('11.314'),
      responseText.includes('1.916'), 
      responseText.includes('13.56'),
      responseText.includes('3,726') || responseText.includes('3726'),
      responseText.includes('3.19'),
      responseText.includes('7.4'),
      responseText.includes('304'),
      responseText.includes('0%')
    ].filter(Boolean).length;
    
    const davidCount = [
      responseText.includes('174.1'),
      responseText.includes('88%'),
      responseText.includes('8 million') && responseText.includes('40 million'),
      responseText.includes('30%'),
      responseText.includes('lumachain'),
      responseText.includes('rfid'),
      responseText.includes('5 million') || responseText.includes('$5')
    ].filter(Boolean).length;
    
    console.log(`   📊 Alex Data Usage: ${alexCount}/8 (${Math.round(alexCount/8*100)}%)`);
    console.log(`   🔬 David Data Usage: ${davidCount}/7 (${Math.round(davidCount/7*100)}%)`);
    
    if (alexCount === 8 && davidCount >= 5) {
      console.log('   🎉 SUCCESS: Maya extracts and uses comprehensive data!');
    } else if (alexCount === 8 && davidCount < 5) {
      console.log('   ⚠️ PARTIAL: Alex perfect, David needs improvement');
    } else {
      console.log('   ❌ ISSUE: Maya not extracting enough specific data');
    }
    
  } catch (error) {
    console.error('❌ Maya data loading test failed:', error);
  }
}

// Run the final extraction test
testMayaCompleteExtractionFinal();

import { mayaPatel } from './mastra/agents/maya-patel';
import { QSR_RESOURCE_ID, generatePostThreadId } from './mastra/config/qsr-memory';

async function testMayaCompleteExtractionFinal() {
  console.log('🔥 FINAL TEST: Maya Complete Data Extraction (Updated Instructions)...\n');
  
  const testRunId = "brutal-1764580023741";
  const threadId = generatePostThreadId();
  
  try {
    console.log('🎯 TESTING: Maya with EXPLICIT extraction mandate');
    console.log('📊 Expected: Maya extracts ALL specifics from David before analyzing');
    console.log('🔬 Target: 100% utilization of David\'s specific data points');
    console.log('='.repeat(80));

    console.log('\n🧠 Maya with NO HINTS - just her updated extraction instructions:');
    
    const mayaResponse = await mayaPatel.generate([{ 
      role: 'user', 
      content: `Maya, create an economic analysis using runId "${testRunId}".` 
    }],
    {
      threadId,
      resourceId: QSR_RESOURCE_ID,
    });
    
    console.log('\n📊 Maya\'s Complete Response:');
    console.log('='.repeat(100));
    console.log(mayaResponse.text);
    console.log('='.repeat(100));
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('\n🔍 SPECIFIC DATA EXTRACTION VALIDATION:');
    console.log('='.repeat(80));
    
    const responseText = mayaResponse.text.toLowerCase();
    
    console.log('\n📊 ALEX DATA (Expect 8/8):');
    console.log(`   ✅ $11.314 billion: ${responseText.includes('11.314') ? 'FOUND' : 'MISSING'}`);
    console.log(`   ✅ $1.916 billion: ${responseText.includes('1.916') ? 'FOUND' : 'MISSING'}`);
    console.log(`   ✅ 13.56%: ${responseText.includes('13.56') ? 'FOUND' : 'MISSING'}`);
    console.log(`   ✅ 3,726 stores: ${responseText.includes('3,726') || responseText.includes('3726') ? 'FOUND' : 'MISSING'}`);
    console.log(`   ✅ $3.19 million: ${responseText.includes('3.19') ? 'FOUND' : 'MISSING'}`);
    console.log(`   ✅ 7.4% growth: ${responseText.includes('7.4') ? 'FOUND' : 'MISSING'}`);
    console.log(`   ✅ 304 expansion: ${responseText.includes('304') ? 'FOUND' : 'MISSING'}`);
    console.log(`   ✅ 0% franchised: ${responseText.includes('0%') ? 'FOUND' : 'MISSING'}`);
    
    console.log('\n🔬 DAVID SPECIFICS (Target Numbers):');
    console.log(`   ✅ 174.1% digital growth: ${responseText.includes('174.1') ? 'FOUND' : 'MISSING'}`);
    console.log(`   ✅ 88% brand recognition: ${responseText.includes('88%') ? 'FOUND' : 'MISSING'}`);
    console.log(`   ✅ 8M → 40M loyalty: ${responseText.includes('8 million') && responseText.includes('40 million') ? 'FOUND' : 'MISSING'}`);
    console.log(`   ✅ 30% daily sales: ${responseText.includes('30%') ? 'FOUND' : 'MISSING'}`);
    console.log(`   ✅ Lumachain company: ${responseText.includes('lumachain') ? 'FOUND' : 'MISSING'}`);
    console.log(`   ✅ RFID technology: ${responseText.includes('rfid') ? 'FOUND' : 'MISSING'}`);
    console.log(`   ✅ $5M investment: ${responseText.includes('5 million') || responseText.includes('$5') ? 'FOUND' : 'MISSING'}`);
    
    console.log('\n💯 OVERALL ASSESSMENT:');
    const alexCount = [
      responseText.includes('11.314'),
      responseText.includes('1.916'), 
      responseText.includes('13.56'),
      responseText.includes('3,726') || responseText.includes('3726'),
      responseText.includes('3.19'),
      responseText.includes('7.4'),
      responseText.includes('304'),
      responseText.includes('0%')
    ].filter(Boolean).length;
    
    const davidCount = [
      responseText.includes('174.1'),
      responseText.includes('88%'),
      responseText.includes('8 million') && responseText.includes('40 million'),
      responseText.includes('30%'),
      responseText.includes('lumachain'),
      responseText.includes('rfid'),
      responseText.includes('5 million') || responseText.includes('$5')
    ].filter(Boolean).length;
    
    console.log(`   📊 Alex Data Usage: ${alexCount}/8 (${Math.round(alexCount/8*100)}%)`);
    console.log(`   🔬 David Data Usage: ${davidCount}/7 (${Math.round(davidCount/7*100)}%)`);
    
    if (alexCount === 8 && davidCount >= 5) {
      console.log('   🎉 SUCCESS: Maya extracts and uses comprehensive data!');
    } else if (alexCount === 8 && davidCount < 5) {
      console.log('   ⚠️ PARTIAL: Alex perfect, David needs improvement');
    } else {
      console.log('   ❌ ISSUE: Maya not extracting enough specific data');
    }
    
  } catch (error) {
    console.error('❌ Maya data loading test failed:', error);
  }
}

// Run the final extraction test
testMayaCompleteExtractionFinal();
