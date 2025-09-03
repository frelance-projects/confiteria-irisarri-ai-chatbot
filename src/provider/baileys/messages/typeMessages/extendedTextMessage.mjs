import { agentResponse } from '#ai/agent.mjs'
import { formatIncomingMessage } from '#utilities/formatIncomingMessage.mjs'

export async function extendedTextMessage(message, userId, host, messageOriginType, list) {
  const contentType = 'extendedTextMessage'
  console.log('baileys - Mensaje de texto: ' + contentType)
  const text = message.message.extendedTextMessage.text
  agentResponse(userId, { type: 'text', text }, messageOriginType, 'whatsapp', message)
  const formatMessage = formatIncomingMessage('whatsapp', 'baileys', 'user', userId, host, {
    type: 'text',
    text
  })
  list.push(formatMessage)
}
