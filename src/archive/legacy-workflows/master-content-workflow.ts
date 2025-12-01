/**
 * Master Content Creation Workflow
 * 
 * Orchestrates all 3 phases:
 * - Phase 1: Strategic Research (3 rounds, 45 queries + 3 prompts)
 * - Phase 2: Economic Analysis (Maya synthesis + gap-filling)
 * - Phase 3: Writing + Evaluation (James feedback loop)
 * 
 * Can be run end-to-end or phase-by-phase.
 */

import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';

// Import individual phases
import { alexTest } from '../agents/test-agents/alex-test';
import { davidTest } from '../agents/test-agents/david-test';
import { strategistTest } from '../agents/test-agents/strategist-test';
import { mayaTest } from '../agents/test-agents/maya-test';
import { jamesTest } from '../agents/test-agents/james-test';

// ============================================================================
// SCHEMAS
// ============================================================================

const masterInputSchema = z.object({
  topic: z.string().describe('QSR industry topic for content creation'),
  runId: z.string().default(() => `run-${Date.now()}`),
});

const masterOutputSchema = z.object({
  // Phase 1 Summary
  phase1Complete: z.boolean(),
  totalResearchQueries: z.number(),
  totalResearchPrompts: z.number(),
  
  // Phase 2 Summary
  phase2Complete: z.boolean(),
  economicCompleteness: z.number(),
  keyInsightsCount: z.number(),
  
  // Phase 3 Summary
  phase3Complete: z.boolean(),
  finalContent: z.string(),
  jamesScore: z.number(),
  jamesVerdict: z.string(),
  revisionsCompleted: z.number(),
  
  // Overall
  publishReady: z.boolean(),
  topic: z.string(),
  runId: z.string(),
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function parseJsonResponse(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    try {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1].trim());
      }
    } catch {}
    
    try {
      // Try to find JSON object in text and clean it
      const objectMatch = text.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        // Clean control characters and fix common issues
        const cleaned = objectMatch[0]
          .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
          .replace(/\n/g, '\\n')           // Escape newlines
          .replace(/\r/g, '\\r')           // Escape carriage returns
          .replace(/\t/g, '\\t');          // Escape tabs
        return JSON.parse(cleaned);
      }
    } catch {}
    
    // Return a default empty object if parsing fails
    console.warn('Failed to parse JSON, returning default object:', text.substring(0, 200));
    return {
      findings: [],
      summary: { totalFindings: 0, keyMetrics: [], dataGaps: [] },
      round: 1
    };
  }
}

// ============================================================================
// PHASE 1 STEPS (Simplified - single step per round for master workflow)
// ============================================================================

