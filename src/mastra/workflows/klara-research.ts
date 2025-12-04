/**
 * Klara Research Workflow
 * 
 * Simple workflow: Topic → Klara → Save
 * 
 * Klara handles everything:
 * - 50 queries via exaAnswerTool
 * - 3 deep research prompts via exaDeepResearchTool (one by one)
 * - Returns combined research
 */

import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { klara } from '../agents/klara';
import { saveResearchData } from '../utils/storage';

// Single step: Klara does all the research
const klaraResearchStep = createStep({
  id: 'klara-research',
  description: 'Klara executes comprehensive research using both Exa tools',
  
  inputSchema: z.object({
    topic: z.string(),
  }),
  
  outputSchema: z.object({
    topic: z.string(),
    research: z.string(),
    filename: z.string(),
  }),
  
  execute: async ({ inputData }) => {
    const { topic } = inputData;
    
    console.log('\n' + '█'.repeat(70));
    console.log('█ KLARA RESEARCH');
    console.log('█'.repeat(70));
    console.log(`\nTopic: ${topic}`);
    console.log(`Strategy: 50 queries + 3 deep research prompts`);
    console.log(`\nStarting research...\n`);
    
    const startTime = Date.now();
    
    // Prompt Klara with the topic
    const prompt = `Research topic: "${topic}"

Execute your complete research workflow:

1. Generate 50 strategic queries covering revenue, costs, operations, competitive positioning, and mechanisms
2. Execute all 50 queries using the exa-bulk-answer tool
3. Analyze the results and identify gaps
4. Generate 3 deep research prompts for different angles:
   - Operational mechanisms
   - Business model economics  
   - Strategic implications
5. Execute each deep research prompt ONE BY ONE using the exa-deep-research tool
6. Combine everything and present your findings

Remember: Your research must enable content that breaks James's brutal evaluation (Emotional Intelligence Test + Social Capital Test).

Go.`;

    const result = await klara.generate(prompt, {
      maxSteps: 15, // Allow 50 queries (batched) + 3 deep research = ~5-6 tool calls
    });
    
    const duration = Math.round((Date.now() - startTime) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    
    const research = result.text || 'No research generated';
    
    console.log('\n' + '─'.repeat(70));
    console.log(`✅ Research complete in ${minutes}m ${seconds}s`);
    console.log(`📊 Research length: ${research.length} characters`);
    
    // Save research data
    const data = {
      topic,
      research,
      generatedAt: new Date().toISOString(),
      durationSeconds: duration,
    };
    
    const filename = saveResearchData(topic, data);
    
    console.log(`💾 Saved to: ${filename}`);
    
    return {
      topic,
      research,
      filename,
    };
  },
});

// Simple workflow: just one step
export const klaraResearchWorkflow = createWorkflow({
  id: 'klara-research',
  description: 'Klara comprehensive research workflow',
  
  inputSchema: z.object({
    topic: z.string(),
  }),
  
  outputSchema: z.object({
    topic: z.string(),
    research: z.string(),
    filename: z.string(),
  }),
})
  .then(klaraResearchStep)
  .commit();

