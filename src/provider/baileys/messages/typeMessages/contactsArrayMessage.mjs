import { agentResponse } from '#ai/agent.mjs'
import { formatIncomingMessage } from '#utilities/formatIncomingMessage.mjs'

export async function contactsArrayMessage(message, userId, host, messageOriginType, list) {
  const contentType = 'contactsArrayMessage'
  console.log('baileys - Lista de contactos' + contentType)
  const text = JSON.stringify({ contactsArrayMessage: message.message.contactsArrayMessage })

  agentResponse(userId, { type: 'text', text }, messageOriginType, 'whatsapp', message)
  const formatMessage = formatIncomingMessage('whatsapp', 'baileys', 'user', userId, host, {
    type: 'text',
    text
  })
  list.push(formatMessage)
}
