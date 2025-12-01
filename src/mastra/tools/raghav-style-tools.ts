import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import * as fs from 'fs';
import * as path from 'path';

// Load Raghav's post data
function loadRaghavPosts() {
  const postsPath = path.join(process.cwd(), 'data', 'posts', 'all-posts.json');
  if (!fs.existsSync(postsPath)) {
    throw new Error('Raghav posts data not found at data/posts/all-posts.json');
  }
  const rawData = fs.readFileSync(postsPath, 'utf-8');
  return JSON.parse(rawData);
}

// TOOL 1: RAGHAV STYLE ANALYSIS - Extract specific patterns
export const raghavStyleAnalysisTool = createTool({
  id: 'raghav_style_analysis',
  description: 'Analyze Raghav\'s viral post patterns for hooks, transitions, data presentation, and closing techniques',
  
  inputSchema: z.object({
    analysisType: z.enum(['hooks', 'transitions', 'closings', 'data_presentation', 'all_patterns']).describe('Type of style pattern to analyze')
  }),

  outputSchema: z.object({
    success: z.boolean(),
    patterns: z.any().optional(),
    examples: z.any().optional(),
    error: z.string().optional()
  }),
  
  execute: async ({ context }) => {
    const { analysisType } = context;
    
    try {
      const posts = loadRaghavPosts();
      const viralPosts = posts.filter((p: any) => p.isViral === true);
      
      if (analysisType === 'hooks') {
        const hooks = viralPosts.map((p: any) => {
          const firstLine = p.text.split('\n')[0];
          const engagement = p.engagement.engagementScore;
          return { hook: firstLine, engagement, postId: p.id };
        }).sort((a: any, b: any) => b.engagement - a.engagement);
        
        const patterns = {
          top_performing_hooks: hooks.slice(0, 5),
          patterns: [
            "Shocking number contrasts: '$8.5M vs $500K', '$27.4M per restaurant'",
            "Company decision frames: 'Chipotle chose to lose $1.2B'", 
            "Surprising outcomes: 'made it more expensive and growth accelerated'",
            "Scale comparisons: 'DoorDash tripled market share in 5 years. Uber Eats stayed flat.'",
            "Performance gaps: 'Taco Bell makes $550,000 profit per store. Pizza Hut makes $147,000.'"
          ],
          avoid: [
            "Did you know... (amateur)",
            "Have you heard of... (condescending)",
            "Surprisingly... (forced curiosity)",
            "Everyone knows... (cringy setup)"
          ]
        };
        
        return { success: true, patterns, examples: hooks.slice(0, 10) };
      }
      
      if (analysisType === 'data_presentation') {
        const dataPatterns = viralPosts.map((p: any) => {
          // Extract bullet points and number presentations
          const bullets = p.text.match(/[•→]\s.+/g) || [];
          const numbers = p.text.match(/\$[\d.]+[BMK]?|\d+\.?\d*%|\d+x/g) || [];
          return { postId: p.id, bullets: bullets.slice(0, 3), numbers: numbers.slice(0, 5), engagement: p.engagement.engagementScore };
        }).sort((a: any, b: any) => b.engagement - a.engagement);
        
        const patterns = {
          bullet_styles: [
            "Arrow bullets: → Owned model: $1.9B",
            "Standard bullets: • Revenue: $25.92B",
            "Comparative format: McDonald's: 95% vs Chipotle: 0%"
          ],
          number_formats: [
            "Specific amounts: $1.916B (not ~$2B)",
            "Percentages: 13.56% (not ~13%)", 
            "Gaps/ratios: 3.7x gap, 275% slower",
            "Time periods: Q3 2024 (not recent quarter)"
          ],
          comparison_structures: [
            "Side-by-side: Taco Bell vs Pizza Hut",
            "Before/after: 2015 vs 2024",
            "Model comparison: Owned vs Franchised"
          ]
        };
        
        return { success: true, patterns, examples: dataPatterns.slice(0, 5) };
      }
      
      if (analysisType === 'closings') {
        const closings = viralPosts.map((p: any) => {
          const lines = p.text.split('\n');
          const lastLine = lines[lines.length - 1];
          const secondLastLine = lines[lines.length - 2] || '';
          return { 
            closing: `${secondLastLine}\n${lastLine}`,
            engagement: p.engagement.engagementScore,
            postId: p.id 
          };
        }).sort((a: any, b: any) => b.engagement - a.engagement);
        
        const patterns = {
          question_patterns: [
            "What business model 'rules' is your industry following blindly?",
            "What happens when both markets stall?",
            "Can [company] do it in 7 [years]?"
          ],
          principle_statements: [
            "The lesson: [specific insight]",
            "Pure-play beats diversified.",
            "Fixed costs are a weapon when you have volume."
          ],
          challenge_statements: [
            "Growth that damages your brand isn't growth at all.",
            "Become so successful there's no room to grow anymore.",
            "Focus beats diversification."
          ]
        };
        
        return { success: true, patterns, examples: closings.slice(0, 5) };
      }
      
      if (analysisType === 'transitions') {
        const transitions: any[] = [];
        viralPosts.forEach((p: any) => {
          const lines = p.text.split('\n');
          const transitionLines = lines.filter((line: string) => 
            line.includes('Here\'s why') || 
            line.includes('The math') ||
            line.includes('Why:') ||
            line.includes('The result') ||
            line.includes('But here\'s')
          );
          transitions.push(...transitionLines.map((t: string) => ({ transition: t, postId: p.id, engagement: p.engagement.engagementScore })));
        });
        
        const patterns = {
          explanation_transitions: [
            "Here's why it was genius:",
            "Here's why:",
            "The math that shocked Wall Street:",
            "Why this works:"
          ],
          contrast_transitions: [
            "But here's the problem:",
            "The result?",
            "What actually happened:",
            "The reality:"
          ],
          mechanism_reveals: [
            "The core issue is fixed costs.",
            "Why? Control.",
            "That's fixed cost leverage.",
            "The compounding loop:"
          ]
        };
        
        return { success: true, patterns, examples: transitions.slice(0, 10) };
      }
      
      if (analysisType === 'all_patterns') {
        return {
          success: true,
          patterns: {
            viral_formula: "Shocking number hook → Context setup → Data revelation → Mechanism explanation → Universal principle → Engagement question",
            signature_elements: [
              "Specific numbers with sources",
              "Side-by-side comparisons", 
              "Arrow bullet formatting",
              "Contrarian business decisions",
              "Universal principles extracted"
            ],
            engagement_drivers: [
              "Shocking number contrasts ($8.5M vs $500K)",
              "Counterintuitive outcomes (raised prices, got MORE buyers)",
              "Hidden mechanisms revealed",
              "David vs Goliath stories",
              "Comeback narratives"
            ]
          }
        };
      }
      
      return { success: false, patterns: {}, error: 'Invalid analysis type' };
      
    } catch (error) {
      return { success: false, patterns: {}, error: `Analysis error: ${error}` };
    }
  }
});

