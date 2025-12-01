import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';
import { Memory } from '@mastra/memory';
import { LibSQLStore, LibSQLVector } from '@mastra/libsql';

// Shared memory storage for all agents with configured recall
const sharedMemory = new Memory({
  storage: new LibSQLStore({
    url: 'file:./network.db',
  }),
  vector: new LibSQLVector({
    connectionUrl: 'file:./network.db',
  }),
  embedder: openai.embedding('text-embedding-3-small'), // Use OpenAI for embeddings
  options: {
    lastMessages: 100, // Keep ALL messages in thread (each report is a new thread)
    semanticRecall: {
      topK: 10, // Recall more relevant past messages for better context
      messageRange: 5, // Include more surrounding context
    },
  },
});

// Research Agent - gathers information
const researchAgent = new Agent({
  name: 'research-agent',
  description: 'Gathers comprehensive research on topics',
  instructions: 'You are a research agent. Gather detailed information on the topic and provide key findings in bullet points.',
  model: openai('gpt-4o'),
  memory: sharedMemory,
});

// Writing Agent - writes the report
const writingAgent = new Agent({
  name: 'writing-agent',
  description: 'Writes well-structured reports based on research',
  instructions: `You are a writing agent. Take research findings from conversation history and write a clear, well-structured report with full paragraphs.

DATA USAGE RULES:
- USE specific numbers, percentages, and data ONLY if they appear in the research findings
- If research says "6% royalty fee", write "approximately 6% of gross sales" ✅
- If research says "$1.2M to $1.5M per store", include that exact range ✅
- NEVER invent numbers that aren't in the research ❌
- If research gives qualitative descriptions only ("consistent growth"), use those words ✅
- When specific data IS provided, you MUST include it in your report to make it credible`,
  model: openai('gpt-4o'),
  memory: sharedMemory,
});

// Critic Agent - gives feedback on first draft, approves improved drafts
const criticAgent = new Agent({
  name: 'critic-agent',
  description: 'Evaluates report quality and provides specific feedback for improvement',
  instructions: `You are a critic agent that helps improve reports.

FORMAT YOUR RESPONSE AS:

**MY THINKING:**
[Explain your thought process - what you're looking for, what you noticed, how you're evaluating]

**MY FEEDBACK:**
[Your actual feedback or approval]

---

ON FIRST REVIEW of a new topic: Provide 2-3 specific, actionable suggestions for improvement.

ON SUBSEQUENT REVIEWS: If the report shows improvement and includes:
- Concrete examples or statistics
- Multiple well-developed sections  
- Clear structure and flow

Then respond with "APPROVED"

Be lenient on subsequent reviews - if you see the report has been improved based on feedback, approve it.`,
  model: openai('o1'), // Using o1 to expose reasoning tokens
  memory: sharedMemory,
});

// Routing Agent - coordinates the network
export const routingAgent = new Agent({
  name: 'routing-agent',
  instructions: `You are an orchestrator coordinating a team of agents to create high-quality reports through iteration.

YOUR ROLE: Decide WHICH agent to call next and provide clear TASK instructions.

PROCESS:
1. Call research-agent: "Research [topic]"
2. Call writing-agent: "Write a comprehensive report"
3. Call critic-agent: "Review the report and provide feedback"
4. If feedback received → Call research-agent: "Gather additional information based on critic's suggestions"
5. Call writing-agent: "Write an improved report"
6. Call critic-agent: "Review the improved report"
7. Repeat until critic says "APPROVED"

IMPORTANT:
- All agents share conversation memory and can see previous outputs automatically
- Your job is to orchestrate WHO goes next, not to manage data transfer
- Agents will use memory to access research, reports, and feedback
- Keep your prompts focused on the TASK, not data copying
- Only mark isComplete: true when critic approves`,
  model: openai('gpt-4o'),
  agents: {
    researchAgent,
    writingAgent,
    criticAgent,
  },
  memory: sharedMemory,
});

