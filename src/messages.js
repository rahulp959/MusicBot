import { MessageEmbed } from "discord.js";

export const createInfoEmbed = (title, message = "") =>
  new MessageEmbed()
    .setColor("#0099ff")
    .setTitle(title)
    .setDescription(message);

export const createErrorEmbed = (message) =>
  new MessageEmbed()
    .setColor("#ff3300")
    .setTitle("Error")
    .setDescription(message);
