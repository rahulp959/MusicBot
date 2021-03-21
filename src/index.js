import Discord from "discord.js";
import dotenv from "dotenv";

import { pauseSong, playSong, stopSong, setVolume } from "./player";
import { createErrorEmbed, createInfoEmbed } from "./messages";

dotenv.config();

const client = new Discord.Client();

let voiceConnection;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (message) => {
  if (message.content === "$music") {
    if (message.member.voice.channel) {
      voiceConnection = await message.member.voice.channel.join();

      playSong(voiceConnection);

      message.channel.send(
        createInfoEmbed("Player Status Changed", "Player Started")
      );
    } else {
      message.channel.send(
        createErrorEmbed("You need to join a voice channel")
      );
    }
  }

  if (message.content === "$stop") {
    stopSong();
    voiceConnection.disconnect();
    message.channel.send(
      createInfoEmbed("Player Status Changed", "Player Stopped")
    );
  }

  if (message.content === "$pause") {
    pauseSong();
    message.channel.send(
      createInfoEmbed("Player Status Changed", "Player Paused")
    );
  }

  if (message.content.match(/\$volume ([1-9][0-9]?$|100)/i)) {
    const volume = message.content.match(/\$volume ([1-9][0-9]?$|100)/i)[1];
    setVolume(volume);
    message.channel.send(
      createInfoEmbed("Volume Change", `Volume changed to ${volume}`)
    );
  }
});

client.login(process.env.DISCORD_TOKEN);
