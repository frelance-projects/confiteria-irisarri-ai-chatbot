export function awaitTime(msg = 1000) {
  return new Promise((resolve) => setTimeout(resolve, msg))
}

export function getRandomDelay(maxDelay = 5000) {
  return Math.floor(Math.random() * maxDelay)
}
