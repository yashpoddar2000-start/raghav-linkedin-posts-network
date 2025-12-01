import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import * as fs from 'fs';
import * as path from 'path';

// Data structure for our research filing cabinet
interface ResearchData {
  runId: string;
  timestamp: string;
  alexData: {
    research: Record<string, string>; // query -> result mapping
  };
  davidData: {
    research: Record<string, string>; // research_prompt -> research_output mapping
  };
  mayaData: {
    analysis: string[];
  };
  marcusDecisions: {
    orchestration: string[];
    iterations: string[];
    posts: string[];
  };
  jamesEvaluations: {
    feedback: string[];
    approvals: string[];
    scores: string[];
  };
}

// Helper function to get file path for a run
function getDataFilePath(runId: string): string {
  const dataDir = path.join(process.cwd(), 'research-data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return path.join(dataDir, `${runId}.json`);
}

// Helper function to load existing data or create new
function loadOrCreateData(runId: string): ResearchData {
  const filePath = getDataFilePath(runId);
  
  if (fs.existsSync(filePath)) {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
  }
  
  // Create new data structure
  return {
    runId,
    timestamp: new Date().toISOString(),
    alexData: { research: {} },
    davidData: { research: {} },
    mayaData: { analysis: [] },
    marcusDecisions: { orchestration: [], iterations: [], posts: [] },
    jamesEvaluations: { feedback: [], approvals: [], scores: [] }
  };
}

// Helper function to save data
function saveData(data: ResearchData): void {
  const filePath = getDataFilePath(data.runId);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export const researchDataStorageTool = createTool({
  id: 'research_data_storage',
  description: 'Save and load research data across agent iterations',
  
  inputSchema: z.object({
    action: z.enum(['save', 'load', 'list']).describe('Action to perform: save data, load data, or list available data'),
    runId: z.string().describe('Unique identifier for this research run'),
    agentName: z.enum(['alex', 'david', 'maya', 'marcus', 'james']).describe('Name of the agent saving/loading data'),
    dataType: z.enum(['research', 'analysis', 'orchestration', 'iterations', 'posts', 'feedback', 'approvals', 'scores']).describe('Type of data to save/load'),
    query: z.string().optional().describe('Query/prompt used (for save action with research data)'),
    data: z.string().optional().describe('Data to save (for save action only)')
  }),

  outputSchema: z.object({
    success: z.boolean(),
    message: z.string().optional(),
    data: z.any().optional(),
    error: z.string().optional()
  }),
  
  execute: async ({ context }) => {
    const { action, runId, agentName, dataType, query, data } = context;
    try {
      if (action === 'save') {
        if (!agentName || !dataType || !data) {
          return { success: false, error: 'agentName, dataType, and data are required for save action' };
        }

        const researchData = loadOrCreateData(runId);
        
        // Validate query parameter only when needed for research data saves
        if ((agentName === 'alex' || agentName === 'david') && dataType === 'research' && !query) {
          return { success: false, error: 'query parameter required when saving research data for Alex or David' };
        }

        // Save to appropriate agent section
        switch (agentName) {
          case 'alex':
            if (dataType === 'research') {
              researchData.alexData.research[query!] = data;
            }
            break;
          case 'david':
            if (dataType === 'research') {
              researchData.davidData.research[query!] = data;
            }
            break;
          case 'maya':
            if (dataType === 'analysis') {
              researchData.mayaData.analysis.push(data);
            }
            break;
          case 'marcus':
            if (dataType in researchData.marcusDecisions) {
              (researchData.marcusDecisions as any)[dataType].push(data);
            }
            break;
          case 'james':
            if (dataType in researchData.jamesEvaluations) {
              (researchData.jamesEvaluations as any)[dataType].push(data);
            }
            break;
        }
        
        saveData(researchData);
        return { success: true, message: `Saved ${dataType} for ${agentName}: "${query}" -> result` };
      }
      
      if (action === 'load') {
        if (!agentName) {
          return { success: false, error: 'agentName is required for load action' };
        }
        if (!dataType) {
          return { success: false, error: 'dataType is required for load action' };
        }
        
        const researchData = loadOrCreateData(runId);
        let result: any = {};
        
        switch (agentName) {
          case 'alex':
            if (dataType === 'research') {
              result = researchData.alexData.research;
            }
            break;
          case 'david':
            if (dataType === 'research') {
              result = researchData.davidData.research;
            }
            break;
          case 'maya':
            if (dataType === 'analysis') {
              result = researchData.mayaData.analysis || [];
            }
            break;
          case 'marcus':
            result = (researchData.marcusDecisions as any)[dataType] || [];
            break;
          case 'james':
            result = (researchData.jamesEvaluations as any)[dataType] || [];
            break;
        }
        
        return { success: true, data: result };
      }
      
      if (action === 'list') {
        const researchData = loadOrCreateData(runId);
        return { 
          success: true, 
          data: {
            runId: researchData.runId,
            timestamp: researchData.timestamp,
            summary: {
              alexData: [`research: ${Object.keys(researchData.alexData.research).length} query-result pairs`],
              davidData: [`research: ${Object.keys(researchData.davidData.research).length} research items`],
              mayaData: [`analysis: ${researchData.mayaData.analysis.length} items`],
              marcusDecisions: Object.keys(researchData.marcusDecisions).map(key => `${key}: ${(researchData.marcusDecisions as any)[key].length} items`),
              jamesEvaluations: Object.keys(researchData.jamesEvaluations).map(key => `${key}: ${(researchData.jamesEvaluations as any)[key].length} items`)
            }
          }
        };
      }
      
      return { success: false, error: 'Invalid action' };
      
    } catch (error) {
      return { success: false, error: `Tool error: ${error}` };
    }
  }
});


