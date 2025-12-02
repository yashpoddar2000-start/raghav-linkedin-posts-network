/**
 * Production Agents - Clean Exports
 * 
 * These agents power the complete content pipeline:
 * - Alex: Financial research queries via Exa Answer API
 * - David: Deep strategic research via Exa Deep Research API
 * - Marcus: Guides research direction between rounds
 * - Maya: Extracts viral economic insights (optional)
 * - Taylor: Writes LinkedIn posts from research
 * - James: Brutal evaluator (Wharton MBA criteria)
 */

// Research Agents
export { alex } from './alex';
export { david } from './david';
export { marcus } from './marcus';
export { maya } from './maya';

// Writing & Evaluation Agents
export { taylor } from './taylor';
export { james } from './james';
