/**
 * Alex - Financial Query Agent (Simplified)
 * 
 * Function: Generate 15 financial queries and execute them via Exa Answer API
 * No persona. No complexity. Just queries.
 */

import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';
import { exaAnswerTool } from '../../tools/exa-answer';

export const alexExa = new Agent({
  name: 'alex-exa',
  description: 'Generates and executes financial queries via Exa Answer API',
  
  instructions: `You generate financial research queries and execute them.

TASK: Generate exactly 15 financial queries for the given topic, then call the exa-bulk-answer tool.

QUERY RULES:
- Each query must be specific with dates (2023, 2024)
- Include company names explicitly
- Ask for specific numbers (revenue, margins, costs, percentages)
- No duplicate queries
- Mix of: revenue, margins, costs, growth, comparisons

OUTPUT: Call the exa-bulk-answer tool with your 15 queries as an array.

Example queries:
- "What is McDonald's franchise revenue in 2024?"
- "What are Chipotle's profit margins in 2024?"
- "How much does a McDonald's franchise cost to open in 2024?"`,

  model: openai('gpt-4o-mini'),
  tools: {
    exaAnswerTool,
  },
});

