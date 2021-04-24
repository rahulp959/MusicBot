const queue = [];

export const addSongToQueue = (url) => {
  queue.push(url);
};

export const removeSongFromQueue = (index) => {
  queue.splice(index, 1);
};

export const getNextSongFromQueue = () => queue.shift();

export const getQueue = () => [...queue];
