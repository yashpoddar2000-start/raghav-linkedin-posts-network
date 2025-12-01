/**
 * Simple runner for Marcus Chen orchestration test
 * 
 * Usage: npx tsx src/test-networks/run-marcus-test.ts
 */

import 'dotenv/config';
import { runMarcusNetworkTests } from './test-marcus-orchestration';

console.log('🚀 Starting Marcus Chen Network Orchestration Test...\n');
runMarcusNetworkTests().catch(console.error);
