import dotenv from "dotenv";
import client from "./client";

import { pauseSong, stopSong, setVolume, addSong, resumeSong } from "./player";
import { createErrorEmbed, createInfoEmbed } from "./messages";
import { getQueue } from "./queue";

dotenv.config();

let voiceConnection;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (message) => {
  if (message.content.match(/\$music (.*)$/i)) {
    const url = message.content.match(/\$music (.*)$/i)[1];

    if (message.member.voice.channel) {
      voiceConnection = await message.member.voice.channel.join();

      addSong(voiceConnection, url);

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

  if (message.content === "$resume") {
    resumeSong();
    message.channel.send(
      createInfoEmbed("Player Status Changed", "Player Resumed")
    );
  }

  if (message.content === "$queue") {
    const queue = getQueue();
    let queueMessage = "";

    queue.forEach((url, index) => {
      queueMessage += `${index + 1}) ${url}\r\n`;
    });

    message.channel.send(createInfoEmbed("Player Queue", queueMessage));
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
