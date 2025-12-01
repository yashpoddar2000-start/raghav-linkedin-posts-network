/**
 * Test Alex Rivera Only - Debug Output
 * 
 * Test only Alex to see what he's outputting and why queries might be repeating
 */

import 'dotenv/config';
import { alexRivera } from './mastra/agents/alex-rivera';

async function testAlexOnly() {
  console.log('🧪 TESTING ALEX RIVERA ONLY - DEBUG OUTPUT');
  console.log('=' .repeat(80));
  console.log('🎯 Goal: See exactly what Alex outputs and tool calls');
  console.log('📊 Focus: Debug the query repetition issue');
  console.log('=' .repeat(80) + '\n');

  const topic = "The Coming Margin Crisis: Why Most QSR Franchisees Won't Survive Their 2025–2027 Lease Renewals";

  console.log(`📋 Topic: ${topic}\n`);

  try {
    console.log('🚀 Calling Alex Rivera...\n');
    
    const alexResult = await alexRivera.generate(
      `Alex, conduct financial research for viral LinkedIn content on: "${topic}"

Generate and execute 10 strategic queries in ONE bulk research call. Use your QSR expertise to identify the most valuable financial data for this topic. Focus on finding shocking numbers, surprising contrasts, and compelling financial patterns that could become viral content.`,
      { 
        maxSteps: 1,
        toolChoice: 'required'
      }
    );

    console.log('\n' + '='.repeat(80));
    console.log('📊 EVERYTHING ALEX RETURNED');
    console.log('=' .repeat(80));
    
    // Print EVERYTHING Alex returns - no filtering
    console.log('📋 FULL ALEX RESULT OBJECT:');
    console.log(JSON.stringify(alexResult, null, 2));
    
    console.log('\n📝 RAW TEXT OUTPUT:');
    console.log('-'.repeat(60));
    console.log(alexResult.text || '[NO TEXT OUTPUT]');
    
    console.log('\n📊 RAW OBJECT OUTPUT:');
    console.log('-'.repeat(60));
    console.log(alexResult.object || '[NO OBJECT OUTPUT]');

  } catch (error) {
    console.error('\n❌ Alex test failed:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
  }

  console.log('\n' + '='.repeat(80));
  console.log('✅ ALEX DEBUG TEST COMPLETED');
  console.log('🎯 Use this output to understand the repetition issue');
  console.log('=' .repeat(80));
}

// Run test
testAlexOnly();

export { testAlexOnly };
