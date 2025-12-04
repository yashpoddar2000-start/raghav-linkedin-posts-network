/**
 * Agentic Research Workflow
 * 
 * Simple, composable workflow:
 * Topic → Query Agent (50 queries) → Deep Research Agent (3 reports) → Save
 * 
 * Truly agentic: Agents have judgment, user prompts are minimal.
 * Can be called 10 times with different topics.
 */

import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { queryAgent } from '../agents/query-agent';
import { deepResearchAgent } from '../agents/deep-research-agent';
import { saveResearchData } from '../utils/storage';

// Step 1: Query Agent executes 50 queries
const queryStep = createStep({
  id: 'query-step',
  description: 'Query Agent generates and executes 50 Exa Answer queries',
  
  inputSchema: z.object({
    topic: z.string(),
  }),
  
  outputSchema: z.object({
    topic: z.string(),
    queryData: z.string(),
    queryCount: z.number(),
    successful: z.number(),
  }),
  
  execute: async ({ inputData }) => {
    const { topic } = inputData;
    
    console.log('\n' + '═'.repeat(70));
    console.log('STEP 1: QUERY AGENT');
    console.log('═'.repeat(70));
    console.log(`Topic: ${topic}`);
    console.log(`Task: Generate and execute queries`);
    console.log(`User prompt: "Research: ${topic}"`);
    console.log('─'.repeat(70));
    
    const startTime = Date.now();
    
    // Minimal user prompt - agent has all the judgment
    const result = await queryAgent.generate(`Research: ${topic}`, {
      maxSteps: 10, // Allow multiple tool batches
    });
    
    const duration = Math.round((Date.now() - startTime) / 1000);
    
    // Extract and ACCUMULATE results from ALL tool calls
    const allQueryResults: string[] = [];
    let queryCount = 0;
    let successful = 0;
    
    const toolResults = (result as any).toolResults || [];
    console.log(`\n📊 Found ${toolResults.length} tool call batches`);
    
    for (let i = 0; i < toolResults.length; i++) {
      const tr = toolResults[i];
      
      // Path: tr.payload.result.results
      const results = tr.payload?.result?.results;
      
      if (results && Array.isArray(results)) {
        const batchSuccessful = results.filter((r: any) => !r.error && r.answer).length;
        
        console.log(`   Batch ${i + 1}: ${results.length} queries, ${batchSuccessful} successful`);
        
        queryCount += results.length;
        successful += batchSuccessful;
        
        // Format and ACCUMULATE ALL query data
        for (const r of results) {
          const answer = r.answer || '';
          if (answer) {
            const sources = r.sources?.length > 0 
              ? ` [Source: ${r.sources[0].title}](${r.sources[0].url})`
              : '';
            allQueryResults.push(`Q: ${r.query}\nA: ${answer}${sources}`);
          }
        }
      } else {
        console.log(`   Batch ${i + 1}: No results found`);
      }
    }
    
    let queryData = allQueryResults.join('\n\n');
    
    // Fallback to text if no tool results
    if (!queryData && result.text) {
      queryData = result.text;
      queryCount = 50;
      successful = 0;
    }
    
    console.log('─'.repeat(70));
    console.log(`✅ Query Agent complete`);
    console.log(`   Total queries: ${queryCount} | Successful: ${successful} | Duration: ${duration}s`);
    console.log(`   Data size: ${queryData.length} characters`);
    
    return {
      topic,
      queryData,
      queryCount,
      successful,
    };
  },
});

