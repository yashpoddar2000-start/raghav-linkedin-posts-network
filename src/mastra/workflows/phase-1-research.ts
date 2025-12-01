/**
 * Phase 1: QSR Research Workflow
 * 
 * Orchestrates Alex (financial data) and David (strategic research) to produce
 * comprehensive research dataset for viral LinkedIn content creation.
 * 
 * Flow: Topic → Alex (50 queries) → David (3 prompts) → Synthesis → Maya handoff
 */

import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { alexRivera } from '../agents/alex-rivera';
import { davidPark } from '../agents/david-park';

// Schema definitions
const researchInputSchema = z.object({
  topic: z.string().describe('QSR industry topic for viral LinkedIn research'),
  runId: z.string().describe('Unique identifier for this research session'),
});

const researchOutputSchema = z.object({
  financialData: z.string().describe('Comprehensive financial metrics from Alex'),
  strategicResearch: z.string().describe('Strategic analysis from David'),
  synthesisReport: z.string().describe('Combined research summary'),
  qualityMetrics: z.object({
    alexDataLength: z.number(),
    davidResearchLength: z.number(), 
    totalResearchScope: z.number(),
  }),
  readyForMaya: z.boolean().describe('Whether dataset is ready for Maya synthesis'),
});

/**
 * Step 1: Alex Financial Data Collection
 * Uses Alex Rivera to execute 50 strategic financial queries
 */
const alexFinancialDataStep = createStep({
  id: 'alex-financial-data',
  description: 'Generate and execute 50 strategic financial queries using Alex Rivera',
  inputSchema: researchInputSchema,
  outputSchema: z.object({
    financialData: z.string(),
    alexMetrics: z.object({
      queriesExecuted: z.number(),
      dataQuality: z.string(),
      responseLength: z.number(),
    }),
  }),
  execute: async ({ inputData }) => {
    console.log(`📊 Phase 1.1: Alex Financial Data Collection`);
    console.log(`🎯 Topic: ${inputData.topic}`);
    console.log(`🆔 Run ID: ${inputData.runId}\n`);

    // Call Alex Rivera as financial data execution engine
    const alexResult = await alexRivera.generate(
      `Alex, conduct comprehensive financial research for viral LinkedIn content on: "${inputData.topic}"

Generate and execute EXACTLY 50 diverse, strategic queries in ONE bulk research call covering:

**Financial Metrics & Economics:**
- Revenue, profit margins, operational costs, unit economics
- Store-level profitability and performance metrics  
- Growth rates and financial trends over time

**Competitive Benchmarking:**
- Industry comparisons and competitive positioning
- Market share analysis and competitive advantages
- Financial performance vs major competitors

**Industry Context:**
- QSR sector trends and market dynamics
- Economic indicators affecting the industry
- Historical context and transformation patterns

**Operational Data:**
- Cost structures and operational efficiency
- Real estate and lease economics
- Technology adoption and operational metrics

CRITICAL: Call your Exa Answer tool ONCE with all 50 queries. Do not repeat the research. Generate diverse, non-repetitive queries that establish a comprehensive financial foundation. Focus on shocking numbers, surprising contrasts, and compelling financial patterns for viral content.`,
      { 
        runId: inputData.runId,
        maxSteps: 1,
        toolChoice: 'required'
      }
    );

    // Extract tool results from Alex's execution - correct path: toolResults[0].payload.result.results
    const toolResults = (alexResult as any).toolResults;
    const toolResult = toolResults?.[0]?.payload?.result;
    const results = toolResult?.results || [];
    
    // Process Alex's tool output into structured format
    const processedFindings = results.map((result: any) => ({
      query: result.query,
      answer: result.answer,
      sources: result.sources?.map((s: any) => s.url).slice(0, 2) || []
    }));

    const financialDataText = processedFindings.map((finding: { query: string; answer: string; sources: string[] }) => 
      `- ${finding.query}: ${finding.answer}`
    ).join('\n');

    console.log(`✅ Alex completed: ${processedFindings.length} queries processed`);

    return {
      financialData: financialDataText,
      alexMetrics: {
        queriesExecuted: processedFindings.length,
        dataQuality: processedFindings.length >= 40 ? 'Comprehensive' : 'Basic',
        responseLength: financialDataText.length,
      },
    };
  },
});

/**
 * Step 2: David Strategic Research
 * Uses David Park to execute 3 strategic research prompts based on Alex's findings
 */
