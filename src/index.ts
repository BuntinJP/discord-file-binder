import { Events } from "discord.js";
import { Bot } from "./Bot";
import fs from 'fs';
import { checkChannelId, saveAttachmentIntoDataDir } from "./utils";

//token
const token = Bun.env.TOKEN ?? "";
if (!token) {
  throw new Error("Please provide a valid token.");
}

//check dirs
const dataDir = Bun.env.DATA_DIR;
if (!dataDir || !fs.existsSync(dataDir)) {
  throw new Error("Please provide a valid data directory.");
} else {
  console.log(`Data dir exists: ${ dataDir }`);
}
const botData = Bun.env.BOT_DATA;
if (!botData || !fs.existsSync(botData)) {
  throw new Error("Please provide a valid bot data file.");
} else {
  console.log(`Bot data file exists: ${ botData }`);
}



const client = new Bot();

client.once(Events.ClientReady, readyClient => {
  console.log(`Ready! Logged in as ${ readyClient.user.tag }`);
});

// command
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

// message
client.on(Events.MessageCreate, async message => {
  if (message.author.bot || message.attachments.size === 0) return;
  if (!checkChannelId(message.channelId)) return;
  const results = await saveAttachmentIntoDataDir({ attachments: message.attachments, dataDir, URL_PRESET: Bun.env.URL_PRESET });
  const out = `${ results.map(result=>`[${result.name}](<${result.url}>)`).join('\n') }`;
  message.reply(out);
});

await client.login(token);

