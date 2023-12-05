import { SlashCommandBuilder } from "discord.js";
import { Command } from "../types";
import { getAvailableChannels, removeMonitor } from "../utils";

export default {
  data: new SlashCommandBuilder()
    .setName("unset")
    .setDescription("unset this channel for file binding"),
  execute: async (interaction) => {
    const channel = interaction.channel;
    if (!channel || channel.type !== 0) return;
    const { id, name } = channel;
    const result = removeMonitor(id);
    let message = '';
    if (!result) {
      message += 'Already unset';
    } else {
      message += 'Successfully unset';
    }
    message += '\n'
    message += getAvailableChannels();
    await interaction.reply(message);
  }
} as Command;