const davidStrategicResearchStep = createStep({
  id: 'david-strategic-research',
  description: 'Generate and execute 3 strategic research prompts using David Park',
  inputSchema: z.object({
    financialData: z.string(),
    alexMetrics: z.object({
      queriesExecuted: z.number(),
      dataQuality: z.string(),
      responseLength: z.number(),
    }),
  }),
  outputSchema: z.object({
    strategicResearch: z.string(),
    davidMetrics: z.object({
      researchPromptsExecuted: z.number(),
      researchDepth: z.string(),
      responseLength: z.number(),
    }),
  }),
  execute: async ({ inputData, getStepResult }) => {
    console.log(`\n🔬 Phase 1.2: David Strategic Research`);
    console.log(`📊 Alex Data Quality: ${inputData.alexMetrics.dataQuality}`);
    console.log(`📈 Alex Queries: ${inputData.alexMetrics.queriesExecuted}\n`);

    // Get Alex's financial data to inform David's research
    const financialContext = inputData.financialData.substring(0, 2000); // First 2000 chars for context

    // Extract topic from financial data context for David's research
    const topicMatch = financialContext.match(/Topic.*?:\s*([^\n]+)/);
    const topic = topicMatch ? topicMatch[1] : 'QSR industry analysis';

    // Call David Park as strategic research execution engine  
    const davidResult = await davidPark.generate(
      `David, you're receiving financial research context for viral LinkedIn content.

FINANCIAL DATA CONTEXT (Alex's 50 Query Results):
${inputData.financialData}

Based on this financial data, follow this workflow:

STEP 1: Analyze the financial patterns and generate 3 COMPLEMENTARY strategic research prompts covering:
1. **Management Rationale & Strategic Reasoning** - Why do companies make these strategic decisions?
2. **Operational Mechanisms & System Details** - HOW do these financial patterns work operationally?  
3. **Competitive Dynamics & Industry Transformation** - How does this compare to competitor approaches?

STEP 2-4: Execute each of the 3 research prompts separately via your Exa Deep Research tool

Use your expertise to craft expert-level research prompts that seek documented evidence and provide comprehensive strategic context explaining WHY the financial patterns exist.`,
      { 
        maxSteps: 3,
        toolChoice: 'required'
      }
    );

    // Extract David's research results (similar to Alex processing)
    let combinedResearch = '';
    let researchCount = 0;
    
    // Check if David returned structured JSON object
    if ((davidResult as any).object) {
      const researchEntries = (davidResult as any).object.strategicResearch || [];
      combinedResearch = researchEntries.map((entry: any, index: number) => 
        `## RESEARCH ANGLE ${index + 1}: ${entry.angle}\n\n${entry.findings}`
      ).join('\n\n');
      researchCount = researchEntries.length;
    } else {
      // Fallback: Extract from tool results 
      const toolResults = (davidResult as any).toolResults;
      const allResults = [];
      if (toolResults && toolResults.length > 0) {
        for (const toolResult of toolResults) {
          const result = toolResult?.payload?.result;
          if (result) {
            allResults.push(result);
          }
        }
      }
      combinedResearch = allResults.map((item, index) => 
        `## RESEARCH PROMPT ${index + 1} FINDINGS\n\n${item}`
      ).join('\n\n');
      researchCount = allResults.length;
    }

    console.log(`✅ David completed: ${researchCount} research prompts, ${combinedResearch.length} characters`);

    return {
      strategicResearch: combinedResearch,
      davidMetrics: {
        researchPromptsExecuted: researchCount,
        researchDepth: combinedResearch.length > 8000 ? 'Comprehensive' : 'Basic',
        responseLength: combinedResearch.length,
      },
    };
  },
});

/**
 * Step 3: Research Synthesis
 * Combines Alex and David results into final dataset for Maya handoff
 */
