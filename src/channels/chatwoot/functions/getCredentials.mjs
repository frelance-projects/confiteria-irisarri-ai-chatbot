import { getServices } from '#config/services/services.mjs'

export async function getCredentials() {
  const services = await getServices()
  const chatwoot = services.find((service) => service.platform === 'chatwoot')
  if (chatwoot) {
    return chatwoot
  } else {
    return null
  }
}