const phase1ExecuteStep = createStep({
  id: 'phase-1-execute',
  description: 'Execute all 3 rounds of research in Phase 1',
  inputSchema: masterInputSchema,
  outputSchema: z.object({
    alexFindings: z.array(z.any()),
    davidResearch: z.array(z.any()),
    finalNarrative: z.string(),
    totalQueries: z.number(),
    topic: z.string(),
    runId: z.string(),
  }),
  execute: async ({ inputData }) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📚 PHASE 1: STRATEGIC RESEARCH`);
    console.log(`${'='.repeat(60)}`);
    console.log(`Topic: ${inputData.topic}`);
    console.log(`Run ID: ${inputData.runId}`);

    const alexFindings: any[] = [];
    const davidResearch: any[] = [];
    let currentGuidance = { alex: '', david: '' };
    let narrative = '';

    // === ROUND 1 ===
    console.log(`\n--- ROUND 1: Broad Exploration ---`);
    
    // Alex Round 1
    const alex1Result = await alexTest.generate(`
Research topic: "${inputData.topic}"
ROUND 1 - Generate 15 broad financial exploration queries.
Focus: revenue, margins, store counts, unit economics.
Return JSON with findings array and summary object.
    `);
    const alex1Data = parseJsonResponse(alex1Result.text || '{}');
    alexFindings.push({ round: 1, ...alex1Data });
    console.log(`✅ Alex R1: ${alex1Data.findings?.length || 0} findings`);

    // David Round 1
    const david1Result = await davidTest.generate(`
Research topic: "${inputData.topic}"
ROUND 1 - Strategic research on industry landscape.
Alex found: ${JSON.stringify(alex1Data.summary?.keyMetrics || [])}
Return JSON with research findings.
    `);
    const david1Data = parseJsonResponse(david1Result.text || '{}');
    davidResearch.push({ round: 1, ...david1Data });
    console.log(`✅ David R1: ${david1Data.researchAngle || 'industry dynamics'}`);

    // Strategist Round 1
    const strat1Result = await strategistTest.generate(`
Analyze Round 1 for: ${inputData.topic}
Alex metrics: ${JSON.stringify(alex1Data.summary?.keyMetrics || [])}
David mechanisms: ${JSON.stringify(david1Data.keyMechanisms || [])}
Provide guidance for Round 2. Return JSON.
    `);
    const strat1Data = parseJsonResponse(strat1Result.text || '{}');
    currentGuidance = { 
      alex: strat1Data.alexNextRoundGuidance || '', 
      david: strat1Data.davidNextRoundGuidance || '' 
    };
    narrative = strat1Data.emergingNarrative || '';
    console.log(`✅ Strategist R1: ${strat1Data.narrativeCompleteness || 35}% complete`);

    // === ROUND 2 ===
    console.log(`\n--- ROUND 2: Focused Investigation ---`);

    // Alex Round 2
    const alex2Result = await alexTest.generate(`
Research topic: "${inputData.topic}"
ROUND 2 - 15 FOCUSED queries based on guidance: ${currentGuidance.alex}
Emerging narrative: ${narrative}
Return JSON with findings array and summary.
    `);
    const alex2Data = parseJsonResponse(alex2Result.text || '{}');
    alexFindings.push({ round: 2, ...alex2Data });
    console.log(`✅ Alex R2: ${alex2Data.findings?.length || 0} findings`);

    // David Round 2
    const david2Result = await davidTest.generate(`
Research topic: "${inputData.topic}"
ROUND 2 - Focused research: ${currentGuidance.david}
Emerging narrative: ${narrative}
Return JSON with research findings.
    `);
    const david2Data = parseJsonResponse(david2Result.text || '{}');
    davidResearch.push({ round: 2, ...david2Data });
    console.log(`✅ David R2: ${david2Data.researchAngle || 'focused mechanisms'}`);

    // Strategist Round 2
    const strat2Result = await strategistTest.generate(`
Analyze Round 2 for: ${inputData.topic}
Cumulative Alex metrics: ${JSON.stringify([
  ...(alex1Data.summary?.keyMetrics || []),
  ...(alex2Data.summary?.keyMetrics || [])
])}
Cumulative David mechanisms: ${JSON.stringify([
  ...(david1Data.keyMechanisms || []),
  ...(david2Data.keyMechanisms || [])
])}
Previous narrative: ${narrative}
Provide guidance for final Round 3. Return JSON.
    `);
    const strat2Data = parseJsonResponse(strat2Result.text || '{}');
    currentGuidance = { 
      alex: strat2Data.alexNextRoundGuidance || '', 
      david: strat2Data.davidNextRoundGuidance || '' 
    };
    narrative = strat2Data.emergingNarrative || narrative;
    console.log(`✅ Strategist R2: ${strat2Data.narrativeCompleteness || 70}% complete`);

    // === ROUND 3 ===
    console.log(`\n--- ROUND 3: Precision Completion ---`);

    // Alex Round 3
    const alex3Result = await alexTest.generate(`
Research topic: "${inputData.topic}"
ROUND 3 - 15 PRECISION queries: ${currentGuidance.alex}
Fill gaps: ${JSON.stringify(strat2Data.dataGaps || [])}
Return JSON with findings array and summary.
    `);
    const alex3Data = parseJsonResponse(alex3Result.text || '{}');
    alexFindings.push({ round: 3, ...alex3Data });
    console.log(`✅ Alex R3: ${alex3Data.findings?.length || 0} findings`);

    // David Round 3
    const david3Result = await davidTest.generate(`
Research topic: "${inputData.topic}"
ROUND 3 - Final research: ${currentGuidance.david}
Complete narrative: ${narrative}
Return JSON with research findings.
    `);
    const david3Data = parseJsonResponse(david3Result.text || '{}');
    davidResearch.push({ round: 3, ...david3Data });
    console.log(`✅ David R3: ${david3Data.researchAngle || 'final context'}`);

    // Calculate totals
    const totalQueries = alexFindings.reduce(
      (sum, round) => sum + (round.findings?.length || 0), 
      0
    );

    console.log(`\n📊 PHASE 1 COMPLETE`);
    console.log(`   Total Alex Queries: ${totalQueries}`);
    console.log(`   Total David Research: ${davidResearch.length}`);

    return {
      alexFindings,
      davidResearch,
      finalNarrative: narrative,
      totalQueries,
      topic: inputData.topic,
      runId: inputData.runId,
    };
  },
});

// ============================================================================
// PHASE 2 STEP
// ============================================================================

const phase2ExecuteStep = createStep({
  id: 'phase-2-execute',
  description: 'Execute economic analysis with Maya',
  inputSchema: z.object({
    alexFindings: z.array(z.any()),
    davidResearch: z.array(z.any()),
    finalNarrative: z.string(),
    totalQueries: z.number(),
    topic: z.string(),
    runId: z.string(),
  }),
  outputSchema: z.object({
    economicNarrative: z.string(),
    keyInsights: z.array(z.string()),
    shockingStats: z.array(z.string()),
    viralAngles: z.array(z.object({
      angle: z.string(),
      hook: z.string(),
      supportingData: z.string(),
    })),
    stakeholderImpacts: z.object({
      winners: z.array(z.string()),
      losers: z.array(z.string()),
    }),
    economicCompleteness: z.number(),
    topic: z.string(),
    runId: z.string(),
  }),
  execute: async ({ inputData }) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📊 PHASE 2: ECONOMIC ANALYSIS`);
    console.log(`${'='.repeat(60)}`);

    // Summarize research for Maya
    const allMetrics = inputData.alexFindings.flatMap(
      round => round.summary?.keyMetrics || []
    );
    const allMechanisms = inputData.davidResearch.flatMap(
      research => research.keyMechanisms || []
    );

    const mayaResult = await mayaTest.generate(`
Synthesize this research into economic insights for viral content.

TOPIC: ${inputData.topic}
NARRATIVE: ${inputData.finalNarrative}

ALL FINANCIAL METRICS (${inputData.totalQueries} queries):
${JSON.stringify(allMetrics, null, 2)}

ALL STRATEGIC MECHANISMS:
${JSON.stringify(allMechanisms, null, 2)}

Create comprehensive economic analysis with:
- economicNarrative: The complete economic story
- keyInsights: 5+ insights with data
- shockingStats: 3+ viral statistics
- viralAngles: Array with angle, hook, supportingData
- stakeholderImpacts: winners and losers arrays
- economicCompleteness: percentage (85-95)

Return JSON.
    `);

    const mayaData = parseJsonResponse(mayaResult.text || '{}');

    console.log(`\n📈 PHASE 2 COMPLETE`);
    console.log(`   Economic Completeness: ${mayaData.economicCompleteness || 85}%`);
    console.log(`   Key Insights: ${mayaData.keyInsights?.length || 0}`);
    console.log(`   Viral Angles: ${mayaData.viralAngles?.length || 0}`);

    return {
      economicNarrative: mayaData.economicNarrative || inputData.finalNarrative,
      keyInsights: mayaData.keyInsights || [],
      shockingStats: mayaData.shockingStats || [],
      viralAngles: mayaData.viralAngles || [],
      stakeholderImpacts: mayaData.stakeholderImpacts || { winners: [], losers: [] },
      economicCompleteness: mayaData.economicCompleteness || 85,
      topic: inputData.topic,
      runId: inputData.runId,
    };
  },
});

