/**
 * Write-Evaluate Step
 * 
 * Executes ONE iteration of the writing loop:
 * 1. Taylor writes post (using research + feedback from previous iteration)
 * 2. James evaluates (returns score, issues, approved status)
 * 3. Returns updated state with iteration++
 */

import { createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { taylor } from '../../../agents/taylor';
import { james } from '../../../agents/james';

export const writeEvaluateStep = createStep({
  id: 'write-evaluate',
  description: 'Taylor writes, James evaluates (one iteration)',
  
  inputSchema: z.object({
    topic: z.string(),
    research: z.string(),
    iteration: z.number(),
    currentPost: z.string(),
    feedback: z.array(z.string()),
    score: z.number(),
    approved: z.boolean(),
  }),
  
  outputSchema: z.object({
    topic: z.string(),
    research: z.string(),
    iteration: z.number(),
    currentPost: z.string(),
    feedback: z.array(z.string()),
    score: z.number(),
    approved: z.boolean(),
  }),
  
  execute: async ({ inputData }) => {
    const { topic, research, iteration, currentPost, feedback } = inputData;
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`WRITING ITERATION ${iteration}`);
    console.log(`${'='.repeat(60)}`);
    
    // ===== TAYLOR: Write Post =====
    console.log(`\n✍️ TAYLOR: Writing post...`);
    
    let taylorPrompt: string;
    
    if (iteration === 1) {
      // First draft - no feedback
      taylorPrompt = `FIRST DRAFT

TOPIC: ${topic}

===== RESEARCH DATA =====
${research}
===== END RESEARCH =====

Write a viral LinkedIn post that would impress a Wharton MBA restaurant analyst.
- Use specific numbers and data from the research
- Explain WHY mechanisms work
- Include historical context
- Add industry comparisons
- 1500-2200 characters
- NO hashtags, NO emojis

Output ONLY the post.`;
    } else {
      // Revision based on feedback
      taylorPrompt = `REVISION ${iteration}

TOPIC: ${topic}

===== RESEARCH DATA =====
${research}
===== END RESEARCH =====

PREVIOUS POST:
${currentPost}

FEEDBACK TO ADDRESS:
${feedback.map((f, i) => `${i + 1}. ${f}`).join('\n')}

Fix ALL issues using the research data above.
Write a viral LinkedIn post that would impress a Wharton MBA restaurant analyst.
- Use specific numbers and data
- Explain WHY mechanisms work
- 1500-2200 characters
- NO hashtags, NO emojis

Output ONLY the post.`;
    }
    
    const taylorResult = await taylor.generate(taylorPrompt);
    const newPost = taylorResult.text || '';
    
    console.log(`   ✅ Post written: ${newPost.length} chars`);
    
    // ===== JAMES: Evaluate =====
    console.log(`\n🔍 JAMES: Evaluating...`);
    
    const jamesPrompt = `Evaluate this LinkedIn post about "${topic}":

${newPost}

Return JSON: { "score": 0-100, "verdict": "APPROVED/NEEDS_REVISION", "issues": ["specific issue 1", "specific issue 2"] }`;
    
    const jamesResult = await james.generate(jamesPrompt);
    
    let newScore = 50;
    let newFeedback: string[] = [];
    let newApproved = false;
    
    try {
      const match = jamesResult.text?.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        newScore = parsed.score || 50;
        newFeedback = parsed.issues || [];
        newApproved = newScore >= 75;
      }
    } catch (e) {
      console.warn('   ⚠️ Could not parse James response');
      newFeedback = ['Could not parse evaluation'];
    }
    
    console.log(`   ✅ Score: ${newScore}/100 | ${newApproved ? 'APPROVED' : 'NEEDS_REVISION'}`);
    
    if (!newApproved && newFeedback.length > 0) {
      console.log(`   📋 Issues: ${newFeedback[0]?.substring(0, 60)}...`);
    }
    
    return {
      topic,
      research,
      iteration: iteration + 1,
      currentPost: newPost,
      feedback: newFeedback,
      score: newScore,
      approved: newApproved,
    };
  },
});