const researchSynthesisStep = createStep({
  id: 'research-synthesis',
  description: 'Synthesize Alex financial data and David strategic research into final dataset',
  inputSchema: z.object({
    strategicResearch: z.string(),
    davidMetrics: z.object({
      researchPromptsExecuted: z.number(),
      researchDepth: z.string(),
      responseLength: z.number(),
    }),
  }),
  outputSchema: researchOutputSchema,
  execute: async ({ inputData, getStepResult }) => {
    console.log(`\n📋 Phase 1.3: Research Synthesis`);
    console.log(`🔬 David: ${inputData.davidMetrics.researchPromptsExecuted} prompts, ${inputData.davidMetrics.researchDepth} depth\n`);

    // Get results from both Alex and David steps
    const alexData = getStepResult('alex-financial-data');
    const davidData = getStepResult('david-strategic-research');

    // Calculate quality metrics
    const totalDataScope = alexData.financialData.length + davidData.strategicResearch.length;
    const qualityScore = calculateResearchQuality(alexData.alexMetrics, inputData.davidMetrics);

    // Extract topic from data (assuming it's mentioned in the research)
    const topic = extractTopicFromResearch(alexData.financialData, davidData.strategicResearch);

    // Create synthesis report
    const synthesisReport = `
# Phase 1 Research Complete: ${topic}

## Research Session Summary
- **Run ID**: Research session completed
- **Total Data Scope**: ${totalDataScope} characters
- **Quality Score**: ${qualityScore}%

## Financial Data (Alex Rivera)
- **Queries Executed**: ${alexData.alexMetrics.queriesExecuted}/50
- **Data Quality**: ${alexData.alexMetrics.dataQuality}
- **Coverage**: ${alexData.alexMetrics.responseLength} characters
- **Focus**: Unit economics, competitive benchmarks, industry metrics

## Strategic Research (David Park)  
- **Research Prompts**: ${inputData.davidMetrics.researchPromptsExecuted}/3
- **Research Depth**: ${inputData.davidMetrics.researchDepth}
- **Coverage**: ${inputData.davidMetrics.responseLength} characters
- **Focus**: Management rationale, operational mechanisms, competitive dynamics

## Handoff Status
- **Dataset Quality**: ${qualityScore >= 70 ? 'Publication Ready' : 'Needs Refinement'}
- **Maya Synthesis**: ${qualityScore >= 70 ? 'Ready' : 'Not Ready'}
- **Viral Potential**: ${qualityScore >= 80 ? 'High' : qualityScore >= 60 ? 'Medium' : 'Low'}

## Next Phase
Ready for Maya Patel economic synthesis and viral content preparation.
`;

    console.log(`📊 Synthesis Quality Score: ${qualityScore}%`);
    console.log(`✅ Dataset Ready: ${qualityScore >= 70 ? 'YES' : 'NO'}`);
    console.log(`🎯 Total Research Scope: ${totalDataScope} characters\n`);

    return {
      financialData: alexData.financialData,
      strategicResearch: davidData.strategicResearch,
      synthesisReport: synthesisReport,
      qualityMetrics: {
        alexDataLength: alexData.financialData.length,
        davidResearchLength: davidData.strategicResearch.length,
        totalResearchScope: totalDataScope,
      },
      readyForMaya: qualityScore >= 70,
    };
  },
});

/**
 * Helper function to calculate research quality score
 */
function calculateResearchQuality(alexMetrics: any, davidMetrics: any): number {
  // Base scoring on data quantity and quality indicators
  const alexScore = Math.min(100, (alexMetrics.responseLength / 5000) * 40); // Up to 40 points
  const davidScore = Math.min(100, (davidMetrics.responseLength / 8000) * 40); // Up to 40 points
  const executionScore = ((alexMetrics.queriesExecuted / 50) + (davidMetrics.researchPromptsExecuted / 3)) * 10; // Up to 20 points
  
  return Math.round(alexScore + davidScore + executionScore);
}

/**
 * Helper function to extract topic from research data
 */
function extractTopicFromResearch(alexData: string, davidData: string): string {
  // Try to extract topic from research content
  const topicPatterns = [
    /Topic[:\s]*([^\n]+)/i,
    /Research[:\s]*([^\n]+)/i,
    /Analysis[:\s]*([^\n]+)/i,
  ];
  
  const combinedData = alexData + ' ' + davidData;
  
  for (const pattern of topicPatterns) {
    const match = combinedData.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return 'QSR Industry Research';
}

/**
 * Phase 1: QSR Research Workflow
 * 
 * Coordinates Alex and David to produce comprehensive research dataset
 * Input: QSR topic + runId
 * Output: Complete research package ready for Maya synthesis
 */
const phase1ResearchWorkflow = createWorkflow({
  id: 'phase-1-research',
  description: 'Comprehensive QSR research using Alex (financial data) and David (strategic research)',
  inputSchema: researchInputSchema,
  outputSchema: researchOutputSchema,
})
  .then(alexFinancialDataStep)
  .map(async ({ inputData }) => ({
    // Map Alex output to David input
    financialData: inputData.financialData,
    alexMetrics: inputData.alexMetrics,
  }))
  .then(davidStrategicResearchStep)
  .map(async ({ inputData }) => ({
    // Map David output to Synthesis input  
    strategicResearch: inputData.strategicResearch,
    davidMetrics: inputData.davidMetrics,
  }))
  .then(researchSynthesisStep);

phase1ResearchWorkflow.commit();

export { phase1ResearchWorkflow };
