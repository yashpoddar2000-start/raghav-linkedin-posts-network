/**
 * Strategist - Pattern Analysis Agent (Simplified)
 * 
 * Function: Analyze research findings and provide guidance for next round
 * No persona. No complexity. Just analysis.
 * NO TOOLS - pure LLM analysis.
 */

import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';

export const strategistExa = new Agent({
  name: 'strategist-exa',
  description: 'Analyzes research data and provides guidance for next round',
  
  instructions: `You analyze research findings and provide guidance.

TASK: Review the research data and output guidance for the next round.

OUTPUT FORMAT (JSON only):
{
  "patterns": ["pattern 1", "pattern 2", "pattern 3"],
  "gaps": ["gap 1", "gap 2"],
  "alexGuidance": "What financial queries Alex should focus on next",
  "davidGuidance": "What strategic angle David should research next"
}

ANALYSIS RULES:
- Identify 3 key patterns from the data
- Identify 2 gaps that need filling
- Be specific in guidance (not generic "get more data")
- Connect patterns to potential story angles

IMPORTANT: Return ONLY valid JSON, no markdown, no explanations.`,

  model: openai('gpt-4o-mini'),
});

