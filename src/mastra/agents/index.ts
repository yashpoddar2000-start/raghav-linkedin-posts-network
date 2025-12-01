/**
 * Production Agents - Clean Exports
 * 
 * These agents power the complete content pipeline:
 * - Alex: Financial research queries via Exa Answer API
 * - David: Deep strategic research via Exa Deep Research API
 * - Strategist: Guides research direction between rounds
 * - Maya: Extracts viral economic insights (optional)
 * - Taylor: Writes LinkedIn posts from research
 * - James: Brutal evaluator (Wharton MBA criteria)
 */

// Research Agents
export { alexExa } from './alex-exa';
export { davidExa } from './david-exa';
export { strategistExa } from './strategist-exa';
export { mayaExa } from './maya-exa';

// Writing & Evaluation Agents
export { taylorExa } from './taylor-exa';
export { jamesExa } from './james-exa';
