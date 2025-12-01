import 'dotenv/config';
import { mayaPatel } from './mastra/agents/maya-patel';
import { loadResearchDataTool } from './mastra/tools/research-storage-tools';
import { RuntimeContext } from '@mastra/core/runtime-context';

async function testMayaSimplified() {
  console.log('🧪 Testing Simplified Maya Prompt...\n');
  
  const testRunId = "brutal-1764580023741";
  const runtimeContext = new RuntimeContext();
  
  try {
    console.log('🎯 Loading COMPLETE data from JSON file (simulating Marcus)');
    console.log(`📊 RunId: ${testRunId}`);
    
    // Load Alex's complete data from JSON
    console.log('📊 Loading Alex\'s financial metrics...');
    const alexResult = await loadResearchDataTool.execute({
      context: {
        runId: testRunId,
        agentName: "alex",
        dataType: "research"
      },
      runtimeContext
    });
    
    // Load David's complete data from JSON  
    console.log('🔬 Loading David\'s strategic research...');
    const davidResult = await loadResearchDataTool.execute({
      context: {
        runId: testRunId,
        agentName: "david",
        dataType: "research"
      },
      runtimeContext
    });
    
    // Format as Marcus would
    const alexData = Object.entries(alexResult.data || {}).map(([query, result]) => 
      `${query}: ${result}`
    ).join('\n');
    
    const davidData = Object.entries(davidResult.data || {}).map(([topic, research]) => 
      `${topic}:\n${research}`
    ).join('\n\n');
    
    const userPrompt = `Maya, here's your complete research foundation:

ALEX'S FINANCIAL METRICS:
${alexData}

DAVID'S STRATEGIC RESEARCH:
${davidData}

Create an economic analysis synthesizing both datasets.`;

    console.log('\n🔍 COMPLETE USER PROMPT BEING SENT TO MAYA:');
    console.log('='.repeat(100));
    console.log(userPrompt);
    console.log('='.repeat(100));
    
    console.log('\n📊 Calling Maya with new strategic prompt...');
    
    const mayaResponse = await mayaPatel.generate([{ 
      role: 'user', 
      content: userPrompt 
    }]);
    
    console.log('\n📊 Maya\'s Economic Analysis Response:');
    console.log('='.repeat(100));
    console.log(mayaResponse.text);
    console.log('='.repeat(100));
    
  } catch (error) {
    console.error('❌ Maya test failed:', error);
  }
}

// Run simplified test
testMayaSimplified();
