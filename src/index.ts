import { run, HandlerContext } from "@xmtp/message-kit";
import { handleSubscribe } from "./subscribe.js";

run(async (context: HandlerContext) => {
  const {
    message: { typeId },
    version,
  } = context;
  if (version === "v2") handleSubscribe(context);
  if (typeId === "text" || typeId === "reply") {
    const {
      message: {
        content: { content: text },
      },
    } = context;
    if (text === "/wordle") {
      await context.send("https://framedl.xyz/");
    } else if (text === "🔍") {
      await context.send("https://framedl.xyz/");
    } else if (text === "🔎") {
      await context.send("https://framedl.xyz/");
    } else if (text === "/help") {
      await context.send(
        "For using this bot you can use the following commands:\n\n" +
          "/wordle -  To start the game\n" +
          "React or send 🔍 or 🔎 - To start the game\n" +
          "React with 🔁 or 🔂 - To start the game\n" +
          "/help - To see commands"
      );
    }
  } else if (typeId === "reaction") {
    const {
      message: {
        content: { content: emoji, action },
      },
    } = context;
    if (
      action === "added" &&
      (emoji === "🔂" || emoji === "🔍" || emoji === "🔎" || emoji === "🔁")
    ) {
      await context.send("https://framedl.xyz/");
    }
  }
});
