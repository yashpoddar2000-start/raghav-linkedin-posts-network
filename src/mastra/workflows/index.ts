/**
 * Production Workflows - Clean Exports
 * 
 * Main workflow: complete-content-pipeline
 * 
 * Flow: Topic → Research (45 queries + 3 deep) → Taylor writes → James evaluates → Approved Post
 * 
 * Features:
 * - Auto-saves research locally (research-data/)
 * - Feedback loop: max 4 iterations
 * - Brutal evaluation with Wharton MBA criteria
 * - ~7 min end-to-end, ~$0.20/topic
 */

export { completeContentPipeline } from './complete-content-pipeline';

