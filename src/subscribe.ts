import { XMTPContext } from "@xmtp/message-kit";
import { RedisClientType } from "@redis/client";

const inMemoryCacheStep = new Map<string, number>();
const stopWords = ["stop", "unsubscribe", "cancel", "list"];

export async function handleSubscribe(
  context: XMTPContext,
  redisClient: RedisClientType
) {
  const {
    message: {
      content: { text },
      sender,
    },
  } = context;

  if (!text) {
    /* If the input is not text do nothing */
    return;
  }

  const lowerContent = text.toLowerCase();

  //Handles unsubscribe and resets step
  if (stopWords.some((word) => lowerContent.includes(word))) {
    inMemoryCacheStep.set(sender.address, 0);
    await redisClient.del(sender.address);
    await context.reply(
      "You are now unsubscribed. You will no longer receive a daily Wordle."
    );
    return;
  }
  const subscribed = await redisClient.get(sender.address);
  if (!subscribed) {
    await redisClient.set(sender.address, "subscribed");
    await context.send(
      "Hi there! I'm a daily Wordle bot, and I will now be sending you a Wordle puzzle every day!"
    );
    await context.send(
      "It works through OpenFrames, and you can play it right in your chat window, but make sure you have an XMTP client that supports Frames, like Converse (https://getconverse.app/)"
    );
    await context.send(
      "The Wordle frame is an Open Frame made by dusan.eth. Say hello!"
    );
    await context.send("To unsubscribe from a daily Wordle, send STOP");
    await context.send("And now, for your first Wordle:");
    await context.send("https://framedl.xyz");
  }
}
