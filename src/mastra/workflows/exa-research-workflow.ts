/**
 * Exa Research Workflow - Linear 3-Round Research
 * 
 * Simple flow:
 * - Round 1: Alex (15 queries) + David (1 research) → Strategist
 * - Round 2: Alex (15 queries) + David (1 research) → Strategist
 * - Round 3: Alex (15 queries) + David (1 research) → Done
 * 
 * Total: 45 Exa Answer calls + 3 Exa Deep Research calls
 * NO RETRIES. NO LOOPS. LINEAR FLOW.
 */

import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { alexExa } from '../agents/exa-agents/alex-exa';
import { davidExa } from '../agents/exa-agents/david-exa';
import { strategistExa } from '../agents/exa-agents/strategist-exa';
import { mayaExa } from '../agents/exa-agents/maya-exa';
import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// SCHEMAS
// ============================================================================

const workflowInputSchema = z.object({
  topic: z.string().describe('QSR topic for research'),
});

const workflowOutputSchema = z.object({
  topic: z.string(),
  totalQueries: z.number(),
  totalResearch: z.number(),
  allFindings: z.array(z.object({
    round: z.number(),
    alexData: z.string(),
    davidReport: z.string(),
  })),
  finalSummary: z.string(),
  // Maya's viral insights
  viralInsights: z.object({
    shockingStats: z.array(z.object({
      stat: z.string(),
      context: z.string(),
    })),
    viralAngles: z.array(z.object({
      angle: z.string(),
      hook: z.string(),
    })),
    narrativeSummary: z.string(),
  }).optional(),
});

// ============================================================================
// ROUND 1
// ============================================================================

