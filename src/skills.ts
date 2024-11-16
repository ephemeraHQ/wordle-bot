import type { SkillGroup } from "@xmtp/message-kit";

export const skills: SkillGroup[] = [
  {
    name: "Games",
    description: "Provides various gaming experiences.",
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
    ],
  },
  {
    name: "Arena",
    description: "Provides various gaming experiences.",
    skills: [
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
  },
];
