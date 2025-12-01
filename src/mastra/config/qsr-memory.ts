import { Memory } from '@mastra/memory';
import { LibSQLStore, LibSQLVector } from '@mastra/libsql';
import { openai } from '@ai-sdk/openai';

/**
 * SHARED MEMORY ARCHITECTURE for QSR Research Network
 * 
 * ONE shared memory instance for all agents to enable seamless communication:
 * - Alex's data → visible to Maya for synthesis
 * - David's research → visible to Maya for synthesis  
 * - Maya's insights → visible to Marcus for writing
 * - Marcus's content → visible to James for evaluation
 * 
 * COST OPTIMIZED: lastMessages: 20 (reduced from 100 for 50% cost savings)
 * Only Marcus has working memory enabled for research state tracking
 * All other agents communicate via shared conversation history
 * 
 * Resource Model:
 * - resourceId: "raghav" (ONE user, all posts)
 * - threadId: unique per post generation (e.g., "post-1234567890")
 */

/**
 * SINGLE SHARED MEMORY for All QSR Network Agents
 * Enables agent-to-agent communication through conversation history
 */
export const qsrSharedMemory = new Memory({
  storage: new LibSQLStore({
    url: 'file:./qsr-network.db',
  }),
  vector: new LibSQLVector({
    connectionUrl: 'file:./qsr-network.db',
  }),
  embedder: openai.embedding('text-embedding-3-small'),
  options: {
    // Optimized for cost efficiency while maintaining agent communication
    lastMessages: 20,  // Essential recent context only (50% cost reduction)
    
    // Cost-efficient semantic recall for research coordination
    semanticRecall: {
      topK: 5,           // Retrieve 5 most relevant messages (reduced from 10)
      messageRange: 2,   // Include 2 messages before/after for context (reduced from 5)
      scope: 'thread',   // Search within current post generation only
    },
    
    // Working memory ONLY for Marcus (research state tracking)
    // Other agents communicate via conversation history only
    workingMemory: {
      enabled: true,
      scope: 'thread', // Each research project gets dedicated working memory
      template: `# QSR Research Project Orchestration

## Topic & Research Strategy
- QSR Topic:
- Research Phase: [Data/Mechanism/Economics/Writing/Evaluation]
- Viral Potential Assessment: [0.0-1.0]
- Content Strategy: [Comparative/Forensic/Economic/Contrarian]

## Resource Budget Intelligence
- Alex Queries Used: 0/50 [efficiency score]
- David Prompts Used: 0/3 [angle coverage]
- Maya Analysis Status: [Pending/Completed]
- James Iteration Count: 0 [quality progression]

## Research Quality Gates
- Data Foundation Strength: [0.0-1.0]
- Mechanism Clarity Level: [0.0-1.0]
- Economic Insights Quality: [0.0-1.0]
- Voice Consistency Confidence: [0.0-1.0]

## Strategic Decision Making
- Current Information Gaps:
- Next Planned Action:
- Last Decision Rationale:
- Research Foundation Status: [Building/Ready/Complete]

## Agent Coordination Intelligence
- Alex: Last called for [purpose] → [outcome assessment]
- David: Angles explored [list] → [effectiveness rating]
- Maya: Framework applied [theory] → [insights quality]
- James: Feedback received [summary] → [action taken]

## Writing & Quality Management
- Content Readiness: [Research/Draft/Review/Final]
- Raghav Voice Alignment: [0.0-1.0]
- 80-20 Principle Applied: [Research Quality/Presentation]
- Iteration Strategy: [More Research/Refine Writing/Voice Adjustment]`,
    },
  },
});

/**
 * Resource ID constant for all QSR network operations
 * Single user (Raghav) across all post generations
 */
export const QSR_RESOURCE_ID = 'raghav';

/**
 * Helper to generate unique thread IDs for each post
 */
export function generatePostThreadId(): string {
  return `post-${Date.now()}`;
}