const round1AlexStep = createStep({
  id: 'round-1-alex',
  description: 'Alex generates and executes 15 broad financial queries',
  inputSchema: workflowInputSchema,
  outputSchema: z.object({
    topic: z.string(),
    round: z.number(),
    alexData: z.string(),
    queryCount: z.number(),
  }),
  execute: async ({ inputData }) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📊 ROUND 1: Alex - 15 Financial Queries`);
    console.log(`${'='.repeat(60)}`);
    console.log(`Topic: ${inputData.topic}\n`);

    const result = await alexExa.generate(
      `Topic: "${inputData.topic}"
Round: 1 (Broad Exploration)

Generate 15 diverse financial queries covering:
- Revenue and profit metrics
- Cost structures and margins
- Industry benchmarks and comparisons
- Growth trends and patterns

Then call your exa-bulk-answer tool with the queries.`,
      { maxSteps: 2 }
    );

    // Extract tool results
    const toolResults = (result as any).toolResults || [];
    const exaResult = toolResults[0]?.result || toolResults[0]?.payload?.result;
    const queryCount = exaResult?.summary?.successful || exaResult?.results?.length || 0;
    
    // Format findings
    const findings = exaResult?.results?.map((r: any) => 
      `Q: ${r.query}\nA: ${r.answer}`
    ).join('\n\n') || result.text || '';

    console.log(`✅ Alex Round 1: ${queryCount} queries executed`);

    return {
      topic: inputData.topic,
      round: 1,
      alexData: findings,
      queryCount,
    };
  },
});

const round1DavidStep = createStep({
  id: 'round-1-david',
  description: 'David generates and executes 1 strategic research prompt',
  inputSchema: z.object({
    topic: z.string(),
    round: z.number(),
    alexData: z.string(),
    queryCount: z.number(),
  }),
  outputSchema: z.object({
    topic: z.string(),
    round: z.number(),
    alexData: z.string(),
    davidReport: z.string(),
    queryCount: z.number(),
  }),
  execute: async ({ inputData }) => {
    console.log(`\n🔬 ROUND 1: David - 1 Deep Research`);

    const result = await davidExa.generate(
      `Topic: "${inputData.topic}"
Round: 1

KEY DATA FROM ALEX:
${inputData.alexData.substring(0, 500)}

Generate a SHORT research prompt (100-300 chars) about WHY this is happening.
Example format: "Summarize why [topic] in 2024. Include management statements and industry analysis."

Call exa-deep-research with your SHORT prompt.`,
      { maxSteps: 2 }
    );

    // Extract tool results
    const toolResults = (result as any).toolResults || [];
    const exaResult = toolResults[0]?.result || toolResults[0]?.payload?.result;
    const report = exaResult?.report || result.text || '';

    console.log(`✅ David Round 1: Research complete (${report.length} chars)`);

    return {
      topic: inputData.topic,
      round: 1,
      alexData: inputData.alexData,
      davidReport: report,
      queryCount: inputData.queryCount,
    };
  },
});

const round1StrategistStep = createStep({
  id: 'round-1-strategist',
  description: 'Strategist analyzes Round 1 and provides guidance',
  inputSchema: z.object({
    topic: z.string(),
    round: z.number(),
    alexData: z.string(),
    davidReport: z.string(),
    queryCount: z.number(),
  }),
  outputSchema: z.object({
    topic: z.string(),
    round1Data: z.object({
      alexData: z.string(),
      davidReport: z.string(),
      queryCount: z.number(),
    }),
    guidance: z.object({
      patterns: z.array(z.string()),
      gaps: z.array(z.string()),
      alexGuidance: z.string(),
      davidGuidance: z.string(),
    }),
  }),
  execute: async ({ inputData }) => {
    console.log(`\n🎯 ROUND 1: Strategist - Analysis`);

    const result = await strategistExa.generate(
      `Analyze Round 1 research for: "${inputData.topic}"

ALEX'S FINANCIAL DATA (${inputData.queryCount} queries):
${inputData.alexData.substring(0, 2000)}

DAVID'S STRATEGIC RESEARCH:
${inputData.davidReport.substring(0, 2000)}

Identify patterns, gaps, and provide guidance for Round 2.
Return JSON only.`
    );

    let guidance;
    try {
      const jsonMatch = result.text?.match(/\{[\s\S]*\}/);
      guidance = jsonMatch ? JSON.parse(jsonMatch[0]) : {
        patterns: ['Pattern analysis pending'],
        gaps: ['More data needed'],
        alexGuidance: 'Focus on specific cost breakdowns',
        davidGuidance: 'Research management decisions'
      };
    } catch {
      guidance = {
        patterns: ['Financial pressure identified'],
        gaps: ['Specific mechanisms unclear'],
        alexGuidance: 'Dig into cost structures',
        davidGuidance: 'Research operational challenges'
      };
    }

    console.log(`✅ Strategist: ${guidance.patterns.length} patterns, ${guidance.gaps.length} gaps`);

    return {
      topic: inputData.topic,
      round1Data: {
        alexData: inputData.alexData,
        davidReport: inputData.davidReport,
        queryCount: inputData.queryCount,
      },
      guidance,
    };
  },
});

// ============================================================================
// ROUND 2
// ============================================================================

const round2AlexStep = createStep({
  id: 'round-2-alex',
  description: 'Alex generates 15 focused queries based on Round 1 guidance',
  inputSchema: z.object({
    topic: z.string(),
    round1Data: z.object({
      alexData: z.string(),
      davidReport: z.string(),
      queryCount: z.number(),
    }),
    guidance: z.object({
      patterns: z.array(z.string()),
      gaps: z.array(z.string()),
      alexGuidance: z.string(),
      davidGuidance: z.string(),
    }),
  }),
  outputSchema: z.object({
    topic: z.string(),
    round1Data: z.object({
      alexData: z.string(),
      davidReport: z.string(),
      queryCount: z.number(),
    }),
    round2AlexData: z.string(),
    round2QueryCount: z.number(),
    guidance: z.object({
      patterns: z.array(z.string()),
      gaps: z.array(z.string()),
      alexGuidance: z.string(),
      davidGuidance: z.string(),
    }),
  }),
  execute: async ({ inputData }) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📊 ROUND 2: Alex - 15 Focused Queries`);
    console.log(`${'='.repeat(60)}`);
    console.log(`Guidance: ${inputData.guidance.alexGuidance}\n`);

    const result = await alexExa.generate(
      `Topic: "${inputData.topic}"
Round: 2 (Focused Investigation)

STRATEGIST GUIDANCE: ${inputData.guidance.alexGuidance}

PATTERNS FROM ROUND 1:
${inputData.guidance.patterns.join('\n')}

GAPS TO FILL:
${inputData.guidance.gaps.join('\n')}

Generate 15 FOCUSED financial queries based on this guidance.
Then call your exa-bulk-answer tool.`,
      { maxSteps: 2 }
    );

    const toolResults = (result as any).toolResults || [];
    const exaResult = toolResults[0]?.result || toolResults[0]?.payload?.result;
    const queryCount = exaResult?.summary?.successful || exaResult?.results?.length || 0;
    
    const findings = exaResult?.results?.map((r: any) => 
      `Q: ${r.query}\nA: ${r.answer}`
    ).join('\n\n') || result.text || '';

    console.log(`✅ Alex Round 2: ${queryCount} queries executed`);

    return {
      topic: inputData.topic,
      round1Data: inputData.round1Data,
      round2AlexData: findings,
      round2QueryCount: queryCount,
      guidance: inputData.guidance,
    };
  },
});

