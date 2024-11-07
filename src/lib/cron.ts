import cron from "node-cron";
import { Client as V2Client } from "@xmtp/xmtp-js";
import { Client as V3Client } from "@xmtp/node-sdk";
import { RedisClientType } from "@redis/client";

export async function startCron(
  redisClient: RedisClientType,
  v2client: V2Client
) {
  console.warn("\t- Starting daily cron");
  const conversations = await v2client.conversations.list();
  cron.schedule(
    "0 0 * * *", // Daily or every 5 seconds in debug mode
    async () => {
      const keys = await redisClient.keys("*");
      console.log(`Running daily task. ${keys.length} subscribers.`);
      for (const address of keys) {
        const subscriptionStatus = await redisClient.get(address);
        if (subscriptionStatus === "subscribed") {
          console.log(`Sending daily update to ${address}`);
          // Logic to send daily updates to each subscriber
          const targetConversation = conversations.find(
            (conv) => conv.peerAddress === address
          );
          if (targetConversation) {
            await targetConversation.send(
              "A new daily Wordle is out! Play it now:"
            );
            await targetConversation.send("https://framedl.xyz");
          }
        }
      }
    },
    {
      scheduled: true,
      timezone: "UTC",
    }
  );
}

export async function startDMToGroupEvery5Seconds(
  v3client: V3Client,
  groupId: string
) {
  cron.schedule("*/10 * * * * *", async () => {
    const conversations = await v3client.conversations.list();
    for (const conversation of conversations) {
      if (conversation?.id === groupId) {
        console.log("Sending message to group", conversation.id);
        await conversation.send("Hello, world!");
      }
    }
  });
}
