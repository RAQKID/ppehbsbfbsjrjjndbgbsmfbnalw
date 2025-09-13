import ms from "ms";

export default {
  name: "gstart",
  async execute(client, message, args) {
    if (!message.member.permissions.has("ManageMessages")) {
      return message.reply("❌ You need `Manage Messages` permission to start giveaways.");
    }

    const duration = args[0];
    const winnersCount = parseInt(args[1]);
    const prize = args.slice(2).join(" ");

    if (!duration || isNaN(ms(duration)) || isNaN(winnersCount) || !prize) {
      return message.reply(
        "**❌ Usage: `*gstart <duration> <winners> <prize>`\n" +
        "Example: `*gstart 10m 1 Nitro`**"
      );
    }

    // ✅ Delete the user’s command message
    if (message.deletable) {
      await message.delete().catch(() => {});
    }

    await client.giveawaysManager.start(message.channel, {
      duration: ms(duration),
      prize: prize,
      winnerCount: winnersCount,
      hostedBy: message.author,
      embedColor: 0x3498db
    });

    // ✅ Send confirmation & auto-delete after 5 seconds
    message.channel.send("🎉 Giveaway started!").then(msg => {
      setTimeout(() => msg.delete().catch(() => {}), 5000);
    });
  }
};