const round2DavidStep = createStep({
  id: 'round-2-david',
  description: 'David generates 1 focused research prompt',
  inputSchema: z.object({
    topic: z.string(),
    round1Data: z.object({
      alexData: z.string(),
      davidReport: z.string(),
      queryCount: z.number(),
    }),
    round2AlexData: z.string(),
    round2QueryCount: z.number(),
    guidance: z.object({
      patterns: z.array(z.string()),
      gaps: z.array(z.string()),
      alexGuidance: z.string(),
      davidGuidance: z.string(),
    }),
  }),
  outputSchema: z.object({
    topic: z.string(),
    round1Data: z.object({
      alexData: z.string(),
      davidReport: z.string(),
      queryCount: z.number(),
    }),
    round2Data: z.object({
      alexData: z.string(),
      davidReport: z.string(),
      queryCount: z.number(),
    }),
    guidance: z.object({
      patterns: z.array(z.string()),
      gaps: z.array(z.string()),
      alexGuidance: z.string(),
      davidGuidance: z.string(),
    }),
  }),
  execute: async ({ inputData }) => {
    console.log(`\n🔬 ROUND 2: David - 1 Deep Research`);
    console.log(`Guidance: ${inputData.guidance.davidGuidance}\n`);

    const result = await davidExa.generate(
      `Topic: "${inputData.topic}"
Round: 2
Focus: ${inputData.guidance.davidGuidance}

Generate a SHORT research prompt (100-300 chars) about the mechanisms.
Example: "Analyze [specific aspect] for [company] in 2024. Include evidence and quotes."

Call exa-deep-research with your SHORT prompt.`,
      { maxSteps: 2 }
    );

    const toolResults = (result as any).toolResults || [];
    const exaResult = toolResults[0]?.result || toolResults[0]?.payload?.result;
    const report = exaResult?.report || result.text || '';

    console.log(`✅ David Round 2: Research complete (${report.length} chars)`);

    return {
      topic: inputData.topic,
      round1Data: inputData.round1Data,
      round2Data: {
        alexData: inputData.round2AlexData,
        davidReport: report,
        queryCount: inputData.round2QueryCount,
      },
      guidance: inputData.guidance,
    };
  },
});

const round2StrategistStep = createStep({
  id: 'round-2-strategist',
  description: 'Strategist analyzes Round 2 and provides final guidance',
  inputSchema: z.object({
    topic: z.string(),
    round1Data: z.object({
      alexData: z.string(),
      davidReport: z.string(),
      queryCount: z.number(),
    }),
    round2Data: z.object({
      alexData: z.string(),
      davidReport: z.string(),
      queryCount: z.number(),
    }),
    guidance: z.object({
      patterns: z.array(z.string()),
      gaps: z.array(z.string()),
      alexGuidance: z.string(),
      davidGuidance: z.string(),
    }),
  }),
  outputSchema: z.object({
    topic: z.string(),
    round1Data: z.object({
      alexData: z.string(),
      davidReport: z.string(),
      queryCount: z.number(),
    }),
    round2Data: z.object({
      alexData: z.string(),
      davidReport: z.string(),
      queryCount: z.number(),
    }),
    round3Guidance: z.object({
      patterns: z.array(z.string()),
      gaps: z.array(z.string()),
      alexGuidance: z.string(),
      davidGuidance: z.string(),
    }),
  }),
  execute: async ({ inputData }) => {
    console.log(`\n🎯 ROUND 2: Strategist - Final Analysis`);

    const result = await strategistExa.generate(
      `Analyze Round 2 research for: "${inputData.topic}"

ROUND 2 ALEX DATA (${inputData.round2Data.queryCount} queries):
${inputData.round2Data.alexData.substring(0, 2000)}

ROUND 2 DAVID RESEARCH:
${inputData.round2Data.davidReport.substring(0, 2000)}

PREVIOUS PATTERNS:
${inputData.guidance.patterns.join('\n')}

Identify remaining gaps for Round 3 (final round).
Return JSON only.`
    );

    let guidance;
    try {
      const jsonMatch = result.text?.match(/\{[\s\S]*\}/);
      guidance = jsonMatch ? JSON.parse(jsonMatch[0]) : {
        patterns: ['Core story emerging'],
        gaps: ['Final data points needed'],
        alexGuidance: 'Precision queries for missing numbers',
        davidGuidance: 'Final context and future outlook'
      };
    } catch {
      guidance = {
        patterns: ['Clear narrative forming'],
        gaps: ['Supporting evidence needed'],
        alexGuidance: 'Fill specific data gaps',
        davidGuidance: 'Complete the strategic picture'
      };
    }

    console.log(`✅ Strategist: Ready for Round 3`);

    return {
      topic: inputData.topic,
      round1Data: inputData.round1Data,
      round2Data: inputData.round2Data,
      round3Guidance: guidance,
    };
  },
});

