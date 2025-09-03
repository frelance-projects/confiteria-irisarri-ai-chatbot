import { agentResponse } from '#ai/agent.mjs'
import { formatIncomingMessage } from '#utilities/formatIncomingMessage.mjs'
import { attachmentsMessage } from '../attachmentsMessage.mjs'

export async function videoMessage(message, userId, host, messageOriginType, list) {
  const contentType = 'videoMessage'
  console.log('baileys - video recibido: ' + contentType)
  const videoMessage = message.message.videoMessage
  if (videoMessage) {
    const extension = String(videoMessage.mimetype).split('/')[1]
    const videoContent = [
      { message, type: 'video', extension: `.${extension}`, caption: videoMessage.caption }
    ]
    const attachments = await attachmentsMessage(videoContent)
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
      console.error('Error al procesar el mensaje de video')
    }
  } else {
    console.error('Error al obtener el mensaje de video')
  }
}
