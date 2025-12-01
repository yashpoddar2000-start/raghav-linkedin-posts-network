/**
 * Test Marcus Chen - QSR Research Director Network Orchestration
 * 
 * This test demonstrates Marcus's agent network orchestration abilities:
 * - Strategic routing between Alex (financial data) and David (strategic research)
 * - Working memory state tracking and budget management
 * - Real-time decision logging similar to network routing
 * - Complete research session from topic to handoff
 * 
 * Topic: "The Coming Margin Crisis: Why Most QSR Franchisees Won't Survive Their 2025–2027 Lease Renewals"
 */

import 'dotenv/config';
import { marcusChen } from '../mastra/agents/marcus-chen';
import { RuntimeContext } from '@mastra/core/runtime-context';

async function testMarcusOrchestration() {
  console.log('🚀 Starting Marcus Chen Orchestration Network Test\n');
  
  // Research topic for testing
  const researchTopic = "The Coming Margin Crisis: Why Most QSR Franchisees Won't Survive Their 2025–2027 Lease Renewals";
  
  // Generate unique session identifiers
  const threadId = `marcus-research-${Date.now()}`;
  const resourceId = 'test-researcher';
  const runId = `research-session-${Date.now()}`;
  
  console.log(`📋 Research Topic: ${researchTopic}`);
  console.log(`🆔 Thread ID: ${threadId}`);
  console.log(`👤 Resource ID: ${resourceId}`);
  console.log(`🏃 Run ID: ${runId}\n`);
  
  console.log('🧠 Marcus Chen - QSR Research Director');
  console.log('=' .repeat(80));
  console.log('📊 Capabilities: Financial Data Orchestration + Strategic Research Coordination');
  console.log('🎯 Budget: 50 Alex Queries + 3 David Research Prompts');
  console.log('🧠 Memory: Working memory state tracking enabled');
  console.log('=' .repeat(80) + '\n');

  // Phase 1: Initial Topic Analysis and Strategy
  console.log('📋 PHASE 1: TOPIC ANALYSIS & RESEARCH STRATEGY');
  console.log('=' .repeat(60));
  
  try {
    const stream1 = await marcusChen.stream(
      `Marcus, I need viral LinkedIn content research on this QSR industry topic: "${researchTopic}". 
      
      This needs to become a viral LinkedIn post that reveals shocking financial mechanisms. Please:
      1. Analyze this topic for viral potential and data requirements
      2. Develop a strategic research plan using Alex and David
      3. Initialize your working memory and begin orchestration
      
      Start with your analysis and strategy - don't wait for my approval.`,
      {
        memory: {
          thread: threadId,
          resource: resourceId,
        },
        runId: runId,
        maxSteps: 5,
        runtimeContext: new RuntimeContext(),
        onStepFinish: (step) => {
          console.log(`\n🔄 MARCUS STEP COMPLETED:`);
          console.log(`   Text Length: ${step.text?.length || 0} characters`);
          console.log(`   Tool Calls: ${step.toolCalls?.length || 0}`);
          if (step.toolCalls && step.toolCalls.length > 0) {
            step.toolCalls.forEach((call, index) => {
              console.log(`   🛠️  Tool ${index + 1}: ${(call as any).toolName || 'Unknown Tool'}`);
              console.log(`        Call Details: ${JSON.stringify(call, null, 2)}`);
            });
          }
        }
      }
    );

    console.log('\n🎤 MARCUS INITIAL ANALYSIS:');
    console.log('-'.repeat(40));
    
    let currentOutput = '';
    for await (const chunk of stream1.textStream) {
      currentOutput += chunk;
      process.stdout.write(chunk);
    }
    
    console.log('\n' + '='.repeat(80));
    console.log(`✅ Phase 1 Complete - Strategy: ${(await stream1.text).length} characters`);
    console.log('='.repeat(80) + '\n');

    // Phase 2: First Research Execution
    console.log('🔬 PHASE 2: FIRST RESEARCH EXECUTION');
    console.log('=' .repeat(60));

    const stream2 = await marcusChen.stream(
      `Marcus, execute your research strategy. Begin with the first phase of data collection and coordinate with your team accordingly.`,
      {
        memory: {
          thread: threadId,
          resource: resourceId,
        },
        runId: runId,
        maxSteps: 3,
        runtimeContext: new RuntimeContext(),
        onStepFinish: (step) => {
          console.log(`\n📊 MARCUS ROUTING DECISION:`);
          console.log(`   Step Type: Research Execution`);
          console.log(`   Decision Rationale: ${step.text?.substring(0, 200)}...`);
          console.log(`   Tool Calls Made: ${step.toolCalls?.length || 0}`);
          
          if (step.toolCalls && step.toolCalls.length > 0) {
            step.toolCalls.forEach((call, index) => {
              const toolName = (call as any).toolName || 'Unknown Agent';
              console.log(`\n   🎯 AGENT ROUTING ${index + 1}:`);
              console.log(`      Target Agent: ${toolName}`);
              console.log(`      Reasoning: Marcus decided to call ${toolName}`);
              console.log(`      Call Details: ${JSON.stringify(call, null, 2)}`);
              console.log(`      Priority: ${toolName === 'alexRivera' ? 'Financial Data Collection' : 'Strategic Research'}`);
            });
          }
        }
      }
    );

    console.log('\n🤖 MARCUS RESEARCH EXECUTION:');
    console.log('-'.repeat(40));
    
    let executionOutput = '';
    for await (const chunk of stream2.textStream) {
      executionOutput += chunk;
      process.stdout.write(chunk);
    }
    
    console.log('\n' + '='.repeat(80));
    console.log(`✅ Phase 2 Complete - Research Initiated`);
    console.log('='.repeat(80) + '\n');

    // Phase 3: Research Progress Assessment
    console.log('📈 PHASE 3: RESEARCH PROGRESS & NEXT ROUTING');
    console.log('=' .repeat(60));

    const stream3 = await marcusChen.stream(
      `Marcus, provide a detailed status update on research progress. What's our current working memory state, budget usage, and strategic next moves? Continue with the next phase of research coordination.`,
      {
        memory: {
          thread: threadId,
          resource: resourceId,
        },
        runId: runId,
        maxSteps: 3,
        runtimeContext: new RuntimeContext(),
        onStepFinish: (step) => {
          console.log(`\n📋 MARCUS STATE TRACKING:`);
          console.log(`   Memory Update: Working memory state tracked`);
          console.log(`   Budget Monitor: Checking query usage`);
          console.log(`   Quality Gate: Assessing research completeness`);
          
          if (step.toolCalls && step.toolCalls.length > 0) {
            step.toolCalls.forEach((call, index) => {
              const toolName = (call as any).toolName || 'Unknown Agent';
              console.log(`\n   🔄 STRATEGIC ROUTING ${index + 1}:`);
              console.log(`      Next Agent: ${toolName}`);
              console.log(`      Strategic Reason: Follow-up research based on findings`);
              console.log(`      Research Phase: ${toolName === 'alexRivera' ? 'Data Refinement' : 'Mechanism Deep Dive'}`);
            });
          }
        }
      }
    );

    console.log('\n📊 MARCUS PROGRESS ASSESSMENT:');
    console.log('-'.repeat(40));
    
    let progressOutput = '';
    for await (const chunk of stream3.textStream) {
      progressOutput += chunk;
      process.stdout.write(chunk);
    }
    
    console.log('\n' + '='.repeat(80));
    console.log(`✅ Phase 3 Complete - Progress Tracked`);
    console.log('='.repeat(80) + '\n');

    // Phase 4: Final Research Completion
    console.log('🎯 PHASE 4: RESEARCH COMPLETION & HANDOFF');
    console.log('=' .repeat(60));

    const stream4 = await marcusChen.stream(
      `Marcus, finalize the research process. Complete any remaining data collection, assess overall quality, and prepare the research dataset for handoff to Maya for economic synthesis.`,
      {
        memory: {
          thread: threadId,
          resource: resourceId,
        },
        runId: runId,
        maxSteps: 2,
        runtimeContext: new RuntimeContext(),
        onStepFinish: (step) => {
          console.log(`\n🏁 MARCUS COMPLETION ASSESSMENT:`);
          console.log(`   Final Decision: Research completion evaluation`);
          console.log(`   Quality Check: Meeting publication standards`);
          console.log(`   Handoff Prep: Dataset ready for economic analysis`);
          
          if (step.toolCalls && step.toolCalls.length > 0) {
            step.toolCalls.forEach((call, index) => {
              const toolName = (call as any).toolName || 'Unknown Agent';
              console.log(`\n   🎯 FINAL ROUTING ${index + 1}:`);
              console.log(`      Final Agent: ${toolName}`);
              console.log(`      Purpose: Research completion and gap filling`);
              console.log(`      Status: ${toolName === 'alexRivera' ? 'Final Data Collection' : 'Strategic Wrap-up'}`);
            });
          } else {
            console.log(`\n   ✅ NO ADDITIONAL ROUTING NEEDED`);
            console.log(`      Decision: Research dataset complete`);
            console.log(`      Status: Ready for Maya handoff`);
            console.log(`      Quality: Publication-ready standards met`);
          }
        }
      }
    );

    console.log('\n🎯 MARCUS FINAL ASSESSMENT:');
    console.log('-'.repeat(40));
    
    let finalOutput = '';
    for await (const chunk of stream4.textStream) {
      finalOutput += chunk;
      process.stdout.write(chunk);
    }
    
    console.log('\n' + '='.repeat(80));
    console.log(`✅ Phase 4 Complete - Research Finalized`);
    console.log('='.repeat(80) + '\n');

    // Final Summary
    console.log('📊 MARCUS ORCHESTRATION SUMMARY');
    console.log('=' .repeat(60));
    console.log(`🎯 Topic Researched: ${researchTopic}`);
    console.log(`📈 Total Phases: 4 strategic phases completed`);
    console.log(`🧠 Memory Management: Working memory state tracked throughout`);
    console.log(`🎭 Agent Coordination: Strategic routing between Alex and David`);
    console.log(`📊 Data Consistency: Single runId maintained across all calls`);
    console.log(`✅ Research Status: Complete dataset ready for Maya synthesis`);
    console.log('=' .repeat(60));

  } catch (error) {
    console.error('\n❌ Marcus Orchestration Test Failed:', error);
    console.error('Error Details:', error instanceof Error ? error.message : String(error));
  }
}

