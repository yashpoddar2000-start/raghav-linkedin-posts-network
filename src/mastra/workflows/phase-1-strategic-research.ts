/**
 * Phase 1: Strategic Research Workflow
 * 
 * 3-round progressive intelligence research:
 * - Round 1: Broad exploration (15 Alex queries + 1 David research)
 * - Round 2: Focused investigation based on patterns (15 + 1)
 * - Round 3: Precision completion to fill gaps (15 + 1)
 * 
 * Total: 45 Alex queries + 3 David research prompts
 * Uses strategist agent for pivot decisions between rounds.
 */

import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { alexTest } from '../agents/test-agents/alex-test';
import { davidTest } from '../agents/test-agents/david-test';
import { strategistTest } from '../agents/test-agents/strategist-test';

// ============================================================================
// SCHEMAS
// ============================================================================

const researchInputSchema = z.object({
  topic: z.string().describe('QSR industry topic for research'),
  runId: z.string().describe('Unique identifier for this research session'),
});

const alexFindingsSchema = z.object({
  findings: z.array(z.object({
    query: z.string(),
    answer: z.string(),
    source: z.string(),
    dataQuality: z.string(),
  })),
  summary: z.object({
    totalFindings: z.number(),
    keyMetrics: z.array(z.string()),
    dataGaps: z.array(z.string()),
  }),
  round: z.number(),
});

const davidResearchSchema = z.object({
  researchAngle: z.string(),
  findings: z.string(),
  keyMechanisms: z.array(z.string()),
  managementQuotes: z.array(z.object({
    quote: z.string(),
    speaker: z.string(),
    context: z.string(),
  })),
  strategicImplications: z.array(z.string()),
  round: z.number(),
});

const strategistAnalysisSchema = z.object({
  emergingNarrative: z.string(),
  patternsIdentified: z.array(z.string()),
  dataGaps: z.array(z.string()),
  alexNextRoundGuidance: z.string(),
  davidNextRoundGuidance: z.string(),
  narrativeCompleteness: z.number(),
  viralPotential: z.string(),
  pivotDecision: z.string(),
  pivotReason: z.string(),
});

const phase1OutputSchema = z.object({
  allAlexFindings: z.array(alexFindingsSchema),
  allDavidResearch: z.array(davidResearchSchema),
  allStrategistAnalysis: z.array(strategistAnalysisSchema),
  finalNarrative: z.string(),
  totalQueries: z.number(),
  totalResearchPrompts: z.number(),
  readyForPhase2: z.boolean(),
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function parseJsonResponse(text: string): any {
  try {
    // Try direct parse first
    return JSON.parse(text);
  } catch {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1].trim());
    }
    // Try to find JSON object in text
    const objectMatch = text.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      return JSON.parse(objectMatch[0]);
    }
    throw new Error('Could not parse JSON from response');
  }
}

// ============================================================================
// ROUND 1: BROAD EXPLORATION
// ============================================================================

const alexRound1Step = createStep({
  id: 'alex-round-1',
  description: 'Alex executes 15 broad financial exploration queries',
  inputSchema: researchInputSchema,
  outputSchema: z.object({
    alexFindings: alexFindingsSchema,
    topic: z.string(),
    runId: z.string(),
  }),
  execute: async ({ inputData }) => {
    console.log(`\n📊 ROUND 1: Alex - Broad Financial Exploration`);
    console.log(`   Topic: ${inputData.topic}`);

    const alexPrompt = `Research topic: "${inputData.topic}"

This is ROUND 1 of 3 - BROAD EXPLORATION phase.

Generate 15 broad financial exploration queries and their findings for this QSR topic.
Focus on: revenue, margins, store counts, unit economics, competitive benchmarks, and industry metrics.

Return your findings in the required JSON format with round: 1`;

    const result = await alexTest.generate(alexPrompt);
    const parsed = parseJsonResponse(result.text || '{}');
    
    console.log(`   ✅ Alex Round 1: ${parsed.findings?.length || 0} findings generated`);

    return {
      alexFindings: {
        findings: parsed.findings || [],
        summary: parsed.summary || { totalFindings: 0, keyMetrics: [], dataGaps: [] },
        round: 1,
      },
      topic: inputData.topic,
      runId: inputData.runId,
    };
  },
});

