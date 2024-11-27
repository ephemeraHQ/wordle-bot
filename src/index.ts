import { Agent, run, XMTPContext, xmtpClient } from "@xmtp/message-kit";
import { startCron } from "./lib/cron.js";
import { RedisClientType } from "@redis/client";
import { getRedisClient } from "./lib/redis.js";
import { handleSubscribe } from "./subscribe.js";
import { wordle } from "./skills/wordle.js";

export const agent: Agent = {
  name: "Wordle",
  description: "Wordle game.",
  tag: "@wordle",
  skills: [...wordle],
};

const redisClient: RedisClientType = await getRedisClient();
const { v2client, client: v3client } = await xmtpClient({
  hideInitLogMessage: true,
  client: {
    structuredLogging: process.env.NODE_ENV === "production" ? true : false,
    //@ts-ignore
    loggingLevel: process.env.NODE_ENV === "production" ? "debug" : "off",
  },
});

startCron(redisClient, v2client);

run(
  async (context: XMTPContext) => {
    const { version } = context;
    if (version === "v2") {
      handleSubscribe(context, redisClient);
    }
  },
  {
    agent,
  }
);