// Step 2: Deep Research Agent executes 3 deep research prompts
const deepResearchStep = createStep({
  id: 'deep-research-step',
  description: 'Deep Research Agent crafts and executes 3 strategic deep research prompts',
  
  inputSchema: z.object({
    topic: z.string(),
    queryData: z.string(),
    queryCount: z.number(),
    successful: z.number(),
  }),
  
  outputSchema: z.object({
    topic: z.string(),
    queryData: z.string(),
    deepResearchData: z.string(),
    reportCount: z.number(),
    totalCost: z.number(),
  }),
  
  execute: async ({ inputData }) => {
    const { topic, queryData, queryCount, successful } = inputData;
    
    console.log('\n' + '═'.repeat(70));
    console.log('STEP 2: DEEP RESEARCH AGENT');
    console.log('═'.repeat(70));
    console.log(`Topic: ${topic}`);
    console.log(`Existing data: ${queryData.length} chars from ${queryCount} queries`);
    console.log(`Task: Craft and execute 3 deep research prompts`);
    console.log('─'.repeat(70));
    
    const startTime = Date.now();
    
    // User prompt includes topic + existing data for context awareness
    const userPrompt = `Deep dive on: ${topic}

Here's what we already know from ${queryCount} queries (${successful} successful):

${queryData.substring(0, 20000)}${queryData.length > 20000 ? '\n...[truncated]...' : ''}

Now craft and execute 3 deep research prompts to fill the gaps.`;
    
    console.log(`User prompt length: ${userPrompt.length} characters`);
    
    const result = await deepResearchAgent.generate(userPrompt, {
      maxSteps: 10, // Allow 3 tool calls + reasoning
    });
    
    const duration = Math.round((Date.now() - startTime) / 1000);
    
    // Extract deep research results - check multiple possible paths
    let deepResearchData = '';
    let reportCount = 0;
    let totalCost = 0;
    
    const toolResults = (result as any).toolResults || [];
    const reports: string[] = [];
    
    console.log(`\n📊 Found ${toolResults.length} deep research tool calls`);
    
    for (let i = 0; i < toolResults.length; i++) {
      const tr = toolResults[i];
      
      // Path: tr.payload.result.report
      const result = tr.payload?.result;
      const report = result?.report;
      const success = result?.success !== false;
      const cost = result?.cost?.total || 0;
      
      if (report) {
        reportCount++;
        reports.push(`## DEEP RESEARCH REPORT ${reportCount}\n\n${report}`);
        totalCost += cost;
        console.log(`   ✅ Report ${reportCount}: ${report.length} chars, $${cost.toFixed(4)}`);
      } else {
        console.log(`   ❌ Report ${i + 1} not captured`);
      }
    }
    
    if (reports.length > 0) {
      deepResearchData = reports.join('\n\n' + '═'.repeat(50) + '\n\n');
    } else if (result.text) {
      // Fallback: use the agent's text response
      console.log(`   ⚠️ No tool results captured, using agent text response`);
      deepResearchData = result.text;
    }
    
    console.log('─'.repeat(70));
    console.log(`✅ Deep Research Agent complete`);
    console.log(`   Reports captured: ${reportCount} | Cost: $${totalCost.toFixed(4)} | Duration: ${duration}s`);
    console.log(`   Data size: ${deepResearchData.length} characters`);
    
    return {
      topic,
      queryData,
      deepResearchData,
      reportCount,
      totalCost,
    };
  },
});

// Step 3: Combine and save
const combineAndSaveStep = createStep({
  id: 'combine-and-save',
  description: 'Combines all research and saves to disk',
  
  inputSchema: z.object({
    topic: z.string(),
    queryData: z.string(),
    deepResearchData: z.string(),
    reportCount: z.number(),
    totalCost: z.number(),
  }),
  
  outputSchema: z.object({
    topic: z.string(),
    researchFile: z.string(),
    combinedResearch: z.string(),
    stats: z.object({
      queryDataLength: z.number(),
      deepResearchLength: z.number(),
      totalLength: z.number(),
      reportCount: z.number(),
      totalCost: z.number(),
    }),
  }),
  
  execute: async ({ inputData }) => {
    const { topic, queryData, deepResearchData, reportCount, totalCost } = inputData;
    
    console.log('\n' + '═'.repeat(70));
    console.log('STEP 3: COMBINE & SAVE');
    console.log('═'.repeat(70));
    
    // Combine all research
    const combinedResearch = `# COMPLETE RESEARCH: ${topic}

Generated: ${new Date().toISOString()}

## SECTION 1: QUERY DATA (50 Exa Answer Queries)

${queryData}

${'═'.repeat(70)}

## SECTION 2: DEEP RESEARCH (${reportCount} Strategic Reports)

${deepResearchData}
`;
    
    // Save to disk
    const dataToSave = {
      topic,
      generatedAt: new Date().toISOString(),
      stats: {
        queryDataLength: queryData.length,
        deepResearchLength: deepResearchData.length,
        totalLength: combinedResearch.length,
        reportCount,
        totalCost,
      },
      combinedResearch,
    };
    
    const filename = saveResearchData(topic, dataToSave);
    
    console.log(`✅ Research combined and saved`);
    console.log(`   File: ${filename}`);
    console.log(`   Total size: ${combinedResearch.length} characters`);
    
    return {
      topic,
      researchFile: filename,
      combinedResearch,
      stats: {
        queryDataLength: queryData.length,
        deepResearchLength: deepResearchData.length,
        totalLength: combinedResearch.length,
        reportCount,
        totalCost,
      },
    };
  },
});

// Compose the workflow
export const agenticResearchWorkflow = createWorkflow({
  id: 'agentic-research',
  description: 'Truly agentic research: Query Agent (50 queries) → Deep Research Agent (3 reports) → Save',
  
  inputSchema: z.object({
    topic: z.string().describe('The QSR industry topic to research'),
  }),
  
  outputSchema: z.object({
    topic: z.string(),
    researchFile: z.string(),
    combinedResearch: z.string(),
    stats: z.object({
      queryDataLength: z.number(),
      deepResearchLength: z.number(),
      totalLength: z.number(),
      reportCount: z.number(),
      totalCost: z.number(),
    }),
  }),
})
  .then(queryStep)
  .then(deepResearchStep)
  .then(combineAndSaveStep)
  .commit();

