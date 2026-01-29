import { MAX_DELAY_MS } from "./constants";

export function getRandomDelay() {
  return Math.floor(Math.random() * (MAX_DELAY_MS + 1));
}

export function getAverage(reactionTimes) {
  if (reactionTimes.length === 0) {
    return 0;
  }
  const sum = reactionTimes.reduce((accumulator, value) => accumulator + value, 0);
  return Math.round(sum / reactionTimes.length);
}
