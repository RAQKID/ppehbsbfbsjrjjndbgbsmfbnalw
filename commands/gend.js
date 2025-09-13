export default {
  name: "gend", // lowercase
  async execute(client, message, args) {
    if (!message.member.permissions.has("ManageMessages")) {
      return message.reply("❌ You need `Manage Messages` permission to end giveaways.");
    }

    const messageId = args[0];
    if (!messageId) return message.reply("❌ Please provide a valid giveaway message ID.");

    try {
      await client.giveawaysManager.end(messageId);
      message.channel.send("✅ Giveaway ended!");
    } catch {
      message.reply("❌ Could not find a giveaway with that ID.");
    }
  }
};