# LinkedIn Post Writing Workflow

## Overview

This is **Phase 2** of the LinkedIn post generation pipeline. It transforms deep research data into publication-ready LinkedIn posts through an iterative writing and evaluation loop.

**Phase 1** (research) → produces `deep-research-{topic}.json`  
**Phase 2** (writing) → produces final LinkedIn post

---

## Architecture

This workflow emulates a manual editorial process with two AI agents:

### 🖋️ Taylor (Writer Agent)
- **Model**: Claude Opus 4 (`claude-opus-4-20250514`)
- **Role**: Draft and revise LinkedIn posts
- **Receives**: Research data, voice example, critique history
- **Outputs**: Draft post text

### 🎯 James (Evaluator Agent)
- **Model**: GPT-4o (`gpt-4o`)
- **Role**: Brutally critique posts for Emotional Intelligence (EI) and Social Capital (SC)
- **Receives**: Draft post, research data (for fact-checking), voice example (for style comparison)
- **Outputs**: Structured JSON with:
  - `ei_score` (1-10): Does the post show empathy, nuance, self-awareness?
  - `sc_score` (1-10): Will this build or destroy credibility?
  - `critique`: Detailed analysis of what's wrong
  - `fixes`: Specific, actionable recommendations

---

## The Evaluation Loop

The workflow uses a **`dountil` loop** that iterates until both scores reach the passing threshold:

```
1. Taylor writes initial draft
2. James evaluates draft → returns scores + critique
3. IF (EI >= 8 AND SC >= 8): DONE ✅
4. ELSE: Taylor revises based on critique → GO TO STEP 2
```

**Key Design Decisions:**
- **Passing threshold**: `>= 8/10` (not `> 8`) to allow for earlier convergence
- **Max iterations**: 5 (safety check to prevent infinite loops)
- **Context passed to Taylor on revisions**: Previous draft + full critique history + specific mistakes to avoid
- **Context passed to James**: Draft + research data (for fact-checking) + voice example (for style comparison)

---

## Project Structure

```
writing-workflow/
├── src/
│   ├── index.ts                          # Test runner (entry point)
│   └── mastra/
│       ├── agents/
│       │   ├── taylor.ts                 # Writer agent (Claude Opus)
│       │   └── james.ts                  # Evaluator agent (GPT-4o)
│       └── workflows/
│           └── post-writing.ts           # Main workflow with dountil loop
├── output/                               # Generated posts (timestamped)
├── test-data/                            # (Optional) Test inputs
├── .env                                  # API keys (ANTHROPIC_API_KEY, OPENAI_API_KEY)
├── env.template                          # Template for .env
└── package.json                          # Dependencies
```

---

## Inputs

The workflow requires three inputs:

1. **Research Data** (`deep-research-{topic}.json`)
   - JSON file with structured research from Phase 1
   - Contains facts, data points, comparisons, insights
   - Location: `../raghav-exa-posts/{week}/deep-research-{topic}.json`

2. **Voice Example** (`in-n-out-post-fixed.txt`)
   - A previous LinkedIn post that demonstrates the target voice/tone/structure
   - Taylor studies this to match writing style
   - Location: `../raghav-exa-posts/11-22-week/in-n-out-post-fixed.txt`

3. **Initial State** (passed to workflow)
   ```typescript
   {
     research: string,           // Raw JSON research data
     voice_example: string,      // Example post text
     draft: "",                  // Empty on first run
     critique_history: [],       // Empty on first run
     current_ei_score: 0,        // Updated each iteration
     current_sc_score: 0,        // Updated each iteration
     iteration: 0                // Incremented each loop
   }
   ```

---

## Outputs

1. **Final Post** (`.txt` file)
   - Saved to `output/post-{timestamp}.txt`
   - Ready for manual edits or direct publishing

2. **Full Workflow State** (`.json` file)
   - Saved to `output/post-{timestamp}-full.json`
   - Contains entire critique history, all drafts, scores per iteration
   - Useful for debugging and understanding the evolution

---

## Key Prompts

### Taylor's System Prompt (Writer)

**Core Philosophy:**
- Don't write for virality. If the insight is strong, engagement will follow naturally.
- Follow the structure: **Question → Comparison → Paradox → Math → Why**

**Rules:**
- Use ONLY facts from the research data (no fabrication)
- Match the voice/tone/structure of the example post
- Be conversational yet rigorous (avoid academic language)
- Avoid "cringey" LinkedIn transitions ("But here's the thing...", "Let that sink in")
- Use specific numbers, show the math, acknowledge nuance
- Find the most interesting comparison or paradox in the research

**Structure:**
1. **Hook**: Question that creates curiosity
2. **Setup**: Brief context (1-2 sentences)
3. **Analysis**: Walk through the numbers/comparison
4. **Insight**: The "why" behind the paradox
5. **Close**: Short, punchy ending (no call-to-action)

### James's System Prompt (Evaluator)

**Persona:**
- Senior Restaurant Industry Analyst
- Former operator, current investor
- Zero tolerance for fluff, jargon, or unearned confidence

**Evaluation Criteria:**

**Emotional Intelligence (EI):**
- Does the writer show empathy for operators/workers/consumers?
- Do they acknowledge nuance or just preach from a soapbox?
- Is there self-awareness or intellectual humility?

