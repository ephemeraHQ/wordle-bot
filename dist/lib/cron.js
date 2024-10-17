import cron from "node-cron";
export async function startCron(redisClient, v2client) {
    console.log("Starting daily cron");
    const conversations = await v2client.conversations.list();
    cron.schedule("0 0 * * *", // Daily or every 5 seconds in debug mode
    async () => {
        const keys = await redisClient.keys("*");
        console.log(`Running daily task. ${keys.length} subscribers.`);
        for (const address of keys) {
            const subscriptionStatus = await redisClient.get(address);
            if (subscriptionStatus === "subscribed") {
                console.log(`Sending daily update to ${address}`);
                // Logic to send daily updates to each subscriber
                const targetConversation = conversations.find((conv) => conv.peerAddress === address);
                if (targetConversation) {
                    await targetConversation.send("A new daily Wordle is out! Play it now:");
                    await targetConversation.send("https://framedl.xyz/");
                }
            }
        }
    }, {
        scheduled: true,
        timezone: "UTC",
    });
}
//# sourceMappingURL=cron.js.map