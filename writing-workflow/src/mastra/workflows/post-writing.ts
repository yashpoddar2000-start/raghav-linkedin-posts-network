import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";

// Schema for James's structured evaluation output
export const evaluationSchema = z.object({
  ei_score: z.number().min(0).max(10),
  sc_score: z.number().min(0).max(10),
  critique: z.string(),
  fixes: z.array(z.string()),
});

// Schema for critique history entry
const critiqueEntrySchema = z.object({
  iteration: z.number(),
  ei_score: z.number(),
  sc_score: z.number(),
  critique: z.string(),
  fixes: z.array(z.string()),
});

// Full workflow state schema
export const workflowStateSchema = z.object({
  // Immutable inputs (carried through all iterations)
  research: z.string(),
  voice_example: z.string(),

  // Mutable state
  draft: z.string().optional(),
  critique_history: z.array(critiqueEntrySchema).default([]),

  // Current scores (for loop condition)
  current_ei_score: z.number().default(0),
  current_sc_score: z.number().default(0),
  iteration: z.number().default(0),
});

// Input schema (what the workflow receives initially)
export const workflowInputSchema = z.object({
  research: z.string(),
  voice_example: z.string(),
});

// Output schema (what the workflow returns)
export const workflowOutputSchema = workflowStateSchema;

// Maximum iterations to prevent infinite loops
const MAX_ITERATIONS = 5;

/**
 * Single step that:
 * 1. Taylor writes (or revises) the post
 * 2. James evaluates it
 * 3. Returns updated state
 */