**Social Capital (SC):**
- Will this build or destroy credibility?
- Would serious operators respect this take, or laugh?
- Are facts accurate? Is reasoning sound?

**Output Requirements:**
- Scores must be integers 1-10
- Critique must be brutal and specific (cite exact sentences)
- Fixes must be actionable (not vague like "be more empathetic")
- If a better story exists in the research, SAY SO

---

## Running the Workflow

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file (see `env.template`):
   ```
   ANTHROPIC_API_KEY=your-key-here
   OPENAI_API_KEY=your-key-here
   ```

3. Update `src/index.ts` to point to your research file:
   ```typescript
   const RESEARCH_PATH = path.join(__dirname, '..', '..', 'raghav-exa-posts', '12-01-week', 'deep-research-4.json');
   ```

### Execute

```bash
npm start
```

The workflow will:
1. Load research data and voice example
2. Initialize Taylor and James
3. Run the evaluation loop
4. Save outputs to `output/` directory
5. Print final draft and critique history to console

---

## Debugging

The workflow includes extensive logging:

- **Current state**: Iteration number, scores, draft length
- **Taylor's revision prompt**: What context Taylor receives on each revision
- **Draft preview**: First 200 characters of each draft
- **James's critique preview**: First 300 characters of each critique
- **Loop condition checks**: Why the loop continued or stopped

**Common Issues:**

1. **Scores oscillating instead of increasing**
   - Cause: James providing too many fixes at once; Taylor overcorrecting
   - Fix: Lowered passing threshold from `> 8` to `>= 8`

2. **Loop runs too many times**
   - Cause: Threshold too strict or prompts misaligned
   - Fix: Max iterations set to 5 (safety check)

3. **Posts too technical/jargony**
   - Cause: Taylor defaulting to operator language (AUV, EBITDA, capex, boxes)
   - Fix: Manual post-processing to simplify language (see post edits in output files)

---

## Design Learnings

### Why James Needs the Research Data
Initially, James critiqued "blind" without access to the research. This meant:
- James couldn't fact-check Taylor's claims
- James couldn't suggest alternative data points or comparisons
- James couldn't say "You missed the real story here"

**Solution**: Pass research data to James. Now he acts as a **strategic editor**, not just a style critic.

### Why Taylor Needs Philosophical Guidance
Taylor's initial prompt was too mechanical, leading to deep-dive posts instead of comparative ones.

**Solution**: Added explicit guidance about the "question → comparison → paradox → math → why" structure. This aligns Taylor's instincts with the voice example's approach.

### Why `critique_history` Matters
Early revisions failed because Taylor didn't remember previous mistakes.

**Solution**: Pass full `critique_history` to Taylor on each revision, with explicit instructions: "Here's what James said in previous rounds. Don't repeat these mistakes."

---

## Integration into Main Workflow

To integrate this into your main pipeline:

1. **Phase 1 (Research)** outputs `deep-research-{topic}.json`
2. **Phase 2 (Writing)** consumes that JSON:
   ```typescript
   const researchData = fs.readFileSync(researchPath, 'utf-8');
   const voiceExample = fs.readFileSync(voiceExamplePath, 'utf-8');

   const run = await postWritingWorkflow.run.start({
     research: researchData,
     voice_example: voiceExample,
     draft: "",
     critique_history: [],
     current_ei_score: 0,
     current_sc_score: 0,
     iteration: 0
   });
   ```
3. Extract final post from `run.results.draft`
4. Optionally save full state for debugging

---

## Dependencies

```json
{
  "@mastra/core": "latest",
  "@ai-sdk/anthropic": "latest",
  "@ai-sdk/openai": "latest",
  "zod": "latest",
  "dotenv": "latest",
  "tsx": "latest",
  "typescript": "latest"
}
```

---

## Example Run (Subway Post)

**Input**: `deep-research-4.json` (Subway closed 7,601 locations)  
**Output**: `post-2025-12-04T12-27-54-232Z.txt`

**Iterations**: 3  
**Final Scores**: EI = 8, SC = 8

**Key Revisions:**
- Iteration 1: Too technical (used "AUV", "EBITDA", "capex", "boxes")
- Iteration 2: Simplified language, improved hook
- Iteration 3: Passed threshold ✅

**Manual Edits** (post-workflow):
- Replaced "AUV" with "revenue per store"
- Replaced "boxes" with "locations"
- Replaced "12.5% toll" with "12.5% in fees"
- Replaced "capex" with "initial investment"
- Simplified conclusion

---

## Future Improvements

1. **Dynamic threshold**: Adjust passing scores based on topic complexity
2. **Better termination**: Detect when scores plateau (not improving anymore)
3. **Jargon detection**: Auto-flag operator language (AUV, EBITDA, etc.) before James sees it
4. **Structure validation**: Check if post follows the 5-part structure (Hook, Setup, Analysis, Insight, Close)
5. **Engagement prediction**: Add a third agent to predict virality/engagement

---

## Questions?

This workflow is designed to be **transparent and debuggable**. Every decision (prompts, thresholds, context passing) was tested through multiple iterations. If you're integrating this into another system, read the logs carefully and adjust thresholds as needed.

**Contact**: Yash Poddar  
**Last Updated**: December 4, 2025

