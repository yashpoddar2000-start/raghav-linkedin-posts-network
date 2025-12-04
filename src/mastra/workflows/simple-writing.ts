/**
 * Simple Writing Workflow
 * 
 * Architecture:
 * Research Data → Taylor (+ voice samples) → Post Draft
 *                                              ↓
 *                                         James Evaluates
 *                                              ↓
 *                 Score >= 75? → APPROVED → Done
 *                 Iteration < 4? → Revise
 *                 Else → Output best attempt
 */

import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { taylor } from '../agents/taylor';
import { james } from '../agents/james';
import * as fs from 'fs';
import * as path from 'path';

// Load all posts for voice sampling
const postsPath = path.join(process.cwd(), 'data/posts/all-posts.json');
let allPosts: any[] = [];
try {
  allPosts = JSON.parse(fs.readFileSync(postsPath, 'utf-8'));
} catch (e) {
  console.warn('Could not load posts for voice sampling');
}

// Get 3 random viral posts for voice reference
function sampleViralPosts(count: number = 3): string[] {
  const viralPosts = allPosts.filter((p: any) => p.isViral === true);
  const shuffled = viralPosts.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((p: any) => p.text);
}

// Schema for evaluation result
const evaluationSchema = z.object({
  score: z.number(),
  verdict: z.enum(['APPROVED', 'NEEDS_REVISION', 'REJECT']),
  emotionalIntelligenceTest: z.object({
    passed: z.boolean(),
    ahaRating: z.number(),
    reasoning: z.string(),
  }),
  socialCapitalTest: z.object({
    passed: z.boolean(),
    wouldRepost: z.boolean(),
    reasoning: z.string(),
  }),
  strengths: z.array(z.string()),
  issues: z.array(z.string()),
  suggestions: z.array(z.string()),
  expertVerdict: z.string(),
});

// Step 1: Taylor writes a draft
const writeStep = createStep({
  id: 'taylor-write',
  description: 'Taylor writes a LinkedIn post from research data',

  inputSchema: z.object({
    researchData: z.string(),
    voiceSamples: z.array(z.string()),
    iteration: z.number(),
    previousPost: z.string().optional(),
    previousFeedback: z.string().optional(),
  }),

  outputSchema: z.object({
    post: z.string(),
    iteration: z.number(),
  }),

  execute: async ({ inputData }) => {
    const { researchData, voiceSamples, iteration, previousPost, previousFeedback } = inputData;

    console.log(`\n${'─'.repeat(70)}`);
    console.log(`📝 TAYLOR WRITING - Iteration ${iteration}`);
    console.log(`${'─'.repeat(70)}`);

    let prompt = '';

    if (iteration === 1) {
      // First draft
      prompt = `Here is the research data to work with:

${researchData}

---

Here are example posts to match the voice (study the style, don't copy):

${voiceSamples.map((p, i) => `EXAMPLE ${i + 1}:\n${p}`).join('\n\n---\n\n')}

---

Write a viral LinkedIn post based on the research data. Match the voice of the examples.`;
    } else {
      // Revision based on feedback
      prompt = `Here is the research data:

${researchData.substring(0, 30000)}
${researchData.length > 30000 ? '\n...[truncated]...' : ''}

---

Your previous draft (iteration ${iteration - 1}):

${previousPost}

---

James's feedback:

${previousFeedback}

---

Revise the post based on the feedback. Keep what works, fix what doesn't.`;
    }

    const result = await taylor.generate(prompt);
    const post = result.text || '';

    console.log(`✅ Taylor wrote ${post.length} characters`);
    console.log(`\nPOST PREVIEW:\n${post.substring(0, 500)}...`);

    return {
      post,
      iteration,
    };
  },
});