const davidRound1Step = createStep({
  id: 'david-round-1',
  description: 'David executes 1 strategic research prompt for industry context',
  inputSchema: z.object({
    alexFindings: alexFindingsSchema,
    topic: z.string(),
    runId: z.string(),
  }),
  outputSchema: z.object({
    alexFindings: alexFindingsSchema,
    davidResearch: davidResearchSchema,
    topic: z.string(),
    runId: z.string(),
  }),
  execute: async ({ inputData }) => {
    console.log(`\n🔬 ROUND 1: David - Strategic Industry Research`);

    const davidPrompt = `Research topic: "${inputData.topic}"

This is ROUND 1 of 3 - BROAD EXPLORATION phase.

Alex has gathered these initial financial findings:
${JSON.stringify(inputData.alexFindings.summary.keyMetrics, null, 2)}

Generate 1 strategic research finding focusing on broad industry landscape and competitive dynamics.

Return your findings in the required JSON format with round: 1`;

    const result = await davidTest.generate(davidPrompt);
    const parsed = parseJsonResponse(result.text || '{}');
    
    console.log(`   ✅ David Round 1: Research on "${parsed.researchAngle || 'industry dynamics'}"`);

    return {
      alexFindings: inputData.alexFindings,
      davidResearch: {
        researchAngle: parsed.researchAngle || 'Industry landscape',
        findings: parsed.findings || '',
        keyMechanisms: parsed.keyMechanisms || [],
        managementQuotes: parsed.managementQuotes || [],
        strategicImplications: parsed.strategicImplications || [],
        round: 1,
      },
      topic: inputData.topic,
      runId: inputData.runId,
    };
  },
});

const strategistRound1Step = createStep({
  id: 'strategist-round-1',
  description: 'Strategist analyzes Round 1 and provides guidance for Round 2',
  inputSchema: z.object({
    alexFindings: alexFindingsSchema,
    davidResearch: davidResearchSchema,
    topic: z.string(),
    runId: z.string(),
  }),
  outputSchema: z.object({
    round1Data: z.object({
      alexFindings: alexFindingsSchema,
      davidResearch: davidResearchSchema,
    }),
    strategistAnalysis: strategistAnalysisSchema,
    topic: z.string(),
    runId: z.string(),
  }),
  execute: async ({ inputData }) => {
    console.log(`\n🎯 ROUND 1: Strategist - Pattern Analysis & Pivot Decision`);

    const strategistPrompt = `Analyze Round 1 research findings and provide guidance for Round 2.

TOPIC: ${inputData.topic}

ALEX'S FINANCIAL DATA (Round 1):
Key Metrics: ${JSON.stringify(inputData.alexFindings.summary.keyMetrics)}
Data Gaps: ${JSON.stringify(inputData.alexFindings.summary.dataGaps)}

DAVID'S STRATEGIC RESEARCH (Round 1):
Angle: ${inputData.davidResearch.researchAngle}
Key Mechanisms: ${JSON.stringify(inputData.davidResearch.keyMechanisms)}

Analyze the patterns, identify what narrative is emerging, and provide SPECIFIC guidance for Round 2.
Set narrativeCompleteness to around 35% for Round 1.

Return your analysis in the required JSON format.`;

    const result = await strategistTest.generate(strategistPrompt);
    const parsed = parseJsonResponse(result.text || '{}');
    
    console.log(`   ✅ Strategist Round 1: Narrative ${parsed.narrativeCompleteness || 35}% complete`);
    console.log(`   📍 Pivot Decision: ${parsed.pivotDecision || 'CONTINUE'}`);

    return {
      round1Data: {
        alexFindings: inputData.alexFindings,
        davidResearch: inputData.davidResearch,
      },
      strategistAnalysis: {
        emergingNarrative: parsed.emergingNarrative || '',
        patternsIdentified: parsed.patternsIdentified || [],
        dataGaps: parsed.dataGaps || [],
        alexNextRoundGuidance: parsed.alexNextRoundGuidance || '',
        davidNextRoundGuidance: parsed.davidNextRoundGuidance || '',
        narrativeCompleteness: parsed.narrativeCompleteness || 35,
        viralPotential: parsed.viralPotential || '',
        pivotDecision: parsed.pivotDecision || 'CONTINUE',
        pivotReason: parsed.pivotReason || '',
      },
      topic: inputData.topic,
      runId: inputData.runId,
    };
  },
});