export const writeAndEvaluateStep = createStep({
  id: "write-and-evaluate",
  inputSchema: workflowStateSchema,
  outputSchema: workflowStateSchema,
  execute: async ({ inputData, mastra }) => {
    if (!mastra) {
      throw new Error("Mastra instance not available");
    }

    const taylor = mastra.getAgent("taylor");
    const james = mastra.getAgent("james");

    if (!taylor || !james) {
      throw new Error("Agents not found. Make sure taylor and james are registered.");
    }

    const iteration = (inputData.iteration || 0) + 1;
    
    // Defensive: ensure critique_history is always an array
    const critiqueHistory = Array.isArray(inputData.critique_history) 
      ? inputData.critique_history 
      : [];

    // Safety check: max iterations
    if (iteration > MAX_ITERATIONS) {
      console.log(`⚠️ Max iterations (${MAX_ITERATIONS}) reached. Returning current draft.`);
      return {
        ...inputData,
        iteration,
        current_ei_score: 10, // Force exit
        current_sc_score: 10,
      };
    }

    console.log(`\n${"=".repeat(60)}`);
    console.log(`📝 ITERATION ${iteration}`);
    console.log(`${"=".repeat(60)}`);
    console.log(`📊 Current State:`);
    console.log(`   - Has draft: ${!!inputData.draft}`);
    console.log(`   - Critique history length: ${critiqueHistory.length}`);
    console.log(`   - Current EI score: ${inputData.current_ei_score || 0}`);
    console.log(`   - Current SC score: ${inputData.current_sc_score || 0}`);
    console.log(`   - Research data length: ${inputData.research.length} chars`);
    console.log(`   - Voice example length: ${inputData.voice_example.length} chars\n`);

    // 1. Build Taylor's prompt based on whether this is first draft or revision
    let taylorPrompt: string;

    if (!inputData.draft) {
      // First iteration: write from scratch
      console.log("🖊️ Taylor: Writing first draft (no previous draft exists)...\n");
      taylorPrompt = `Write a LinkedIn post based on this research data.

Don't write for virality. If the insight is strong, engagement will follow naturally.

Look at the voice example carefully - notice how it:
- Starts with a QUESTION that creates curiosity
- Uses a COMPARISON between two companies/models  
- Reveals a PARADOX (something counterintuitive)
- Shows the MATH to prove the paradox
- Explains the WHY

Find the most interesting comparison or paradox in the research data. Let that drive your structure.

=== RESEARCH DATA ===
${inputData.research}

=== VOICE EXAMPLE (take the voice, find the structure) ===
${inputData.voice_example}

Write the post now. No preamble, just the post content.`;
    } else {
      // Revision: include critique history
      const lastCritique = critiqueHistory.at(-1);
      if (!lastCritique) {
        throw new Error("Expected critique history for revision");
      }

      console.log(`🔄 Taylor: Revising based on James's feedback (EI: ${lastCritique.ei_score}/10, SC: ${lastCritique.sc_score}/10)...\n`);

      // Build previous mistakes summary (excluding the most recent critique)
      const previousMistakes = critiqueHistory
        .slice(0, -1)
        .flatMap((c) => c.fixes)
        .join("\n- ");

      taylorPrompt = `REVISION REQUEST

Your previous draft scored:
- Emotional Intelligence: ${lastCritique.ei_score}/10
- Social Capital: ${lastCritique.sc_score}/10

James's critique:
${lastCritique.critique}

SPECIFIC FIXES REQUIRED (address ALL of these):
${lastCritique.fixes.map((f, i) => `${i + 1}. ${f}`).join("\n")}

${previousMistakes ? `\nPREVIOUS MISTAKES (don't repeat these):\n- ${previousMistakes}` : ""}

=== CURRENT DRAFT TO REVISE ===
${inputData.draft}

=== RESEARCH DATA (for fact-checking) ===
${inputData.research}

=== VOICE EXAMPLE (maintain this tone) ===
${inputData.voice_example}

Write the revised post now. Address every fix. No preamble, just the post content.`;

      // DEBUG: Print what Taylor is receiving
      console.log("📋 TAYLOR'S REVISION PROMPT:");
      console.log(`   Previous scores: EI ${lastCritique.ei_score}/10, SC ${lastCritique.sc_score}/10`);
      console.log(`   Number of fixes to address: ${lastCritique.fixes.length}`);
      console.log("\n   FIXES:");
      lastCritique.fixes.forEach((fix, i) => {
        console.log(`   ${i + 1}. ${fix.substring(0, 150)}${fix.length > 150 ? "..." : ""}`);
      });
      if (previousMistakes) {
        console.log(`\n   Previous mistakes to avoid: ${previousMistakes.substring(0, 200)}...`);
      }
      console.log();
    }

    // 2. Taylor writes/revises
    console.log("⏳ Calling Taylor agent (this may take 20-60 seconds)...\n");
    const taylorResponse = await taylor.generate([
      { role: "user", content: taylorPrompt },
    ]);
    const newDraft = taylorResponse.text;

    console.log("📄 Draft written. Length:", newDraft.length, "characters");
    console.log("\n📝 DRAFT PREVIEW (first 300 chars):");
    console.log(`   ${newDraft.substring(0, 300)}...\n`);

    // 3. James evaluates (with structured output)
    console.log("🔍 James: Evaluating draft...");
    console.log("⏳ Calling James agent (this may take 20-60 seconds)...\n");

    const jamesPrompt = `=== RESEARCH DATA (use this to fact-check AND find better insights) ===
${inputData.research}

=== VOICE EXAMPLE (compare style against this) ===
${inputData.voice_example}

=== POST TO EVALUATE ===
${newDraft}

Evaluate this post:
1. Fact-check every claim against the research data
2. Compare the style and structure to the voice example
3. Look for BETTER insights in the research that the writer missed - stronger comparisons, more interesting paradoxes, more compelling numbers
4. If there's a better story hiding in the research, tell the writer exactly what it is

Be brutal.`;
    
    const jamesResponse = await james.generate(
      [{ role: "user", content: jamesPrompt }],
      { output: evaluationSchema }
    );

    const evaluation = jamesResponse.object;

    console.log(`📊 James's Scores: EI ${evaluation.ei_score}/10, SC ${evaluation.sc_score}/10`);
    console.log(`📝 Fixes required: ${evaluation.fixes.length}`);
    
    // DEBUG: Print James's full critique and fixes
    console.log("\n🔍 JAMES'S CRITIQUE:");
    console.log(`   ${evaluation.critique.substring(0, 500)}${evaluation.critique.length > 500 ? "..." : ""}`);
    console.log("\n   FIXES PROVIDED:");
    evaluation.fixes.forEach((fix, i) => {
      console.log(`   ${i + 1}. ${fix.substring(0, 150)}${fix.length > 150 ? "..." : ""}`);
    });
    console.log();

    // 4. Update and return state
    const updatedState = {
      research: inputData.research,
      voice_example: inputData.voice_example,
      draft: newDraft,
      critique_history: [
        ...critiqueHistory,
        {
          iteration,
          ei_score: evaluation.ei_score,
          sc_score: evaluation.sc_score,
          critique: evaluation.critique,
          fixes: evaluation.fixes,
        },
      ],
      current_ei_score: evaluation.ei_score,
      current_sc_score: evaluation.sc_score,
      iteration,
    };

    console.log("📦 Returning state to next iteration:");
    console.log(`   - Draft length: ${newDraft.length} chars`);
    console.log(`   - Critique history entries: ${updatedState.critique_history.length}`);
    console.log(`   - EI score: ${evaluation.ei_score}/10`);
    console.log(`   - SC score: ${evaluation.sc_score}/10`);
    console.log(`   - Iteration: ${iteration}`);
    console.log();

    return updatedState;
  },
});

/**
 * Main workflow: loops until both scores >= 9
 */
export const postWritingWorkflow = createWorkflow({
  id: "post-writing",
  inputSchema: workflowStateSchema, // Changed to use full state schema
  outputSchema: workflowOutputSchema,
})
  .dountil(
    writeAndEvaluateStep,
    async ({ inputData }) => {
      const passed = inputData.current_ei_score >= 8 && inputData.current_sc_score >= 8;
      
      console.log(`\n🔄 LOOP CONDITION CHECK:`);
      console.log(`   EI score: ${inputData.current_ei_score}/10 (need >=8)`);
      console.log(`   SC score: ${inputData.current_sc_score}/10 (need >=8)`);
      console.log(`   Passed: ${passed ? "✅ YES - Exiting loop" : "❌ NO - Continue iterating"}`);
      
      if (passed) {
        console.log(`\n✅ WORKFLOW COMPLETE! EI: ${inputData.current_ei_score}/10, SC: ${inputData.current_sc_score}/10\n`);
      }
      
      return passed;
    }
  )
  .commit();

