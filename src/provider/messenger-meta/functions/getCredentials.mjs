import { getServices } from '#config/services/services.mjs'

export async function getCredentials() {
  const services = await getServices()
  const meta = services.find((service) => service.platform === 'messenger' && service.provider === 'meta')
  if (meta) {
    return meta
  } else {
    return null
  }
}
