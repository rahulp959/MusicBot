// import fs from "fs";
import { getStream } from "./youtube";

let dispatcher;
const dispatcherStatusOptions = {
  playing: "playing",
  notPlaying: "notPlaying",
  paused: "paused",
};
// Status = notPlaying or playing or paused
let dispatcherStatus = "notPlaying";

let dispatcherVolume = 0.01;

export const playSong = (connection, url) => {
  if (dispatcherStatus === dispatcherStatusOptions.paused) {
    dispatcherStatus = dispatcherStatusOptions.playing;
    dispatcher.resume();

    return;
  }

  const youtubeStream = getStream(url);

  // Create a dispatcher
  dispatcher = connection.play(youtubeStream, {
    // type: "webm/opus",
    volume: dispatcherVolume,
  });

  dispatcher.on("start", () => {
    dispatcherStatus = dispatcherStatusOptions.playing;
    console.log("audio.mp3 is now playing!");
  });

  dispatcher.on("finish", () => {
    dispatcherStatus = dispatcherStatusOptions.notPlaying;
    console.log("audio.mp3 has finished playing!");
  });

  // Always remember to handle errors appropriately!
  dispatcher.on("error", console.error);
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