// TOOL 2: VIRAL ELEMENTS REFERENCE - Find examples by signal type
export const viralElementsReferenceTool = createTool({
  id: 'viral_elements_reference',
  description: 'Find examples of successful posts using specific viral signals',
  
  inputSchema: z.object({
    targetSignal: z.enum(['shocking_number_contrast', 'detailed_breakdown', 'contrarian_with_proof', 'reveals_hidden_mechanism', 'comeback_story', 'david_vs_goliath', 'side_by_side_comparison']).describe('Viral signal to find examples for')
  }),

  outputSchema: z.object({
    success: z.boolean(),
    examples: z.any().optional(),
    signal_analysis: z.any().optional(),
    error: z.string().optional()
  }),
  
  execute: async ({ context }) => {
    const { targetSignal } = context;
    
    try {
      const posts = loadRaghavPosts();
      const signalPosts = posts.filter((p: any) => 
        p.leverageSignals && p.leverageSignals.some((s: any) => s.signal === targetSignal)
      );
      
      const examples = signalPosts.map((p: any) => {
        const signal = p.leverageSignals.find((s: any) => s.signal === targetSignal);
        return {
          postId: p.id,
          hook: p.text.split('\n')[0],
          engagement: p.engagement.engagementScore,
          signal_note: signal.note,
          impact: signal.impact
        };
      }).sort((a: any, b: any) => b.engagement - a.engagement);
      
      const analysis = {
        signal_description: targetSignal,
        total_posts_using: examples.length,
        avg_engagement: examples.reduce((sum: number, e: any) => sum + e.engagement, 0) / examples.length,
        best_examples: examples.slice(0, 3),
        implementation_tips: examples.slice(0, 3).map((e: any) => e.signal_note)
      };
      
      return { success: true, examples: examples.slice(0, 5), signal_analysis: analysis };
      
    } catch (error) {
      return { success: false, examples: [], error: `Reference error: ${error}` };
    }
  }
});

