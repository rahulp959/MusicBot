import ytdl from "ytdl-core";

// eslint-disable-next-line
export const getStream = (url) => {
  return ytdl(url, { filter: "audioonly", quality: "highestaudio" });
};
