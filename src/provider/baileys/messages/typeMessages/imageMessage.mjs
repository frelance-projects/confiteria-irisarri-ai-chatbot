import { agentResponse } from '#ai/agent.mjs'
import { formatIncomingMessage } from '#utilities/formatIncomingMessage.mjs'
import { attachmentsMessage } from '../attachmentsMessage.mjs'

export async function imageMessage(message, userId, host, messageOriginType, list) {
  const contentType = 'imageMessage'
  console.log('baileys - Imagen recibida: ' + contentType)
  const imageMessage = message.message.imageMessage
  if (imageMessage) {
    const extension = String(imageMessage.mimetype).split('/')[1]

    const imageContent = [
      { message, type: 'image', extension: `.${extension}`, caption: imageMessage.caption }
    ]
    const attachments = await attachmentsMessage(imageContent)
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
      console.error('Error al procesar el mensaje de imagen')
    }
  } else {
    console.error('Error al obtener el mensaje de imagen')
  }
}