// TOOL 3: ANTI-PATTERN AVOIDANCE - Check for engagement killers
export const antiPatternAvoidanceTool = createTool({
  id: 'anti_pattern_avoidance',
  description: 'Check content for anti-patterns that kill engagement based on Raghav\'s failed posts',
  
  inputSchema: z.object({
    contentDraft: z.string().describe('Draft content to check for anti-patterns')
  }),

  outputSchema: z.object({
    success: z.boolean(),
    warnings: z.array(z.any()),
    safe_to_post: z.boolean(),
    error: z.string().optional()
  }),
  
  execute: async ({ context }) => {
    const { contentDraft } = context;
    
    try {
      const posts = loadRaghavPosts();
      const failedPosts = posts.filter((p: any) => p.isViral === false);
      
      const warnings = [];
      
      // Check for forced cringy hooks
      const cringyPatterns = ['Did you know', 'Have you heard of', 'Surprisingly,', 'Everyone knows'];
      for (const pattern of cringyPatterns) {
        if (contentDraft.includes(pattern)) {
          warnings.push({
            type: 'forced_cringy_hook',
            severity: 'high',
            message: `Avoid "${pattern}" - this destroys credibility instantly. Use shocking numbers instead.`,
            fix: 'Start with specific shocking data: "$X vs $Y", "Company chose to lose $Z"'
          });
        }
      }
      
      // Check for forbidden formatting
      if (contentDraft.includes('**')) {
        warnings.push({
          type: 'forbidden_formatting',
          severity: 'high',
          message: 'Remove ** bold formatting - use clean plain text only.',
          fix: 'Remove all ** markdown formatting and let content structure create emphasis'
        });
      }
      
      if (contentDraft.includes('—')) {
        warnings.push({
          type: 'forbidden_formatting',
          severity: 'high', 
          message: 'Remove em dashes (—) - not allowed in posts.',
          fix: 'Use regular dashes (-) or restructure sentences without em dashes'
        });
      }
      
      // Check for missing numbers
      const hasShockingNumbers = /\$[\d.]+[BMK]|\d+\.?\d*%|\d+x/.test(contentDraft);
      if (!hasShockingNumbers) {
        warnings.push({
          type: 'missing_shock_factor',
          severity: 'high',
          message: 'No shocking numbers detected. Viral posts need specific data.',
          fix: 'Add specific metrics: dollar amounts, percentages, ratios that create "wait what?" moment'
        });
      }
      
      // Check for zero insight patterns
      const insightKeywords = ['mechanism', 'why', 'because', 'principle', 'lesson'];
      const hasInsight = insightKeywords.some(keyword => contentDraft.toLowerCase().includes(keyword));
      if (!hasInsight) {
        warnings.push({
          type: 'missing_insight',
          severity: 'medium',
          message: 'Content appears to lack deeper business insight or mechanism explanation.',
          fix: 'Explain WHY this works, the hidden mechanism, or universal principle'
        });
      }
      
      // Check for broad appeal
      const narrowPatterns = ['restaurant owners', 'if you own', 'for operators only'];
      for (const pattern of narrowPatterns) {
        if (contentDraft.toLowerCase().includes(pattern)) {
          warnings.push({
            type: 'too_narrow_audience',
            severity: 'medium',
            message: 'Content may be too narrow for broad LinkedIn audience.',
            fix: 'Focus on universal business principles anyone can learn from'
          });
        }
      }
      
      const safeToPost = warnings.filter(w => w.severity === 'high').length === 0;
      
      return { success: true, warnings, safe_to_post: safeToPost };
      
    } catch (error) {
      return { success: false, warnings: [], safe_to_post: false, error: `Anti-pattern check error: ${error}` };
    }
  }
});

