const BASE_DELAY_MS = 500;
const MAX_DELAY_MS = 10000;

export function nextDelayMs(attempt: number) {
  const expDelay = Math.min(MAX_DELAY_MS, BASE_DELAY_MS * 2 ** attempt);
  const jitter = Math.random() * 250;
  return expDelay + jitter;
}
