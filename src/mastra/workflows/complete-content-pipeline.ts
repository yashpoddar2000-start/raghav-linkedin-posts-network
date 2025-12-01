/**
 * COMPLETE CONTENT PIPELINE
 * 
 * Full end-to-end workflow:
 * Topic → Research (saved locally) → Taylor → James Loop → Approved Post
 * 
 * FEATURES:
 * - All research saved locally (no wasted API calls)
 * - Taylor gets full 40K research directly
 * - James evaluates with brutal Wharton MBA criteria
 * - 4 iteration loop until approved
 * 
 * COST: ~$0.15 per topic (Exa calls) + ~$0.05 (LLM calls)
 * TIME: ~7-10 minutes per topic
 */

import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { alexExa } from '../agents/alex-exa';
import { davidExa } from '../agents/david-exa';
import { strategistExa } from '../agents/strategist-exa';
import { taylorExa } from '../agents/taylor-exa';
import { jamesExa } from '../agents/james-exa';
import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// SCHEMAS
// ============================================================================

const pipelineInputSchema = z.object({
  topic: z.string().describe('QSR topic for LinkedIn post'),
});

const pipelineOutputSchema = z.object({
  topic: z.string(),
  finalPost: z.string(),
  finalScore: z.number(),
  approved: z.boolean(),
  totalIterations: z.number(),
  researchFile: z.string(),
  stats: z.object({
    totalQueries: z.number(),
    totalDeepResearch: z.number(),
    researchCharacters: z.number(),
    postCharacters: z.number(),
    durationSeconds: z.number(),
  }),
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function saveResearchData(topic: string, data: any): string {
  const topicSlug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50);
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `full-research-${topicSlug}-${timestamp}.json`;
  const savePath = path.join(process.cwd(), 'research-data', filename);
  
  fs.writeFileSync(savePath, JSON.stringify(data, null, 2));
  console.log(`💾 SAVED: ${filename}`);
  return filename;
}

async function runAlexQueries(topic: string, guidance: string, round: number): Promise<{ data: string; count: number }> {
  console.log(`\n📊 ALEX Round ${round}: Executing queries via agent...`);
  
  const result = await alexExa.generate(
    `Research topic: "${topic}"
${guidance ? `Focus on: ${guidance}` : 'Round 1: Broad exploration'}

Generate 15 financial research queries and call the exa-bulk-answer tool.`,
    { maxSteps: 2 }
  );

  // Extract tool results
  const toolResults = (result as any).toolResults || [];
  const exaResult = toolResults[0]?.result || toolResults[0]?.payload?.result;
  
  let data = '';
  let count = 0;
  
  if (exaResult?.results) {
    data = exaResult.results.map((r: any) => 
      `Q: ${r.query}\nA: ${r.answer || 'No answer'}`
    ).join('\n\n');
    count = exaResult.summary?.successful || exaResult.results.length;
  } else {
    data = result.text || 'No data retrieved';
    count = 0;
  }

  console.log(`   ✅ ${count} queries executed`);
  return { data, count };
}

async function runDavidResearch(topic: string, guidance: string, round: number): Promise<string> {
  console.log(`\n🔬 DAVID Round ${round}: Deep research via agent...`);
  
  const result = await davidExa.generate(
    `Research topic: "${topic}"
${guidance ? `Focus: ${guidance}` : 'Round 1: Broad strategic research'}

Create a SHORT research prompt (100-200 chars) and call exa-deep-research.
Example: "Summarize why McDonald's franchisees are leaving in 2024. Include management statements."`,
    { maxSteps: 2 }
  );

  // Extract tool results
  const toolResults = (result as any).toolResults || [];
  const exaResult = toolResults[0]?.result || toolResults[0]?.payload?.result;
  
  const report = exaResult?.report || result.text || 'No research retrieved';
  console.log(`   ✅ Research complete (${report.length} chars)`);
  
  return report;
}

async function taylorWrite(topic: string, research: string, feedback?: { post: string; issues: string[] }, iteration?: number): Promise<string> {
  const prompt = `${feedback ? `REVISION ${iteration}:` : 'FIRST DRAFT:'}

TOPIC: ${topic}

===== RESEARCH DATA =====
${research}
===== END RESEARCH =====

${feedback ? `
PREVIOUS POST:
${feedback.post}

FEEDBACK TO ADDRESS:
${feedback.issues.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}

Fix ALL issues using the research data above.
` : ''}

Write a viral LinkedIn post that would impress a Wharton MBA restaurant analyst.
- Use specific numbers and data
- Explain WHY mechanisms work
- Include historical context
- Add industry comparisons
- 1500-2200 characters
- NO hashtags, NO emojis

Output ONLY the post.`;

  const result = await taylorExa.generate(prompt);
  return result.text || '';
}

async function jamesEvaluate(post: string, topic: string): Promise<{ score: number; issues: string[]; approved: boolean }> {
  const result = await jamesExa.generate(`
Evaluate this LinkedIn post about "${topic}":

${post}

Return JSON: { "score": 0-100, "verdict": "APPROVED/NEEDS_REVISION", "issues": ["specific issue 1", "specific issue 2"] }`);

  try {
    const match = result.text?.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      return {
        score: parsed.score || 50,
        issues: parsed.issues || [],
        approved: parsed.score >= 75,
      };
    }
  } catch {}
  
  return { score: 50, issues: ['Could not parse'], approved: false };
}