// TOOL 4: VOICE MATCHING - Match Raghav's specific voice patterns  
export const raghavVoiceMatchingTool = createTool({
  id: 'raghav_voice_matching',
  description: 'Compare draft content against Raghav\'s voice patterns and suggest improvements',
  
  inputSchema: z.object({
    postDraft: z.string().describe('Draft LinkedIn post to analyze'),
    targetEngagement: z.enum(['high', 'medium']).optional().describe('Target engagement level')
  }),

  outputSchema: z.object({
    success: z.boolean(),
    voice_score: z.number(),
    suggestions: z.array(z.any()),
    raghav_examples: z.array(z.any()).optional(),
    error: z.string().optional()
  }),
  
  execute: async ({ context }) => {
    const { postDraft, targetEngagement = 'high' } = context;
    
    try {
      const posts = loadRaghavPosts();
      const viralPosts = posts.filter((p: any) => p.isViral === true);
      const highEngagementPosts = viralPosts.filter((p: any) => p.engagement.engagementScore > 100);
      
      const suggestions = [];
      let voiceScore = 0;
      
      // Check for Raghav's signature hook patterns
      const hasShockingNumbers = /\$[\d.]+[BMK]|\d+\.?\d*%|\d+x/.test(postDraft);
      if (hasShockingNumbers) {
        voiceScore += 20;
      } else {
        suggestions.push({
          element: 'hook',
          issue: 'Missing shocking numbers in opening',
          raghav_example: 'Chick-fil-A earns $8.5M per store. Subway? $500K.',
          fix: 'Start with specific shocking data comparison'
        });
      }
      
      // Check for Raghav's transition phrases
      const raghavTransitions = ['Here\'s why', 'The math that', 'Why:', 'The result?', 'But here\'s'];
      const hasTransitions = raghavTransitions.some(t => postDraft.includes(t));
      if (hasTransitions) {
        voiceScore += 15;
      } else {
        suggestions.push({
          element: 'transitions',
          issue: 'Missing Raghav\'s signature transition phrases',
          raghav_example: 'Here\'s why it was genius:', 
          fix: 'Use "Here\'s why:", "The math that shocked:", or "But here\'s the problem:"'
        });
      }
      
      // Check for arrow bullets (Raghav signature)
      const hasArrowBullets = postDraft.includes('→') || postDraft.includes('•');
      if (hasArrowBullets) {
        voiceScore += 10;
      } else {
        suggestions.push({
          element: 'formatting',
          issue: 'Missing Raghav\'s signature bullet formatting',
          raghav_example: '→ Owned model: $1.9B\n→ Franchised model: $700M',
          fix: 'Use arrow bullets (→) for data presentation'
        });
      }
      
      // Check for contrarian framing
      const contrarian = ['chose to lose', 'refused to', 'did the opposite', 'while everyone'];
      const hasContrarian = contrarian.some(c => postDraft.toLowerCase().includes(c));
      if (hasContrarian) {
        voiceScore += 15;
      } else {
        suggestions.push({
          element: 'positioning',
          issue: 'Missing contrarian business decision framing',
          raghav_example: 'Chipotle chose to lose $1.2B. Here\'s why it was genius.',
          fix: 'Frame as contrarian business decision that defied conventional wisdom'
        });
      }
      
      // Check for mechanism explanation
      const mechanisms = ['mechanism', 'why this works', 'the core issue', 'fixed costs', 'control'];
      const hasMechanism = mechanisms.some(m => postDraft.toLowerCase().includes(m));
      if (hasMechanism) {
        voiceScore += 20;
      } else {
        suggestions.push({
          element: 'mechanism',
          issue: 'Missing mechanism explanation',
          raghav_example: 'The core issue is fixed costs. When you pay $227K rent on $980K revenue...',
          fix: 'Explain the underlying business mechanism that drives the outcome'
        });
      }
      
      // Check for engagement question
      const hasQuestion = postDraft.includes('?');
      if (hasQuestion) {
        voiceScore += 10;
      } else {
        suggestions.push({
          element: 'engagement',
          issue: 'Missing engagement question',
          raghav_example: 'What business model "rules" is your industry following blindly?',
          fix: 'End with thought-provoking question that applies to reader\'s industry'
        });
      }
      
      // Check for universal principle
      const principles = ['lesson:', 'principle:', 'the truth:', 'universal'];
      const hasPrinciple = principles.some(p => postDraft.toLowerCase().includes(p));
      if (hasPrinciple) {
        voiceScore += 10;
      } else {
        suggestions.push({
          element: 'principle',
          issue: 'Missing universal principle extraction',
          raghav_example: 'The lesson: When you\'re capital-rich, franchising is giving away your best stores.',
          fix: 'Extract universal business principle readers can apply'
        });
      }
      
      // Find similar high-performing posts for examples
      const similarPosts = highEngagementPosts.slice(0, 3).map((p: any) => ({
        postId: p.id,
        hook: p.text.split('\n')[0],
        engagement: p.engagement.engagementScore,
        why_it_worked: p.analysis.whatWorkedOrDidntWork
      }));
      
      return { 
        success: true, 
        voice_score: voiceScore, 
        suggestions: suggestions.slice(0, 5),
        raghav_examples: similarPosts 
      };
      
    } catch (error) {
      return { success: false, voice_score: 0, suggestions: [], error: `Voice matching error: ${error}` };
    }
  }
});

