import type { CommandGroup } from "@xmtp/message-kit";

export const commands: CommandGroup[] = [
  {
    name: "Games",
    triggers: ["/wordle", "@wordle", "🔎", "🔍"],
    description: "Provides various gaming experiences.",
    commands: [
      {
        command: "/wordle",
        handler: undefined,
        description: "Play wordle.",
        params: {},
      },
    ],
  },
  {
    name: "Arena",
    triggers: ["/arena", "@arena"],
    description: "Provides various gaming experiences.",
    commands: [
      {
        command: "/arena [word count] [audience size]",
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
  },
];
