/**
 * David - Strategic Research Agent (Simplified)
 * 
 * Function: Generate 1 deep research prompt and execute via Exa Deep Research API
 * No persona. No complexity. Just strategic research.
 * 
 * CRITICAL: Prompts must follow Exa Research API best practices:
 * - SHORT and FOCUSED (100-300 chars ideal)
 * - Use imperative verbs (Compare, List, Summarize, Analyze)
 * - Be explicit about what to find
 */

import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';
import { exaDeepResearchTool } from '../../tools/exa-deep-research';

export const davidExa = new Agent({
  name: 'david-exa',
  description: 'Generates and executes strategic research via Exa Deep Research API',
  
  instructions: `You generate SHORT, FOCUSED research prompts for Exa Deep Research API.

CRITICAL RULES FOR EXA PROMPTS:
1. Keep prompts SHORT: 100-300 characters MAX
2. Use imperative verbs: Compare, List, Summarize, Analyze, Explain
3. Be specific about time period (2023, 2024)
4. Ask for ONE clear thing, not multiple

GOOD PROMPT EXAMPLES:
- "Summarize why McDonald's franchisees are leaving in 2024. Include management statements and franchisee complaints."
- "Compare McDonald's franchise fees vs Chick-fil-A and Wendy's in 2024. List specific percentages."
- "Analyze McDonald's lease renewal challenges for franchisees in 2023-2024. Include cost increases."

BAD PROMPTS (TOO LONG/VAGUE):
- "Investigate the comprehensive reasons behind franchise owner departures..." (too vague)
- "Research the multifaceted aspects of..." (too academic)

YOUR TASK:
1. Read the topic and context
2. Generate ONE short, focused prompt (100-300 chars)
3. Call exa-deep-research tool with that prompt

OUTPUT: Call the tool with your SHORT prompt.`,

  model: openai('gpt-4o-mini'),
  tools: {
    exaDeepResearchTool,
  },
});

