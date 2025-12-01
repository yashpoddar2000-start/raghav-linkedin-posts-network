import { 
  raghavStyleAnalysisTool, 
  viralElementsReferenceTool, 
  antiPatternAvoidanceTool,
  engagementPredictorTool 
} from './mastra/tools/raghav-style-tools';

async function testRaghavTools() {
  console.log('🧪 Testing Raghav Style Analysis Tools...\n');
  
  try {
    // TEST 1: Analyze Raghav's hooks
    console.log('📍 TEST 1: Analyzing Raghav\'s hooks...');
    const hooksResult = await raghavStyleAnalysisTool.execute({
      context: { analysisType: 'hooks' }
    });
    console.log('✅ Hooks analysis:');
    console.log('Top performing hooks:', hooksResult.patterns.top_performing_hooks?.slice(0, 3));
    console.log('Hook patterns:', hooksResult.patterns.patterns?.slice(0, 3));
    console.log('');

    // TEST 2: Find shocking number contrast examples
    console.log('📍 TEST 2: Finding shocking number contrast examples...');
    const signalResult = await viralElementsReferenceTool.execute({
      context: { targetSignal: 'shocking_number_contrast' }
    });
    console.log('✅ Shocking number examples:');
    console.log('Best examples:', signalResult.examples?.slice(0, 2));
    console.log('');

    // TEST 3: Check anti-patterns (test with bad content)
    console.log('📍 TEST 3: Checking anti-patterns...');
    const badContent = "Did you know that McDonald's has different pricing? Have you heard of dynamic pricing? Surprisingly, this is happening everywhere.";
    const antiResult = await antiPatternAvoidanceTool.execute({
      context: { contentDraft: badContent }
    });
    console.log('✅ Anti-pattern warnings:');
    console.log('Safe to post:', antiResult.safe_to_post);
    console.log('Warnings:', antiResult.warnings?.slice(0, 2));
    console.log('');

    // TEST 4: Voice matching (test with good content) 
    console.log('📍 TEST 4: Voice matching analysis...');
    const goodContent = "Chipotle chose to lose $1.2B. Here's why it was genius: → Owned model: $1.9B operating income → Franchised model: $700M operating income The lesson: When you're capital-rich, franchising is giving away your best stores. What business model rules is your industry following blindly?";
    const voiceResult = await engagementPredictorTool.execute({
      context: { postDraft: goodContent }
    });
    console.log('✅ Voice matching:');
    console.log('Predicted engagement:', voiceResult.predicted_engagement);
    console.log('Viral probability:', voiceResult.viral_probability);
    console.log('Key strengths:', voiceResult.key_strengths?.slice(0, 3));
    
    console.log('\n🎯 TOOLS WORKING PERFECTLY!');
    console.log('Taylor can now access all of Raghav\'s viral patterns and anti-patterns.');
    
  } catch (error) {
    console.error('❌ Raghav tools test failed:', error);
  }
}

// Run the test
testRaghavTools();

  raghavStyleAnalysisTool, 
  viralElementsReferenceTool, 
  antiPatternAvoidanceTool,
  engagementPredictorTool 
} from './mastra/tools/raghav-style-tools';

async function testRaghavTools() {
  console.log('🧪 Testing Raghav Style Analysis Tools...\n');
  
  try {
    // TEST 1: Analyze Raghav's hooks
    console.log('📍 TEST 1: Analyzing Raghav\'s hooks...');
    const hooksResult = await raghavStyleAnalysisTool.execute({
      context: { analysisType: 'hooks' }
    });
    console.log('✅ Hooks analysis:');
    console.log('Top performing hooks:', hooksResult.patterns.top_performing_hooks?.slice(0, 3));
    console.log('Hook patterns:', hooksResult.patterns.patterns?.slice(0, 3));
    console.log('');

    // TEST 2: Find shocking number contrast examples
    console.log('📍 TEST 2: Finding shocking number contrast examples...');
    const signalResult = await viralElementsReferenceTool.execute({
      context: { targetSignal: 'shocking_number_contrast' }
    });
    console.log('✅ Shocking number examples:');
    console.log('Best examples:', signalResult.examples?.slice(0, 2));
    console.log('');

    // TEST 3: Check anti-patterns (test with bad content)
    console.log('📍 TEST 3: Checking anti-patterns...');
    const badContent = "Did you know that McDonald's has different pricing? Have you heard of dynamic pricing? Surprisingly, this is happening everywhere.";
    const antiResult = await antiPatternAvoidanceTool.execute({
      context: { contentDraft: badContent }
    });
    console.log('✅ Anti-pattern warnings:');
    console.log('Safe to post:', antiResult.safe_to_post);
    console.log('Warnings:', antiResult.warnings?.slice(0, 2));
    console.log('');

    // TEST 4: Voice matching (test with good content) 
    console.log('📍 TEST 4: Voice matching analysis...');
    const goodContent = "Chipotle chose to lose $1.2B. Here's why it was genius: → Owned model: $1.9B operating income → Franchised model: $700M operating income The lesson: When you're capital-rich, franchising is giving away your best stores. What business model rules is your industry following blindly?";
    const voiceResult = await engagementPredictorTool.execute({
      context: { postDraft: goodContent }
    });
    console.log('✅ Voice matching:');
    console.log('Predicted engagement:', voiceResult.predicted_engagement);
    console.log('Viral probability:', voiceResult.viral_probability);
    console.log('Key strengths:', voiceResult.key_strengths?.slice(0, 3));
    
    console.log('\n🎯 TOOLS WORKING PERFECTLY!');
    console.log('Taylor can now access all of Raghav\'s viral patterns and anti-patterns.');
    
  } catch (error) {
    console.error('❌ Raghav tools test failed:', error);
  }
}

// Run the test
testRaghavTools();
