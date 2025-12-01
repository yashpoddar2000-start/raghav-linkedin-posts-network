/**
 * Taylor-James Feedback Loop
 * 
 * SIMPLIFIED FLOW:
 * 1. Load full research data
 * 2. Taylor writes directly from research (skip Maya)
 * 3. James evaluates brutally + gives specific recommendations
 * 4. Taylor revises using research + feedback
 * 5. Repeat 4 times max
 * 
 * KEY INSIGHT: Taylor always has access to full 40K research
 * So he can actually act on James's feedback
 */

import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { taylorExa } from '../agents/exa-agents/taylor-exa';
import { jamesExa } from '../agents/exa-agents/james-exa';

// ============================================================================
// SCHEMAS
// ============================================================================

const workflowInputSchema = z.object({
  topic: z.string(),
  fullResearchData: z.string(), // The full 40K chars from Phase 1
});

const evaluationSchema = z.object({
  iteration: z.number(),
  post: z.string(),
  score: z.number(),
  verdict: z.string(),
  feedback: z.string(),
  recommendations: z.array(z.string()),
});

const workflowOutputSchema = z.object({
  finalPost: z.string(),
  finalScore: z.number(),
  approved: z.boolean(),
  totalIterations: z.number(),
  history: z.array(evaluationSchema),
});

// ============================================================================
// TAYLOR WRITER FUNCTION
// ============================================================================

async function taylorWrite(
  topic: string,
  research: string,
  previousAttempt?: { post: string; feedback: string; recommendations: string[] },
  iteration?: number
): Promise<string> {
  const isRevision = !!previousAttempt;
  
  const prompt = `${isRevision ? `REVISION ${iteration}: Address the feedback and try again.` : 'FIRST DRAFT: Write a viral LinkedIn post.'}

TOPIC: ${topic}

===== FULL RESEARCH DATA (USE THIS FOR DEPTH) =====
${research}
===== END RESEARCH =====

${isRevision ? `
===== PREVIOUS POST THAT NEEDS IMPROVEMENT =====
${previousAttempt!.post}
===== END PREVIOUS POST =====

===== EVALUATOR FEEDBACK =====
${previousAttempt!.feedback}
===== END FEEDBACK =====

===== SPECIFIC RECOMMENDATIONS TO ADDRESS =====
${previousAttempt!.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}
===== END RECOMMENDATIONS =====

IMPORTANT: Address EACH recommendation specifically using data from the research above.
` : ''}

YOUR TASK:
1. Write a LinkedIn post that would impress a Wharton MBA restaurant analyst
2. Use SPECIFIC data and numbers from the research
3. Explain WHY and HOW mechanisms work (not just state facts)
4. Include historical context (compare to previous years)
5. Add industry comparisons where the data exists
6. Make it sophisticated analysis, not just stat dumping

REQUIREMENTS:
- 1500-2200 characters
- NO hashtags, NO emojis, NO bold formatting
- Start with a compelling hook
- End with a non-obvious insight

Output ONLY the post. Nothing else.`;

  const result = await taylorExa.generate(prompt);
  return result.text || '';
}

// ============================================================================
// JAMES EVALUATOR FUNCTION (MORE DETAILED FEEDBACK)
// ============================================================================

async function jamesEvaluate(post: string, topic: string): Promise<{
  score: number;
  verdict: string;
  feedback: string;
  recommendations: string[];
}> {
  const result = await jamesExa.generate(`
Evaluate this LinkedIn post about "${topic}":

${post}

Remember: You are a Senior Restaurant Industry Analyst with 15+ years experience, MBA from Wharton, worked at McKinsey.

Return JSON with:
{
  "score": 0-100,
  "verdict": "APPROVED" or "NEEDS_REVISION" or "REJECT",
  "emotionalIntelligenceTest": {
    "passed": true/false,
    "reasoning": "Did it give you that 'aha' moment?"
  },
  "socialCapitalTest": {
    "passed": true/false,
    "reasoning": "Would you repost this to your network?"
  },
  "feedback": "Overall assessment - be brutal and specific",
  "recommendations": [
    "Specific thing #1 to fix with exact instructions",
    "Specific thing #2 to fix with exact instructions",
    "Specific thing #3 to fix with exact instructions"
  ]
}

CRITICAL: Your recommendations must be SPECIFIC and ACTIONABLE.
Bad: "Add more depth"
Good: "Explain WHY the asset-light model benefits corporate - specifically mention real estate appreciation and supplier rebates"

Return ONLY valid JSON.`);

  try {
    const jsonMatch = result.text?.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        score: parsed.score || 50,
        verdict: parsed.verdict || 'NEEDS_REVISION',
        feedback: parsed.feedback || '',
        recommendations: parsed.recommendations || [],
      };
    }
  } catch {
    console.log('⚠️ Could not parse James evaluation');
  }

  return {
    score: 50,
    verdict: 'NEEDS_REVISION',
    feedback: 'Could not parse evaluation',
    recommendations: ['Try again with clearer structure'],
  };
}