// Step 2: James evaluates
const evaluateStep = createStep({
  id: 'james-evaluate',
  description: 'James brutally evaluates the post',

  inputSchema: z.object({
    post: z.string(),
    iteration: z.number(),
  }),

  outputSchema: z.object({
    post: z.string(),
    iteration: z.number(),
    score: z.number(),
    verdict: z.string(),
    feedback: z.string(),
    approved: z.boolean(),
  }),

  execute: async ({ inputData }) => {
    const { post, iteration } = inputData;

    console.log(`\n${'─'.repeat(70)}`);
    console.log(`🔍 JAMES EVALUATING - Iteration ${iteration}`);
    console.log(`${'─'.repeat(70)}`);

    const prompt = `Evaluate this LinkedIn post:

${post}

Remember: You are a Senior Restaurant Industry Analyst with 15+ years experience. Be BRUTAL.`;

    const result = await james.generate(prompt);
    const responseText = result.text || '';

    // Parse JSON from response
    let evaluation: any = {
      score: 0,
      verdict: 'NEEDS_REVISION',
      suggestions: [],
      expertVerdict: 'Could not parse evaluation',
    };

    try {
      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        evaluation = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.log('⚠️ Could not parse James evaluation as JSON');
    }

    const score = evaluation.score || 0;
    const verdict = evaluation.verdict || 'NEEDS_REVISION';
    const approved = score >= 75;

    console.log(`\n📊 SCORE: ${score}/100`);
    console.log(`📋 VERDICT: ${verdict}`);
    console.log(`${approved ? '✅ APPROVED' : '❌ NEEDS REVISION'}`);

    if (evaluation.suggestions?.length > 0) {
      console.log(`\n💡 SUGGESTIONS:`);
      evaluation.suggestions.forEach((s: string, i: number) => {
        console.log(`   ${i + 1}. ${s}`);
      });
    }

    // Create structured feedback for next iteration
    const feedback = `
SCORE: ${score}/100
VERDICT: ${verdict}

EMOTIONAL INTELLIGENCE TEST:
${evaluation.emotionalIntelligenceTest?.passed ? '✅ PASSED' : '❌ FAILED'}
Rating: ${evaluation.emotionalIntelligenceTest?.ahaRating || 'N/A'}/10
${evaluation.emotionalIntelligenceTest?.reasoning || ''}

SOCIAL CAPITAL TEST:
${evaluation.socialCapitalTest?.passed ? '✅ PASSED' : '❌ FAILED'}
Would Repost: ${evaluation.socialCapitalTest?.wouldRepost ? 'Yes' : 'No'}
${evaluation.socialCapitalTest?.reasoning || ''}

ISSUES TO FIX:
${(evaluation.issues || []).map((i: string) => `- ${i}`).join('\n')}

SUGGESTIONS:
${(evaluation.suggestions || []).map((s: string) => `- ${s}`).join('\n')}

EXPERT VERDICT:
${evaluation.expertVerdict || ''}
`.trim();

    return {
      post,
      iteration,
      score,
      verdict,
      feedback,
      approved,
    };
  },
});

