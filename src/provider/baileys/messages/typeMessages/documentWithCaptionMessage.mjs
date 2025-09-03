import { agentResponse } from '#ai/agent.mjs'
import { formatIncomingMessage } from '#utilities/formatIncomingMessage.mjs'
import { attachmentsMessage } from '../attachmentsMessage.mjs'

// Mapeo de tipos MIME
const mimeType = {
  'application/pdf': 'document',
  'application/msword': 'file',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'document',
  'application/vnd.ms-excel': 'file',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'document',
  'application/zip': 'file',
  'application/json': 'file',
  'application/xml': 'file',
  'text/plain': 'file',
  'text/csv': 'file',
  'text/html': 'file',
  'audio/mpeg': 'audio',
  'audio/wav': 'audio',
  'audio/x-wav': 'audio',
  'audio/ogg': 'audio',
  'audio/flac': 'audio',
  'audio/aac': 'audio',
  'image/jpeg': 'image',
  'image/png': 'image',
  'image/gif': 'image',
  'image/svg+xml': 'image',
  'image/webp': 'image',
  'video/mp4': 'video',
  'video/mpeg': 'video',
  'video/ogg': 'video',
  'video/webm': 'video',
  'video/x-msvideo': 'video'
}

export async function documentWithCaptionMessage(message, userId, host, messageOriginType, list) {
  const contentType = 'documentWithCaptionMessage'
  console.log('baileys - Documento recibido: ' + contentType)
  const documentMessage = message.message.documentWithCaptionMessage
  if (documentMessage) {
    const mime = String(documentMessage.message.documentMessage.mimetype)
    const extension = mime.split('/')[1]
    const documentContent = [
      {
        message,
        type: mimeType[mime],
        extension: `.${extension}`,
        caption: documentMessage.message.documentMessage.caption
      }
    ]
    const attachments = await attachmentsMessage(documentContent)
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
      console.error('Error al procesar el mensaje de documento')
    }
  } else {
    console.error('Error al obtener el mensaje de documento')
  }
}
