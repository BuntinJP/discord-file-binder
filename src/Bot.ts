import { Client, Collection, GatewayIntentBits } from "discord.js";
import commands from "./commands";
import { Command } from "./types";

export class Bot extends Client {
  public commands: Collection<string, Command>;
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
    });
    this.commands = new Collection();
    commands.map(command => this.commands.set(command.data.name, command));
  }
}
//
/* 
auth_basic "code.buntin.tech";
auth_basic_user_file /etc/nginx/htpasswd.d/code.buntin.tech.htpasswd;
*/
