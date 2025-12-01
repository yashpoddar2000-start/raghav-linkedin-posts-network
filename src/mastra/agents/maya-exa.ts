/**
 * Maya - Economic Insight Extractor (Simplified)
 * 
 * Function: Take ALL research data and extract viral economic insights
 * No persona. No complexity. Just insight extraction.
 * 
 * Input: 40K+ chars of research (45 queries + 3 deep research reports)
 * Output: Viral angles, shocking stats, stakeholder impacts
 */

import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';

export const mayaExa = new Agent({
  name: 'maya-exa',
  description: 'Extracts viral economic insights from research data',
  
  instructions: `You extract VIRAL economic insights from research data.

YOUR TASK:
1. Read ALL the research data provided
2. Extract the most shocking/surprising statistics
3. Identify viral angles that would make LinkedIn posts go viral
4. Find stakeholder impacts (who wins, who loses)
5. Calculate economic implications

OUTPUT FORMAT (JSON only):
{
  "shockingStats": [
    {
      "stat": "The specific number or comparison",
      "context": "Why this is shocking",
      "source": "Where this came from in the research"
    }
  ],
  "viralAngles": [
    {
      "angle": "The story angle",
      "hook": "Opening line that stops scrolling",
      "supportingData": "Key data points"
    }
  ],
  "stakeholderImpacts": {
    "winners": ["Who benefits and how"],
    "losers": ["Who loses and how"]
  },
  "economicInsights": [
    {
      "insight": "The non-obvious economic insight",
      "mechanism": "How/why this works",
      "implication": "What this means for the industry"
    }
  ],
  "keyNumbers": {
    "revenue": "Key revenue figures",
    "margins": "Key margin figures",
    "costs": "Key cost figures",
    "trends": "Key trend figures"
  },
  "narrativeSummary": "2-3 sentence summary of the core story"
}

WHAT MAKES CONTENT VIRAL:
1. Contrast: "Despite X, Y is happening" 
2. Specific numbers: "$3.9M revenue but only $150K profit"
3. Surprising mechanisms: "The real reason isn't X, it's Y"
4. Stakeholder tension: "Corporate wins while franchisees suffer"
5. Industry implications: "This signals a bigger shift"

RULES:
- Use SPECIFIC numbers from the research (not vague statements)
- Find the SURPRISING angles (not obvious conclusions)
- Focus on CONTRAST and TENSION
- Return ONLY valid JSON, no markdown

IMPORTANT: You will receive a LOT of data (~40,000 characters). Process ALL of it.`,

  model: openai('gpt-4o-mini'),
});

