import { run, HandlerContext } from "@xmtp/message-kit";

run(async (context: HandlerContext) => {
  const {
    message: { typeId },
  } = context;
  console.log(typeId);
  if (typeId === "text" || typeId === "reply") {
    const {
      message: {
        content: { content: text },
      },
    } = context;
    if (text === "/wordle") {
      await context.reply("https://framedl.xyz/");
    } else if (text === "🔍") {
      await context.reply("https://framedl.xyz/");
    } else if (text === "🔎") {
      await context.reply("https://framedl.xyz/");
    }
  } else if (typeId === "reaction") {
    const {
      message: {
        content: { content: emoji, action },
      },
    } = context;
    if (action === "added" && (emoji === "🔂" || emoji === "🔁")) {
      await context.send("https://framedl.xyz/");
    }
  }
});
