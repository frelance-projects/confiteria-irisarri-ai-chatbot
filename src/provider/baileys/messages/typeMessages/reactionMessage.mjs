import { agentResponse } from '#ai/agent.mjs'
import { formatIncomingMessage } from '#utilities/formatIncomingMessage.mjs'

export async function reactionMessage(message, userId, host, messageOriginType, list) {
  const contentType = 'reactionMessage'
  console.log('baileys - Reaccion: ' + contentType)
  const text = message.message.reactionMessage.text

  // Verificar que se ha añadido el mensaje
  if (!text) {
    console.log('Se elimino la reaccion a un mensaje')
    return
  }

  agentResponse(userId, { type: 'text', text }, messageOriginType, 'whatsapp', message)
  const formatMessage = formatIncomingMessage('whatsapp', 'baileys', 'user', userId, host, {
    type: 'text',
    text
  })
  list.push(formatMessage)
}
