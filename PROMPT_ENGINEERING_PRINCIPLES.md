# Prompt Engineering Principles
## Based on "Principles of Building AI Agents" by Sam Bhagwat (Mastra AI Founder)

---

## Core Insight: Good Prompts = Foundational AI Engineering Skill

LLMs will follow instructions **if you know how to specify them well.**

---

## 1. GIVE MORE EXAMPLES (Zero-shot → Few-shot)

### Three Prompting Techniques:

**Zero-shot: The "YOLO" Approach**
- Ask the question and hope for the best
- Example: "Be a data analyst"
- Result: Generic, unpredictable

**Single-shot: One Example**
- Ask a question + provide ONE example (input + output)
- Example: "Be a data analyst. Here's how you should format findings: [1 example]"
- Result: Some guidance, still variable

**Few-shot: Multiple Examples** ⭐
- Give multiple examples for precise control
- Example: "Be a data analyst. Here are 5 examples of how to format data..."
- Result: Highly controlled output

**Key Tradeoff:**
- More examples = More guidance
- More examples = More tokens/cost/time
- **Balance based on task criticality**

### For Our QSR Network:
- **Alex (Data Analyst):** Few-shot with examples of exact data formatting
- **Maya (Economist):** Few-shot with examples of forensic breakdowns
- **James (Critic):** Zero-shot with detailed evaluation criteria
- **Marcus (Director):** Zero-shot with clear orchestration logic

---

## 2. SEED CRYSTAL APPROACH (Bootstrap Your Prompts)

### How It Works:

**Step 1: Ask the model to generate a prompt**
```
"Generate a prompt for a data analyst agent who finds exact 
financial metrics for QSR companies from SEC filings."
```

**Step 2: Get a solid v1 to refine**
The model gives you a starting point based on its training

**Step 3: Ask for improvements**
```
"What could make this prompt better? What's missing?"
```

**Step 4: Iterate based on suggestions**

### Best Practice:
**Ask the SAME model that you'll be prompting:**
- Claude is best at generating prompts for Claude
- GPT-4o is best for GPT-4o prompts
- Models understand their own strengths/weaknesses

### Mastra Built This In:
"We actually built a prompt CMS into Mastra's local development 
environment for this reason."

---

## 3. USE SYSTEM PROMPTS (Shape Persona & Tone)

### What System Prompts Do:

**Give the model characteristics** in addition to specific "user prompt"

Example Use Cases:
- Answer as different personas (Steve Jobs vs Bill Gates)
- Answer as fictional characters (Harry Potter vs Draco Malfoy)
- Set consistent tone/style across interactions

### Purpose:
✓ **Good for:** Shaping tone, maintaining persona consistency
✗ **Not ideal for:** Improving accuracy (use examples/structure instead)

### For Our Agents:
We use detailed system prompts to define:
- **Alex:** 26, Penn Finance, Goldman Sachs background, skeptical, detail-obsessed
- **Maya:** PhD Economist, calculates implications, creates "aha moments"
- **David:** Ex-McKinsey, investigates WHY, finds mechanisms
- **James:** 30 years editing, brutally honest, tired of surface-level analysis

System prompts embed the PERSONA, user prompts contain the TASK.

---

## 4. WEIRD FORMATTING TRICKS (Structure Matters)

### AI Models Are Sensitive to Formatting - Use It!

**CAPITALIZATION adds weight:**
```
You are a data analyst.
vs.
You are a DATA ANALYST. PRECISION is NON-NEGOTIABLE.
```

**XML-like structure helps precision:**
```xml
<role>Data Analyst</role>
<task>Find exact financial metrics</task>
<constraints>
  - Only SEC filings
  - Exact numbers only
  - Must include sources
</constraints>
```

**Structured prompts for Claude & GPT-4:**
```
TASK: [What to do]
CONTEXT: [Background information]
CONSTRAINTS: [Rules to follow]
OUTPUT: [Expected format]
```

**Separators for clarity:**
```
═══════════════════════════════════════════
YOUR BACKGROUND
═══════════════════════════════════════════
[Details here]

═══════════════════════════════════════════
YOUR ROLE
═══════════════════════════════════════════
[Role details]
```

### Experiment and Measure:
**Small changes in structure = HUGE difference in output**

Use evals to measure which formatting works best.

---

## 5. PRODUCTION PROMPTS ARE VERY DETAILED

### Key Insight from Sam:

> "If you think your prompts are detailed, go through and read 
> some production prompts. They tend to be VERY detailed."

Example given: bolt.new code-generation prompt (partial shown)

### What "Detailed" Means:

**Not detailed (amateur):**
```
You are a data analyst. Find financial metrics for restaurants.
```

**Detailed (production):**
```
You are Alex Rivera, 26, Senior Data Analyst.

BACKGROUND:
- Penn Finance (3.8 GPA)
- 2 years Goldman Sachs
- 3 years QSR equity research
- CFA Level 1

EXPERTISE:
- Know where data hides in 10-Ks
- Can extract from 200-page doc in 30 min
- Source hierarchy ingrained
- Pattern recognition from 100+ filings/year

ROLE:
You find exact numbers. Not analysis.
- YOU find: $1.9B, 8%, $3.2M
- MAYA calculates: gaps and percentages
- DIRECTOR decides: continue/pivot

WORK STYLE:
- Batch queries (20-30 at once)
- Speed + precision (Goldman training)
- Honest about gaps
- Systematic approach

[... continues for 400+ lines]
```

### Why So Detailed?

1. **Reduces ambiguity** - Model knows exactly what to do
2. **Consistent output** - Same quality every time
3. **Better judgment** - Model can make decisions aligned with persona
4. **Fewer iterations** - Gets it right the first time