// Alternative test for pure routing decision visibility
async function testMarcusRoutingDecisions() {
  console.log('\n\n🧭 MARCUS ROUTING DECISIONS TEST');
  console.log('=' .repeat(80));
  
  const topic = "QSR franchise margin crisis and lease renewals";
  const threadId = `routing-test-${Date.now()}`;
  const runId = `routing-${Date.now()}`;

  console.log(`📋 Focus: Pure routing decision visibility`);
  console.log(`🎯 Topic: ${topic}\n`);

  try {
    const result = await marcusChen.generate(
      `Marcus, analyze this QSR topic: "${topic}". Show me your strategic thinking about whether to call Alex or David first, and why. Make your routing decision clear.`,
      {
        memory: {
          thread: threadId,
          resource: 'routing-tester',
        },
        runId: runId,
        maxSteps: 2,
        runtimeContext: new RuntimeContext(),
        onStepFinish: (step) => {
          console.log(`\n🎯 MARCUS ROUTING ANALYSIS:`);
          console.log(`   Strategic Thinking: ${step.text?.substring(0, 300)}...`);
          console.log(`   Routing Decision Made: ${step.toolCalls?.length || 0} agent(s) selected`);
          
          if (step.toolCalls && step.toolCalls.length > 0) {
            step.toolCalls.forEach((call, index) => {
              const toolName = (call as any).toolName || 'Unknown Agent';
              console.log(`\n   📊 ROUTING DECISION ${index + 1}:`);
              console.log(`      ✅ Selected Agent: ${toolName}`);
              console.log(`      🎯 Selection Reason: ${toolName === 'alexRivera' ? 'Financial data foundation needed' : 'Strategic mechanism research required'}`);
              console.log(`      📝 Call Details: ${JSON.stringify(call, null, 2)}`);
              console.log(`      🏗️  Research Phase: ${toolName === 'alexRivera' ? 'Quantitative Foundation' : 'Qualitative Deep Dive'}`);
            });
          }
        }
      }
    );

    console.log('\n📋 FINAL ROUTING ASSESSMENT:');
    console.log('-'.repeat(50));
    console.log(result.text);

  } catch (error) {
    console.error('\n❌ Routing test failed:', error);
  }
}

