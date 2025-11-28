# Agent Network Final

A Mastra agent network that uses three specialized agents to research and write reports iteratively until the critic agent approves.

## Agents

All agents are defined in `src/mastra/agents/report-network.ts`:

1. **Research Agent** - Gathers comprehensive research on topics
2. **Writing Agent** - Writes well-structured reports based on research
3. **Critic Agent** - Evaluates report quality and provides feedback

## How It Works

The network uses Mastra's `loop` method to:
1. Research the topic with the research agent
2. Write a report with the writing agent
3. Review with the critic agent
4. If not approved, iterate with more research and writing
5. Continue until the critic says "APPROVED"

## Setup

1. Set your OpenAI API key:
```bash
export OPENAI_API_KEY=your-key-here
```

2. Install dependencies:
```bash
npm install
```

## Running the Example

Run the example script:
```bash
npm run example
```

This will generate a report about AI and healthcare, showing the agent network in action.

## Customizing

Edit `src/example.ts` to change the topic:
```typescript
const result = await network.loop(
  'Your custom topic here',
  {
    runtimeContext,
    maxSteps: 20,
  }
);
```

## Development

Start the Mastra dev server to test agents interactively:
```bash
npm run dev
```

Then visit `http://localhost:4111` to access the playground.


