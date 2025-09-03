import { agentResponse } from '#ai/agent.mjs'
import { formatIncomingMessage } from '#utilities/formatIncomingMessage.mjs'

export async function locationMessage(message, userId, host, messageOriginType, list) {
  const contentType = 'locationMessage'
  console.log('baileys - Ubicacion: ' + contentType)
  const degreesLatitude = message.message?.locationMessage?.degreesLatitude
  const degreesLongitude = message.message?.locationMessage?.degreesLongitude
  const text = JSON.stringify({ degreesLatitude, degreesLongitude })

  agentResponse(userId, { type: 'text', text }, messageOriginType, 'whatsapp', message)
  const formatMessage = formatIncomingMessage('whatsapp', 'baileys', 'user', userId, host, {
    type: 'text',
    text
  })
  list.push(formatMessage)
}
