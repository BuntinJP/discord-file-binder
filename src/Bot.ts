import { Client, Collection, GatewayIntentBits } from "discord.js";
import commands from "./commands";
import { Command } from "./types";

export class Bot extends Client {
  public commands: Collection<string, Command>;
  constructor() {
    super({ intents: [GatewayIntentBits.Guilds] });
    this.commands = new Collection();
    commands.map(command => this.commands.set(command.data.name, command));
  }
}