import { agentResponse } from '#ai/agent.mjs'
import { formatIncomingMessage } from '#utilities/formatIncomingMessage.mjs'
import { attachmentsMessage } from '../attachmentsMessage.mjs'

export async function documentMessage(message, userId, host, messageOriginType, list) {
  const contentType = 'documentMessage'
  console.log('baileys - Documento recibido: ' + contentType)
  const documentMessage = message.message.documentMessage
  if (documentMessage) {
    const extension = String(documentMessage.mimetype).split('/')[1]
    const documentContent = [
      { message, type: 'document', extension: `.${extension}`, caption: documentMessage.caption }
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