// TOOL 5: ENGAGEMENT PREDICTOR - Predict virality based on historical patterns
export const engagementPredictorTool = createTool({
  id: 'engagement_predictor',
  description: 'Predict post engagement potential based on Raghav\'s historical viral patterns',
  
  inputSchema: z.object({
    postDraft: z.string().describe('Draft post to analyze for viral potential')
  }),

  outputSchema: z.object({
    success: z.boolean(),
    predicted_engagement: z.string(),
    viral_probability: z.number(),
    key_strengths: z.array(z.string()),
    improvement_areas: z.array(z.string()),
    error: z.string().optional()
  }),
  
  execute: async ({ context }) => {
    const { postDraft } = context;
    
    try {
      const posts = loadRaghavPosts();
      const viralPosts = posts.filter((p: any) => p.isViral === true);
      const failedPosts = posts.filter((p: any) => p.isViral === false);
      
      let viralScore = 0;
      const strengths: string[] = [];
      const improvements: string[] = [];
      
      // Check viral signals presence
      const viralSignals = [
        { pattern: /\$[\d.]+[BMK]\s*vs\s*\$[\d.]+[BMK]/, signal: 'shocking_number_contrast', points: 30 },
        { pattern: /(chose to lose|\d+x\s+gap|vs\s+\$[\d.]+[BMK])/, signal: 'shocking_contrast', points: 25 },
        { pattern: /(Here's why|The math|mechanism|fixed costs)/, signal: 'detailed_breakdown', points: 20 },
        { pattern: /(did the opposite|refused to|while everyone|contrarian)/, signal: 'contrarian_positioning', points: 20 },
        { pattern: /→/, signal: 'raghav_formatting', points: 15 },
        { pattern: /\?$/, signal: 'engagement_question', points: 10 }
      ];
      
      viralSignals.forEach(({ pattern, signal, points }) => {
        if (pattern.test(postDraft)) {
          viralScore += points;
          strengths.push(`✅ ${signal}: Detected in content`);
        } else {
          improvements.push(`❌ Missing ${signal}: Add this element`);
        }
      });
      
      // Check for anti-patterns
      const antiPatterns = ['Did you know', 'Have you heard', 'Surprisingly,', 'Everyone knows'];
      antiPatterns.forEach(pattern => {
        if (postDraft.includes(pattern)) {
          viralScore -= 30;
          improvements.push(`🚨 REMOVE: "${pattern}" - destroys credibility instantly`);
        }
      });
      
      const viralProbability = Math.min(Math.max(viralScore / 100, 0), 1);
      
      let predictedEngagement = 'low';
      if (viralScore >= 80) predictedEngagement = 'very_high';
      else if (viralScore >= 60) predictedEngagement = 'high';  
      else if (viralScore >= 40) predictedEngagement = 'medium';
      
      return {
        success: true,
        predicted_engagement: predictedEngagement,
        viral_probability: viralProbability,
        key_strengths: strengths,
        improvement_areas: improvements.slice(0, 5)
      };
      
    } catch (error) {
      return { success: false, predicted_engagement: 'unknown', viral_probability: 0, key_strengths: [], improvement_areas: [], error: `Prediction error: ${error}` };
    }
  }
});
// TOOL 5: REPEAT CONTENT DETECTOR - Check if Taylor's post is too similar to existing content
export const repeatContentDetectorTool = createTool({
  id: 'repeat_content_detector',
  description: 'Check if draft post is too similar to Raghav\'s existing posts to avoid repetitive content',
  
  inputSchema: z.object({
    postDraft: z.string().describe('Taylor\'s draft post to check for similarity'),
    similarityThreshold: z.number().optional().describe('Similarity threshold (0.0-1.0), default 0.7')
  }),

  outputSchema: z.object({
    success: z.boolean(),
    is_repeat: z.boolean(),
    similarity_score: z.number(),
    similar_posts: z.array(z.any()).optional(),
    recommendation: z.string(),
    error: z.string().optional()
  }),
  
  execute: async ({ context }) => {
    const { postDraft, similarityThreshold = 0.7 } = context;
    
    try {
      const posts = loadRaghavPosts();
      const similarities: any[] = [];
      
      // Extract key elements from Taylor's draft
      const companyRegex = /\b(McDonald's|Chipotle|Starbucks|Taco Bell|Pizza Hut|Subway|Chick-fil-A|Dutch Bros|Wingstop|DoorDash|Uber|Cava|Sweetgreen|Din Tai Fung|Shake Shack|Jack in the Box|Del Taco|Wendy's|Burger King|KFC|Domino's|Papa John's|Little Caesars|Panera|Qdoba|Moe's|In-N-Out|Five Guys|White Castle|Popeyes|Dunkin|Krispy Kreme)\b/gi;
      const draftCompanies = (postDraft.match(companyRegex) || []);
      const draftNumbers = (postDraft.match(/\$[\d.]+[BMK]?|\d+\.?\d*%|\d+x/g) || []);
      
      const businessConcepts = ['franchise', 'margin', 'revenue', 'profit', 'control', 'owned', 'operator', 'unit economics', 'same-store sales', 'operating income', 'expansion', 'growth', 'pricing', 'fixed costs', 'variable costs', 'ROIC', 'cash flow', 'valuation'];
      const draftConcepts = businessConcepts.filter(concept => postDraft.toLowerCase().includes(concept));
      
      // Compare against each existing post
      posts.forEach((existingPost: any) => {
        let similarityScore = 0;
        const reasons: string[] = [];
        
        // 1. Company overlap (weight: 0.3)
        const existingCompanies = (existingPost.text.match(companyRegex) || []);
        const companyOverlap = draftCompanies.filter(company => existingCompanies.includes(company));
        if (companyOverlap.length > 0) {
          similarityScore += 0.3;
          reasons.push(`Same companies: ${companyOverlap.join(', ')}`);
        }
        
        // 2. Number overlap (weight: 0.2)
        const existingNumbers = (existingPost.text.match(/\$[\d.]+[BMK]?|\d+\.?\d*%|\d+x/g) || []);
        const numberOverlap = draftNumbers.filter(num => existingNumbers.includes(num));
        if (numberOverlap.length > 0) {
          similarityScore += 0.2;
          reasons.push(`Similar numbers: ${numberOverlap.join(', ')}`);
        }
        
        // 3. Concept overlap (weight: 0.2)
        const existingConcepts = businessConcepts.filter(concept => existingPost.text.toLowerCase().includes(concept));
        const conceptOverlap = draftConcepts.filter(concept => existingConcepts.includes(concept));
        if (conceptOverlap.length >= 3) {
          similarityScore += 0.2;
          reasons.push(`Similar concepts: ${conceptOverlap.slice(0, 3).join(', ')}`);
        }
        
        // 4. Hook structure overlap (weight: 0.3)
        const draftHook = postDraft.split('\n')[0];
        const existingHook = existingPost.text.split('\n')[0];
        
        const hookPatterns = [
          /\$[\d.]+[BMK]?\s*vs?\s*\$[\d.]+[BMK]?/, // "$X vs $Y"
          /(chose to|refuses to|decided to)/, // Decision framing
          /\d+\.?\d*%\s*(vs|compared to|while)/, // Percentage comparisons
          /(makes|generates|earns)\s*\$[\d.]+[BMK]?/ // Revenue statements
        ];
        
        let hookMatches = 0;
        hookPatterns.forEach(pattern => {
          if (pattern.test(draftHook) && pattern.test(existingHook)) {
            hookMatches++;
          }
        });
        
        if (hookMatches >= 2) {
          similarityScore += 0.3;
          reasons.push('Similar hook structure');
        }
        
        if (similarityScore > 0) {
          similarities.push({
            postId: existingPost.id,
            similarityScore,
            reasons,
            existingHook: existingHook,
            existingEngagement: existingPost.engagement?.engagementScore || 0,
            isViral: existingPost.isViral
          });
        }
      });
      
      // Sort by similarity and get top matches
      similarities.sort((a, b) => b.similarityScore - a.similarityScore);
      const topSimilar = similarities.slice(0, 3);
      
      const highestSimilarity = similarities.length > 0 ? similarities[0].similarityScore : 0;
      const isRepeat = highestSimilarity >= similarityThreshold;
      
      let recommendation = 'Content appears original - safe to proceed';
      if (isRepeat) {
        const similar = similarities[0];
        recommendation = `🚨 REPEAT TOPIC: ${similar.similarityScore.toFixed(2)} similarity to ${similar.postId}. Consider different angle or company comparison.`;
      } else if (highestSimilarity > 0.5) {
        recommendation = `⚠️ SIMILAR CONTENT: ${highestSimilarity.toFixed(2)} similarity detected. Consider emphasizing different aspect.`;
      }
      
      return {
        success: true,
        is_repeat: isRepeat,
        similarity_score: highestSimilarity,
        similar_posts: topSimilar,
        recommendation
      };
      
    } catch (error) {
      return { 
        success: false, 
        is_repeat: false, 
        similarity_score: 0, 
        recommendation: 'Error checking similarity', 
        error: `Similarity check error: ${error}` 
      };
    }
  }
});