// ============================================================================
// ROUND 3
// ============================================================================

const round3AlexStep = createStep({
  id: 'round-3-alex',
  description: 'Alex generates 15 precision queries to fill final gaps',
  inputSchema: z.object({
    topic: z.string(),
    round1Data: z.object({
      alexData: z.string(),
      davidReport: z.string(),
      queryCount: z.number(),
    }),
    round2Data: z.object({
      alexData: z.string(),
      davidReport: z.string(),
      queryCount: z.number(),
    }),
    round3Guidance: z.object({
      patterns: z.array(z.string()),
      gaps: z.array(z.string()),
      alexGuidance: z.string(),
      davidGuidance: z.string(),
    }),
  }),
  outputSchema: z.object({
    topic: z.string(),
    round1Data: z.object({
      alexData: z.string(),
      davidReport: z.string(),
      queryCount: z.number(),
    }),
    round2Data: z.object({
      alexData: z.string(),
      davidReport: z.string(),
      queryCount: z.number(),
    }),
    round3AlexData: z.string(),
    round3QueryCount: z.number(),
    round3Guidance: z.object({
      patterns: z.array(z.string()),
      gaps: z.array(z.string()),
      alexGuidance: z.string(),
      davidGuidance: z.string(),
    }),
  }),
  execute: async ({ inputData }) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📊 ROUND 3: Alex - 15 Final Queries`);
    console.log(`${'='.repeat(60)}`);
    console.log(`Guidance: ${inputData.round3Guidance.alexGuidance}\n`);

    const result = await alexExa.generate(
      `Topic: "${inputData.topic}"
Round: 3 (Final Precision)

STRATEGIST GUIDANCE: ${inputData.round3Guidance.alexGuidance}

GAPS TO FILL:
${inputData.round3Guidance.gaps.join('\n')}

Generate 15 PRECISION financial queries to complete the research.
Then call your exa-bulk-answer tool.`,
      { maxSteps: 2 }
    );

    const toolResults = (result as any).toolResults || [];
    const exaResult = toolResults[0]?.result || toolResults[0]?.payload?.result;
    const queryCount = exaResult?.summary?.successful || exaResult?.results?.length || 0;
    
    const findings = exaResult?.results?.map((r: any) => 
      `Q: ${r.query}\nA: ${r.answer}`
    ).join('\n\n') || result.text || '';

    console.log(`✅ Alex Round 3: ${queryCount} queries executed`);

    return {
      topic: inputData.topic,
      round1Data: inputData.round1Data,
      round2Data: inputData.round2Data,
      round3AlexData: findings,
      round3QueryCount: queryCount,
      round3Guidance: inputData.round3Guidance,
    };
  },
});

const round3DavidStep = createStep({
  id: 'round-3-david',
  description: 'David generates 1 final research prompt',
  inputSchema: z.object({
    topic: z.string(),
    round1Data: z.object({
      alexData: z.string(),
      davidReport: z.string(),
      queryCount: z.number(),
    }),
    round2Data: z.object({
      alexData: z.string(),
      davidReport: z.string(),
      queryCount: z.number(),
    }),
    round3AlexData: z.string(),
    round3QueryCount: z.number(),
    round3Guidance: z.object({
      patterns: z.array(z.string()),
      gaps: z.array(z.string()),
      alexGuidance: z.string(),
      davidGuidance: z.string(),
    }),
  }),
  outputSchema: z.object({
    topic: z.string(),
    round1Data: z.object({
      alexData: z.string(),
      davidReport: z.string(),
      queryCount: z.number(),
    }),
    round2Data: z.object({
      alexData: z.string(),
      davidReport: z.string(),
      queryCount: z.number(),
    }),
    round3Data: z.object({
      alexData: z.string(),
      davidReport: z.string(),
      queryCount: z.number(),
    }),
  }),
  execute: async ({ inputData }) => {
    console.log(`\n🔬 ROUND 3: David - 1 Final Research`);
    console.log(`Guidance: ${inputData.round3Guidance.davidGuidance}\n`);

    const result = await davidExa.generate(
      `Topic: "${inputData.topic}"
Round: 3 (Final)
Focus: ${inputData.round3Guidance.davidGuidance}

Generate a SHORT research prompt (100-300 chars) to complete the picture.
Example: "Compare [aspect] across competitors in 2024. List specific data."

Call exa-deep-research with your SHORT prompt.`,
      { maxSteps: 2 }
    );

    const toolResults = (result as any).toolResults || [];
    const exaResult = toolResults[0]?.result || toolResults[0]?.payload?.result;
    const report = exaResult?.report || result.text || '';

    console.log(`✅ David Round 3: Research complete (${report.length} chars)`);

    return {
      topic: inputData.topic,
      round1Data: inputData.round1Data,
      round2Data: inputData.round2Data,
      round3Data: {
        alexData: inputData.round3AlexData,
        davidReport: report,
        queryCount: inputData.round3QueryCount,
      },
    };
  },
});

// ============================================================================
// FINAL SYNTHESIS
// ============================================================================

const synthesisStep = createStep({
  id: 'synthesis',
  description: 'Compile all research into intermediate format for Maya',
  inputSchema: z.object({
    topic: z.string(),
    round1Data: z.object({
      alexData: z.string(),
      davidReport: z.string(),
      queryCount: z.number(),
    }),
    round2Data: z.object({
      alexData: z.string(),
      davidReport: z.string(),
      queryCount: z.number(),
    }),
    round3Data: z.object({
      alexData: z.string(),
      davidReport: z.string(),
      queryCount: z.number(),
    }),
  }),
  outputSchema: z.object({
    topic: z.string(),
    totalQueries: z.number(),
    allFindings: z.array(z.object({
      round: z.number(),
      alexData: z.string(),
      davidReport: z.string(),
    })),
    combinedResearch: z.string(),
  }),
  execute: async ({ inputData }) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📦 SYNTHESIS: Compiling Research for Maya`);
    console.log(`${'='.repeat(60)}`);

    const totalQueries = 
      inputData.round1Data.queryCount + 
      inputData.round2Data.queryCount + 
      inputData.round3Data.queryCount;

    // Combine ALL research for Maya
    const combinedResearch = `
# COMPLETE RESEARCH: ${inputData.topic}

## ROUND 1 - BROAD EXPLORATION
### Financial Data (${inputData.round1Data.queryCount} queries):
${inputData.round1Data.alexData}

### Strategic Research:
${inputData.round1Data.davidReport}

## ROUND 2 - FOCUSED INVESTIGATION
### Financial Data (${inputData.round2Data.queryCount} queries):
${inputData.round2Data.alexData}

### Strategic Research:
${inputData.round2Data.davidReport}

## ROUND 3 - PRECISION COMPLETION
### Financial Data (${inputData.round3Data.queryCount} queries):
${inputData.round3Data.alexData}

### Strategic Research:
${inputData.round3Data.davidReport}
`;

    console.log(`✅ Combined ${totalQueries} queries + 3 reports`);
    console.log(`📏 Total research: ${combinedResearch.length} characters`);

    // === SAVE FULL RESEARCH DATA LOCALLY ===
    const topicSlug = inputData.topic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .substring(0, 50);
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `full-research-${topicSlug}-${timestamp}.json`;
    const savePath = path.join(process.cwd(), 'research-data', filename);
    
    const dataToSave = {
      topic: inputData.topic,
      generatedAt: new Date().toISOString(),
      totalQueries,
      totalResearchReports: 3,
      totalCharacters: combinedResearch.length,
      combinedResearch,
      roundBreakdown: {
        round1: {
          alexData: inputData.round1Data.alexData,
          davidReport: inputData.round1Data.davidReport,
          queryCount: inputData.round1Data.queryCount,
        },
        round2: {
          alexData: inputData.round2Data.alexData,
          davidReport: inputData.round2Data.davidReport,
          queryCount: inputData.round2Data.queryCount,
        },
        round3: {
          alexData: inputData.round3Data.alexData,
          davidReport: inputData.round3Data.davidReport,
          queryCount: inputData.round3Data.queryCount,
        },
      },
    };

    try {
      fs.writeFileSync(savePath, JSON.stringify(dataToSave, null, 2));
      console.log(`💾 SAVED: Full research data to ${filename}`);
    } catch (err) {
      console.log(`⚠️ Could not save research data: ${err}`);
    }
    // === END SAVE ===

    return {
      topic: inputData.topic,
      totalQueries,
      allFindings: [
        { round: 1, alexData: inputData.round1Data.alexData, davidReport: inputData.round1Data.davidReport },
        { round: 2, alexData: inputData.round2Data.alexData, davidReport: inputData.round2Data.davidReport },
        { round: 3, alexData: inputData.round3Data.alexData, davidReport: inputData.round3Data.davidReport },
      ],
      combinedResearch,
    };
  },
});

