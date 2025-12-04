/**
 * Research Round Step (Prompt-Only)
 * 
 * Executes ONE complete research round in PROMPT-ONLY mode:
 * 1. Marcus: Choose mental model perspective + provide detailed guidance
 * 2. Alex: Generate 15 financial queries using Marcus's guidance (NO Exa API call)
 * 3. David: Generate 1 deep research prompt using Marcus's guidance (NO Exa API call)
 * 
 * Purpose: Test and optimize prompts before running expensive Exa calls
 * Strategy: Charlie Munger's mental models - each round explores a DIFFERENT perspective
 */

import { createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { alexPromptOnly } from '../../../agents/prompt-only/alex-prompt-only';
import { davidPromptOnly } from '../../../agents/prompt-only/david-prompt-only';
import { marcusPromptOnly } from '../../../agents/prompt-only/marcus-prompt-only';

// Schema for round data
const roundDataSchema = z.object({
  perspective: z.string(),
  alexQueries: z.string(),
  davidPrompt: z.string(),
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

export const researchRoundPromptOnlyStep = createStep({
  id: 'research-round-prompt-only',
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
    
    console.log(`\n${'='.repeat(70)}`);
    console.log(`PROMPT-ONLY ROUND ${round}`);
    console.log(`${'='.repeat(70)}`);
    
    // ===== STEP 1: MARCUS CHOOSES PERSPECTIVE & PROVIDES GUIDANCE =====
    console.log(`\n🧠 MARCUS (PLANNING): Choosing perspective for Round ${round}...`);
    
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
- Alex Queries (${r.queryCount}): ${r.alexQueries.substring(0, 300)}...
- David Prompt: ${r.davidPrompt.substring(0, 300)}...
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
    
    const marcusResult = await marcusPromptOnly.generate(marcusPrompt, {
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
    
    console.log(`   ✅ Perspective chosen: ${marcusGuidance.chosenPerspective}`);
    console.log(`   📋 Rationale: ${marcusGuidance.perspectiveRationale.substring(0, 100)}...`);
    console.log(`   📊 Alex Focus: ${marcusGuidance.alexGuidance.focus}`);
    console.log(`   🔬 David Angle: ${marcusGuidance.davidGuidance.researchAngle}`);
    
    // ===== STEP 2: ALEX GENERATES QUERIES (With Marcus's Guidance) =====
    console.log(`\n📊 ALEX Round ${round}: Generating 15 queries for "${marcusGuidance.chosenPerspective}"...`);
    
    // Build Alex's prompt with Marcus's specific guidance
    let alexPrompt = '';
    const previousQueries = rounds.length > 0 
      ? `\n\nQUERIES FROM PREVIOUS ROUNDS (DO NOT REPEAT):\n${rounds.map((r, i) => `Round ${i + 1}:\n${r.alexQueries}`).join('\n\n')}`
      : '';
    
    alexPrompt = `Research topic: "${topic}"
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
Return ONLY a JSON array of query strings.`;
    
    const alexResult = await alexPromptOnly.generate(alexPrompt, {
      memory: {
        thread: threadId,
        resource: resourceId,
      },
    });
    
    // Parse queries from response
    let alexQueries = '';
    let queryCount = 0;
    
    try {
      const match = alexResult.text?.match(/\[[\s\S]*?\]/);
      if (match) {
        const queries = JSON.parse(match[0]);
        alexQueries = queries.map((q: string, i: number) => `${i + 1}. ${q}`).join('\n');
        queryCount = queries.length;
        console.log(`   ✅ ${queryCount} queries generated`);
      } else {
        alexQueries = alexResult.text || 'No queries generated';
        queryCount = alexQueries.split('\n').filter(l => l.trim()).length;
        console.log(`   ⚠️  Could not parse JSON, using raw text`);
      }
    } catch (e) {
      alexQueries = alexResult.text || 'No queries generated';
      console.log(`   ⚠️  JSON parse error`);
    }
    
    // ===== STEP 3: DAVID GENERATES RESEARCH PROMPT (With Marcus's Guidance) =====
    console.log(`\n🔬 DAVID Round ${round}: Generating research prompt for "${marcusGuidance.chosenPerspective}"...`);
    
    // Build David's prompt with Marcus's specific guidance
    const previousPrompts = rounds.length > 0
      ? `\n\nPROMPTS FROM PREVIOUS ROUNDS (DO NOT REPEAT CONCEPTS):\n${rounds.map((r, i) => `Round ${i + 1} (${r.perspective}): "${r.davidPrompt.substring(0, 200)}..."`).join('\n\n')}`
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
Return ONLY the prompt text (no extra labels).`;
    
    const davidResult = await davidPromptOnly.generate(davidPrompt, {
      memory: {
        thread: threadId,
        resource: resourceId,
      },
    });
    const davidResearchPrompt = davidResult.text?.trim() || 'No prompt generated';
    
    console.log(`   ✅ Prompt generated (${davidResearchPrompt.length} chars)`);
    console.log(`   📝 "${davidResearchPrompt.substring(0, 150)}..."`);
    
    // ===== Accumulate Round Data =====
    const newRoundData = {
      perspective: marcusGuidance.chosenPerspective,
      alexQueries,
      davidPrompt: davidResearchPrompt,
      queryCount,
    };
    
    const accumulatedRounds = [...rounds, newRoundData];
    
    console.log(`\n✅ Round ${round} complete.`);
    console.log(`   Perspective: ${marcusGuidance.chosenPerspective}`);
    console.log(`   Total rounds: ${accumulatedRounds.length}`);
    
    return {
      topic,
      threadId,
      resourceId,
      round: round + 1,  // Increment for next iteration
      rounds: accumulatedRounds,
    };
  },
});