// ============================================================================
// ITERATION STEPS
// ============================================================================

const iteration1Step = createStep({
  id: 'iteration-1',
  description: 'Taylor writes, James evaluates (iteration 1)',
  inputSchema: workflowInputSchema,
  outputSchema: z.object({
    topic: z.string(),
    fullResearchData: z.string(),
    currentPost: z.string(),
    evaluation: evaluationSchema,
    approved: z.boolean(),
  }),
  execute: async ({ inputData }) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`✍️ ITERATION 1: Initial Draft`);
    console.log(`${'='.repeat(60)}`);

    const post = await taylorWrite(inputData.topic, inputData.fullResearchData);
    console.log(`📝 Post: ${post.length} chars`);

    console.log(`\n🔍 James evaluating...`);
    const evaluation = await jamesEvaluate(post, inputData.topic);
    
    console.log(`📊 Score: ${evaluation.score}/100 | ${evaluation.verdict}`);
    if (evaluation.recommendations.length > 0) {
      console.log(`📋 Recommendations: ${evaluation.recommendations.length}`);
    }

    return {
      topic: inputData.topic,
      fullResearchData: inputData.fullResearchData,
      currentPost: post,
      evaluation: {
        iteration: 1,
        post,
        score: evaluation.score,
        verdict: evaluation.verdict,
        feedback: evaluation.feedback,
        recommendations: evaluation.recommendations,
      },
      approved: evaluation.score >= 75,
    };
  },
});

const iteration2Step = createStep({
  id: 'iteration-2',
  description: 'Taylor revises based on feedback (iteration 2)',
  inputSchema: z.object({
    topic: z.string(),
    fullResearchData: z.string(),
    currentPost: z.string(),
    evaluation: evaluationSchema,
    approved: z.boolean(),
  }),
  outputSchema: z.object({
    topic: z.string(),
    fullResearchData: z.string(),
    currentPost: z.string(),
    history: z.array(evaluationSchema),
    approved: z.boolean(),
  }),
  execute: async ({ inputData }) => {
    if (inputData.approved) {
      console.log(`\n✅ Already approved at iteration 1, skipping...`);
      return {
        ...inputData,
        history: [inputData.evaluation],
      };
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`✍️ ITERATION 2: Revision`);
    console.log(`${'='.repeat(60)}`);

    const post = await taylorWrite(
      inputData.topic,
      inputData.fullResearchData,
      {
        post: inputData.currentPost,
        feedback: inputData.evaluation.feedback,
        recommendations: inputData.evaluation.recommendations,
      },
      2
    );
    console.log(`📝 Revised post: ${post.length} chars`);

    console.log(`\n🔍 James evaluating...`);
    const evaluation = await jamesEvaluate(post, inputData.topic);
    
    console.log(`📊 Score: ${evaluation.score}/100 | ${evaluation.verdict}`);

    return {
      topic: inputData.topic,
      fullResearchData: inputData.fullResearchData,
      currentPost: post,
      history: [
        inputData.evaluation,
        {
          iteration: 2,
          post,
          score: evaluation.score,
          verdict: evaluation.verdict,
          feedback: evaluation.feedback,
          recommendations: evaluation.recommendations,
        },
      ],
      approved: evaluation.score >= 75,
    };
  },
});