// ============================================================================
// PHASE 2: MAYA ECONOMIC INSIGHTS
// ============================================================================

const mayaInsightsStep = createStep({
  id: 'maya-insights',
  description: 'Maya extracts viral economic insights from all research',
  inputSchema: z.object({
    topic: z.string(),
    totalQueries: z.number(),
    allFindings: z.array(z.object({
      round: z.number(),
      alexData: z.string(),
      davidReport: z.string(),
    })),
    combinedResearch: z.string(),
  }),
  outputSchema: workflowOutputSchema,
  execute: async ({ inputData }) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🧠 PHASE 2: Maya Economic Insights`);
    console.log(`${'='.repeat(60)}`);
    console.log(`📏 Processing ${inputData.combinedResearch.length} characters of research...\n`);

    const result = await mayaExa.generate(
      `Analyze this complete research data and extract viral economic insights:

${inputData.combinedResearch}

Return your analysis as JSON with shockingStats, viralAngles, stakeholderImpacts, economicInsights, keyNumbers, and narrativeSummary.`
    );

    // Parse Maya's JSON output
    let viralInsights = {
      shockingStats: [] as { stat: string; context: string }[],
      viralAngles: [] as { angle: string; hook: string }[],
      narrativeSummary: '',
    };

    try {
      const jsonMatch = result.text?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        viralInsights = {
          shockingStats: (parsed.shockingStats || []).map((s: any) => ({
            stat: s.stat || '',
            context: s.context || '',
          })),
          viralAngles: (parsed.viralAngles || []).map((a: any) => ({
            angle: a.angle || '',
            hook: a.hook || '',
          })),
          narrativeSummary: parsed.narrativeSummary || '',
        };
      }
    } catch {
      console.log('⚠️ Could not parse Maya JSON, using raw output');
      viralInsights.narrativeSummary = result.text || '';
    }

    console.log(`✅ Maya extracted:`);
    console.log(`   📊 Shocking Stats: ${viralInsights.shockingStats.length}`);
    console.log(`   🔥 Viral Angles: ${viralInsights.viralAngles.length}`);
    
    if (viralInsights.viralAngles.length > 0) {
      console.log(`\n📱 TOP VIRAL HOOK:`);
      console.log(`   "${viralInsights.viralAngles[0].hook}"`);
    }

    const summary = `
# Research Complete: ${inputData.topic}

## Summary
- Total Exa Answer Queries: ${inputData.totalQueries}
- Total Exa Deep Research: 3
- Research Rounds: 3
- Shocking Stats Found: ${viralInsights.shockingStats.length}
- Viral Angles Identified: ${viralInsights.viralAngles.length}

## Maya's Narrative
${viralInsights.narrativeSummary}
`;

    return {
      topic: inputData.topic,
      totalQueries: inputData.totalQueries,
      totalResearch: 3,
      allFindings: inputData.allFindings,
      finalSummary: summary,
      viralInsights,
    };
  },
});

// ============================================================================
// WORKFLOW ASSEMBLY
// ============================================================================

export const exaResearchWorkflow = createWorkflow({
  id: 'exa-research-workflow',
  description: 'Linear 3-round research with Exa APIs + Maya insights - NO retries, NO loops',
  inputSchema: workflowInputSchema,
  outputSchema: workflowOutputSchema,
})
  // PHASE 1: RESEARCH (3 Rounds)
  // ROUND 1
  .then(round1AlexStep)
  .then(round1DavidStep)
  .then(round1StrategistStep)
  // ROUND 2
  .then(round2AlexStep)
  .then(round2DavidStep)
  .then(round2StrategistStep)
  // ROUND 3
  .then(round3AlexStep)
  .then(round3DavidStep)
  // SYNTHESIS
  .then(synthesisStep)
  // PHASE 2: MAYA INSIGHTS
  .then(mayaInsightsStep);

exaResearchWorkflow.commit();

