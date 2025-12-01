/**
 * Test cleaned Alex and David agents
 * 
 * Verify they work correctly with only their core tools:
 * - Alex: Only exaAnswerTool (no storage)
 * - David: Only exaDeepResearchTool (no storage)
 */

import 'dotenv/config';
import { alexRivera } from './mastra/agents/alex-rivera';
import { davidPark } from './mastra/agents/david-park';

async function testCleanedAgents() {
  console.log('🧪 Testing Cleaned Alex and David Agents\n');

  // Test Alex (Financial Data Specialist) - Only Exa Answer Tool
  console.log('📊 Testing Alex Rivera - Financial Data Specialist');
  console.log('=' .repeat(60));
  
  try {
    const alexResult = await alexRivera.generate(
      'Alex, get me 5 key financial metrics for Chipotle in 2024: revenue, profit per store, operating margin, store count, and market cap. Use precise queries for each metric.',
      {
        maxSteps: 5,
        toolChoice: 'required'
      }
    );

    console.log('✅ Alex Response:');
    console.log(alexResult.text);
    console.log(`\n📊 Tool Calls Made: ${alexResult.toolCalls?.length || 0}`);
    
  } catch (error) {
    console.error('❌ Alex test failed:', error);
  }

  console.log('\n' + '='.repeat(80) + '\n');

  // Test David (Strategic Research Specialist) - Only Exa Deep Research Tool  
  console.log('🔬 Testing David Park - Strategic Research Specialist');
  console.log('=' .repeat(60));
  
  try {
    const davidResult = await davidPark.generate(
      'David, research Chipotle\'s strategic rationale for remaining company-owned instead of franchising. Focus on management quotes and operational control mechanisms.',
      {
        maxSteps: 3,
        toolChoice: 'required'
      }
    );

    console.log('✅ David Response:');
    console.log(davidResult.text);
    console.log(`\n🔬 Tool Calls Made: ${davidResult.toolCalls?.length || 0}`);
    
  } catch (error) {
    console.error('❌ David test failed:', error);
  }

  console.log('\n✨ Agent cleaning test completed!');
  console.log('🎯 Both agents now ready for workflow integration');
}

// Run test 
testCleanedAgents();

export { testCleanedAgents };
