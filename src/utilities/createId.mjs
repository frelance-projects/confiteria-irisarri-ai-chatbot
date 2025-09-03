import crypto from 'crypto'

export function createId() {
  return crypto
    .randomBytes(11) // 11 bytes = 88 bits → 15 caracteres en base64
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .substring(0, 15)
}

export function createIdNumber(long = 7) {
  let rect = long
  if (long < 1 || long > 15) rect = 15

  const maxRandomLength = Math.min(rect, 6)
  const timestamp = Date.now()
    .toString()
    .slice(-(rect - maxRandomLength))
  const random = Math.floor(Math.random() * Math.pow(10, maxRandomLength))
    .toString()
    .padStart(maxRandomLength, '0')

  return (timestamp + random).slice(0, rect)
}
