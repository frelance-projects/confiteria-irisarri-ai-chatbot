import { getServices } from '#config/services/services.mjs'

export async function validateService(platform) {
  try {
    const services = await getServices()
    if (!services) {
      console.error('No se encontraron servicios')
      return null
    }
    const chatwoot = services.find((service) => service.platform === 'chatwoot')
    if (!chatwoot) {
      console.error('No se encontraron servicios de chatwoot')
      return null
    }
    const service = services.find((service) => service.platform === platform)
    if (!service) {
      console.error(`No se encontraron servicios de ${platform}`)
      return null
    }
    return { service, chatwoot }
  } catch (error) {
    console.error('Error al validar el servicio')
    console.error(error)
    return null
  }
}
