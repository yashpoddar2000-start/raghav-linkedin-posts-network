/**
 * PHASE 1: RESEARCH WORKFLOW (PROMPT-ONLY)
 * 
 * 3-round progressive research using Charlie Munger's mental models approach
 * 
 * Purpose: Test and optimize prompts before running expensive Exa API calls
 * 
 * Flow:
 * Round 0: Marcus analyzes topic → chooses 1st perspective
 * Round 1: Marcus guides → Alex (15 queries) + David (1 prompt) for Perspective 1
 * Round 2: Marcus reviews → chooses 2nd perspective → Alex + David for Perspective 2
 * Round 3: Marcus reviews → chooses 3rd perspective → Alex + David for Perspective 3
 * 
 * Output: 3 different mental model perspectives, NOT 3x more data
 */

import { createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { researchRoundPromptOnlyStep } from '../steps/prompt-only';

const roundDataSchema = z.object({
  perspective: z.string(),
  alexQueries: z.string(),
  davidPrompt: z.string(),
  queryCount: z.number(),
});

export const researchPhase1PromptOnly = createWorkflow({
  id: 'research-phase1-prompt-only',
  description: 'Phase 1 Research (PROMPT-ONLY) - 3 mental model perspectives using Charlie Munger approach',
  
  inputSchema: z.object({
    topic: z.string(),
  }),
  
  outputSchema: z.object({
    topic: z.string(),
    rounds: z.array(roundDataSchema),
    summary: z.string(),
  }),
})
  // Initialize round state with unique threadId for this research session
  .map(async ({ inputData }) => {
    const threadId = `prompt-research-${inputData.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
    const resourceId = 'qsr-research';
    
    return {
      topic: inputData.topic,
      threadId,
      resourceId,
      round: 1,
      rounds: [] as { perspective: string; alexQueries: string; davidPrompt: string; queryCount: number }[],
    };
  })
  
  // Loop until round > 3 (3 rounds total, 3 different perspectives)
  .dountil(
    researchRoundPromptOnlyStep,
    async ({ inputData }) => inputData.round > 3
  )
  
  // Format final output
  .map(async ({ inputData }) => {
    const { topic, rounds } = inputData;
    
    // Create summary
    const totalQueries = rounds.reduce((sum, r) => sum + r.queryCount, 0);
    const perspectives = rounds.map(r => r.perspective);
    
    let summary = `MULTI-PERSPECTIVE RESEARCH RESULTS (Charlie Munger Approach)\n\n`;
    summary += `Topic: ${topic}\n`;
    summary += `Total Queries Generated: ${totalQueries}\n`;
    summary += `Total Deep Research Prompts: ${rounds.length}\n`;
    summary += `Perspectives Explored: ${perspectives.join(' → ')}\n\n`;
    
    rounds.forEach((round, index) => {
      summary += `\n${'='.repeat(70)}\n`;
      summary += `ROUND ${index + 1}: ${round.perspective.toUpperCase()}\n`;
      summary += `${'='.repeat(70)}\n\n`;
      summary += `ALEX'S QUERIES (${round.queryCount}):\n${round.alexQueries}\n\n`;
      summary += `DAVID'S PROMPT (${round.davidPrompt.length} chars):\n"${round.davidPrompt}"\n`;
    });
    
    summary += `\n${'='.repeat(70)}\n`;
    summary += `NEXT STEPS\n`;
    summary += `${'='.repeat(70)}\n`;
    summary += `1. Review the 3 perspectives above\n`;
    summary += `2. Taylor (writer) can pick the BEST angle for a focused post\n`;
    summary += `3. If James (evaluator) says "try different angle", alternatives exist\n`;
    summary += `4. Each perspective provides options, not more data to summarize\n`;
    
    return {
      topic,
      rounds,
      summary,
    };
  })
  
  .commit();
