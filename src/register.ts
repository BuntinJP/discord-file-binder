import { REST, Routes } from 'discord.js';
import commands from './commands';

const token = Bun.env.TOKEN;
const clientId = Bun.env.CLIENT_ID;
const guildId = Bun.env.GUILD_ID;

if (!token || !clientId || !guildId) {
  console.log('token', token);
  console.log('clientId', clientId);
  console.log('guildId', guildId);
  throw new Error("Please provide a valid token, client ID, and guild ID.");
}

const rest = new REST().setToken(token);

(async () => {
  try {
    console.log(`Started refreshing ${ commands.length } application (/) commands.`);

    const data = await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands.map(command => command.data.toJSON()) },
    );

    console.log('Successfully reloaded application (/) commands.');
    console.log(data);
  } catch (e) {
    console.error(e);
  }
})();