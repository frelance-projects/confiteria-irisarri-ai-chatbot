import { agentResponse } from '#ai/agent.mjs'
import { formatIncomingMessage } from '#utilities/formatIncomingMessage.mjs'
import { attachmentsMessage } from '../attachmentsMessage.mjs'

export async function audioMessage(message, userId, host, messageOriginType, list) {
  const contentType = 'audioMessage'
  console.log('baileys - Audio recibido: ' + contentType)

  const audioMessage = message.message.audioMessage
  if (audioMessage) {
    const audioContent = [{ message, type: 'audio', extension: '.mp3', caption: audioMessage.caption }]
    const attachments = await attachmentsMessage(audioContent)
    if (attachments) {
      for (const attachment of attachments) {
        const formatMessage = formatIncomingMessage('whatsapp', 'baileys', 'user', userId, host, {
          type: 'media',
          media: attachment
        })
        list.push(formatMessage)
        agentResponse(userId, { type: 'media', media: attachment }, messageOriginType, 'whatsapp', message)
      }
    } else {
      console.error('Error al procesar el mensaje de audio')
    }
  } else {
    console.error('Error al obtener el mensaje de audio')
  }
}