// ============================================================================
// ROUND 2: FOCUSED INVESTIGATION
// ============================================================================

const alexRound2Step = createStep({
  id: 'alex-round-2',
  description: 'Alex executes 15 focused queries based on Round 1 insights',
  inputSchema: z.object({
    round1Data: z.object({
      alexFindings: alexFindingsSchema,
      davidResearch: davidResearchSchema,
    }),
    strategistAnalysis: strategistAnalysisSchema,
    topic: z.string(),
    runId: z.string(),
  }),
  outputSchema: z.object({
    round1Data: z.object({
      alexFindings: alexFindingsSchema,
      davidResearch: davidResearchSchema,
    }),
    round1Analysis: strategistAnalysisSchema,
    alexRound2Findings: alexFindingsSchema,
    topic: z.string(),
    runId: z.string(),
  }),
  execute: async ({ inputData }) => {
    console.log(`\n📊 ROUND 2: Alex - Focused Financial Investigation`);

    const alexPrompt = `Research topic: "${inputData.topic}"

This is ROUND 2 of 3 - FOCUSED INVESTIGATION phase.

STRATEGIST GUIDANCE: ${inputData.strategistAnalysis.alexNextRoundGuidance}

PATTERNS IDENTIFIED IN ROUND 1:
${JSON.stringify(inputData.strategistAnalysis.patternsIdentified)}

EMERGING NARRATIVE: ${inputData.strategistAnalysis.emergingNarrative}

Generate 15 FOCUSED financial queries based on this guidance. Dig deeper into the patterns identified.

Return your findings in the required JSON format with round: 2`;

    const result = await alexTest.generate(alexPrompt);
    const parsed = parseJsonResponse(result.text || '{}');
    
    console.log(`   ✅ Alex Round 2: ${parsed.findings?.length || 0} focused findings`);

    return {
      round1Data: inputData.round1Data,
      round1Analysis: inputData.strategistAnalysis,
      alexRound2Findings: {
        findings: parsed.findings || [],
        summary: parsed.summary || { totalFindings: 0, keyMetrics: [], dataGaps: [] },
        round: 2,
      },
      topic: inputData.topic,
      runId: inputData.runId,
    };
  },
});

const davidRound2Step = createStep({
  id: 'david-round-2',
  description: 'David executes 1 focused research prompt based on patterns',
  inputSchema: z.object({
    round1Data: z.object({
      alexFindings: alexFindingsSchema,
      davidResearch: davidResearchSchema,
    }),
    round1Analysis: strategistAnalysisSchema,
    alexRound2Findings: alexFindingsSchema,
    topic: z.string(),
    runId: z.string(),
  }),
  outputSchema: z.object({
    round1Data: z.object({
      alexFindings: alexFindingsSchema,
      davidResearch: davidResearchSchema,
    }),
    round2Data: z.object({
      alexFindings: alexFindingsSchema,
      davidResearch: davidResearchSchema,
    }),
    round1Analysis: strategistAnalysisSchema,
    topic: z.string(),
    runId: z.string(),
  }),
  execute: async ({ inputData }) => {
    console.log(`\n🔬 ROUND 2: David - Focused Strategic Research`);

    const davidPrompt = `Research topic: "${inputData.topic}"

This is ROUND 2 of 3 - FOCUSED INVESTIGATION phase.

STRATEGIST GUIDANCE: ${inputData.round1Analysis.davidNextRoundGuidance}

EMERGING NARRATIVE: ${inputData.round1Analysis.emergingNarrative}

ALEX'S ROUND 2 KEY FINDINGS:
${JSON.stringify(inputData.alexRound2Findings.summary.keyMetrics)}

Generate 1 FOCUSED strategic research finding that digs deeper into the mechanisms behind the patterns.

Return your findings in the required JSON format with round: 2`;

    const result = await davidTest.generate(davidPrompt);
    const parsed = parseJsonResponse(result.text || '{}');
    
    console.log(`   ✅ David Round 2: Research on "${parsed.researchAngle || 'focused mechanisms'}"`);

    return {
      round1Data: inputData.round1Data,
      round2Data: {
        alexFindings: inputData.alexRound2Findings,
        davidResearch: {
          researchAngle: parsed.researchAngle || 'Focused mechanisms',
          findings: parsed.findings || '',
          keyMechanisms: parsed.keyMechanisms || [],
          managementQuotes: parsed.managementQuotes || [],
          strategicImplications: parsed.strategicImplications || [],
          round: 2,
        },
      },
      round1Analysis: inputData.round1Analysis,
      topic: inputData.topic,
      runId: inputData.runId,
    };
  },
});

