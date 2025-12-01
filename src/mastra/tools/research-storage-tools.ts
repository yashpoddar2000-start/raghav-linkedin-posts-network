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
  taylorData: {
    posts: string[];
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
    const existingData = JSON.parse(rawData);
    
    // Ensure taylorData section exists in old files
    if (!existingData.taylorData) {
      existingData.taylorData = { posts: [] };
    }
    
    // Ensure all sections exist for backward compatibility
    if (!existingData.alexData) existingData.alexData = { research: {} };
    if (!existingData.davidData) existingData.davidData = { research: {} };
    if (!existingData.mayaData) existingData.mayaData = { analysis: [] };
    if (!existingData.marcusDecisions) existingData.marcusDecisions = { orchestration: [], iterations: [], posts: [] };
    if (!existingData.jamesEvaluations) existingData.jamesEvaluations = { feedback: [], approvals: [], scores: [] };
    
    return existingData;
  }
  
  // Create new data structure
  return {
    runId,
    timestamp: new Date().toISOString(),
    alexData: { research: {} },
    davidData: { research: {} },
    mayaData: { analysis: [] },
    taylorData: { posts: [] },
    marcusDecisions: { orchestration: [], iterations: [], posts: [] },
    jamesEvaluations: { feedback: [], approvals: [], scores: [] }
  };
}

// Helper function to save data
function saveData(data: ResearchData): void {
  const filePath = getDataFilePath(data.runId);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// TOOL 1: LOAD RESEARCH DATA (Clean, focused)
export const loadResearchDataTool = createTool({
  id: 'load_research_data',
  description: 'Load research data from storage for cross-agent access',
  
  inputSchema: z.object({
    runId: z.string().describe('Unique identifier for this research run'),
    agentName: z.enum(['alex', 'david', 'maya', 'taylor', 'marcus', 'james']).describe('Name of the agent whose data to load'),
    dataType: z.enum(['research', 'analysis', 'posts', 'orchestration', 'iterations', 'feedback', 'approvals', 'scores']).describe('Type of data to load')
  }),

  outputSchema: z.object({
    success: z.boolean(),
    data: z.any(),
    error: z.string().optional()
  }),
  
  execute: async ({ context }) => {
    const { runId, agentName, dataType } = context;
    
    try {
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
            result = researchData.mayaData.analysis;
          }
          break;
        case 'taylor':
          if (dataType === 'posts') {
            result = researchData.taylorData.posts;
          }
          break;
        case 'marcus':
          if (dataType in researchData.marcusDecisions) {
            result = (researchData.marcusDecisions as any)[dataType] || [];
          }
          break;
        case 'james':
          if (dataType in researchData.jamesEvaluations) {
            result = (researchData.jamesEvaluations as any)[dataType] || [];
          }
          break;
      }
      
      return { success: true, data: result };
      
    } catch (error) {
      return { success: false, error: `Load error: ${error}` };
    }
  }
});

// TOOL 2: SAVE RESEARCH DATA (Clean, focused)  
export const saveResearchDataTool = createTool({
  id: 'save_research_data',
  description: 'Save research data to storage for cross-agent persistence',
  
  inputSchema: z.object({
    runId: z.string().describe('Unique identifier for this research run'),
    agentName: z.enum(['alex', 'david', 'maya', 'taylor', 'marcus', 'james']).describe('Name of the agent saving data'),
    dataType: z.enum(['research', 'analysis', 'posts', 'orchestration', 'iterations', 'feedback', 'approvals', 'scores']).describe('Type of data to save'),
    data: z.string().describe('Data to save'),
    query: z.string().optional().describe('Query/prompt used (required for Alex/David research data)')
  }),

  outputSchema: z.object({
    success: z.boolean(),
    message: z.string().optional(),
    error: z.string().optional()
  }),
  
  execute: async ({ context }) => {
    const { runId, agentName, dataType, data, query } = context;
    
    try {
      const researchData = loadOrCreateData(runId);
      
      // Handle research data saves (need query-value pairs)
      if ((agentName === 'alex' || agentName === 'david') && dataType === 'research') {
        if (!query) {
          return { success: false, error: 'query parameter required when saving research data for Alex or David' };
        }
        
        if (agentName === 'alex') {
          researchData.alexData.research[query] = data;
        } else if (agentName === 'david') {
          researchData.davidData.research[query] = data;
        }
        
        saveData(researchData);
        return { success: true, message: `Saved research pair for ${agentName}: "${query}" -> result` };
      }
      
      // Handle other data saves (append to arrays)
      switch (agentName) {
        case 'maya':
          if (dataType === 'analysis') {
            researchData.mayaData.analysis.push(data);
          }
          break;
        case 'taylor':
          if (dataType === 'posts') {
            researchData.taylorData.posts.push(data);
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
      return { success: true, message: `Saved ${dataType} for ${agentName}` };
      
    } catch (error) {
      return { success: false, error: `Save error: ${error}` };
    }
  }
});

// TOOL 3: LIST RESEARCH DATA (Clean, focused)
export const listResearchDataTool = createTool({
  id: 'list_research_data',
  description: 'List all available research data for a run',
  
  inputSchema: z.object({
    runId: z.string().describe('Unique identifier for this research run')
  }),

  outputSchema: z.object({
    success: z.boolean(),
    data: z.any(),
    error: z.string().optional()
  }),
  
  execute: async ({ context }) => {
    const { runId } = context;
    
    try {
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
              taylorData: [`posts: ${researchData.taylorData.posts.length} items`],
              marcusDecisions: Object.keys(researchData.marcusDecisions).map(key => `${key}: ${(researchData.marcusDecisions as any)[key].length} items`),
              jamesEvaluations: Object.keys(researchData.jamesEvaluations).map(key => `${key}: ${(researchData.jamesEvaluations as any)[key].length} items`)
            }
        }
      };
      
    } catch (error) {
      return { success: false, error: `List error: ${error}` };
    }
  }
});

