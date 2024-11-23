import type { Agent } from "@xmtp/message-kit";

export const agent: Agent = {
  name: "Games",
  description: "Provides various gaming experiences.",
  tag: "@wordle",
  skills: [
    {
      skill: "/wordle",
      handler: undefined,
      examples: ["/wordle"],
      description: "Play wordle.",
      params: {},
    },
    {
      skill: "/id",
      adminOnly: true,
      handler: undefined,
      examples: ["/id"],
      description: "Get the group ID.",
      params: {},
    },
    {
      skill: "/arena [word count] [audience size]",
      examples: ["/arena 3 15"],
      handler: undefined,
      description: "Play arena.",
      params: {
        wordCount: {
          default: 3,
          type: "number",
        },
        audienceSize: {
          default: 15,
          type: "number",
        },
      },
    },
  ],
};