const strategistRound2Step = createStep({
  id: 'strategist-round-2',
  description: 'Strategist analyzes Round 1+2 and provides guidance for final round',
  inputSchema: z.object({
    round1Data: z.object({
      alexFindings: alexFindingsSchema,
      davidResearch: davidResearchSchema,
    }),
    round2Data: z.object({
      alexFindings: alexFindingsSchema,
      davidResearch: davidResearchSchema,
    }),
    round1Analysis: strategistAnalysisSchema,
    topic: z.string(),
    runId: z.string(),
  }),
  outputSchema: z.object({
    round1Data: z.object({
      alexFindings: alexFindingsSchema,
      davidResearch: davidResearchSchema,
    }),
    round2Data: z.object({
      alexFindings: alexFindingsSchema,
      davidResearch: davidResearchSchema,
    }),
    round1Analysis: strategistAnalysisSchema,
    round2Analysis: strategistAnalysisSchema,
    topic: z.string(),
    runId: z.string(),
  }),
  execute: async ({ inputData }) => {
    console.log(`\n🎯 ROUND 2: Strategist - Narrative Refinement & Final Round Planning`);

    const strategistPrompt = `Analyze COMBINED Round 1 + Round 2 research and plan the final round.

TOPIC: ${inputData.topic}

ROUND 1 NARRATIVE: ${inputData.round1Analysis.emergingNarrative}
ROUND 1 PATTERNS: ${JSON.stringify(inputData.round1Analysis.patternsIdentified)}

ROUND 2 ALEX DATA:
Key Metrics: ${JSON.stringify(inputData.round2Data.alexFindings.summary.keyMetrics)}

ROUND 2 DAVID RESEARCH:
Angle: ${inputData.round2Data.davidResearch.researchAngle}
Mechanisms: ${JSON.stringify(inputData.round2Data.davidResearch.keyMechanisms)}

How has the narrative evolved? What gaps remain for Round 3 to fill?
Set narrativeCompleteness to around 70% for Round 2.

Return your analysis in the required JSON format.`;

    const result = await strategistTest.generate(strategistPrompt);
    const parsed = parseJsonResponse(result.text || '{}');
    
    console.log(`   ✅ Strategist Round 2: Narrative ${parsed.narrativeCompleteness || 70}% complete`);
    console.log(`   📍 Final Gaps: ${(parsed.dataGaps || []).length} gaps to fill`);

    return {
      round1Data: inputData.round1Data,
      round2Data: inputData.round2Data,
      round1Analysis: inputData.round1Analysis,
      round2Analysis: {
        emergingNarrative: parsed.emergingNarrative || '',
        patternsIdentified: parsed.patternsIdentified || [],
        dataGaps: parsed.dataGaps || [],
        alexNextRoundGuidance: parsed.alexNextRoundGuidance || '',
        davidNextRoundGuidance: parsed.davidNextRoundGuidance || '',
        narrativeCompleteness: parsed.narrativeCompleteness || 70,
        viralPotential: parsed.viralPotential || '',
        pivotDecision: parsed.pivotDecision || 'CONTINUE',
        pivotReason: parsed.pivotReason || '',
      },
      topic: inputData.topic,
      runId: inputData.runId,
    };
  },
});

// ============================================================================
// ROUND 3: PRECISION COMPLETION
// ============================================================================

