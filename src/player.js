// import fs from "fs";
import { getStream } from "./youtube";
import { getNextSongFromQueue, addSongToQueue } from "./queue";
import client from "./client";

let dispatcher;
const dispatcherStatusOptions = {
  playing: "playing",
  notPlaying: "notPlaying",
  paused: "paused",
};
// Status = notPlaying or playing or paused
let dispatcherStatus = "notPlaying";

let dispatcherVolume = 0.01;

const broadcast = client.voice.createBroadcast();

export const resumeSong = () => {
  if (dispatcherStatus === dispatcherStatusOptions.paused) {
    dispatcherStatus = dispatcherStatusOptions.playing;
    dispatcher.resume();
  }
};

export const playSong = async (connection, url) => {
  const youtubeStream = getStream(url);

  if (dispatcher) {
    dispatcher.end();
    dispatcher = null;
  }

  // Create a dispatcher
  dispatcher = broadcast.play(youtubeStream, {
    volume: dispatcherVolume,
  });

  connection.play(broadcast);
  dispatcherStatus = dispatcherStatusOptions.playing;

  dispatcher.on("finish", () => {
    console.log("Finished playing");
    dispatcherStatus = dispatcherStatusOptions.notPlaying;
    const nextSong = getNextSongFromQueue();

    if (nextSong) {
      playSong(connection, nextSong);
    }
  });

  // Always remember to handle errors appropriately!
  dispatcher.on("error", console.error);
};

export const addSong = (connection, url) => {
  addSongToQueue(url);

  if (dispatcherStatus === dispatcherStatusOptions.notPlaying) {
    console.log("Starting again");
    const nextSong = getNextSongFromQueue();

    if (nextSong) {
      playSong(connection, nextSong);
    }
  }
};

export const stopSong = () => {
  dispatcher.destroy();
};

export const pauseSong = () => {
  dispatcherStatus = dispatcherStatusOptions.paused;
  // Play silent packets while paused
  dispatcher.pause(true);
};

export const setVolume = (volume) => {
  const parsedVolume = parseFloat(volume);
  dispatcherVolume = parsedVolume / 100;
  dispatcher.setVolume(dispatcherVolume);
};
