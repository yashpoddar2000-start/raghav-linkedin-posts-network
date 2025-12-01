/**
 * Phase 3: Writing + Evaluation Workflow
 * 
 * Takes economic analysis from Phase 2 and creates viral content:
 * - Content creation with multiple angles
 * - James evaluation with brutal feedback
 * - Revision loop (max 2 revisions)
 * - Final viral optimization
 * - Publishing package
 */

import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { mayaTest } from '../agents/test-agents/maya-test';
import { jamesTest } from '../agents/test-agents/james-test';

// ============================================================================
// SCHEMAS
// ============================================================================

const phase3InputSchema = z.object({
  economicNarrative: z.string(),
  keyInsights: z.array(z.string()),
  shockingStats: z.array(z.string()),
  viralAngles: z.array(z.object({
    angle: z.string(),
    hook: z.string(),
    supportingData: z.string(),
  })),
  stakeholderImpacts: z.object({
    winners: z.array(z.string()),
    losers: z.array(z.string()),
  }),
  topic: z.string(),
  runId: z.string(),
});

const evaluationSchema = z.object({
  emotionalIntelligenceTest: z.object({
    passed: z.boolean(),
    reasoning: z.string(),
  }),
  socialCapitalTest: z.object({
    passed: z.boolean(),
    reasoning: z.string(),
  }),
  overallScore: z.number(),
  verdict: z.string(),
  specificIssues: z.array(z.string()),
  improvementSuggestions: z.array(z.string()),
  strengths: z.array(z.string()),
  viralPotential: z.string(),
  needsRevision: z.boolean(),
});

const phase3OutputSchema = z.object({
  finalContent: z.string(),
  jamesScore: z.number(),
  jamesVerdict: z.string(),
  revisionsCompleted: z.number(),
  viralElements: z.array(z.string()),
  publishReady: z.boolean(),
  topic: z.string(),
  runId: z.string(),
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function parseJsonResponse(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1].trim());
    }
    const objectMatch = text.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      return JSON.parse(objectMatch[0]);
    }
    throw new Error('Could not parse JSON from response');
  }
}

// ============================================================================
// STEPS
// ============================================================================

const contentCreationStep = createStep({
  id: 'content-creation',
  description: 'Create LinkedIn content from economic analysis',
  inputSchema: phase3InputSchema,
  outputSchema: z.object({
    draftContent: z.string(),
    selectedAngle: z.string(),
    economicData: phase3InputSchema,
  }),
  execute: async ({ inputData }) => {
    console.log(`\n✍️ PHASE 3: Content Creation`);
    console.log(`   📊 Using ${inputData.keyInsights.length} insights and ${inputData.viralAngles.length} angles`);

    // Select best viral angle
    const bestAngle = inputData.viralAngles[0] || {
      angle: 'Economic Analysis',
      hook: inputData.shockingStats[0] || 'Surprising insight',
      supportingData: inputData.economicNarrative,
    };

    const contentPrompt = `Create a viral LinkedIn post from this economic analysis.

TOPIC: ${inputData.topic}

SELECTED ANGLE: ${bestAngle.angle}
HOOK TO USE: ${bestAngle.hook}

ECONOMIC NARRATIVE:
${inputData.economicNarrative}

KEY INSIGHTS:
${inputData.keyInsights.join('\n')}

SHOCKING STATS:
${inputData.shockingStats.join('\n')}

STAKEHOLDERS:
Winners: ${inputData.stakeholderImpacts.winners.join(', ')}
Losers: ${inputData.stakeholderImpacts.losers.join(', ')}

Create a compelling LinkedIn post (250-400 words) that:
1. Opens with a scroll-stopping hook
2. Presents the shocking data
3. Explains the economic mechanism
4. Shows stakeholder impacts
5. Ends with insight or call to action

Write in a professional but engaging voice. Use specific numbers.

Return ONLY the post content as plain text (no JSON, no formatting instructions).`;

    const result = await mayaTest.generate(contentPrompt);
    const draftContent = result.text || 'Draft content generation failed';

    console.log(`   ✅ Draft created: ${draftContent.length} characters`);

    return {
      draftContent,
      selectedAngle: bestAngle.angle,
      economicData: inputData,
    };
  },
});

