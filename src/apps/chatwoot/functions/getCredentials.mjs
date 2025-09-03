import { getServices } from '#config/services/services.mjs'

export async function getCredentials(inboxid) {
  const services = await getServices()
  const chatwoot = services.find((service) => service.platform === 'chatwoot')
  if (!chatwoot) {
    console.error('Chatwoot - eventMessages: No se encontraron servicios de chatwoot')
    return null
  }
  const inbox = chatwoot.messagebox.find((messagebox) => String(messagebox.inboxid) === String(inboxid))
  if (!inbox) {
    console.error('Chatwoot - getCredentials: No se encontro la bandeja de entrada')
    return null
  }
  return { chatwoot, inbox }
}
