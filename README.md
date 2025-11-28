# Raghav LinkedIn Posts Network

A Mastra agent network for generating high-quality LinkedIn posts through iterative research, writing, and critique until approved.

## Architecture

Built on Mastra's agent network framework with three specialized agents:

**Research Agent** - Gathers comprehensive information on topics
- Provides detailed bullet-point findings
- Sources data from conversation context

**Writing Agent** - Creates well-structured content
- Writes in full paragraphs
- Uses ONLY data from research (no fabrication)
- Accesses research through shared memory

**Critic Agent** - Evaluates content quality
- Provides specific, actionable feedback
- Uses o1 model for extended reasoning
- Remembers previous feedback through memory

**Routing Agent** - Orchestrates the workflow
- Decides which agent to call next
- Provides simple task instructions
- Relies on memory for data transfer (not prompt engineering)

## How It Works

### Memory-Based Data Flow

All agents share a common memory database:
- `lastMessages: 100` - Full thread context available to all agents
- `semanticRecall: topK 10` - Can search for specific data points
- Same `threadId` - All agents see the same conversation
- No explicit data passing - Memory handles inter-agent communication

### Self-Improving Loop

1. Research agent gathers information → Stored in memory
2. Writing agent creates post → Reads research from memory
3. Critic agent reviews → Provides feedback in memory
4. If not approved → Research gathers more based on feedback
5. Writing agent creates improved version → Sees all previous context
6. Critic reviews again → Approves if improved
7. Repeat until approval

### Key Learnings

**What Works:**
- ✅ Shared memory for data transfer between agents
- ✅ Simple orchestration (routing agent just coordinates)
- ✅ Individual agents read context from memory automatically
- ✅ Explicit instructions to prevent hallucination

**What Doesn't:**
- ❌ Prompting routing agent to "copy data" (redundant)
- ❌ Workflows for dynamic content generation (too rigid)
- ❌ Separate databases per agent (breaks shared context)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set your OpenAI API key in `.env`:
```bash
OPENAI_API_KEY=your-key-here
```

3. Run example:
```bash
npm run example
```

4. Or start dev server:
```bash
npm run dev
```

## Configuration

**Memory Settings** (`src/mastra/agents/report-network.ts`):
```typescript
options: {
  lastMessages: 100,  // Keeps full thread context
  semanticRecall: {
    topK: 10,         // Retrieves relevant past messages
    messageRange: 5,  // Context around matches
  },
}
```

**Context Window Capacity:**
- GPT-4o: 128k tokens
- ~5,500 tokens per iteration
- **Can handle 15-20 iterations** safely
- Perfect for quality content generation

## Production Use

For production LinkedIn post generation:

1. **Update agents** with Raghav's voice and style preferences
2. **Add web search tools** to research agent for real-time data
3. **Configure critic** with specific quality criteria
4. **Add post formatting** requirements to writing agent
5. **Scale with different threadIds** for different post topics

## Architecture Decisions

**Why Agent Network (not Workflow):**
- Dynamic routing based on content quality
- Flexible iteration count (until approved)
- LLM-driven decisions (not hardcoded steps)

**Why Shared Memory (not explicit passing):**
- Cleaner architecture
- Automatic context management
- Agents decide what data they need

**Why o1 for Critic:**
- Extended reasoning capabilities
- Better evaluation quality
- Can track reasoning events

## Next Steps

Ready to build the production LinkedIn post network! 🚀
