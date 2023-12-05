import { Events } from "discord.js";
import { Bot } from "./Bot";
import fs from 'fs';
import { saveAttachmentIntoDataDir } from "./utils";

const [token, guildId, channelId] = [Bun.env.TOKEN, Bun.env.GUILD_ID, Bun.env.CHANNEL_ID];

const dataDir = Bun.env.DATA_DIR;
if (!dataDir || !fs.existsSync(dataDir)) {
  throw new Error("Please provide a valid data directory.");
} else {
  console.log(`Data dir exists: ${ dataDir }`);
}

if (!token) {
  throw new Error("Please provide a valid token.");
}

const client = new Bot();

client.once(Events.ClientReady, readyClient => {
  console.log(`Ready! Logged in as ${ readyClient.user.tag }`);
});
client.on(Events.InteractionCreate, interaction => {
  if (!interaction.isCommand()) return;
  const { commandName } = interaction;
  const command = client.commands.get(commandName);
  if (!command) return;
  try {
    command.execute(interaction);
  } catch (error) {
    console.error(error);
    interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true
    });
  }
});
client.on(Events.MessageCreate, async message => {
  console.log('ttt');

  if (message.author.bot || !(message.guildId === guildId && message.channelId === channelId) || message.attachments.size === 0) return;
  const urls = await saveAttachmentIntoDataDir(message.attachments, dataDir);
  const out = `${ urls.join('\n') }\nSaved ${ urls.length } attachments.`;
  message.reply(out);
});

client.login(token);

