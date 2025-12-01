/**
 * Phase 3: Writing + Evaluation Workflow
 * 
 * FEEDBACK LOOP DESIGN:
 * 1. Taylor writes post from Maya's insights
 * 2. James evaluates brutally
 * 3. If NEEDS_REVISION and iteration < 2, go back with feedback
 * 4. Max 2 revisions (3 total attempts), then done
 * 
 * GUARDRAILS:
 * - Max 2 feedback loops (3 total writes)
 * - Automatic approval if score >= 75
 * - Force exit after max iterations
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
  viralInsights: z.object({
    shockingStats: z.array(z.object({
      stat: z.string(),
      context: z.string(),
    })),
    viralAngles: z.array(z.object({
      angle: z.string(),
      hook: z.string(),
      supportingData: z.string().optional(),
    })),
    keyNumbers: z.record(z.string()),
    narrativeSummary: z.string(),
  }),
});

const workflowOutputSchema = z.object({
  finalPost: z.string(),
  finalScore: z.number(),
  approved: z.boolean(),
  iterations: z.number(),
  history: z.array(z.object({
    iteration: z.number(),
    post: z.string(),
    score: z.number(),
    verdict: z.string(),
    feedback: z.string(),
  })),
});

// ============================================================================
// STEP 1: INITIAL WRITE
// ============================================================================

const initialWriteStep = createStep({
  id: 'initial-write',
  description: 'Taylor creates first draft from Maya insights',
  inputSchema: workflowInputSchema,
  outputSchema: z.object({
    topic: z.string(),
    viralInsights: workflowInputSchema.shape.viralInsights,
    currentPost: z.string(),
    iteration: z.number(),
  }),
  execute: async ({ inputData }) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`✍️ WRITE ITERATION 1: Initial Draft`);
    console.log(`${'='.repeat(60)}`);

    const prompt = buildWriterPrompt(inputData.viralInsights, null);
    const result = await taylorExa.generate(prompt);
    const post = result.text || '';

    console.log(`📝 Post length: ${post.length} characters`);
    console.log(`📄 Preview: ${post.substring(0, 100)}...`);

    return {
      topic: inputData.topic,
      viralInsights: inputData.viralInsights,
      currentPost: post,
      iteration: 1,
    };
  },
});

// ============================================================================
// STEP 2: EVALUATE + REVISE LOOP (Iteration 1)
// ============================================================================

const evaluateAndRevise1Step = createStep({
  id: 'evaluate-revise-1',
  description: 'James evaluates, Taylor revises if needed (attempt 1)',
  inputSchema: z.object({
    topic: z.string(),
    viralInsights: workflowInputSchema.shape.viralInsights,
    currentPost: z.string(),
    iteration: z.number(),
  }),
  outputSchema: z.object({
    topic: z.string(),
    viralInsights: workflowInputSchema.shape.viralInsights,
    currentPost: z.string(),
    iteration: z.number(),
    evaluationHistory: z.array(z.object({
      iteration: z.number(),
      post: z.string(),
      score: z.number(),
      verdict: z.string(),
      feedback: z.string(),
    })),
    approved: z.boolean(),
  }),
  execute: async ({ inputData }) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🔍 EVALUATE ITERATION ${inputData.iteration}`);
    console.log(`${'='.repeat(60)}`);

    // James evaluates
    const evaluation = await evaluatePost(inputData.currentPost);
    
    const historyEntry = {
      iteration: inputData.iteration,
      post: inputData.currentPost,
      score: evaluation.score,
      verdict: evaluation.verdict,
      feedback: evaluation.issues.join(' | '),
    };

    console.log(`📊 Score: ${evaluation.score}/100`);
    console.log(`✅ Verdict: ${evaluation.verdict}`);

    // If approved, we're done
    if (evaluation.score >= 75 || evaluation.verdict === 'APPROVED') {
      console.log(`🎉 APPROVED! No revision needed.`);
      return {
        topic: inputData.topic,
        viralInsights: inputData.viralInsights,
        currentPost: inputData.currentPost,
        iteration: inputData.iteration,
        evaluationHistory: [historyEntry],
        approved: true,
      };
    }

    // Need revision - Taylor rewrites
    console.log(`\n✍️ WRITE ITERATION 2: Revision based on feedback`);
    console.log(`📋 Feedback: ${evaluation.issues.join(', ')}`);

    const revisionPrompt = buildWriterPrompt(inputData.viralInsights, {
      previousPost: inputData.currentPost,
      feedback: evaluation.issues,
      suggestions: evaluation.suggestions,
    });

    const result = await taylorExa.generate(revisionPrompt);
    const revisedPost = result.text || '';

    console.log(`📝 Revised post length: ${revisedPost.length} characters`);

    return {
      topic: inputData.topic,
      viralInsights: inputData.viralInsights,
      currentPost: revisedPost,
      iteration: 2,
      evaluationHistory: [historyEntry],
      approved: false,
    };
  },
});

// ============================================================================
// STEP 3: EVALUATE + REVISE LOOP (Iteration 2 - Final)
// ============================================================================

const evaluateAndRevise2Step = createStep({
  id: 'evaluate-revise-2',
  description: 'James evaluates revision, final attempt if needed',
  inputSchema: z.object({
    topic: z.string(),
    viralInsights: workflowInputSchema.shape.viralInsights,
    currentPost: z.string(),
    iteration: z.number(),
    evaluationHistory: z.array(z.object({
      iteration: z.number(),
      post: z.string(),
      score: z.number(),
      verdict: z.string(),
      feedback: z.string(),
    })),
    approved: z.boolean(),
  }),
  outputSchema: z.object({
    topic: z.string(),
    viralInsights: workflowInputSchema.shape.viralInsights,
    currentPost: z.string(),
    iteration: z.number(),
    evaluationHistory: z.array(z.object({
      iteration: z.number(),
      post: z.string(),
      score: z.number(),
      verdict: z.string(),
      feedback: z.string(),
    })),
    approved: z.boolean(),
  }),
  execute: async ({ inputData }) => {
    // If already approved, pass through
    if (inputData.approved) {
      console.log(`\n✅ Already approved, skipping iteration 2`);
      return inputData;
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`🔍 EVALUATE ITERATION ${inputData.iteration}`);
    console.log(`${'='.repeat(60)}`);

    // James evaluates revision
    const evaluation = await evaluatePost(inputData.currentPost);
    
    const historyEntry = {
      iteration: inputData.iteration,
      post: inputData.currentPost,
      score: evaluation.score,
      verdict: evaluation.verdict,
      feedback: evaluation.issues.join(' | '),
    };

    const updatedHistory = [...inputData.evaluationHistory, historyEntry];

    console.log(`📊 Score: ${evaluation.score}/100`);
    console.log(`✅ Verdict: ${evaluation.verdict}`);

    // If approved, we're done
    if (evaluation.score >= 75 || evaluation.verdict === 'APPROVED') {
      console.log(`🎉 APPROVED after revision!`);
      return {
        ...inputData,
        evaluationHistory: updatedHistory,
        approved: true,
      };
    }

    // Final revision attempt
    console.log(`\n✍️ WRITE ITERATION 3: FINAL revision`);
    console.log(`📋 Feedback: ${evaluation.issues.join(', ')}`);

    const revisionPrompt = buildWriterPrompt(inputData.viralInsights, {
      previousPost: inputData.currentPost,
      feedback: evaluation.issues,
      suggestions: evaluation.suggestions,
      isFinalAttempt: true,
    });

    const result = await taylorExa.generate(revisionPrompt);
    const revisedPost = result.text || '';

    console.log(`📝 Final revision length: ${revisedPost.length} characters`);

    return {
      topic: inputData.topic,
      viralInsights: inputData.viralInsights,
      currentPost: revisedPost,
      iteration: 3,
      evaluationHistory: updatedHistory,
      approved: false,
    };
  },
});

// ============================================================================
// STEP 4: FINAL EVALUATION
// ============================================================================

const finalEvaluationStep = createStep({
  id: 'final-evaluation',
  description: 'Final evaluation and output',
  inputSchema: z.object({
    topic: z.string(),
    viralInsights: workflowInputSchema.shape.viralInsights,
    currentPost: z.string(),
    iteration: z.number(),
    evaluationHistory: z.array(z.object({
      iteration: z.number(),
      post: z.string(),
      score: z.number(),
      verdict: z.string(),
      feedback: z.string(),
    })),
    approved: z.boolean(),
  }),
  outputSchema: workflowOutputSchema,
  execute: async ({ inputData }) => {
    // If already approved, just format output
    if (inputData.approved) {
      const lastEval = inputData.evaluationHistory[inputData.evaluationHistory.length - 1];
      
      console.log(`\n${'='.repeat(60)}`);
      console.log(`✅ WORKFLOW COMPLETE - APPROVED`);
      console.log(`${'='.repeat(60)}`);
      console.log(`📊 Final Score: ${lastEval.score}/100`);
      console.log(`📝 Iterations: ${inputData.iteration}`);

      return {
        finalPost: inputData.currentPost,
        finalScore: lastEval.score,
        approved: true,
        iterations: inputData.iteration,
        history: inputData.evaluationHistory,
      };
    }

    // Final evaluation for last attempt
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🔍 FINAL EVALUATION (Iteration ${inputData.iteration})`);
    console.log(`${'='.repeat(60)}`);

    const evaluation = await evaluatePost(inputData.currentPost);
    
    const historyEntry = {
      iteration: inputData.iteration,
      post: inputData.currentPost,
      score: evaluation.score,
      verdict: evaluation.verdict,
      feedback: evaluation.issues.join(' | '),
    };

    const finalHistory = [...inputData.evaluationHistory, historyEntry];
    const approved = evaluation.score >= 75;

    console.log(`📊 Final Score: ${evaluation.score}/100`);
    console.log(`✅ Final Verdict: ${approved ? 'APPROVED' : 'BEST EFFORT'}`);
    console.log(`📝 Total Iterations: ${inputData.iteration}`);

    return {
      finalPost: inputData.currentPost,
      finalScore: evaluation.score,
      approved,
      iterations: inputData.iteration,
      history: finalHistory,
    };
  },
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function buildWriterPrompt(
  insights: z.infer<typeof workflowInputSchema>['viralInsights'],
  revision: {
    previousPost: string;
    feedback: string[];
    suggestions: string[];
    isFinalAttempt?: boolean;
  } | null
): string {
  const basePrompt = `Create a viral LinkedIn post using these insights:

SHOCKING STATS:
${insights.shockingStats.map(s => `• ${s.stat} - ${s.context}`).join('\n')}

VIRAL ANGLES:
${insights.viralAngles.map(a => `• Hook: "${a.hook}" - ${a.supportingData || ''}`).join('\n')}

KEY NUMBERS:
${Object.entries(insights.keyNumbers).map(([k, v]) => `• ${k}: ${v}`).join('\n')}

NARRATIVE:
${insights.narrativeSummary}

Write the post now. Just the post text, nothing else.`;

  if (!revision) {
    return basePrompt;
  }

  return `${basePrompt}

---
REVISION REQUIRED${revision.isFinalAttempt ? ' (FINAL ATTEMPT)' : ''}

PREVIOUS POST HAD ISSUES:
${revision.feedback.map(f => `• ${f}`).join('\n')}

SUGGESTIONS:
${revision.suggestions.map(s => `• ${s}`).join('\n')}

PREVIOUS POST:
${revision.previousPost}

Write an IMPROVED version addressing ALL the feedback.`;
}

async function evaluatePost(post: string): Promise<{
  score: number;
  verdict: string;
  issues: string[];
  suggestions: string[];
}> {
  const result = await jamesExa.generate(
    `Evaluate this LinkedIn post for viral potential:

${post}

Return your evaluation as JSON.`
  );

  try {
    const jsonMatch = result.text?.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        score: parsed.score || 50,
        verdict: parsed.verdict || (parsed.score >= 75 ? 'APPROVED' : 'NEEDS_REVISION'),
        issues: parsed.issues || [],
        suggestions: parsed.suggestions || [],
      };
    }
  } catch {
    console.log('⚠️ Could not parse evaluation, using defaults');
  }

  return {
    score: 70,
    verdict: 'NEEDS_REVISION',
    issues: ['Could not parse evaluation'],
    suggestions: ['Try again'],
  };
}

// ============================================================================
// WORKFLOW ASSEMBLY
// ============================================================================

export const phase3WritingWorkflow = createWorkflow({
  id: 'phase-3-writing-workflow',
  description: 'Writing + Evaluation with feedback loops (max 2 revisions)',
  inputSchema: workflowInputSchema,
  outputSchema: workflowOutputSchema,
})
  .then(initialWriteStep)
  .then(evaluateAndRevise1Step)
  .then(evaluateAndRevise2Step)
  .then(finalEvaluationStep);

phase3WritingWorkflow.commit();

