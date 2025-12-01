import { 
  raghavStyleAnalysisTool, 
  viralElementsReferenceTool, 
  antiPatternAvoidanceTool,
  engagementPredictorTool,
  repeatContentDetectorTool
} from './mastra/tools/raghav-style-tools';
import { RuntimeContext } from '@mastra/core/runtime-context';

async function testRaghavToolsBrutal() {
  console.log('🔥 BRUTAL TEST SUITE: Raghav Style Tools...\n');
  console.log('='.repeat(120));
  console.log('🎯 TESTING ALL 5 TOOLS WITH COMPREHENSIVE SCENARIOS');
  console.log('='.repeat(120));
  
  const runtimeContext = new RuntimeContext();
  
  try {
    // ===================================================================
    // TEST 1: RAGHAV STYLE ANALYSIS TOOL - All Analysis Types
    // ===================================================================
    
    console.log('\n🧪 TEST 1: RAGHAV STYLE ANALYSIS TOOL');
    console.log('-'.repeat(80));
    
    // Test hooks analysis
    console.log('\n📍 1A: Analyzing Raghav\'s hooks...');
    const hooksResult = await raghavStyleAnalysisTool.execute({
      context: { analysisType: 'hooks' },
      runtimeContext
    });
    console.log('✅ Hooks Result:');
    console.log('   Top 3 hooks:', JSON.stringify(hooksResult.patterns?.top_performing_hooks?.slice(0, 3), null, 2));
    console.log('   Patterns to use:', hooksResult.patterns?.patterns?.slice(0, 3));
    console.log('   Patterns to avoid:', hooksResult.patterns?.avoid);
    
    // Test data presentation  
    console.log('\n📍 1B: Analyzing data presentation...');
    const dataResult = await raghavStyleAnalysisTool.execute({
      context: { analysisType: 'data_presentation' },
      runtimeContext
    });
    console.log('✅ Data Presentation:');
    console.log('   Bullet styles:', dataResult.patterns?.bullet_styles);
    console.log('   Number formats:', dataResult.patterns?.number_formats?.slice(0, 3));
    
    // Test viral formula
    console.log('\n📍 1C: Getting complete viral formula...');
    const formulaResult = await raghavStyleAnalysisTool.execute({
      context: { analysisType: 'all_patterns' },
      runtimeContext
    });
    console.log('✅ Viral Formula:', formulaResult.patterns?.viral_formula);
    console.log('   Signature elements:', formulaResult.patterns?.signature_elements);
    
    // ===================================================================
    // TEST 2: VIRAL ELEMENTS REFERENCE TOOL - Different Signals
    // ===================================================================
    
    console.log('\n\n🧪 TEST 2: VIRAL ELEMENTS REFERENCE TOOL');
    console.log('-'.repeat(80));
    
    // Test shocking number contrast
    console.log('\n📍 2A: Finding shocking number contrast examples...');
    const shockingResult = await viralElementsReferenceTool.execute({
      context: { targetSignal: 'shocking_number_contrast' },
      runtimeContext
    });
    console.log('✅ Shocking Number Examples:');
    console.log('   Total posts using signal:', shockingResult.signal_analysis?.total_posts_using);
    console.log('   Average engagement:', shockingResult.signal_analysis?.avg_engagement);
    console.log('   Best examples:', shockingResult.examples?.slice(0, 2));
    
    // Test contrarian with proof
    console.log('\n📍 2B: Finding contrarian examples...');
    const contrarianResult = await viralElementsReferenceTool.execute({
      context: { targetSignal: 'contrarian_with_proof' },
      runtimeContext
    });
    console.log('✅ Contrarian Examples:');
    console.log('   Best examples:', contrarianResult.examples?.slice(0, 2).map((e: any) => ({ postId: e.postId, hook: e.hook, engagement: e.engagement })));
    
    // ===================================================================
    // TEST 3: ANTI-PATTERN AVOIDANCE TOOL - Good vs Bad Content
    // ===================================================================
    
    console.log('\n\n🧪 TEST 3: ANTI-PATTERN AVOIDANCE TOOL');
    console.log('-'.repeat(80));
    
    // Test with BAD content (multiple anti-patterns)
    console.log('\n📍 3A: Testing BAD content with anti-patterns...');
    const badContent = "Did you know that McDonald's has different pricing strategies? Have you heard of dynamic pricing? Surprisingly, this is happening across the restaurant industry.";
    const badResult = await antiPatternAvoidanceTool.execute({
      context: { contentDraft: badContent },
      runtimeContext
    });
    console.log('❌ Bad Content Analysis:');
    console.log('   Safe to post:', badResult.safe_to_post);
    console.log('   Warnings found:', badResult.warnings?.length);
    console.log('   Critical warnings:', badResult.warnings?.filter((w: any) => w.severity === 'high'));
    
    // Test with GOOD content
    console.log('\n📍 3B: Testing GOOD content...');
    const goodContent = "McDonald's charges different customers different prices. The $2.1B revenue impact: → App users: 50% discounts → Counter customers: Full price → Late-night crowd: No app access = pay premium The mechanism: Price discrimination based on willingness to engage with digital platform.";
    const goodResult = await antiPatternAvoidanceTool.execute({
      context: { contentDraft: goodContent },
      runtimeContext
    });
    console.log('✅ Good Content Analysis:');
    console.log('   Safe to post:', goodResult.safe_to_post);
    console.log('   Warnings found:', goodResult.warnings?.length);
    
    // ===================================================================
    // TEST 4: ENGAGEMENT PREDICTOR TOOL - Different Quality Levels
    // ===================================================================
    
    console.log('\n\n🧪 TEST 4: ENGAGEMENT PREDICTOR TOOL');
    console.log('-'.repeat(80));
    
    // Test VIRAL-STYLE content
    console.log('\n📍 4A: Testing VIRAL-style content...');
    const viralContent = "Chipotle chose to lose $1.2B. Here's why it was genius: → Owned model: $1.9B operating income → Franchised model: $700M operating income The mechanism: Control enables operational excellence that franchisees can't replicate. The lesson: When you're capital-rich, franchising is giving away your best stores. What business model rules is your industry following blindly?";
    const viralPrediction = await engagementPredictorTool.execute({
      context: { postDraft: viralContent },
      runtimeContext
    });
    console.log('🔥 Viral Content Prediction:');
    console.log('   Predicted engagement:', viralPrediction.predicted_engagement);
    console.log('   Viral probability:', viralPrediction.viral_probability);
    console.log('   Key strengths:', viralPrediction.key_strengths?.slice(0, 3));
    
    // Test WEAK content
    console.log('\n📍 4B: Testing WEAK content...');
    const weakContent = "Chipotle has an interesting business model that generates good returns for shareholders through operational efficiency and strategic positioning in the market.";
    const weakPrediction = await engagementPredictorTool.execute({
      context: { postDraft: weakContent },
      runtimeContext
    });
    console.log('📉 Weak Content Prediction:');
    console.log('   Predicted engagement:', weakPrediction.predicted_engagement);
    console.log('   Viral probability:', weakPrediction.viral_probability);
    console.log('   Improvement areas:', weakPrediction.improvement_areas?.slice(0, 3));
    
    // ===================================================================
    // TEST 5: REPEAT CONTENT DETECTOR - Similarity Detection
    // ===================================================================
    
    console.log('\n\n🧪 TEST 5: REPEAT CONTENT DETECTOR');
    console.log('-'.repeat(80));
    
    // Test REPEAT content (similar to P054)
    console.log('\n📍 5A: Testing REPEAT content (Chipotle franchise)...');
    const repeatContent = "Chipotle refuses to franchise its 3,500 restaurants. That decision generates $1.2B more annually than franchising would. Here's the control vs capital trade-off.";
    const repeatResult = await repeatContentDetectorTool.execute({
      context: { postDraft: repeatContent, similarityThreshold: 0.7 },
      runtimeContext
    });
    console.log('🚨 Repeat Content Check:');
    console.log('   Is repeat:', repeatResult.is_repeat);
    console.log('   Similarity score:', repeatResult.similarity_score);
    console.log('   Similar posts:', repeatResult.similar_posts?.slice(0, 2));
    console.log('   Recommendation:', repeatResult.recommendation);
    
    // Test ORIGINAL content (new company/topic)
    console.log('\n📍 5B: Testing ORIGINAL content (Panera)...');
    const originalContent = "Panera's menu complexity drives 23% higher labor costs. Here's the operational breakdown: → Simple chains: 24% labor costs → Complex menus: 31% labor costs The mechanism: Menu variety requires specialized training and longer prep times.";
    const originalResult = await repeatContentDetectorTool.execute({
      context: { postDraft: originalContent, similarityThreshold: 0.7 },
      runtimeContext
    });
    console.log('✅ Original Content Check:');
    console.log('   Is repeat:', originalResult.is_repeat);
    console.log('   Similarity score:', originalResult.similarity_score);
    console.log('   Recommendation:', originalResult.recommendation);
    
    // ===================================================================
    // COMPREHENSIVE VALIDATION SUMMARY
    // ===================================================================
    
    console.log('\n\n' + '='.repeat(120));
    console.log('🏆 BRUTAL TEST VALIDATION SUMMARY');
    console.log('='.repeat(120));
    
    console.log('\n📊 TOOL PERFORMANCE:');
    console.log(`✅ Style Analysis: ${hooksResult.success ? 'WORKING' : 'FAILED'} - Extracted ${hooksResult.patterns?.top_performing_hooks?.length || 0} top hooks`);
    console.log(`✅ Viral Reference: ${shockingResult.success ? 'WORKING' : 'FAILED'} - Found ${shockingResult.examples?.length || 0} shocking number examples`);
    console.log(`✅ Anti-Pattern Check: ${badResult.success && goodResult.success ? 'WORKING' : 'FAILED'} - Detected ${badResult.warnings?.length || 0} bad patterns, ${goodResult.warnings?.length || 0} good patterns`);
    console.log(`✅ Engagement Predictor: ${viralPrediction.success && weakPrediction.success ? 'WORKING' : 'FAILED'} - Viral: ${viralPrediction.viral_probability}, Weak: ${weakPrediction.viral_probability}`);
    console.log(`✅ Repeat Detector: ${repeatResult.success && originalResult.success ? 'WORKING' : 'FAILED'} - Repeat: ${repeatResult.similarity_score?.toFixed(2)}, Original: ${originalResult.similarity_score?.toFixed(2)}`);
    
    console.log('\n🎯 TAYLOR READINESS ASSESSMENT:');
    console.log('📝 Hook Examples Available:', hooksResult.patterns?.top_performing_hooks?.length >= 5 ? '✅ YES' : '❌ NO');
    console.log('🎨 Style Patterns Extracted:', formulaResult.patterns?.signature_elements?.length >= 4 ? '✅ YES' : '❌ NO');
    console.log('⚠️ Anti-Pattern Protection:', badResult.warnings?.length > 0 ? '✅ YES' : '❌ NO');
    console.log('📈 Engagement Prediction:', Math.abs((viralPrediction.viral_probability || 0) - (weakPrediction.viral_probability || 0)) > 0.3 ? '✅ YES' : '❌ NO');
    console.log('🔒 Repeat Content Protection:', (repeatResult.similarity_score || 0) > 0.7 && (originalResult.similarity_score || 0) < 0.3 ? '✅ YES' : '❌ NO');
    
    console.log('\n💯 OVERALL ASSESSMENT:');
    const allToolsWorking = [hooksResult, shockingResult, badResult, viralPrediction, repeatResult].every(r => r.success);
    if (allToolsWorking) {
      console.log('🚀 ALL TOOLS WORKING - TAYLOR IS READY TO BE BUILT!');
      console.log('📊 Taylor will have access to:');
      console.log(`   - ${hooksResult.patterns?.top_performing_hooks?.length || 0} viral hook examples`);
      console.log(`   - ${shockingResult.examples?.length || 0} shocking number examples`);
      console.log(`   - ${contrarianResult.examples?.length || 0} contrarian decision examples`);
      console.log('   - Real-time anti-pattern warnings');
      console.log('   - Viral probability scoring');
      console.log('   - Repeat content detection');
      console.log('\n🎯 Ready to build Taylor with complete Raghav voice toolkit!');
    } else {
      console.log('❌ SOME TOOLS FAILED - FIX BEFORE BUILDING TAYLOR');
      console.log('Failed tools need debugging before Taylor integration.');
    }
    
  } catch (error) {
    console.error('💥 BRUTAL TEST FAILED:', error);
  }
}

// Run the brutal test
testRaghavToolsBrutal();


