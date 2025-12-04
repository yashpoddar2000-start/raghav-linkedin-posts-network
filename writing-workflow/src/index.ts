import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { mastra } from "./mastra/index";

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to original test data (no copying needed)
const RESEARCH_PATH = path.resolve(
  __dirname,
  "../../raghav-exa-posts/12-01-week/deep-research-4.json"
);
const VOICE_PATH = path.resolve(
  __dirname,
  "../../raghav-exa-posts/11-22-week/in-n-out-post-fixed.txt"
);
const OUTPUT_DIR = path.resolve(__dirname, "../output");
const REFERENCE_POST_PATH = path.resolve(
  __dirname,
  "../../raghav-exa-posts/12-01-week/drive-thru-economics-post.txt"
);

async function main() {
  console.log("🚀 Starting Taylor-James Writing Workflow\n");

  // Load test data
  console.log("📂 Loading test data...");

  if (!fs.existsSync(RESEARCH_PATH)) {
    throw new Error(`Research file not found: ${RESEARCH_PATH}`);
  }
  if (!fs.existsSync(VOICE_PATH)) {
    throw new Error(`Voice example not found: ${VOICE_PATH}`);
  }

  const researchData = fs.readFileSync(RESEARCH_PATH, "utf-8");
  const voiceExample = fs.readFileSync(VOICE_PATH, "utf-8");

  // Parse research JSON to get the combined research text
  const researchJson = JSON.parse(researchData);
  const research = researchJson.combinedResearch || researchData;

  console.log(`   Research: ${research.length} characters`);
  console.log(`   Voice example: ${voiceExample.length} characters\n`);

  // Get the workflow
  const workflow = mastra.getWorkflow("post-writing");
  if (!workflow) {
    throw new Error("Workflow 'post-writing' not found");
  }

  // Create a run
  const run = workflow.createRun();

  console.log("🏃 Running workflow...\n");
  const startTime = Date.now();

  // Execute workflow with properly initialized state
  const result = await run.start({
    inputData: {
      research,
      voice_example: voiceExample,
      critique_history: [],
      current_ei_score: 0,
      current_sc_score: 0,
      iteration: 0,
    },
  });

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n⏱️ Completed in ${elapsed}s`);

  // Handle result
  if (result.status === "success") {
    const output = result.result;

    console.log(`\n${"=".repeat(60)}`);
    console.log("📊 FINAL RESULTS");
    console.log(`${"=".repeat(60)}`);
    console.log(`Iterations: ${output.iteration}`);
    console.log(`Final EI Score: ${output.current_ei_score}/10`);
    console.log(`Final SC Score: ${output.current_sc_score}/10`);

    // Save output
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const outputPath = path.join(OUTPUT_DIR, `post-${timestamp}.txt`);
    const fullOutputPath = path.join(OUTPUT_DIR, `full-output-${timestamp}.json`);

    fs.writeFileSync(outputPath, output.draft || "No draft generated");
    fs.writeFileSync(fullOutputPath, JSON.stringify(output, null, 2));

    console.log(`\n📁 Output saved to:`);
    console.log(`   Post: ${outputPath}`);
    console.log(`   Full output: ${fullOutputPath}`);

    // Show the final draft
    console.log(`\n${"=".repeat(60)}`);
    console.log("📝 FINAL DRAFT");
    console.log(`${"=".repeat(60)}\n`);
    console.log(output.draft);

    // Compare with reference post if exists
    if (fs.existsSync(REFERENCE_POST_PATH)) {
      const referencePost = fs.readFileSync(REFERENCE_POST_PATH, "utf-8");
      console.log(`\n${"=".repeat(60)}`);
      console.log("📋 REFERENCE POST (for comparison)");
      console.log(`${"=".repeat(60)}\n`);
      console.log(referencePost);
    }

    // Show critique history
    console.log(`\n${"=".repeat(60)}`);
    console.log("📜 CRITIQUE HISTORY");
    console.log(`${"=".repeat(60)}`);
    for (const critique of output.critique_history) {
      console.log(`\n--- Iteration ${critique.iteration} ---`);
      console.log(`EI: ${critique.ei_score}/10, SC: ${critique.sc_score}/10`);
      console.log(`Fixes required: ${critique.fixes.length}`);
      critique.fixes.forEach((fix, i) => console.log(`  ${i + 1}. ${fix}`));
    }
  } else if (result.status === "failed") {
    console.error("❌ Workflow failed:", result.error);
  } else if (result.status === "suspended") {
    console.log("⏸️ Workflow suspended");
  }
}

main().catch(console.error);

