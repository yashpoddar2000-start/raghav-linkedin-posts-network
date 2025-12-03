import { Memory } from '@mastra/memory';
import { LibSQLStore, LibSQLVector } from '@mastra/libsql';
import { openai } from '@ai-sdk/openai';

/**
 * MEMORY CONFIGURATION for QSR Research Agents
 * 
 * Purpose: Prevent duplicate queries/prompts across research rounds
 * 
 * - Alex & David: Memory to avoid duplicates (semantic recall + lastMessages)
 * - Marcus: Working memory for research state tracking (not needed in prompt-only mode)
 * - Maya, Taylor, James: Shared memory for agent coordination
 * 
 * Resource Model:
 * - resourceId: "qsr-research" (shared across all research sessions)
 * - threadId: unique per research session (e.g., "research-1234567890")
 */

/**
 * Memory for Alex & David (Prompt Generation Only)
 * 
 * Configured to help them avoid generating duplicate queries/prompts:
 * - lastMessages: 15 (recent queries/prompts from this session)
 * - semanticRecall: Enabled to find similar past queries/prompts
 * - NO working memory needed (they just generate prompts)
 */
export const alexDavidMemory = new Memory({
  storage: new LibSQLStore({
    url: 'file:./qsr-network.db',
  }),
  vector: new LibSQLVector({
    connectionUrl: 'file:./qsr-network.db',
  }),
  embedder: openai.embedding('text-embedding-3-small'),
  options: {
    // Recent queries/prompts from this research session (cost-optimized)
    lastMessages: 15,
    
    // Find semantically similar past queries/prompts to avoid duplicates
    semanticRecall: {
      topK: 10,          // Check top 10 most similar past queries/prompts
      messageRange: 1,   // Include 1 message before/after for context
      scope: 'thread',   // Search within current research session only
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

