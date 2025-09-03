import { agentResponse } from '#ai/agent.mjs'
import { formatIncomingMessage } from '#utilities/formatIncomingMessage.mjs'

export async function conversation(message, userId, host, messageOriginType, list) {
  const contentType = 'conversation'
  console.log('baileys - Mensaje de texto: ' + contentType)
  const text = message.message.conversation

  agentResponse(userId, { type: 'text', text }, messageOriginType, 'whatsapp', message)
  const formatMessage = formatIncomingMessage('whatsapp', 'baileys', 'user', userId, host, {
    type: 'text',
    text
  })
  list.push(formatMessage)
}
