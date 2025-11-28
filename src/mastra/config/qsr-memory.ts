import { Memory } from '@mastra/memory';
import { LibSQLStore, LibSQLVector } from '@mastra/libsql';
import { openai } from '@ai-sdk/openai';

/**
 * Shared Memory Configuration for QSR Research Network
 * 
 * All agents in the network share this memory instance to enable:
 * - Conversation history across the research process
 * - Semantic recall for finding relevant past insights
 * - Iteration loops (critic feedback → research → write → repeat)
 * 
 * Resource Model:
 * - resourceId: "raghav" (ONE user, all posts)
 * - threadId: unique per post generation (e.g., "post-1234567890")
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
    // Keep full conversation in each thread (research → write → critique → iterate)
    lastMessages: 100,
    
    // Enable semantic recall for finding relevant insights
    semanticRecall: {
      topK: 10,          // Retrieve 10 most relevant messages
      messageRange: 5,   // Include 5 messages before/after for context
      scope: 'thread',   // Search within current post generation only
    },
    
    // No working memory needed (not tracking user profiles)
    workingMemory: {
      enabled: false,
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

