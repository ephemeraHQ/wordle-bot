import cron from "node-cron";
import { V2Client } from "@xmtp/message-kit";
import { RedisClientType } from "@redis/client";

export async function startCron(
  redisClient: RedisClientType,
  v2client: V2Client
) {
  console.warn("\t- Starting daily cron");
  const conversations = await v2client.conversations.list();
  cron.schedule(
    "0 0 * * *",
    async () => {
      const keys = await redisClient.keys("*");
      console.log(`Running daily task. ${keys.length} subscribers.`);
      for (const address of keys) {
        const subscriptionStatus = await redisClient.get(address);
        if (subscriptionStatus === "subscribed") {
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
      console.log(`Sent daily update to ${keys.length} subscribers.`);
    },
    {
      scheduled: true,
      timezone: "UTC",
    }
  );
}
