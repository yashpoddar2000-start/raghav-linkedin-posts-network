import 'dotenv/config';
import { mayaPatel } from './mastra/agents/maya-patel';
import { QSR_RESOURCE_ID, generatePostThreadId } from './mastra/config/qsr-memory';

async function testMayaDataTypes() {
  console.log('🔥 Testing Maya Data Type Differentiation (Alex=Metrics, David=Context)...\n');
  
  const testRunId = "brutal-1764580023741";
  const threadId = generatePostThreadId();
  
  try {
    console.log('🎯 TESTING NEW APPROACH: Data Type Differentiation');
    console.log('📊 Alex = Financial metrics (use 100% for calculations)');
    console.log('🔬 David = Strategic context (use selectively for mechanisms)');
    console.log('🧮 Context Window: ~16K tokens (12.5% of GPT-4o limit) - NOT an issue');
    console.log('='.repeat(80));

    console.log('\n🧠 Maya with DATA TYPE GUIDANCE:');
    
    const mayaResponse = await mayaPatel.generate([{ 
      role: 'user', 
      content: `Maya, create an economic analysis using runId "${testRunId}".

Use Alex's data: ALL financial metrics for your calculations
Use David's data: Strategic mechanisms that explain economic performance` 
    }],
    {
      threadId,
      resourceId: QSR_RESOURCE_ID,
    });
    
    console.log('\n📊 Maya\'s Data Type Differentiation Response:');
    console.log('='.repeat(100));
    console.log(mayaResponse.text);
    console.log('='.repeat(100));
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('\n🔍 EVALUATION CRITERIA:');
    console.log('='.repeat(80));
    
    console.log('\n📊 ALEX METRICS USAGE (Expect 100%):');
    console.log('   Does Maya use ALL 8 financial metrics in calculations?');
    console.log('   Are exact numbers used for economic modeling?');
    
    console.log('\n🔬 DAVID CONTEXT USAGE (Expect Strategic Selection):');
    console.log('   Does Maya extract brand strength metrics (88% recognition)?');
    console.log('   Does Maya use operational mechanisms (RFID, digital capabilities)?');
    console.log('   Does Maya explain HOW strategic factors drive financial performance?');
    
    console.log('\n💡 INTEGRATION QUALITY:');
    console.log('   Does Maya connect Alex\'s numbers to David\'s mechanisms?');
    console.log('   Does analysis show WHY financial performance exists?');
    console.log('   Does it demonstrate sophisticated economic thinking?');
    
    console.log('\n🎯 SUCCESS CRITERIA:');
    console.log('   ✅ All Alex metrics incorporated into economic calculations');  
    console.log('   ✅ David\'s strategic findings explain mechanisms behind the numbers');
    console.log('   ✅ Economic analysis combines both data types effectively');
    console.log('   ✅ Shows sophisticated understanding of data type differentiation');
    
  } catch (error) {
    console.error('❌ Maya data types test failed:', error);
  }
}

// Run the data types test
testMayaDataTypes();