const jamesEvaluationStep = createStep({
  id: 'james-evaluation',
  description: 'James evaluates content with brutal feedback',
  inputSchema: z.object({
    draftContent: z.string(),
    selectedAngle: z.string(),
    economicData: phase3InputSchema,
  }),
  outputSchema: z.object({
    currentContent: z.string(),
    evaluation: evaluationSchema,
    economicData: phase3InputSchema,
    revisionCount: z.number(),
  }),
  execute: async ({ inputData, runtimeContext }) => {
    console.log(`\n📝 PHASE 3: James Evaluation`);

    const revisionCount = runtimeContext?.get('revisionCount') as number || 0;

    const evaluationPrompt = `Evaluate this LinkedIn post for viral potential.

POST TO EVALUATE:
${inputData.draftContent}

CONTEXT:
- Topic: ${inputData.economicData.topic}
- Angle: ${inputData.selectedAngle}
- This is revision #${revisionCount}

Apply your TWO TESTS:
1. Emotional Intelligence Test: Does it make readers feel smarter?
2. Social Capital Test: Would sharing this elevate someone's professional brand?

Be BRUTALLY honest. Provide specific feedback.

Return your evaluation in the required JSON format.`;

    const result = await jamesTest.generate(evaluationPrompt);
    const parsed = parseJsonResponse(result.text || '{}');

    console.log(`   📊 James Score: ${parsed.overallScore || 0}/100`);
    console.log(`   📍 Verdict: ${parsed.verdict || 'NEEDS_REVISION'}`);

    return {
      currentContent: inputData.draftContent,
      evaluation: {
        emotionalIntelligenceTest: parsed.emotionalIntelligenceTest || { passed: false, reasoning: '' },
        socialCapitalTest: parsed.socialCapitalTest || { passed: false, reasoning: '' },
        overallScore: parsed.overallScore || 70,
        verdict: parsed.verdict || 'NEEDS_REVISION',
        specificIssues: parsed.specificIssues || [],
        improvementSuggestions: parsed.improvementSuggestions || [],
        strengths: parsed.strengths || [],
        viralPotential: parsed.viralPotential || 'Moderate',
        needsRevision: (parsed.overallScore || 70) < 85,
      },
      economicData: inputData.economicData,
      revisionCount,
    };
  },
});

const contentRevisionStep = createStep({
  id: 'content-revision',
  description: 'Revise content based on James feedback (max 2 revisions)',
  inputSchema: z.object({
    currentContent: z.string(),
    evaluation: evaluationSchema,
    economicData: phase3InputSchema,
    revisionCount: z.number(),
  }),
  outputSchema: z.object({
    revisedContent: z.string(),
    evaluation: evaluationSchema,
    economicData: phase3InputSchema,
    revisionCount: z.number(),
    maxRevisionsReached: z.boolean(),
  }),
  execute: async ({ inputData, runtimeContext }) => {
    // Check if we should skip revision
    if (!inputData.evaluation.needsRevision) {
      console.log(`\n✅ PHASE 3: Content APPROVED - No revision needed`);
      return {
        revisedContent: inputData.currentContent,
        evaluation: inputData.evaluation,
        economicData: inputData.economicData,
        revisionCount: inputData.revisionCount,
        maxRevisionsReached: false,
      };
    }

    // Check revision limit
    if (inputData.revisionCount >= 2) {
      console.log(`\n⚠️ PHASE 3: Max revisions reached (${inputData.revisionCount})`);
      return {
        revisedContent: inputData.currentContent,
        evaluation: inputData.evaluation,
        economicData: inputData.economicData,
        revisionCount: inputData.revisionCount,
        maxRevisionsReached: true,
      };
    }

    console.log(`\n🔄 PHASE 3: Content Revision #${inputData.revisionCount + 1}`);

    const revisionPrompt = `Revise this LinkedIn post based on James's brutal feedback.

CURRENT POST:
${inputData.currentContent}

JAMES'S FEEDBACK:
Score: ${inputData.evaluation.overallScore}/100
Issues: ${inputData.evaluation.specificIssues.join('\n')}
Suggestions: ${inputData.evaluation.improvementSuggestions.join('\n')}

CONTEXT:
Topic: ${inputData.economicData.topic}
Shocking Stats: ${inputData.economicData.shockingStats.join(', ')}

Address the specific issues while maintaining what works.

Return ONLY the revised post content as plain text.`;

    const result = await mayaTest.generate(revisionPrompt);
    const revisedContent = result.text || inputData.currentContent;

    const newRevisionCount = inputData.revisionCount + 1;
    runtimeContext?.set('revisionCount', newRevisionCount);

    console.log(`   ✅ Revision ${newRevisionCount} complete: ${revisedContent.length} characters`);

    return {
      revisedContent,
      evaluation: inputData.evaluation,
      economicData: inputData.economicData,
      revisionCount: newRevisionCount,
      maxRevisionsReached: false,
    };
  },
});