// ============================================================================
// MAIN PIPELINE STEP
// ============================================================================

const completePipelineStep = createStep({
  id: 'complete-pipeline',
  description: 'Full pipeline: Research → Write → Evaluate → Loop',
  inputSchema: pipelineInputSchema,
  outputSchema: pipelineOutputSchema,
  execute: async ({ inputData }) => {
    const startTime = Date.now();
    const topic = inputData.topic;

    console.log('\n' + '='.repeat(70));
    console.log('🚀 COMPLETE CONTENT PIPELINE');
    console.log('='.repeat(70));
    console.log(`📋 Topic: ${topic}`);
    console.log('='.repeat(70));

    // ========== PHASE 1: RESEARCH ==========
    console.log('\n' + '='.repeat(70));
    console.log('📚 PHASE 1: RESEARCH (3 Rounds)');
    console.log('='.repeat(70));

    let totalQueries = 0;
    const rounds: { alexData: string; davidReport: string; queryCount: number }[] = [];

    // Round 1: Broad exploration
    console.log('\n--- ROUND 1: Broad Exploration ---');
    const alex1 = await runAlexQueries(topic, '', 1);
    const david1 = await runDavidResearch(topic, '', 1);
    rounds.push({ alexData: alex1.data, davidReport: david1, queryCount: alex1.count });
    totalQueries += alex1.count;

    // Get strategist guidance for round 2
    const strat1 = await strategistExa.generate(
      `Based on research about "${topic}", what should round 2 focus on? Be specific.`
    );
    const guidance2 = strat1.text?.substring(0, 200) || '';

    // Round 2: Focused investigation  
    console.log('\n--- ROUND 2: Focused Investigation ---');
    const alex2 = await runAlexQueries(topic, guidance2, 2);
    const david2 = await runDavidResearch(topic, guidance2, 2);
    rounds.push({ alexData: alex2.data, davidReport: david2, queryCount: alex2.count });
    totalQueries += alex2.count;

    // Get strategist guidance for round 3
    const strat2 = await strategistExa.generate(
      `Based on 2 rounds of research about "${topic}", what gaps remain? What should round 3 focus on?`
    );
    const guidance3 = strat2.text?.substring(0, 200) || '';

    // Round 3: Precision completion
    console.log('\n--- ROUND 3: Precision Completion ---');
    const alex3 = await runAlexQueries(topic, guidance3, 3);
    const david3 = await runDavidResearch(topic, guidance3, 3);
    rounds.push({ alexData: alex3.data, davidReport: david3, queryCount: alex3.count });
    totalQueries += alex3.count;

    // Combine all research
    const combinedResearch = `
# COMPLETE RESEARCH: ${topic}

## ROUND 1 - BROAD EXPLORATION
### Financial Data (${rounds[0].queryCount} queries):
${rounds[0].alexData}

### Strategic Research:
${rounds[0].davidReport}

## ROUND 2 - FOCUSED INVESTIGATION
### Financial Data (${rounds[1].queryCount} queries):
${rounds[1].alexData}

### Strategic Research:
${rounds[1].davidReport}

## ROUND 3 - PRECISION COMPLETION
### Financial Data (${rounds[2].queryCount} queries):
${rounds[2].alexData}

### Strategic Research:
${rounds[2].davidReport}
`;

    console.log(`\n📊 Research complete: ${totalQueries} queries, 3 deep research`);
    console.log(`📏 Total: ${combinedResearch.length} characters`);

    // Save research locally
    const researchFile = saveResearchData(topic, {
      topic,
      generatedAt: new Date().toISOString(),
      totalQueries,
      totalDeepResearch: 3,
      combinedResearch,
      rounds,
    });

    // ========== PHASE 2: WRITE + EVALUATE LOOP ==========
    console.log('\n' + '='.repeat(70));
    console.log('✍️ PHASE 2: WRITE + EVALUATE (4 iterations max)');
    console.log('='.repeat(70));

    let currentPost = '';
    let currentScore = 0;
    let approved = false;
    let iteration = 0;
    let lastFeedback: { post: string; issues: string[] } | undefined;

    while (!approved && iteration < 4) {
      iteration++;
      console.log(`\n--- Iteration ${iteration} ---`);

      // Taylor writes
      currentPost = await taylorWrite(topic, combinedResearch, lastFeedback, iteration);
      console.log(`✍️ Taylor: ${currentPost.length} chars`);

      // James evaluates
      const evaluation = await jamesEvaluate(currentPost, topic);
      currentScore = evaluation.score;
      approved = evaluation.approved;

      console.log(`🔍 James: ${currentScore}/100 | ${approved ? 'APPROVED ✅' : 'NEEDS_REVISION'}`);
      
      if (!approved && evaluation.issues.length > 0) {
        console.log(`📋 Issues: ${evaluation.issues[0].substring(0, 50)}...`);
        lastFeedback = { post: currentPost, issues: evaluation.issues };
      }
    }

    // ========== RESULTS ==========
    const duration = Math.round((Date.now() - startTime) / 1000);

    console.log('\n' + '='.repeat(70));
    console.log('🎉 PIPELINE COMPLETE');
    console.log('='.repeat(70));
    console.log(`📊 Final Score: ${currentScore}/100`);
    console.log(`✅ Approved: ${approved ? 'YES' : 'NO (best effort)'}`);
    console.log(`📝 Iterations: ${iteration}`);
    console.log(`⏱️ Duration: ${duration}s`);
    console.log(`💾 Research saved: ${researchFile}`);

    return {
      topic,
      finalPost: currentPost,
      finalScore: currentScore,
      approved,
      totalIterations: iteration,
      researchFile,
      stats: {
        totalQueries,
        totalDeepResearch: 3,
        researchCharacters: combinedResearch.length,
        postCharacters: currentPost.length,
        durationSeconds: duration,
      },
    };
  },
});

// ============================================================================
// WORKFLOW
// ============================================================================

export const completeContentPipeline = createWorkflow({
  id: 'complete-content-pipeline',
  description: 'Topic → Research (saved) → Taylor → James Loop → Approved Post',
  inputSchema: pipelineInputSchema,
  outputSchema: pipelineOutputSchema,
})
  .then(completePipelineStep);

completeContentPipeline.commit();

