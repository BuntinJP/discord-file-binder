import { SlashCommandBuilder } from "discord.js";
import { Command } from "../types";

export default {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Replies with user info!"),
  execute: async (interaction) => {
    await interaction.reply(`Your tag: ${ interaction.user.tag }\nYour id: ${ interaction.user.id }`);
  }
} as Command;