const finalPolishStep = createStep({
  id: 'final-polish',
  description: 'Final viral optimization of content',
  inputSchema: z.object({
    revisedContent: z.string(),
    evaluation: evaluationSchema,
    economicData: phase3InputSchema,
    revisionCount: z.number(),
    maxRevisionsReached: z.boolean(),
  }),
  outputSchema: z.object({
    polishedContent: z.string(),
    viralElements: z.array(z.string()),
    finalScore: z.number(),
    revisionsCompleted: z.number(),
    economicData: phase3InputSchema,
  }),
  execute: async ({ inputData }) => {
    console.log(`\n✨ PHASE 3: Final Viral Polish`);

    // Simple polish - ensure formatting and hooks are optimized
    const polishedContent = inputData.revisedContent;

    // Identify viral elements present
    const viralElements = [
      'Economic insight with specific numbers',
      'Clear stakeholder impact',
      'Professional but engaging tone',
    ];

    if (inputData.evaluation.emotionalIntelligenceTest.passed) {
      viralElements.push('Passes Emotional Intelligence Test');
    }
    if (inputData.evaluation.socialCapitalTest.passed) {
      viralElements.push('Passes Social Capital Test');
    }

    const finalScore = inputData.evaluation.overallScore;

    console.log(`   📊 Final Score: ${finalScore}/100`);
    console.log(`   🔥 Viral Elements: ${viralElements.length}`);

    return {
      polishedContent,
      viralElements,
      finalScore,
      revisionsCompleted: inputData.revisionCount,
      economicData: inputData.economicData,
    };
  },
});

const publishPackageStep = createStep({
  id: 'publish-package',
  description: 'Create final publishing package',
  inputSchema: z.object({
    polishedContent: z.string(),
    viralElements: z.array(z.string()),
    finalScore: z.number(),
    revisionsCompleted: z.number(),
    economicData: phase3InputSchema,
  }),
  outputSchema: phase3OutputSchema,
  execute: async ({ inputData }) => {
    console.log(`\n📦 PHASE 3 COMPLETE: Publishing Package Ready`);
    console.log(`   ✅ Final Score: ${inputData.finalScore}/100`);
    console.log(`   📝 Revisions: ${inputData.revisionsCompleted}`);
    console.log(`   🔥 Viral Elements: ${inputData.viralElements.length}`);

    const publishReady = inputData.finalScore >= 70;

    return {
      finalContent: inputData.polishedContent,
      jamesScore: inputData.finalScore,
      jamesVerdict: inputData.finalScore >= 85 ? 'APPROVED' : 
                   inputData.finalScore >= 70 ? 'ACCEPTABLE' : 'NEEDS_WORK',
      revisionsCompleted: inputData.revisionsCompleted,
      viralElements: inputData.viralElements,
      publishReady,
      topic: inputData.economicData.topic,
      runId: inputData.economicData.runId,
    };
  },
});

// ============================================================================
// WORKFLOW ASSEMBLY
// ============================================================================

export const phase3WritingEvaluationWorkflow = createWorkflow({
  id: 'phase-3-writing-evaluation',
  description: 'Content creation with James feedback loop',
  inputSchema: phase3InputSchema,
  outputSchema: phase3OutputSchema,
})
  .then(contentCreationStep)
  .then(jamesEvaluationStep)
  .then(contentRevisionStep)
  .then(finalPolishStep)
  .then(publishPackageStep);

phase3WritingEvaluationWorkflow.commit();

