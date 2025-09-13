process.removeAllListeners('warning'); // 🚫 Suppress DeprecationWarnings

import { Client, GatewayIntentBits, Collection } from "discord.js";
import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GiveawaysManager } from "discord-giveaways";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =====================
// Express Web Server
// =====================
const app = express();
app.get("/", (req, res) => res.send(`🎉 ${client.user.tag} is running!`));
app.listen(3000, () => console.log("🌐 Express server running on port 3000"));

// =====================
// Discord Client Setup
// =====================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers
  ]
});

client.commands = new Collection();
const prefix = process.env.BOT_PREFIX || "*";

// =====================
// Load Commands
// =====================
const commandFiles = fs
  .readdirSync(path.join(__dirname, "commands"))
  .filter(f => f.endsWith(".js"));

for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  client.commands.set(command.default.name, command.default);
}

// =====================
// Giveaway Manager
// =====================
client.giveawaysManager = new GiveawaysManager(client, {
  storage: "./giveaways.json",
  default: {
    botsCanWin: false,
    embedColor: 0x3498db,
    reaction: "🎉"
  }
});

// =====================
// Command Handler
// =====================
client.on("messageCreate", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (command) {
    try {
      await command.execute(client, message, args);
    } catch (err) {
      console.error(`❌ Error executing ${commandName}:`, err);
      message.reply("❌ Error while executing that command.");
    }
  }
});

// =====================
// Bot Ready (v14 safe)
// =====================
client.once("ready", () => {
  console.log(`✅ ${client.user.tag} is online and ready!`);
});

client.login(process.env.BOT_TOKEN);