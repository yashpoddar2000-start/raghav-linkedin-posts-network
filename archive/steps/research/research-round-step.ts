/**
 * Research Round Step (Production)
 * 
 * Executes ONE complete research round with Marcus directing Alex & David:
 * 1. Marcus: Choose mental model perspective + provide detailed guidance
 * 2. Alex: Generate queries using Marcus's guidance + execute via Exa Answer API
 * 3. David: Generate prompt using Marcus's guidance + execute via Exa Deep Research API
 * 
 * Includes detailed logging for debugging and monitoring.
 */

import { createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { alex } from '../../../agents/alex';
import { david } from '../../../agents/david';
import { marcus } from '../../../agents/marcus';

// Schema for round data
const roundDataSchema = z.object({
  perspective: z.string(),
  alexQueries: z.string(),
  davidReport: z.string(),
  queryCount: z.number(),
});

// Schema for Marcus's guidance
const marcusGuidanceSchema = z.object({
  chosenPerspective: z.string(),
  perspectiveRationale: z.string(),
  alexGuidance: z.object({
    focus: z.string(),
    metricsToQuery: z.array(z.string()),
    specificQueryExamples: z.array(z.string()),
  }),
  davidGuidance: z.object({
    researchAngle: z.string(),
    mechanismToInvestigate: z.string(),
    evidenceToFind: z.array(z.string()),
  }),
});

// Helper function for detailed logging
function logAgentCall(
  agentName: string,
  round: number,
  step: string,
  userPrompt: string,
  response: string,
  toolInfo?: { name: string; input: string; output: string }
) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`AGENT: ${agentName} | ROUND: ${round} | STEP: ${step}`);
  console.log(`${'='.repeat(80)}`);
  
  console.log(`\nUSER PROMPT:`);
  console.log(`${'─'.repeat(80)}`);
  console.log(userPrompt.substring(0, 2000) + (userPrompt.length > 2000 ? '...[truncated]' : ''));
  console.log(`${'─'.repeat(80)}`);
  
  console.log(`\nAGENT RESPONSE:`);
  console.log(`${'─'.repeat(80)}`);
  console.log(response.substring(0, 1500) + (response.length > 1500 ? '...[truncated]' : ''));
  console.log(`${'─'.repeat(80)}`);
  
  if (toolInfo) {
    console.log(`\nTOOL CALL: ${toolInfo.name}`);
    console.log(`INPUT: ${toolInfo.input.substring(0, 500)}${toolInfo.input.length > 500 ? '...' : ''}`);
    console.log(`OUTPUT: ${toolInfo.output.substring(0, 500)}${toolInfo.output.length > 500 ? '...' : ''}`);
  }
  
  console.log(`${'='.repeat(80)}\n`);
}

