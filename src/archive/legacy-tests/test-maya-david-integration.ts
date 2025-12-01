import 'dotenv/config';
import { mayaPatel } from './mastra/agents/maya-patel';
import { QSR_RESOURCE_ID, generatePostThreadId } from './mastra/config/qsr-memory';

async function testMayaDavidIntegration() {
  console.log('🔍 Testing Maya\'s David Data Integration Issue...\n');
  
  const testRunId = "brutal-1764580023741";
  const threadId = generatePostThreadId();
  
  try {
    console.log('🎯 TESTING: Can Maya access and use David\'s specific findings?');
    console.log('📊 David provided:');
    console.log('   - 174.1% digital sales growth (specific number)');
    console.log('   - 88% brand recognition in US (specific metric)');  
    console.log('   - 8M → 40M loyalty members (specific growth)');
    console.log('   - RFID technology implementation (specific system)');
    console.log('   - Lumachain AI investment (specific partnership)');
    console.log('='.repeat(80));

    console.log('\n🧠 Maya\'s Task: Load David\'s research and use SPECIFIC findings in analysis');
    
    const mayaResponse = await mayaPatel.generate([{ 
      role: 'user', 
      content: `Maya, load David's strategic research for runId "${testRunId}" and create an analysis that uses David's SPECIFIC findings, not just high-level themes.

For example, David found:
- 174.1% digital sales growth
- 88% brand recognition  
- 8M → 40M loyalty members
- RFID technology details
- Lumachain AI partnerships

Use these SPECIFIC data points in your economic analysis. Don't just say "digital transformation" - use the actual 174.1% number. Don't just say "strategic partnerships" - mention Lumachain specifically.

Show me you can access and integrate David's detailed findings.` 
    }],
    {
      threadId,
      resourceId: QSR_RESOURCE_ID,
    });
    
    console.log('\n📊 Maya\'s Response:');
    console.log('='.repeat(80));
    console.log(mayaResponse.text);
    console.log('='.repeat(80));
    
    console.log('\n🔍 ANALYSIS QUESTIONS:');
    console.log('✅ Did Maya reference 174.1% digital growth specifically?');
    console.log('✅ Did Maya use 88% brand recognition metric?');
    console.log('✅ Did Maya mention Lumachain AI investment specifically?');
    console.log('✅ Did Maya use 8M → 40M loyalty growth data?');
    console.log('✅ Did Maya incorporate RFID technology details?');
    
    console.log('\n🎯 DIAGNOSIS:');
    console.log('   If Maya uses specific numbers → Tool access works, prompt needs improvement');
    console.log('   If Maya stays general → Structural tool/data access issue');
    console.log('   If Maya can\'t load David\'s data → Layer 2 problem to fix');
    
  } catch (error) {
    console.error('❌ Maya-David integration test failed:', error);
  }
}

// Run the integration test
testMayaDavidIntegration();

import { mayaPatel } from './mastra/agents/maya-patel';
import { QSR_RESOURCE_ID, generatePostThreadId } from './mastra/config/qsr-memory';

async function testMayaDavidIntegration() {
  console.log('🔍 Testing Maya\'s David Data Integration Issue...\n');
  
  const testRunId = "brutal-1764580023741";
  const threadId = generatePostThreadId();
  
  try {
    console.log('🎯 TESTING: Can Maya access and use David\'s specific findings?');
    console.log('📊 David provided:');
    console.log('   - 174.1% digital sales growth (specific number)');
    console.log('   - 88% brand recognition in US (specific metric)');  
    console.log('   - 8M → 40M loyalty members (specific growth)');
    console.log('   - RFID technology implementation (specific system)');
    console.log('   - Lumachain AI investment (specific partnership)');
    console.log('='.repeat(80));

    console.log('\n🧠 Maya\'s Task: Load David\'s research and use SPECIFIC findings in analysis');
    
    const mayaResponse = await mayaPatel.generate([{ 
      role: 'user', 
      content: `Maya, load David's strategic research for runId "${testRunId}" and create an analysis that uses David's SPECIFIC findings, not just high-level themes.

For example, David found:
- 174.1% digital sales growth
- 88% brand recognition  
- 8M → 40M loyalty members
- RFID technology details
- Lumachain AI partnerships

Use these SPECIFIC data points in your economic analysis. Don't just say "digital transformation" - use the actual 174.1% number. Don't just say "strategic partnerships" - mention Lumachain specifically.

Show me you can access and integrate David's detailed findings.` 
    }],
    {
      threadId,
      resourceId: QSR_RESOURCE_ID,
    });
    
    console.log('\n📊 Maya\'s Response:');
    console.log('='.repeat(80));
    console.log(mayaResponse.text);
    console.log('='.repeat(80));
    
    console.log('\n🔍 ANALYSIS QUESTIONS:');
    console.log('✅ Did Maya reference 174.1% digital growth specifically?');
    console.log('✅ Did Maya use 88% brand recognition metric?');
    console.log('✅ Did Maya mention Lumachain AI investment specifically?');
    console.log('✅ Did Maya use 8M → 40M loyalty growth data?');
    console.log('✅ Did Maya incorporate RFID technology details?');
    
    console.log('\n🎯 DIAGNOSIS:');
    console.log('   If Maya uses specific numbers → Tool access works, prompt needs improvement');
    console.log('   If Maya stays general → Structural tool/data access issue');
    console.log('   If Maya can\'t load David\'s data → Layer 2 problem to fix');
    
  } catch (error) {
    console.error('❌ Maya-David integration test failed:', error);
  }
}

// Run the integration test
testMayaDavidIntegration();
