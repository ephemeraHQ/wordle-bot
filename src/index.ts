import { run, HandlerContext, xmtpClient } from "@xmtp/message-kit";
import { handleSubscribe } from "./subscribe.js";
import { startCron } from "./lib/cron.js";
import { RedisClientType } from "@redis/client";
import { getRedisClient } from "./lib/redis.js";

const redisClient: RedisClientType = await getRedisClient();
const { v2client, client: v3client } = await xmtpClient({
  hideInitLogMessage: true,
  client: {
    structuredLogging: true,
    //@ts-ignore
    loggingLevel: "debug",
  },
});

startCron(redisClient, v2client);

run(async (context: HandlerContext) => {
  const {
    message: {
      content: { skill },
    },
    version,
    group,
  } = context;

  if (skill === "id") {
    console.log(group.id);
    context.send(`This group id is: ${group.id}`);
    return;
  }
  if (version === "v2") handleSubscribe(context, redisClient);

  if (skill === "arena") {
    await handleArenaMessage(context);
  } else if (skill === "wordle") {
    await context.send("https://framedl.xyz");
  } else if (skill === "help") {
    await context.send(
      "For using this bot you can use the following commands:\n\n" +
        "/wordle, @wordle, 🔍, 🔎 - To start the game\n" +
        "/arena <word count> <audience size> - To start the arena game\n" +
        "/help - To see commands"
    );
  }
});

async function handleArenaMessage(context: HandlerContext) {
  const {
    message: {
      content: { text },
    },
    members,
  } = context;

  const apiKey = process.env.FRAMEDL_API_KEY;
  if (!apiKey) {
    console.log("FRAMEDL_API_KEY is not set");
    await context.send("https://www.framedl.xyz/games/arena/create");
    return;
  }
  const participantCount = members && members.length ? members.length - 1 : 0;
  const args = text?.split(" ") ?? [];
  const wordCountArg = args[1] ? parseInt(args[1], 10) : 3;
  const audienceSizeArg = args[2] ? parseInt(args[2], 10) : participantCount;
  if (isNaN(wordCountArg) || isNaN(audienceSizeArg)) {
    await context.send(
      "usage: /arena <word count> <audience size>\n\n" +
        "word count: number of words in the arena (default: 3, min: 1, max: 9)\n" +
        "audience size: number of audience members (default: number of participants excluding wordle bot, min: 1, max: 15)"
    );
    return;
  }

  const audienceSize = Math.max(1, Math.min(15, audienceSizeArg));
  const wordCount = Math.max(1, Math.min(9, wordCountArg));

  try {
    const response = await fetch("https://www.framedl.xyz/api/arenas", {
      method: "POST",
      body: JSON.stringify({ wordCount, audienceSize }),
      headers: {
        "Content-Type": "application/json",
        "x-framedl-api-key": apiKey,
      },
    });

    const data = (await response.json()) as { arenaUrl: string };

    await context.send(data.arenaUrl);
  } catch (error) {
    console.error(error);
    await context.send("https://www.framedl.xyz/games/arena/create");
  }
}
