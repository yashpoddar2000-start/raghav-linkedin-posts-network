import { Mastra } from "@mastra/core";
import { taylor } from "./agents/taylor";
import { james } from "./agents/james";
import { postWritingWorkflow } from "./workflows/post-writing";

export const mastra = new Mastra({
  agents: {
    taylor,
    james,
  },
  workflows: {
    "post-writing": postWritingWorkflow,
  },
});

export { taylor, james, postWritingWorkflow };