const alexRound3Step = createStep({
  id: 'alex-round-3',
  description: 'Alex executes 15 precision queries to fill narrative gaps',
  inputSchema: z.object({
    round1Data: z.object({
      alexFindings: alexFindingsSchema,
      davidResearch: davidResearchSchema,
    }),
    round2Data: z.object({
      alexFindings: alexFindingsSchema,
      davidResearch: davidResearchSchema,
    }),
    round1Analysis: strategistAnalysisSchema,
    round2Analysis: strategistAnalysisSchema,
    topic: z.string(),
    runId: z.string(),
  }),
  outputSchema: z.object({
    round1Data: z.object({
      alexFindings: alexFindingsSchema,
      davidResearch: davidResearchSchema,
    }),
    round2Data: z.object({
      alexFindings: alexFindingsSchema,
      davidResearch: davidResearchSchema,
    }),
    round1Analysis: strategistAnalysisSchema,
    round2Analysis: strategistAnalysisSchema,
    alexRound3Findings: alexFindingsSchema,
    topic: z.string(),
    runId: z.string(),
  }),
  execute: async ({ inputData }) => {
    console.log(`\n📊 ROUND 3: Alex - Precision Gap-Filling`);

    const alexPrompt = `Research topic: "${inputData.topic}"

This is ROUND 3 of 3 - PRECISION COMPLETION phase.

CURRENT NARRATIVE: ${inputData.round2Analysis.emergingNarrative}

GAPS TO FILL: ${JSON.stringify(inputData.round2Analysis.dataGaps)}

STRATEGIST GUIDANCE: ${inputData.round2Analysis.alexNextRoundGuidance}

Generate 15 PRECISION financial queries to fill these specific gaps and complete the narrative.

Return your findings in the required JSON format with round: 3`;

    const result = await alexTest.generate(alexPrompt);
    const parsed = parseJsonResponse(result.text || '{}');
    
    console.log(`   ✅ Alex Round 3: ${parsed.findings?.length || 0} precision findings`);

    return {
      round1Data: inputData.round1Data,
      round2Data: inputData.round2Data,
      round1Analysis: inputData.round1Analysis,
      round2Analysis: inputData.round2Analysis,
      alexRound3Findings: {
        findings: parsed.findings || [],
        summary: parsed.summary || { totalFindings: 0, keyMetrics: [], dataGaps: [] },
        round: 3,
      },
      topic: inputData.topic,
      runId: inputData.runId,
    };
  },
});

const davidRound3Step = createStep({
  id: 'david-round-3',
  description: 'David executes final strategic research to complete the narrative',
  inputSchema: z.object({
    round1Data: z.object({
      alexFindings: alexFindingsSchema,
      davidResearch: davidResearchSchema,
    }),
    round2Data: z.object({
      alexFindings: alexFindingsSchema,
      davidResearch: davidResearchSchema,
    }),
    round1Analysis: strategistAnalysisSchema,
    round2Analysis: strategistAnalysisSchema,
    alexRound3Findings: alexFindingsSchema,
    topic: z.string(),
    runId: z.string(),
  }),
  outputSchema: z.object({
    round1Data: z.object({
      alexFindings: alexFindingsSchema,
      davidResearch: davidResearchSchema,
    }),
    round2Data: z.object({
      alexFindings: alexFindingsSchema,
      davidResearch: davidResearchSchema,
    }),
    round3Data: z.object({
      alexFindings: alexFindingsSchema,
      davidResearch: davidResearchSchema,
    }),
    round1Analysis: strategistAnalysisSchema,
    round2Analysis: strategistAnalysisSchema,
    topic: z.string(),
    runId: z.string(),
  }),
  execute: async ({ inputData }) => {
    console.log(`\n🔬 ROUND 3: David - Final Strategic Research`);

    const davidPrompt = `Research topic: "${inputData.topic}"

This is ROUND 3 of 3 - PRECISION COMPLETION phase.

STRATEGIST GUIDANCE: ${inputData.round2Analysis.davidNextRoundGuidance}

CURRENT NARRATIVE: ${inputData.round2Analysis.emergingNarrative}

ALEX'S FINAL KEY METRICS:
${JSON.stringify(inputData.alexRound3Findings.summary.keyMetrics)}

Generate 1 FINAL strategic research finding that completes the narrative with strategic context.

Return your findings in the required JSON format with round: 3`;

    const result = await davidTest.generate(davidPrompt);
    const parsed = parseJsonResponse(result.text || '{}');
    
    console.log(`   ✅ David Round 3: Final research on "${parsed.researchAngle || 'narrative completion'}"`);

    return {
      round1Data: inputData.round1Data,
      round2Data: inputData.round2Data,
      round3Data: {
        alexFindings: inputData.alexRound3Findings,
        davidResearch: {
          researchAngle: parsed.researchAngle || 'Final strategic context',
          findings: parsed.findings || '',
          keyMechanisms: parsed.keyMechanisms || [],
          managementQuotes: parsed.managementQuotes || [],
          strategicImplications: parsed.strategicImplications || [],
          round: 3,
        },
      },
      round1Analysis: inputData.round1Analysis,
      round2Analysis: inputData.round2Analysis,
      topic: inputData.topic,
      runId: inputData.runId,
    };
  },
});