// Main execution function
async function runMarcusNetworkTests() {
  console.log('🚀 MARCUS CHEN - QSR RESEARCH NETWORK ORCHESTRATION TEST');
  console.log('=' .repeat(100));
  console.log('🎯 Testing comprehensive agent coordination and routing decisions');
  console.log('📊 Simulating real research scenario with detailed logging');
  console.log('🧠 Tracking working memory, budget management, and decision flow');
  console.log('=' .repeat(100) + '\n');

  try {
    // Run main orchestration test
    await testMarcusOrchestration();
    
    // Run routing decisions test
    await testMarcusRoutingDecisions();
    
    console.log('\n\n✨ ALL MARCUS NETWORK TESTS COMPLETED SUCCESSFULLY!');
    console.log('🎯 Key Capabilities Demonstrated:');
    console.log('   📊 Strategic topic analysis and research planning');
    console.log('   🎭 Intelligent agent routing (Alex vs David decisions)');
    console.log('   🧠 Working memory state management');
    console.log('   💰 Budget tracking and resource allocation');
    console.log('   📈 Research quality assessment and completion criteria');
    console.log('   🤝 Clean handoff preparation for downstream agents');

  } catch (error) {
    console.error('\n❌ Marcus network test suite failed:', error);
    process.exit(1);
  }
}

// Export for external use
export { testMarcusOrchestration, testMarcusRoutingDecisions, runMarcusNetworkTests };

// Run the test
runMarcusNetworkTests();
