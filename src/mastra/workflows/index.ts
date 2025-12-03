/**
 * Production Workflows - Clean Exports
 * 
 * Workflows:
 * - researchPhase1: 3-round research with dountil loop
 * - writingPhase2: Taylor writes, James evaluates with dountil loop
 * - completeContentPipeline: Full topic → post pipeline (legacy)
 */

// Phase 1: Research workflow with dountil loop
export { researchPhase1 } from './research-phase1';

// Phase 2: Writing workflow with dountil loop
export { writingPhase2 } from './writing-phase2';

// Full pipeline (legacy - uses inline logic)
export { completeContentPipeline } from './complete-content-pipeline';