export const researchRoundStep = createStep({
  id: 'research-round',
  description: 'Executes one complete research round with Marcus directing Alex & David',
  
  inputSchema: z.object({
    topic: z.string(),
    threadId: z.string(),
    resourceId: z.string(),
    round: z.number(),
    rounds: z.array(roundDataSchema),
  }),
  
  outputSchema: z.object({
    topic: z.string(),
    threadId: z.string(),
    resourceId: z.string(),
    round: z.number(),
    rounds: z.array(roundDataSchema),
  }),
  
  execute: async ({ inputData }) => {
    const { topic, threadId, resourceId, round, rounds } = inputData;
    
    console.log(`\n${'█'.repeat(80)}`);
    console.log(`${'█'.repeat(30)} RESEARCH ROUND ${round} ${'█'.repeat(30)}`);
    console.log(`${'█'.repeat(80)}`);
    console.log(`Topic: ${topic}`);
    console.log(`Thread ID: ${threadId}`);
    console.log(`Previous Rounds: ${rounds.length}`);
    
    // ===== STEP 1: MARCUS CHOOSES PERSPECTIVE & PROVIDES GUIDANCE =====
    console.log(`\n🧠 MARCUS: Choosing perspective for Round ${round}...`);
    
    let marcusPrompt = '';
    
    if (round === 1) {
      // Round 1: Marcus analyzes topic and chooses FIRST perspective
      marcusPrompt = `You are the Research Director. Analyze this topic and choose the FIRST mental model perspective to explore.

TOPIC: "${topic}"

This is Round 1 - the initial exploration. Choose ONE mental model perspective that will establish the foundation for understanding this topic.

Mental models to consider:
- Unit Economics (WHAT are the numbers?)
- Management Rationale (WHY did leadership decide this?)
- Operational Mechanisms (HOW do systems create advantages?)
- Competitive Dynamics (HOW does this affect positioning?)
- Franchise Economics (WHO captures value?)
- Consumer Behavior (WHAT drives customer choices?)
- Historical Patterns (WHAT precedents exist?)
- Capital Allocation (WHERE are resources deployed?)

Provide your response in this EXACT JSON format:
{
  "chosenPerspective": "The mental model you chose (e.g., 'Unit Economics')",
  "perspectiveRationale": "Why you chose this perspective for Round 1",
  "alexGuidance": {
    "focus": "What category of metrics Alex should query",
    "metricsToQuery": ["metric 1", "metric 2", "metric 3", "metric 4", "metric 5"],
    "specificQueryExamples": [
      "Example query 1 Alex should include",
      "Example query 2 Alex should include",
      "Example query 3 Alex should include"
    ]
  },
  "davidGuidance": {
    "researchAngle": "The specific angle David should investigate",
    "mechanismToInvestigate": "What mechanism/rationale David should research",
    "evidenceToFind": ["Evidence type 1", "Evidence type 2", "Evidence type 3"]
  }
}

Return ONLY valid JSON.`;
    } else {
      // Round 2+: Marcus reviews previous data and chooses DIFFERENT perspective
      const previousRoundsSummary = rounds.map((r, i) => `
Round ${i + 1} (${r.perspective}):
- Alex Queries (${r.queryCount}): ${r.alexQueries.substring(0, 500)}...
- David Report (${r.davidReport.length} chars): ${r.davidReport.substring(0, 500)}...
`).join('\n');
      
      const perspectivesCovered = rounds.map(r => r.perspective).join(', ');
      
      marcusPrompt = `You are the Research Director. Review the previous rounds and choose a DIFFERENT perspective for Round ${round}.

TOPIC: "${topic}"

PREVIOUS ROUNDS:
${previousRoundsSummary}

PERSPECTIVES ALREADY COVERED: ${perspectivesCovered}

CRITICAL: Choose a DIFFERENT mental model that will provide NEW insights. Do NOT repeat previous perspectives.

Mental models to consider (pick one NOT already used):
- Unit Economics (WHAT are the numbers?)
- Management Rationale (WHY did leadership decide this?)
- Operational Mechanisms (HOW do systems create advantages?)
- Competitive Dynamics (HOW does this affect positioning?)
- Franchise Economics (WHO captures value?)
- Consumer Behavior (WHAT drives customer choices?)
- Historical Patterns (WHAT precedents exist?)
- Capital Allocation (WHERE are resources deployed?)

Think: "I've seen ${perspectivesCovered}. What DIFFERENT perspective would add value based on what I learned?"

Provide your response in this EXACT JSON format:
{
  "chosenPerspective": "The NEW mental model you chose",
  "perspectiveRationale": "Why this perspective adds value based on previous rounds",
  "alexGuidance": {
    "focus": "What category of metrics Alex should query (DIFFERENT from before)",
    "metricsToQuery": ["NEW metric 1", "NEW metric 2", "NEW metric 3", "NEW metric 4", "NEW metric 5"],
    "specificQueryExamples": [
      "Example query 1 (NEW angle)",
      "Example query 2 (NEW angle)",
      "Example query 3 (NEW angle)"
    ]
  },
  "davidGuidance": {
    "researchAngle": "The NEW specific angle David should investigate",
    "mechanismToInvestigate": "What NEW mechanism David should research",
    "evidenceToFind": ["NEW evidence type 1", "NEW evidence type 2", "NEW evidence type 3"]
  }
}

Return ONLY valid JSON.`;
    }
    
    const marcusResult = await marcus.generate(marcusPrompt, {
      memory: {
        thread: threadId,
        resource: resourceId,
      },
    });
    
    // Parse Marcus's guidance
    let marcusGuidance = {
      chosenPerspective: 'General Exploration',
      perspectiveRationale: 'Initial exploration',
      alexGuidance: {
        focus: 'Financial metrics',
        metricsToQuery: ['revenue', 'profit', 'costs'],
        specificQueryExamples: [],
      },
      davidGuidance: {
        researchAngle: 'Strategic mechanisms',
        mechanismToInvestigate: 'Business dynamics',
        evidenceToFind: ['management quotes', 'SEC filings'],
      },
    };
    
    try {
      const jsonMatch = marcusResult.text?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        marcusGuidance = {
          chosenPerspective: parsed.chosenPerspective || marcusGuidance.chosenPerspective,
          perspectiveRationale: parsed.perspectiveRationale || marcusGuidance.perspectiveRationale,
          alexGuidance: parsed.alexGuidance || marcusGuidance.alexGuidance,
          davidGuidance: parsed.davidGuidance || marcusGuidance.davidGuidance,
        };
      }
    } catch (e) {
      console.log(`   ⚠️  Could not parse Marcus's JSON, using defaults`);
    }
    
    logAgentCall(
      'MARCUS',
      round,
      'CHOOSING PERSPECTIVE',
      marcusPrompt,
      marcusResult.text || 'No response',
    );
    
    console.log(`   ✅ Perspective chosen: ${marcusGuidance.chosenPerspective}`);
    console.log(`   📋 Rationale: ${marcusGuidance.perspectiveRationale.substring(0, 100)}...`);
    console.log(`   📊 Alex Focus: ${marcusGuidance.alexGuidance.focus}`);
    console.log(`   🔬 David Angle: ${marcusGuidance.davidGuidance.researchAngle}`);
    
    // ===== STEP 2: ALEX GENERATES QUERIES (With Marcus's Guidance) + EXECUTES =====
    console.log(`\n📊 ALEX Round ${round}: Executing 15 queries for "${marcusGuidance.chosenPerspective}"...`);
    
    // Build Alex's prompt with Marcus's specific guidance
    const previousQueries = rounds.length > 0 
      ? `\n\nQUERIES FROM PREVIOUS ROUNDS (DO NOT REPEAT):\n${rounds.map((r, i) => `Round ${i + 1}:\n${r.alexQueries.substring(0, 1000)}`).join('\n\n')}`
      : '';
    
    const alexPrompt = `Research topic: "${topic}"
Round ${round} - Perspective: ${marcusGuidance.chosenPerspective}

MARCUS (Research Director) GUIDANCE FOR YOU:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Focus: ${marcusGuidance.alexGuidance.focus}

Metrics to query:
${marcusGuidance.alexGuidance.metricsToQuery.map(m => `- ${m}`).join('\n')}

Example queries Marcus wants you to include:
${marcusGuidance.alexGuidance.specificQueryExamples.map(q => `- "${q}"`).join('\n')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${previousQueries}

Generate exactly 15 financial research queries that align with Marcus's guidance.
Focus on the ${marcusGuidance.chosenPerspective} perspective.
Then CALL the exa-bulk-answer tool with your queries.`;
    
    const alexResult = await alex.generate(alexPrompt, {
      maxSteps: 2,
      memory: {
        thread: threadId,
        resource: resourceId,
      },
    });
    
    // Extract Alex's tool results
    let alexQueries = '';
    let queryCount = 0;
    let alexToolInfo: { name: string; input: string; output: string } | undefined;
    
    const alexToolResults = (alexResult as any).toolResults || [];
    const alexExaResult = alexToolResults[0]?.result || alexToolResults[0]?.payload?.result;
    
    if (alexExaResult?.results) {
      alexQueries = alexExaResult.results.map((r: any) => 
        `Q: ${r.query}\nA: ${r.answer || 'No answer'}\nSources: ${r.sources?.map((s: any) => s.url).slice(0, 2).join(', ') || 'None'}`
      ).join('\n\n');
      queryCount = alexExaResult.summary?.successful || alexExaResult.results.length;
      
      alexToolInfo = {
        name: 'exa-bulk-answer',
        input: `${queryCount} queries`,
        output: `${alexExaResult.summary?.successful || 0}/${alexExaResult.summary?.totalQueries || 0} successful`,
      };
    } else {
      alexQueries = alexResult.text || 'No data retrieved';
      // Try to count queries from text
      const queryMatches = alexQueries.match(/\d+\./g);
      queryCount = queryMatches ? queryMatches.length : 0;
    }
    
    logAgentCall(
      'ALEX',
      round,
      'EXECUTING 15 QUERIES',
      alexPrompt,
      alexQueries,
      alexToolInfo,
    );
    
    console.log(`   ✅ ${queryCount} queries executed`);
    
    // ===== STEP 3: DAVID GENERATES RESEARCH PROMPT (With Marcus's Guidance) + EXECUTES =====
    console.log(`\n🔬 DAVID Round ${round}: Deep research for "${marcusGuidance.chosenPerspective}"...`);
    
    // Build David's prompt with Marcus's specific guidance
    const previousPrompts = rounds.length > 0
      ? `\n\nRESEARCH FROM PREVIOUS ROUNDS (DO NOT REPEAT CONCEPTS):\n${rounds.map((r, i) => `Round ${i + 1} (${r.perspective}): ${r.davidReport.substring(0, 500)}...`).join('\n\n')}`
      : '';
    
    const davidPrompt = `Research topic: "${topic}"
Round ${round} - Perspective: ${marcusGuidance.chosenPerspective}

MARCUS (Research Director) GUIDANCE FOR YOU:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Research Angle: ${marcusGuidance.davidGuidance.researchAngle}

Mechanism to Investigate: ${marcusGuidance.davidGuidance.mechanismToInvestigate}

Evidence to Find:
${marcusGuidance.davidGuidance.evidenceToFind.map(e => `- ${e}`).join('\n')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${previousPrompts}

Generate ONE expert deep research prompt for Exa Deep Research API that investigates the ${marcusGuidance.chosenPerspective} perspective.

Use the FULL 3-COMPONENT TEMPLATE:
1. Research Objectives (4-6 bullet points focused on ${marcusGuidance.davidGuidance.mechanismToInvestigate})
2. Methodology (sources, time range, what to look for, what to avoid)
3. Output Format (exact sections for report)

Target length: 800-1500 characters.
Then CALL the exa-deep-research tool with your prompt.`;
    
    const davidResult = await david.generate(davidPrompt, {
      maxSteps: 2,
      memory: {
        thread: threadId,
        resource: resourceId,
      },
    });
    
    // Extract David's tool results
    let davidReport = '';
    let davidToolInfo: { name: string; input: string; output: string } | undefined;
    
    const davidToolResults = (davidResult as any).toolResults || [];
    const davidExaResult = davidToolResults[0]?.result || davidToolResults[0]?.payload?.result;
    
    if (davidExaResult?.report) {
      davidReport = davidExaResult.report;
      davidToolInfo = {
        name: 'exa-deep-research',
        input: `Prompt (${davidExaResult.prompt?.length || 0} chars)`,
        output: `Report (${davidReport.length} chars), Cost: $${davidExaResult.cost?.total?.toFixed(4) || 0}`,
      };
    } else {
      davidReport = davidResult.text || 'No research retrieved';
    }
    
    logAgentCall(
      'DAVID',
      round,
      'DEEP RESEARCH',
      davidPrompt,
      davidReport,
      davidToolInfo,
    );
    
    console.log(`   ✅ Research complete (${davidReport.length} chars)`);
    
    // ===== Accumulate Round Data =====
    const newRoundData = {
      perspective: marcusGuidance.chosenPerspective,
      alexQueries,
      davidReport,
      queryCount,
    };
    
    const accumulatedRounds = [...rounds, newRoundData];
    
    console.log(`\n${'█'.repeat(80)}`);
    console.log(`✅ ROUND ${round} COMPLETE`);
    console.log(`   Perspective: ${marcusGuidance.chosenPerspective}`);
    console.log(`   Alex Queries: ${queryCount}`);
    console.log(`   David Report: ${davidReport.length} chars`);
    console.log(`   Total Rounds: ${accumulatedRounds.length}`);
    console.log(`${'█'.repeat(80)}\n`);
    
    return {
      topic,
      threadId,
      resourceId,
      round: round + 1,  // Increment for next iteration
      rounds: accumulatedRounds,
    };
  },
});
