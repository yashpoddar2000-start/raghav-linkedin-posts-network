/**
 * Production Agents - Clean Exports
 * 
 * Agentic Research (minimal user prompts, rich system prompts):
 * - queryAgent: 50 Exa Answer queries across 5 dimensions
 * - deepResearchAgent: 3 strategic deep research reports
 * 
 * Writing & Evaluation:
 * - taylor: LinkedIn post writer (GPT-5, viral post patterns)
 * - james: Brutal evaluator (GPT-5, ≥95 to pass)
 */

// Research Agents
export { queryAgent } from './query-agent';
export { deepResearchAgent } from './deep-research-agent';

// Writing & Evaluation Agents
export { taylor } from './taylor';
export { james } from './james';