// Main workflow
export const simpleWritingWorkflow = createWorkflow({
  id: 'simple-writing',
  description: 'Taylor writes, James evaluates, loop until approved or max 4 iterations',

  inputSchema: z.object({
    researchData: z.string().describe('The combined research data'),
  }),

  outputSchema: z.object({
    finalPost: z.string(),
    score: z.number(),
    iterations: z.number(),
    approved: z.boolean(),
    evaluationHistory: z.array(z.object({
      iteration: z.number(),
      post: z.string(),
      score: z.number(),
      feedback: z.string(),
    })),
  }),
})
  .map(async ({ inputData }) => {
    // Initialize workflow state
    const { researchData } = inputData;
    const voiceSamples = sampleViralPosts(3);

    console.log('\n' + '═'.repeat(70));
    console.log('SIMPLE WRITING WORKFLOW');
    console.log('═'.repeat(70));
    console.log(`Research data: ${researchData.length} characters`);
    console.log(`Voice samples: ${voiceSamples.length} posts`);
    console.log(`Max iterations: 4`);

    // Manual iteration loop (since we need complex state management)
    let currentPost = '';
    let currentScore = 0;
    let currentFeedback = '';
    let approved = false;
    let iteration = 0;
    const evaluationHistory: any[] = [];

    const MAX_ITERATIONS = 4;

    while (!approved && iteration < MAX_ITERATIONS) {
      iteration++;

      // Taylor writes
      console.log(`\n${'═'.repeat(70)}`);
      console.log(`ITERATION ${iteration}/${MAX_ITERATIONS}`);
      console.log('═'.repeat(70));

      const writePrompt = iteration === 1
        ? `Here is the research data to work with:

${researchData}

---

Here are example posts to match the voice (study the style, don't copy):

${voiceSamples.map((p, i) => `EXAMPLE ${i + 1}:\n${p}`).join('\n\n---\n\n')}

---

Write a viral LinkedIn post based on the research data. Match the voice of the examples.`
        : `Here is the research data:

${researchData.substring(0, 30000)}
${researchData.length > 30000 ? '\n...[truncated]...' : ''}

---

Your previous draft (iteration ${iteration - 1}):

${currentPost}

---

James's feedback:

${currentFeedback}

---

Revise the post based on the feedback. Keep what works, fix what doesn't.`;

      console.log(`\n📝 TAYLOR WRITING...`);
      
      // Log what feedback Taylor is receiving (for iterations 2+)
      if (iteration > 1) {
        console.log(`\n📨 FEEDBACK BEING SENT TO TAYLOR:`);
        console.log(`${'─'.repeat(50)}`);
        console.log(currentFeedback);
        console.log(`${'─'.repeat(50)}`);
      }
      
      const writeResult = await taylor.generate(writePrompt);
      currentPost = writeResult.text || '';
      console.log(`✅ Taylor wrote ${currentPost.length} characters`);

      // James evaluates
      console.log(`\n🔍 JAMES EVALUATING...`);
      const evalPrompt = `Evaluate this LinkedIn post:

${currentPost}

Remember: You are a Senior Restaurant Industry Analyst with 15+ years experience. Be BRUTAL.`;

      const evalResult = await james.generate(evalPrompt);
      const responseText = evalResult.text || '';

      // Parse evaluation
      let evaluation: any = {
        score: 0,
        verdict: 'NEEDS_REVISION',
        suggestions: [],
        expertVerdict: 'Could not parse evaluation',
      };

      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          evaluation = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.log('⚠️ Could not parse James evaluation');
      }

      currentScore = evaluation.score || 0;
      approved = currentScore >= 95; // BRUTAL: Only pass at 95+

      console.log(`\n📊 SCORE: ${currentScore}/100`);
      console.log(`📋 VERDICT: ${evaluation.verdict || 'UNKNOWN'}`);
      console.log(`${approved ? '✅ APPROVED (95+)!' : '❌ NEEDS REVISION (need 95+)'}`);

      // Log James's detailed feedback
      if (evaluation.issues?.length > 0) {
        console.log(`\n🔴 ISSUES James identified:`);
        evaluation.issues.forEach((issue: string, idx: number) => {
          console.log(`   ${idx + 1}. ${issue}`);
        });
      }

      if (evaluation.suggestions?.length > 0) {
        console.log(`\n💡 SUGGESTIONS from James:`);
        evaluation.suggestions.forEach((sug: string, idx: number) => {
          console.log(`   ${idx + 1}. ${sug}`);
        });
      }

      if (evaluation.expertVerdict) {
        console.log(`\n🎯 EXPERT VERDICT: ${evaluation.expertVerdict}`);
      }

      // Build feedback for next iteration
      currentFeedback = `
SCORE: ${currentScore}/100
VERDICT: ${evaluation.verdict || 'UNKNOWN'}

ISSUES:
${(evaluation.issues || []).map((i: string) => `- ${i}`).join('\n') || 'None listed'}

SUGGESTIONS:
${(evaluation.suggestions || []).map((s: string) => `- ${s}`).join('\n') || 'None listed'}

EXPERT VERDICT:
${evaluation.expertVerdict || 'N/A'}
`.trim();

      // Save to history
      evaluationHistory.push({
        iteration,
        post: currentPost,
        score: currentScore,
        feedback: currentFeedback,
      });

      if (approved) {
        console.log(`\n🎉 POST APPROVED after ${iteration} iteration(s)!`);
        break;
      }

      if (iteration < MAX_ITERATIONS) {
        console.log(`\n↩️ Revising based on feedback...`);
      }
    }

    if (!approved) {
      console.log(`\n⚠️ Max iterations reached. Outputting best attempt (score: ${currentScore})`);
    }

    return {
      finalPost: currentPost,
      score: currentScore,
      iterations: iteration,
      approved,
      evaluationHistory,
    };
  })
  .commit();

// Helper function to load research from file
export async function loadResearchFile(filepath: string): Promise<string> {
  const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  return data.combinedResearch || '';
}

