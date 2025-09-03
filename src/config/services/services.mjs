import { readServicesConfig } from './functions/readServicesConfig.mjs'

let SERVICES = null

export async function getServices() {
  if (!SERVICES) {
    SERVICES = await readServicesConfig()
  }
  return SERVICES
}
