import { postMessage } from './api/postMessage.mjs'
import { postMedia } from './api/postMedia.mjs'
import { downloadFile } from '#storage/dowloadFile.mjs'
import { createId } from '#utilities/createId.mjs'

export async function sendMessage(message, conversacion) {
  //texto
  if (message.message.type === 'text') {
    const conversationId = conversacion.id
    const content = message.message.text
    const channel = message.channel
    const res = await postMessage(conversationId, content, channel)
    if (!res) {
      console.log('Error al enviar mensaje a chatwoot')
    }
    console.log('mensaje enviado a chatwoot')
    return res
  }
  //media
  else if (message.message.type === 'media') {
    let attachments = ''
    //comprobar path
    if (!message.message.media.path) {
      const localFile = await downloadFile(message.message.media.fileUrl, createId())
      if (!localFile) {
        console.error(
          'chatwoot / sendMessage: Error al descargar el archivo: ' + message.message.media.fileUrl
        )
        return null
      }
      attachments = localFile
    } else {
      attachments = message.message.media.path
    }
    const conversationId = conversacion.id
    const channel = message.channel
    const caption = message.message.media.caption ? message.message.media.caption : ''
    const fileType = message.message.media.fileType

    //enviar mensaje
    const res = await postMedia(conversationId, channel, attachments, caption, fileType)
    if (!res) {
      console.log('Error al enviar mensaje a chatwoot')
    }
    console.log('mensaje enviado a chatwoot')
    return res
  } else {
    console.error('tipo de mensaje no soportado: ' + message.message.type)

    return null
  }
}
