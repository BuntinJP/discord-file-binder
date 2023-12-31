import { SlashCommandBuilder } from "discord.js";
import { Command } from "../types";
import { getIds, addMonitor, getAvailableChannels } from "../utils";

export default {
  data: new SlashCommandBuilder()
    .setName("set")
    .setDescription("Set this channel for file binding")
  ,
  execute: async (interaction) => {
    const channel = interaction.channel;
    if (!channel || channel.type !== 0) return;
    const { id, name } = channel;
    const result = addMonitor(name, id);
    let message = '';
    if (result) {
      message += 'Successfully set';
    } else {
      message += 'Already set';
    }
    message += getAvailableChannels();
    await interaction.reply(message);
  }
} as Command;

