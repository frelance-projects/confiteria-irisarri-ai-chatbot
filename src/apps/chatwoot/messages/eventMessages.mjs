import { getCredentials } from '../functions/getCredentials.mjs'
import { sendMessage } from './sendMessage.mjs'

export async function eventMessages(data) {
  //si es actaulizacion de mensaje
  if (data.message_type === 'incoming') {
    return true
  }
  //si es de un tipo desconocido
  if (data.message_type !== 'outgoing') {
    console.error(`Chatwoot - eventMessages: Tipo de mensaje no soportado: ${data.message_type}`)
    return null
  }

  // Obtener credenciales
  const credentials = await getCredentials(data.inbox.id)
  if (!credentials) {
    console.error('Chatwoot - eventMessages: No se encontraron credenciales')
    return null
  }

  //SS MENSAJE ENVIADO POR EL BOT
  const { chatwoot, inbox } = credentials
  if (String(chatwoot.agentid) === String(data.sender.id)) {
    console.log('Chatwoot - eventMessages: Mensaje enviado por el bot')
    return true
  }

  return await sendMessage(data, inbox.platform)
}