const iteration3Step = createStep({
  id: 'iteration-3',
  description: 'Taylor revises based on feedback (iteration 3)',
  inputSchema: z.object({
    topic: z.string(),
    fullResearchData: z.string(),
    currentPost: z.string(),
    history: z.array(evaluationSchema),
    approved: z.boolean(),
  }),
  outputSchema: z.object({
    topic: z.string(),
    fullResearchData: z.string(),
    currentPost: z.string(),
    history: z.array(evaluationSchema),
    approved: z.boolean(),
  }),
  execute: async ({ inputData }) => {
    if (inputData.approved) {
      console.log(`\n✅ Already approved, skipping iteration 3...`);
      return inputData;
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`✍️ ITERATION 3: Second Revision`);
    console.log(`${'='.repeat(60)}`);

    const lastEval = inputData.history[inputData.history.length - 1];
    
    const post = await taylorWrite(
      inputData.topic,
      inputData.fullResearchData,
      {
        post: inputData.currentPost,
        feedback: lastEval.feedback,
        recommendations: lastEval.recommendations,
      },
      3
    );
    console.log(`📝 Revised post: ${post.length} chars`);

    console.log(`\n🔍 James evaluating...`);
    const evaluation = await jamesEvaluate(post, inputData.topic);
    
    console.log(`📊 Score: ${evaluation.score}/100 | ${evaluation.verdict}`);

    return {
      topic: inputData.topic,
      fullResearchData: inputData.fullResearchData,
      currentPost: post,
      history: [
        ...inputData.history,
        {
          iteration: 3,
          post,
          score: evaluation.score,
          verdict: evaluation.verdict,
          feedback: evaluation.feedback,
          recommendations: evaluation.recommendations,
        },
      ],
      approved: evaluation.score >= 75,
    };
  },
});

const iteration4Step = createStep({
  id: 'iteration-4',
  description: 'Final iteration (iteration 4)',
  inputSchema: z.object({
    topic: z.string(),
    fullResearchData: z.string(),
    currentPost: z.string(),
    history: z.array(evaluationSchema),
    approved: z.boolean(),
  }),
  outputSchema: workflowOutputSchema,
  execute: async ({ inputData }) => {
    if (inputData.approved) {
      console.log(`\n✅ Already approved, finalizing...`);
      const lastEval = inputData.history[inputData.history.length - 1];
      return {
        finalPost: inputData.currentPost,
        finalScore: lastEval.score,
        approved: true,
        totalIterations: lastEval.iteration,
        history: inputData.history,
      };
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`✍️ ITERATION 4: Final Attempt`);
    console.log(`${'='.repeat(60)}`);

    const lastEval = inputData.history[inputData.history.length - 1];
    
    const post = await taylorWrite(
      inputData.topic,
      inputData.fullResearchData,
      {
        post: inputData.currentPost,
        feedback: lastEval.feedback,
        recommendations: lastEval.recommendations,
      },
      4
    );
    console.log(`📝 Final post: ${post.length} chars`);

    console.log(`\n🔍 James final evaluation...`);
    const evaluation = await jamesEvaluate(post, inputData.topic);
    
    console.log(`📊 Final Score: ${evaluation.score}/100 | ${evaluation.verdict}`);

    const finalHistory = [
      ...inputData.history,
      {
        iteration: 4,
        post,
        score: evaluation.score,
        verdict: evaluation.verdict,
        feedback: evaluation.feedback,
        recommendations: evaluation.recommendations,
      },
    ];

    return {
      finalPost: post,
      finalScore: evaluation.score,
      approved: evaluation.score >= 75,
      totalIterations: 4,
      history: finalHistory,
    };
  },
});

// ============================================================================
// WORKFLOW ASSEMBLY
// ============================================================================

export const taylorJamesLoop = createWorkflow({
  id: 'taylor-james-loop',
  description: 'Taylor writes, James evaluates, 4 iterations max',
  inputSchema: workflowInputSchema,
  outputSchema: workflowOutputSchema,
})
  .then(iteration1Step)
  .then(iteration2Step)
  .then(iteration3Step)
  .then(iteration4Step);

taylorJamesLoop.commit();

