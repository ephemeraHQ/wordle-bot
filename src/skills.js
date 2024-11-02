export const skills = [
    {
        name: "Games",
        description: "Provides various gaming experiences.",
        skills: [
            {
                command: "/wordle",
                triggers: ["/wordle", "@wordle", "🔎", "🔍"],
                handler: undefined,
                description: "Play wordle.",
                params: {},
            },
        ],
    },
    {
        name: "Arena",
        description: "Provides various gaming experiences.",
        skills: [
            {
                command: "/arena [word count] [audience size]",
                triggers: ["/arena", "@arena"],
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
//# sourceMappingURL=skills.js.map