---

## OUR APPROACH: Applying These Principles

### 1. We Use Few-Shot (Implicitly)

Our system prompts reference examples from the 56 analyzed viral posts:
- Alex knows what data appears in viral posts
- Maya knows what calculations create "aha moments"
- James knows what passed the brutal evaluator test

### 2. We Used Seed Crystal

We started with basic agent descriptions, then:
- Asked "what would this person's background be?"
- Asked "what expertise would they need?"
- Refined based on real-world research team structure

### 3. We Leverage System Prompts Heavily

Each agent has rich persona embedded:
- 400+ line system prompts
- Detailed background, expertise, work style
- Clear boundaries (what they DO vs DON'T do)

### 4. We Use Formatting Tricks

**Separators for structure:**
```
═══════════════════════════════════════════
SECTION TITLE
═══════════════════════════════════════════
```

**CAPITALS for emphasis:**
```
You are a RAW DATA GATHERER, not an analyst.
```

**Symbols for clarity:**
```
What you DO:
✓ Find exact numbers
✓ Structure data

What you DON'T DO:
✗ Calculate gaps
✗ Make recommendations
```

**Clear divisions:**
```
Division of Labor:
- YOU find: $1.9B
- MAYA calculates: $1.2B gap
```

### 5. Our Prompts Are Production-Level

Alex's prompt: **470+ lines**
- Complete background (education, experience)
- Detailed expertise (what he knows, where to find it)
- Clear role boundaries (find data, not analyze)
- Work style (batch thinking, systematic approach)
- Personality traits (detail-obsessed, collaborative)
- Communication format (structured output)

This isn't over-engineering. This is **production-quality prompting**.

---

## KEY TAKEAWAYS

1. **More Examples = Better Control** (but costs more tokens)
2. **Seed Crystal = Bootstrap Complex Prompts** (ask model to help)
3. **System Prompts = Persona/Tone** (not accuracy)
4. **Formatting = Structure** (use capitals, separators, symbols)
5. **Production Prompts = Very Detailed** (400+ lines is normal)

---

## MEASURING SUCCESS

From Sam's book: **"Experiment and tweak—small changes can make a huge difference! You can measure with evals."**

For our QSR network:
- Alex's output → Measured by: completeness, source quality, structure
- Maya's output → Measured by: calculation accuracy, insight quality
- James's output → Measured by: viral quality eval (0.85+ threshold)

**Always measure. Always iterate.**

---

---

## EXAMPLE: PRODUCTION-LEVEL PROMPT (Bolt.new)

### From Bolt - AI Coding Assistant

This is what a real production prompt looks like (partial excerpt):

```
You are Bolt, an expert AI assistant and exceptional senior software 
developer with vast knowledge across multiple programming languages, 
frameworks, and best practices.

<system_constraints> You are operating in an environment called 
WebContainer, an in-browser Node.js runtime that emulates a Linux 
system to some degree. However, it runs in the browser and doesn't run 
a full-fledged Linux system nor rely on a cloud VM to execute code. 
All code is executed in the browser. It does come with a shell that 
emulates zsh. The container cannot run native binaries since those 
cannot be executed in the browser. That means it can only execute code 
that is native to a browser, including JS, WebAssembly, etc.

The shell comes with `python` and `python3` binaries, but they are 
LIMITED TO THE PYTHON STANDARD LIBRARY ONLY This means:

- There is NO `pip` support! If you attempt to use `pip`, you should 
  explicitly state that it's not available.
- CRITICAL: Third-party libraries cannot be installed or imported.
  Even some standard library modules that require additional system 
  dependencies (like `ctypes`) are not available.
- Only modules from the core Python standard library can be used.

[... continues with more detailed constraints ...]
```

### What Makes This Great:

1. **Clear persona:** "Bolt, expert AI assistant and exceptional senior software developer"

2. **XML-like structure:** `<system_constraints>` tags for precise parsing

3. **CAPITALIZATION for critical points:**
   - "LIMITED TO THE PYTHON STANDARD LIBRARY ONLY"
   - "NO `pip` support"
   - "CRITICAL: Third-party libraries cannot be installed"

4. **Specific technical constraints:** 
   - Environment details (WebContainer, in-browser Node.js)
   - What works (JS, WebAssembly)
   - What doesn't work (native binaries, pip)
   - Behavioral guidance (how to handle limitations)

5. **Multiple levels of detail:**
   - High-level: "operates in WebContainer"
   - Mid-level: "emulates Linux to some degree"
   - Specific: "cannot run native binaries"
   - Actionable: "explicitly state pip is not available"

6. **Prevents common mistakes:**
   - Tells model what NOT to do
   - Explains WHY (runs in browser)
   - Gives alternatives when relevant

### Key Lessons for Our Prompts:

**Apply to Alex (Data Analyst):**
- Environment: "You have access to Exa Answer API (not Bloomberg Terminal)"
- Constraints: "You can query 50 times max per task"
- Critical rules: "ONLY trust SEC filings, earnings calls - REJECT LinkedIn/blogs"
- Prevents mistakes: "Don't calculate gaps - that's Maya's job"

**Apply to All Agents:**
- Use XML-like structure: `<background>`, `<role>`, `<constraints>`
- CAPITALIZE critical boundaries
- Explain WHY constraints exist
- Multiple detail levels (persona → expertise → task → output)

---

## REFERENCE

Source: "Principles of Building AI Agents" by Sam Bhagwat
Founder of Mastra AI
Chapter: "Writing Great Prompts"

Example: Bolt.new production prompt (showing real-world detailed prompting)

