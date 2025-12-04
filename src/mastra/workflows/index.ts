/**
 * Production Workflows - Clean Exports
 * 
 * Research Workflow:
 * - agenticResearchWorkflow: Query Agent (50 queries) → Deep Research Agent (3 reports) → Save
 * 
 * Writing Workflow:
 * - simpleWritingWorkflow: Taylor writes → James evaluates → Loop until ≥95 (max 4 iterations)
 */

// Research: 50 queries + 3 deep research reports
export { agenticResearchWorkflow } from './agentic-research';

// Writing: Taylor + James feedback loop
export { simpleWritingWorkflow } from './simple-writing';
