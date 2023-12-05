import { SlashCommandBuilder } from "discord.js";
import { Command } from "../types";
import { getData, setData } from "../utils";

export default {
  data: new SlashCommandBuilder()
    .setName("set")
    .setDescription("Set this channel for file binding")
  ,
  execute: async (interaction) => {
    const { monitors } = getData();
    const channelId = interaction.channelId;
  }
} as Command;

