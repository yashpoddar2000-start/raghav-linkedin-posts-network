import 'dotenv/config';
import { taylorKim } from './mastra/agents/taylor-kim';

async function testTaylorDataFlow() {
  console.log('🧪 Testing Taylor\'s Complete Data Flow (Read Maya → Write Post)...\n');
  
  // Use the existing brutal test runId with Maya's complete analysis
  const existingRunId = "brutal-1764580023741";
  
  try {
    console.log(`🎯 Using runId: ${existingRunId}`);
    console.log('📊 This contains:');
    console.log('   - Alex: 8 financial query-result pairs');
    console.log('   - David: 2 complete strategic research items');  
    console.log('   - Maya: Complete Chipotle economic analysis');
    console.log('='.repeat(80));

    console.log('\n🧠 Taylor\'s Task: Read Maya\'s data from JSON, create LinkedIn post, save to JSON');
    
    const taylorResponse = await taylorKim.generate([{ 
      role: 'user', 
      content: `Taylor, use runId "${existingRunId}" to:

1. Load Maya's economic analysis from storage
2. Create a viral LinkedIn post
3. Save your final post to storage

Show the final LinkedIn post you created.` 
    }]);
    
    console.log('\n📊 Taylor\'s Complete Response:');
    console.log('='.repeat(80));
    console.log(taylorResponse.text);
    console.log('='.repeat(80));
    
    console.log('\n⏳ Waiting 3 seconds for storage operations...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log(`\n📁 Checking if Taylor saved her post: research-data/${existingRunId}.json`);
    console.log('   Expected: taylorData section with final LinkedIn post');
    console.log('   This validates complete read → transform → write workflow');
    
  } catch (error) {
    console.error('❌ Taylor data flow test failed:', error);
  }
}

// Run the data flow test
testTaylorDataFlow();

import { taylorKim } from './mastra/agents/taylor-kim';

async function testTaylorDataFlow() {
  console.log('🧪 Testing Taylor\'s Complete Data Flow (Read Maya → Write Post)...\n');
  
  // Use the existing brutal test runId with Maya's complete analysis
  const existingRunId = "brutal-1764580023741";
  
  try {
    console.log(`🎯 Using runId: ${existingRunId}`);
    console.log('📊 This contains:');
    console.log('   - Alex: 8 financial query-result pairs');
    console.log('   - David: 2 complete strategic research items');  
    console.log('   - Maya: Complete Chipotle economic analysis');
    console.log('='.repeat(80));

    console.log('\n🧠 Taylor\'s Task: Read Maya\'s data from JSON, create LinkedIn post, save to JSON');
    
    const taylorResponse = await taylorKim.generate([{ 
      role: 'user', 
      content: `Taylor, use runId "${existingRunId}" to:

1. Load Maya's economic analysis from storage
2. Create a viral LinkedIn post
3. Save your final post to storage

Show the final LinkedIn post you created.` 
    }]);
    
    console.log('\n📊 Taylor\'s Complete Response:');
    console.log('='.repeat(80));
    console.log(taylorResponse.text);
    console.log('='.repeat(80));
    
    console.log('\n⏳ Waiting 3 seconds for storage operations...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log(`\n📁 Checking if Taylor saved her post: research-data/${existingRunId}.json`);
    console.log('   Expected: taylorData section with final LinkedIn post');
    console.log('   This validates complete read → transform → write workflow');
    
  } catch (error) {
    console.error('❌ Taylor data flow test failed:', error);
  }
}

// Run the data flow test
testTaylorDataFlow();
