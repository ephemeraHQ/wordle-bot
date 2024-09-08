import { getRedisClient } from "./lib/redis.js";
import { HandlerContext } from "@xmtp/message-kit";

//Tracks conversation steps
const inMemoryCacheStep = new Map<string, number>();

//List of words to stop or unsubscribe.
const stopWords = ["stop", "unsubscribe", "cancel", "list"];

const redisClient = await getRedisClient();

export async function handleSubscribe(context: HandlerContext) {
  const {
    message: {
      content: { content: text },
      typeId,
      sender,
    },
  } = context;

  if (typeId !== "text") {
    /* If the input is not text do nothing */
    return;
  }

  const lowerContent = text?.toLowerCase();

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
  }
}
