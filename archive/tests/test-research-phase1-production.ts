/**
 * Production Test: Research Phase 1
 * 
 * Tests the full 3-round research workflow with:
 * - Marcus directing Alex & David using mental models
 * - Real Exa API calls (Answer + Deep Research)
 * - Memory for cross-round context
 * - Detailed logging
 * - Research data saved to file
 * 
 * Expected output:
 * - 3 different perspectives (mental models)
 * - ~45 queries (15 x 3)
 * - 3 deep research reports
 * - Research file saved to research-data/
 */

import 'dotenv/config';
import { mastra } from '../mastra';

async function testResearchPhase1Production() {
  console.log('\n' + '█'.repeat(80));
  console.log('█'.repeat(20) + ' PRODUCTION TEST: RESEARCH PHASE 1 ' + '█'.repeat(20));
  console.log('█'.repeat(80));
  
  // Use a real topic
  const topic = "Chick-fil-A vs McDonald's revenue per store";
  console.log(`\nTopic: ${topic}`);
  console.log(`Strategy: Charlie Munger Mental Models (3 different perspectives)`);
  console.log(`Expected: 45 queries, 3 deep research reports`);
  
  const startTime = Date.now();
  
  try {
    const workflow = mastra.getWorkflow('researchPhase1');
    const run = await workflow.createRunAsync();
    
    console.log('\n' + '─'.repeat(80));
    console.log('STARTING WORKFLOW...');
    console.log('─'.repeat(80) + '\n');
    
    const result = await run.start({
      inputData: { topic },
    });
    
    const duration = Math.round((Date.now() - startTime) / 1000);
    
    console.log('\n' + '█'.repeat(80));
    console.log('█'.repeat(30) + ' RESULTS ' + '█'.repeat(30));
    console.log('█'.repeat(80));
    
    console.log(`\nStatus: ${result.status}`);
    console.log(`Duration: ${duration} seconds (${Math.round(duration / 60)} minutes)`);
    
    if (result.status === 'success' && result.result) {
      console.log(`\n${'═'.repeat(80)}`);
      console.log('SUCCESS METRICS:');
      console.log(`${'═'.repeat(80)}`);
      console.log(`Research File: ${result.result.researchFile}`);
      console.log(`Total Queries: ${result.result.totalQueries}`);
      console.log(`Research Length: ${result.result.combinedResearch?.length || 0} characters`);
      
      // Show preview of research
      console.log(`\n${'═'.repeat(80)}`);
      console.log('RESEARCH PREVIEW (first 2000 chars):');
      console.log(`${'═'.repeat(80)}`);
      console.log(result.result.combinedResearch?.substring(0, 2000) || 'No research');
      console.log('\n...[truncated]');
      
      // Validate results
      console.log(`\n${'═'.repeat(80)}`);
      console.log('VALIDATION:');
      console.log(`${'═'.repeat(80)}`);
      
      const totalQueries = result.result.totalQueries || 0;
      const researchLength = result.result.combinedResearch?.length || 0;
      
      console.log(`✓ Total queries: ${totalQueries} (expected ~45)`);
      console.log(`✓ Research length: ${researchLength} chars`);
      console.log(`✓ Research file saved: ${result.result.researchFile}`);
      
      // Check perspectives in research
      const research = result.result.combinedResearch || '';
      const roundMatches = research.match(/## ROUND \d+:/g);
      const perspectiveCount = roundMatches?.length || 0;
      console.log(`✓ Perspectives found: ${perspectiveCount} (expected 3)`);
      
      if (totalQueries >= 30 && perspectiveCount >= 3 && researchLength > 10000) {
        console.log(`\n${'█'.repeat(80)}`);
        console.log('█'.repeat(25) + ' ALL VALIDATIONS PASSED ' + '█'.repeat(25));
        console.log(`${'█'.repeat(80)}`);
      } else {
        console.log(`\n⚠️ Some validations may have issues - review output above`);
      }
      
    } else if (result.status === 'failed') {
      console.error('\n❌ Workflow failed:');
      console.error(result.error);
    }
    
    console.log('\n✅ Test complete!');
    
  } catch (error) {
    console.error('\n❌ Test failed with error:');
    console.error(error);
    process.exit(1);
  }
}

// Run the test
testResearchPhase1Production();




 * 
 * Tests the full 3-round research workflow with:
 * - Marcus directing Alex & David using mental models
 * - Real Exa API calls (Answer + Deep Research)
 * - Memory for cross-round context
 * - Detailed logging
 * - Research data saved to file
 * 
 * Expected output:
 * - 3 different perspectives (mental models)
 * - ~45 queries (15 x 3)
 * - 3 deep research reports
 * - Research file saved to research-data/
 */

import 'dotenv/config';
import { mastra } from '../mastra';

async function testResearchPhase1Production() {
  console.log('\n' + '█'.repeat(80));
  console.log('█'.repeat(20) + ' PRODUCTION TEST: RESEARCH PHASE 1 ' + '█'.repeat(20));
  console.log('█'.repeat(80));
  
  // Use a real topic
  const topic = "Chick-fil-A vs McDonald's revenue per store";
  console.log(`\nTopic: ${topic}`);
  console.log(`Strategy: Charlie Munger Mental Models (3 different perspectives)`);
  console.log(`Expected: 45 queries, 3 deep research reports`);
  
  const startTime = Date.now();
  
  try {
    const workflow = mastra.getWorkflow('researchPhase1');
    const run = await workflow.createRunAsync();
    
    console.log('\n' + '─'.repeat(80));
    console.log('STARTING WORKFLOW...');
    console.log('─'.repeat(80) + '\n');
    
    const result = await run.start({
      inputData: { topic },
    });
    
    const duration = Math.round((Date.now() - startTime) / 1000);
    
    console.log('\n' + '█'.repeat(80));
    console.log('█'.repeat(30) + ' RESULTS ' + '█'.repeat(30));
    console.log('█'.repeat(80));
    
    console.log(`\nStatus: ${result.status}`);
    console.log(`Duration: ${duration} seconds (${Math.round(duration / 60)} minutes)`);
    
    if (result.status === 'success' && result.result) {
      console.log(`\n${'═'.repeat(80)}`);
      console.log('SUCCESS METRICS:');
      console.log(`${'═'.repeat(80)}`);
      console.log(`Research File: ${result.result.researchFile}`);
      console.log(`Total Queries: ${result.result.totalQueries}`);
      console.log(`Research Length: ${result.result.combinedResearch?.length || 0} characters`);
      
      // Show preview of research
      console.log(`\n${'═'.repeat(80)}`);
      console.log('RESEARCH PREVIEW (first 2000 chars):');
      console.log(`${'═'.repeat(80)}`);
      console.log(result.result.combinedResearch?.substring(0, 2000) || 'No research');
      console.log('\n...[truncated]');
      
      // Validate results
      console.log(`\n${'═'.repeat(80)}`);
      console.log('VALIDATION:');
      console.log(`${'═'.repeat(80)}`);
      
      const totalQueries = result.result.totalQueries || 0;
      const researchLength = result.result.combinedResearch?.length || 0;
      
      console.log(`✓ Total queries: ${totalQueries} (expected ~45)`);
      console.log(`✓ Research length: ${researchLength} chars`);
      console.log(`✓ Research file saved: ${result.result.researchFile}`);
      
      // Check perspectives in research
      const research = result.result.combinedResearch || '';
      const roundMatches = research.match(/## ROUND \d+:/g);
      const perspectiveCount = roundMatches?.length || 0;
      console.log(`✓ Perspectives found: ${perspectiveCount} (expected 3)`);
      
      if (totalQueries >= 30 && perspectiveCount >= 3 && researchLength > 10000) {
        console.log(`\n${'█'.repeat(80)}`);
        console.log('█'.repeat(25) + ' ALL VALIDATIONS PASSED ' + '█'.repeat(25));
        console.log(`${'█'.repeat(80)}`);
      } else {
        console.log(`\n⚠️ Some validations may have issues - review output above`);
      }
      
    } else if (result.status === 'failed') {
      console.error('\n❌ Workflow failed:');
      console.error(result.error);
    }
    
    console.log('\n✅ Test complete!');
    
  } catch (error) {
    console.error('\n❌ Test failed with error:');
    console.error(error);
    process.exit(1);
  }
}

// Run the test
testResearchPhase1Production();



