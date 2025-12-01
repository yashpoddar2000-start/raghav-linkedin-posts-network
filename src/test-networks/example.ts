import 'dotenv/config';
import { mastra } from './mastra';

async function main() {
  const agent = mastra.getAgent('routingAgent');

  if (!agent) {
    throw new Error('Routing agent not found');
  }

  console.log('🚀 Starting report generation network...\n');

  // Use the network method to coordinate agents
  // Set maxSteps to allow for 2 iterations (research + write + critique = 3, times 2 = 6 agents, plus routing)
  const threadId = `report-${Date.now()}`; // Unique thread for this report
  const resourceId = 'report-generator'; // Resource identifier
  
  console.log(`📝 Using threadId: ${threadId}`);
  console.log(`🆔 Using resourceId: ${resourceId}\n`);
  
  const result = await agent.network(
    'Write a comprehensive report about wingstops royalty revenue',
    { 
      maxSteps: 10,
      memory: {
        thread: threadId,
        resource: resourceId,
      }
    }
  );

  console.log('\n\n✅ Processing network execution:\n');

  let agentExecutionCount = 0;
  let currentAgentOutput = '';

  for await (const chunk of result) {
    // Log ALL chunk types to see if reasoning comes through
    if (chunk.type.includes('reasoning')) {
      console.log(`\n🧠 REASONING CHUNK TYPE: ${chunk.type}`);
      console.log(JSON.stringify(chunk, null, 2));
    }
    
    if (chunk.type === 'routing-agent-end') {
      // Show routing decision
      const payload = chunk.payload;
      console.log(`\n🎯 ROUTING DECISION:`);
      console.log(`   Selected: ${payload.primitiveId} (${payload.primitiveType})`);
      console.log(`   Reason: ${payload.selectionReason}`);
      console.log(`   Prompt: ${payload.prompt}`);
      console.log(`   Is Complete: ${payload.isComplete}`);
    } else if (chunk.type === 'agent-execution-start') {
      agentExecutionCount++;
      currentAgentOutput = '';
      console.log(`\n${'='.repeat(80)}`);
      console.log(`🤖 AGENT #${agentExecutionCount}: ${chunk.payload.agentId}`);
      console.log(`${'='.repeat(80)}`);
    } else if (chunk.type === 'agent-execution-event-text-delta') {
      // Extract text from nested payload
      if ('payload' in chunk && chunk.payload && 'payload' in chunk.payload) {
        const text = (chunk.payload.payload as any)?.text;
        if (text) {
          currentAgentOutput += text;
          process.stdout.write(text);
        }
      }
    } else if (chunk.type === 'agent-execution-end') {
      console.log(`\n${'='.repeat(80)}`);
      console.log(`✅ Agent completed\n`);
    }
  }

  console.log('\n\n✨ Network execution complete!');
  console.log(`Total agent executions: ${agentExecutionCount}`);
}

main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});