// ============================================================================
// FINAL SYNTHESIS
// ============================================================================

const finalSynthesisStep = createStep({
  id: 'final-synthesis',
  description: 'Synthesize all 3 rounds into complete research package',
  inputSchema: z.object({
    round1Data: z.object({
      alexFindings: alexFindingsSchema,
      davidResearch: davidResearchSchema,
    }),
    round2Data: z.object({
      alexFindings: alexFindingsSchema,
      davidResearch: davidResearchSchema,
    }),
    round3Data: z.object({
      alexFindings: alexFindingsSchema,
      davidResearch: davidResearchSchema,
    }),
    round1Analysis: strategistAnalysisSchema,
    round2Analysis: strategistAnalysisSchema,
    topic: z.string(),
    runId: z.string(),
  }),
  outputSchema: phase1OutputSchema,
  execute: async ({ inputData }) => {
    console.log(`\n📋 FINAL SYNTHESIS: Compiling complete research package`);

    // Compile all data
    const allAlexFindings = [
      inputData.round1Data.alexFindings,
      inputData.round2Data.alexFindings,
      inputData.round3Data.alexFindings,
    ];

    const allDavidResearch = [
      inputData.round1Data.davidResearch,
      inputData.round2Data.davidResearch,
      inputData.round3Data.davidResearch,
    ];

    const allStrategistAnalysis = [
      inputData.round1Analysis,
      inputData.round2Analysis,
    ];

    // Calculate totals
    const totalQueries = allAlexFindings.reduce(
      (sum, round) => sum + (round.findings?.length || 0), 
      0
    );

    console.log(`\n✅ PHASE 1 COMPLETE`);
    console.log(`   📊 Total Alex Queries: ${totalQueries}`);
    console.log(`   🔬 Total David Research: ${allDavidResearch.length}`);
    console.log(`   📍 Final Narrative: ${inputData.round2Analysis.emergingNarrative.substring(0, 100)}...`);

    return {
      allAlexFindings,
      allDavidResearch,
      allStrategistAnalysis,
      finalNarrative: inputData.round2Analysis.emergingNarrative,
      totalQueries,
      totalResearchPrompts: allDavidResearch.length,
      readyForPhase2: true,
    };
  },
});

// ============================================================================
// WORKFLOW ASSEMBLY
// ============================================================================

export const phase1StrategicResearchWorkflow = createWorkflow({
  id: 'phase-1-strategic-research',
  description: '3-round progressive intelligence research with Alex, David, and Strategist',
  inputSchema: researchInputSchema,
  outputSchema: phase1OutputSchema,
})
  // ROUND 1: BROAD EXPLORATION
  .then(alexRound1Step)
  .then(davidRound1Step)
  .then(strategistRound1Step)
  
  // ROUND 2: FOCUSED INVESTIGATION
  .then(alexRound2Step)
  .then(davidRound2Step)
  .then(strategistRound2Step)
  
  // ROUND 3: PRECISION COMPLETION
  .then(alexRound3Step)
  .then(davidRound3Step)
  
  // FINAL SYNTHESIS
  .then(finalSynthesisStep);

phase1StrategicResearchWorkflow.commit();

