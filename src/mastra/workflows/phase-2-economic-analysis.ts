/**
 * Phase 2: Economic Analysis Workflow
 * 
 * Takes research data from Phase 1 and synthesizes into economic insights:
 * - Maya initial analysis of all research data
 * - Gap analysis to identify missing economic angles
 * - Conditional additional research if critical gaps
 * - Enhanced economic synthesis
 * - Final economic package for writing phase
 */

import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { mayaTest } from '../agents/test-agents/maya-test';
import { alexTest } from '../agents/test-agents/alex-test';
import { strategistTest } from '../agents/test-agents/strategist-test';

// ============================================================================
// SCHEMAS
// ============================================================================

// Import-compatible schema for Phase 1 output
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

const phase2InputSchema = z.object({
  allAlexFindings: z.array(alexFindingsSchema),
  allDavidResearch: z.array(davidResearchSchema),
  finalNarrative: z.string(),
  totalQueries: z.number(),
  topic: z.string(),
  runId: z.string(),
});

const economicAnalysisSchema = z.object({
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
  gapsIdentified: z.array(z.string()),
  needsAdditionalResearch: z.boolean(),
  economicCompleteness: z.number(),
});

const phase2OutputSchema = z.object({
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
  readyForPhase3: z.boolean(),
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
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1].trim());
    }
    const objectMatch = text.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      return JSON.parse(objectMatch[0]);
    }
    throw new Error('Could not parse JSON from response');
  }
}

// ============================================================================
// STEPS
// ============================================================================

const mayaInitialAnalysisStep = createStep({
  id: 'maya-initial-analysis',
  description: 'Maya synthesizes all research into initial economic analysis',
  inputSchema: phase2InputSchema,
  outputSchema: z.object({
    initialAnalysis: economicAnalysisSchema,
    researchData: phase2InputSchema,
  }),
  execute: async ({ inputData }) => {
    console.log(`\n📊 PHASE 2: Maya - Initial Economic Analysis`);
    console.log(`   Processing ${inputData.totalQueries} queries + ${inputData.allDavidResearch.length} research prompts`);

    // Summarize research for Maya
    const alexSummary = inputData.allAlexFindings.map(round => ({
      round: round.round,
      keyMetrics: round.summary.keyMetrics,
      findingsCount: round.findings.length,
    }));

    const davidSummary = inputData.allDavidResearch.map(research => ({
      round: research.round,
      angle: research.researchAngle,
      mechanisms: research.keyMechanisms,
    }));

    const mayaPrompt = `Analyze this complete research package and synthesize into economic insights.

TOPIC: ${inputData.topic}

RESEARCH NARRATIVE: ${inputData.finalNarrative}

ALEX'S FINANCIAL DATA (${inputData.totalQueries} queries across 3 rounds):
${JSON.stringify(alexSummary, null, 2)}

DAVID'S STRATEGIC RESEARCH (3 prompts):
${JSON.stringify(davidSummary, null, 2)}

Create economic analysis with:
1. Economic narrative connecting all data
2. 5+ key insights with supporting data
3. 3+ shocking statistics
4. Multiple viral angles with hooks
5. Stakeholder winners/losers analysis
6. Assessment of any critical gaps

Return your analysis in the required JSON format.`;

    const result = await mayaTest.generate(mayaPrompt);
    const parsed = parseJsonResponse(result.text || '{}');
    
    console.log(`   ✅ Maya Initial Analysis: ${parsed.keyInsights?.length || 0} insights, ${parsed.economicCompleteness || 0}% complete`);

    return {
      initialAnalysis: {
        economicNarrative: parsed.economicNarrative || '',
        keyInsights: parsed.keyInsights || [],
        shockingStats: parsed.shockingStats || [],
        viralAngles: parsed.viralAngles || [],
        stakeholderImpacts: parsed.stakeholderImpacts || { winners: [], losers: [] },
        gapsIdentified: parsed.gapsIdentified || [],
        needsAdditionalResearch: parsed.needsAdditionalResearch || false,
        economicCompleteness: parsed.economicCompleteness || 75,
      },
      researchData: inputData,
    };
  },
});