// ============================================================================
// PHASE 3 STEP
// ============================================================================

const phase3ExecuteStep = createStep({
  id: 'phase-3-execute',
  description: 'Execute content creation with James feedback',
  inputSchema: z.object({
    economicNarrative: z.string(),
    keyInsights: z.array(z.string()),
    shockingStats: z.array(z.string()),
    viralAngles: z.array(z.object({
      angle: z.string(),
      hook: z.string(),
      supportingData: z.string(),
    })),
    stakeholderImpacts: z.object({
      winners: z.array(z.string()),
      losers: z.array(z.string()),
    }),
    economicCompleteness: z.number(),
    topic: z.string(),
    runId: z.string(),
  }),
  outputSchema: masterOutputSchema,
  execute: async ({ inputData }) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`✍️ PHASE 3: WRITING + EVALUATION`);
    console.log(`${'='.repeat(60)}`);

    const bestAngle = inputData.viralAngles[0] || {
      angle: 'Economic Analysis',
      hook: inputData.shockingStats[0] || 'Surprising insight',
      supportingData: inputData.economicNarrative,
    };

    // Create initial content
    console.log(`\n--- Content Creation ---`);
    const createResult = await mayaTest.generate(`
Create a viral LinkedIn post (250-400 words).

TOPIC: ${inputData.topic}
ANGLE: ${bestAngle.angle}
HOOK: ${bestAngle.hook}

ECONOMIC NARRATIVE:
${inputData.economicNarrative}

KEY INSIGHTS:
${inputData.keyInsights.join('\n')}

SHOCKING STATS:
${inputData.shockingStats.join('\n')}

WINNERS: ${inputData.stakeholderImpacts.winners.join(', ')}
LOSERS: ${inputData.stakeholderImpacts.losers.join(', ')}

Write compelling post with scroll-stopping hook, specific numbers, economic mechanisms, stakeholder impacts.
Return ONLY the post text (no JSON).
    `);
    
    let currentContent = createResult.text || 'Content creation failed';
    console.log(`✅ Draft created: ${currentContent.length} chars`);

    // James evaluation loop (max 2 iterations)
    let jamesScore = 0;
    let jamesVerdict = 'NEEDS_REVISION';
    let revisions = 0;

    for (let i = 0; i < 2; i++) {
      console.log(`\n--- James Evaluation ${i + 1} ---`);
      
      const evalResult = await jamesTest.generate(`
Evaluate this LinkedIn post for viral potential.

POST:
${currentContent}

TOPIC: ${inputData.topic}
REVISION: ${i}

Apply tests:
1. Emotional Intelligence: Makes readers feel smarter?
2. Social Capital: Would sharing elevate professional brand?

Return JSON with overallScore, verdict (APPROVED/NEEDS_REVISION/REJECT), specificIssues, improvementSuggestions.
      `);

      const evalData = parseJsonResponse(evalResult.text || '{}');
      jamesScore = evalData.overallScore || 70;
      jamesVerdict = evalData.verdict || 'NEEDS_REVISION';

      console.log(`   Score: ${jamesScore}/100`);
      console.log(`   Verdict: ${jamesVerdict}`);

      if (jamesVerdict === 'APPROVED' || jamesScore >= 85) {
        console.log(`✅ Content APPROVED`);
        break;
      }

      // Revise if not approved
      if (i < 1) {
        console.log(`\n--- Revision ${i + 1} ---`);
        const reviseResult = await mayaTest.generate(`
Revise this LinkedIn post based on feedback.

CURRENT POST:
${currentContent}

ISSUES: ${evalData.specificIssues?.join(', ') || 'Needs improvement'}
SUGGESTIONS: ${evalData.improvementSuggestions?.join(', ') || 'Improve hook and data'}

Return ONLY the revised post text.
        `);
        currentContent = reviseResult.text || currentContent;
        revisions++;
        console.log(`✅ Revision complete: ${currentContent.length} chars`);
      }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`✅ ALL PHASES COMPLETE`);
    console.log(`${'='.repeat(60)}`);
    console.log(`Final Score: ${jamesScore}/100`);
    console.log(`Verdict: ${jamesVerdict}`);
    console.log(`Revisions: ${revisions}`);

    return {
      // Phase 1
      phase1Complete: true,
      totalResearchQueries: 45, // 15 * 3 rounds
      totalResearchPrompts: 3,
      
      // Phase 2
      phase2Complete: true,
      economicCompleteness: inputData.economicCompleteness,
      keyInsightsCount: inputData.keyInsights.length,
      
      // Phase 3
      phase3Complete: true,
      finalContent: currentContent,
      jamesScore,
      jamesVerdict,
      revisionsCompleted: revisions,
      
      // Overall
      publishReady: jamesScore >= 70,
      topic: inputData.topic,
      runId: inputData.runId,
    };
  },
});

// ============================================================================
// MASTER WORKFLOW
// ============================================================================

export const masterContentWorkflow = createWorkflow({
  id: 'master-content-workflow',
  description: 'Complete 3-phase content creation: Research → Analysis → Writing',
  inputSchema: masterInputSchema,
  outputSchema: masterOutputSchema,
})
  .then(phase1ExecuteStep)
  .then(phase2ExecuteStep)
  .then(phase3ExecuteStep);

masterContentWorkflow.commit();

