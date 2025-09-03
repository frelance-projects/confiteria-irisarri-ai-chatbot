import { agentResponse } from '#ai/agent.mjs'
import { formatIncomingMessage } from '#utilities/formatIncomingMessage.mjs'

export async function stickerMessage(message, userId, host, messageOriginType, list) {
  const contentType = 'stickerMessage'
  console.log('baileys - Sticker ' + contentType)
  const text = JSON.stringify({ stickerMessage: message.message.stickerMessage })

  agentResponse(userId, { type: 'text', text }, messageOriginType, 'whatsapp', message)
  const formatMessage = formatIncomingMessage('whatsapp', 'baileys', 'user', userId, host, {
    type: 'text',
    text
  })
  list.push(formatMessage)
}