const gapAnalysisStep = createStep({
  id: 'gap-analysis',
  description: 'Analyze economic gaps and determine if additional research needed',
  inputSchema: z.object({
    initialAnalysis: economicAnalysisSchema,
    researchData: phase2InputSchema,
  }),
  outputSchema: z.object({
    initialAnalysis: economicAnalysisSchema,
    researchData: phase2InputSchema,
    shouldDoAdditionalResearch: z.boolean(),
    gapResearchPlan: z.string(),
  }),
  execute: async ({ inputData }) => {
    console.log(`\n🔍 PHASE 2: Gap Analysis`);

    const gaps = inputData.initialAnalysis.gapsIdentified;
    const completeness = inputData.initialAnalysis.economicCompleteness;
    
    // Determine if additional research is needed
    const shouldResearch = inputData.initialAnalysis.needsAdditionalResearch && 
                          completeness < 85 && 
                          gaps.length > 0;

    console.log(`   📊 Economic Completeness: ${completeness}%`);
    console.log(`   🔍 Gaps Identified: ${gaps.length}`);
    console.log(`   ➡️ Additional Research Needed: ${shouldResearch ? 'YES' : 'NO'}`);

    const gapResearchPlan = shouldResearch 
      ? `Fill these gaps with surgical queries: ${gaps.join(', ')}`
      : '';

    return {
      initialAnalysis: inputData.initialAnalysis,
      researchData: inputData.researchData,
      shouldDoAdditionalResearch: shouldResearch,
      gapResearchPlan,
    };
  },
});

const conditionalGapResearchStep = createStep({
  id: 'conditional-gap-research',
  description: 'Execute additional research if critical gaps identified',
  inputSchema: z.object({
    initialAnalysis: economicAnalysisSchema,
    researchData: phase2InputSchema,
    shouldDoAdditionalResearch: z.boolean(),
    gapResearchPlan: z.string(),
  }),
  outputSchema: z.object({
    initialAnalysis: economicAnalysisSchema,
    researchData: phase2InputSchema,
    additionalFindings: z.array(z.string()).optional(),
    gapsFilled: z.boolean(),
  }),
  execute: async ({ inputData }) => {
    if (!inputData.shouldDoAdditionalResearch) {
      console.log(`\n⏭️ PHASE 2: Skipping additional research (completeness sufficient)`);
      return {
        initialAnalysis: inputData.initialAnalysis,
        researchData: inputData.researchData,
        additionalFindings: [],
        gapsFilled: false,
      };
    }

    console.log(`\n🔬 PHASE 2: Executing Gap-Filling Research`);

    const alexPrompt = `Execute 5-8 surgical financial queries to fill these economic gaps:

TOPIC: ${inputData.researchData.topic}
GAPS TO FILL: ${inputData.gapResearchPlan}

Generate PRECISE queries targeting only the missing economic data.
Return findings as a simple JSON array of strings.`;

    const result = await alexTest.generate(alexPrompt);
    const parsed = parseJsonResponse(result.text || '{}');
    
    const additionalFindings = parsed.findings?.map((f: any) => 
      `${f.query}: ${f.answer}`
    ) || [];

    console.log(`   ✅ Gap Research: ${additionalFindings.length} additional findings`);

    return {
      initialAnalysis: inputData.initialAnalysis,
      researchData: inputData.researchData,
      additionalFindings,
      gapsFilled: additionalFindings.length > 0,
    };
  },
});

