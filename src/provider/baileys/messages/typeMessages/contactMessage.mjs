import { agentResponse } from '#ai/agent.mjs'
import { formatIncomingMessage } from '#utilities/formatIncomingMessage.mjs'

export async function contactMessage(message, userId, host, messageOriginType, list) {
  const contentType = 'contactMessage'
  console.log('baileys - Contacto ' + contentType)
  const text = JSON.stringify({ contactMessage: message.message.contactMessage })

  agentResponse(userId, { type: 'text', text }, messageOriginType, 'whatsapp', message)
  const formatMessage = formatIncomingMessage('whatsapp', 'baileys', 'user', userId, host, {
    type: 'text',
    text
  })
  list.push(formatMessage)
}
