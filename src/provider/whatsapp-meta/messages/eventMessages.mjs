import { agentResponse } from '#ai/agent.mjs'
import { attachmentsMessage } from './attachmentsMessage.mjs'
import { formatIncomingMessage } from '#utilities/formatIncomingMessage.mjs'
import { getCredentials } from '../functions/getCredentials.mjs'
import { sendToChannels } from '#channels/channels.mjs'

export async function eventMessages(data) {
  if (!Array.isArray(data)) {
    return console.error('Error: data no es un array')
  }
  const meta = await getCredentials()
  if (!meta) {
    console.error('Error al obtener las credenciales de Meta')
    return null
  }
  const list = []
  for (const message of data) {
    console.log(message)
    //SS TEXTO
    switch (message.type) {
      case 'text': {
        const text = message.text.body
        const userId = message.from
        agentResponse(userId, { type: 'text', text }, 'user', 'whatsapp', message)
        const formatMessage = formatIncomingMessage('whatsapp', 'meta', 'user', userId, meta.phoneid, {
          type: 'text',
          text
        })
        list.push(formatMessage)
        break
      }
      //SS AUDIO
      case 'audio': {
        console.log('Audio recibido')
        const userId = message.from
        const audioContent = [{ message: message.audio, type: 'audio' }]
        const attachments = await attachmentsMessage(audioContent)
        if (attachments) {
          for (const attachment of attachments) {
            agentResponse(userId, { type: 'media', media: attachment }, 'user', 'whatsapp', message)
            const formatMessage = formatIncomingMessage('whatsapp', 'meta', 'user', userId, meta.phoneid, {
              type: 'media',
              media: attachment
            })
            list.push(formatMessage)
          }
        }
        break
      }
      //SS IMAGEN
      case 'image': {
        console.log('Imagen recibida')
        const userId = message.from
        const imageContent = [{ message: message.image, type: 'image' }]
        const attachments = await attachmentsMessage(imageContent)
        if (attachments) {
          for (const attachment of attachments) {
            agentResponse(userId, { type: 'media', media: attachment }, 'user', 'whatsapp', message)
            const formatMessage = formatIncomingMessage('whatsapp', 'meta', 'user', userId, meta.phoneid, {
              type: 'media',
              media: attachment
            })
            list.push(formatMessage)
          }
        }
        break
      }
      //SS VIDEO
      case 'video': {
        console.log('Video recibido')
        const userId = message.from
        const videoContent = [{ message: message.video, type: 'video' }]
        const attachments = await attachmentsMessage(videoContent)
        if (attachments) {
          for (const attachment of attachments) {
            agentResponse(userId, { type: 'media', media: attachment }, 'user', 'whatsapp', message)
            const formatMessage = formatIncomingMessage('whatsapp', 'meta', 'user', userId, meta.phoneid, {
              type: 'media',
              media: attachment
            })
            list.push(formatMessage)
          }
        }
        break
      }
      //SS DOCUMENTO
      case 'document': {
        console.log('Documento recibido')
        const userId = message.from
        const documentContent = [{ message: message.document, type: 'document' }]
        const attachments = await attachmentsMessage(documentContent)
        if (attachments) {
          for (const attachment of attachments) {
            agentResponse(userId, { type: 'media', media: attachment }, 'user', 'whatsapp', message)
            const formatMessage = formatIncomingMessage('whatsapp', 'meta', 'user', userId, meta.phoneid, {
              type: 'media',
              media: attachment
            })
            list.push(formatMessage)
          }
        }
        break
      }

      default: {
        console.log('Mensaje de tipo desconocido:', message)
      }
    }
  }
  if (list.length > 0) {
    sendToChannels(list)
  }
}