const mayaEnhancedAnalysisStep = createStep({
  id: 'maya-enhanced-analysis',
  description: 'Maya creates enhanced economic analysis with gap research',
  inputSchema: z.object({
    initialAnalysis: economicAnalysisSchema,
    researchData: phase2InputSchema,
    additionalFindings: z.array(z.string()).optional(),
    gapsFilled: z.boolean(),
  }),
  outputSchema: z.object({
    enhancedAnalysis: economicAnalysisSchema,
    topic: z.string(),
    runId: z.string(),
  }),
  execute: async ({ inputData }) => {
    console.log(`\n📈 PHASE 2: Maya - Enhanced Economic Analysis`);

    if (!inputData.gapsFilled) {
      // No additional research, return initial analysis enhanced
      console.log(`   ℹ️ Using initial analysis (no gaps filled)`);
      return {
        enhancedAnalysis: {
          ...inputData.initialAnalysis,
          economicCompleteness: Math.min(inputData.initialAnalysis.economicCompleteness + 5, 100),
        },
        topic: inputData.researchData.topic,
        runId: inputData.researchData.runId,
      };
    }

    const mayaPrompt = `Enhance your economic analysis by incorporating additional research findings.

INITIAL ANALYSIS:
${JSON.stringify(inputData.initialAnalysis, null, 2)}

ADDITIONAL GAP-FILLING RESEARCH:
${inputData.additionalFindings?.join('\n')}

Create ENHANCED economic analysis that incorporates the new data.
Increase economicCompleteness to reflect the fuller picture.

Return your enhanced analysis in the required JSON format.`;

    const result = await mayaTest.generate(mayaPrompt);
    const parsed = parseJsonResponse(result.text || '{}');
    
    console.log(`   ✅ Enhanced Analysis: ${parsed.economicCompleteness || 90}% complete`);

    return {
      enhancedAnalysis: {
        economicNarrative: parsed.economicNarrative || inputData.initialAnalysis.economicNarrative,
        keyInsights: parsed.keyInsights || inputData.initialAnalysis.keyInsights,
        shockingStats: parsed.shockingStats || inputData.initialAnalysis.shockingStats,
        viralAngles: parsed.viralAngles || inputData.initialAnalysis.viralAngles,
        stakeholderImpacts: parsed.stakeholderImpacts || inputData.initialAnalysis.stakeholderImpacts,
        gapsIdentified: parsed.gapsIdentified || [],
        needsAdditionalResearch: false,
        economicCompleteness: parsed.economicCompleteness || 90,
      },
      topic: inputData.researchData.topic,
      runId: inputData.researchData.runId,
    };
  },
});

const economicPackageStep = createStep({
  id: 'economic-package',
  description: 'Package complete economic analysis for Phase 3',
  inputSchema: z.object({
    enhancedAnalysis: economicAnalysisSchema,
    topic: z.string(),
    runId: z.string(),
  }),
  outputSchema: phase2OutputSchema,
  execute: async ({ inputData }) => {
    console.log(`\n📦 PHASE 2 COMPLETE: Packaging for Writing Phase`);
    console.log(`   📊 Economic Completeness: ${inputData.enhancedAnalysis.economicCompleteness}%`);
    console.log(`   💡 Key Insights: ${inputData.enhancedAnalysis.keyInsights.length}`);
    console.log(`   🔥 Viral Angles: ${inputData.enhancedAnalysis.viralAngles.length}`);

    return {
      economicNarrative: inputData.enhancedAnalysis.economicNarrative,
      keyInsights: inputData.enhancedAnalysis.keyInsights,
      shockingStats: inputData.enhancedAnalysis.shockingStats,
      viralAngles: inputData.enhancedAnalysis.viralAngles,
      stakeholderImpacts: inputData.enhancedAnalysis.stakeholderImpacts,
      economicCompleteness: inputData.enhancedAnalysis.economicCompleteness,
      readyForPhase3: inputData.enhancedAnalysis.economicCompleteness >= 75,
      topic: inputData.topic,
      runId: inputData.runId,
    };
  },
});

// ============================================================================
// WORKFLOW ASSEMBLY
// ============================================================================

export const phase2EconomicAnalysisWorkflow = createWorkflow({
  id: 'phase-2-economic-analysis',
  description: 'Economic synthesis with Maya and gap-filling feedback loop',
  inputSchema: phase2InputSchema,
  outputSchema: phase2OutputSchema,
})
  .then(mayaInitialAnalysisStep)
  .then(gapAnalysisStep)
  .then(conditionalGapResearchStep)
  .then(mayaEnhancedAnalysisStep)
  .then(economicPackageStep);

phase2EconomicAnalysisWorkflow.commit();

