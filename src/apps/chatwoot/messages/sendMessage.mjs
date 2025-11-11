import { getUserId } from '../functions/getUserId.mjs'
import { providerSendMessage } from '#provider/provider.mjs'
import { validateUrlMedia } from '#utilities/validateMedia.mjs'
import { sendToChannels } from '#channels/channels.mjs'


export async function sendMessage(data, platform) {
  // Obtener ID de usuario
  const userId = getUserId(data, platform)
  if (!userId) {
    console.error('Chatwoot - eventMessages: No se encontró el ID de usuario')
    return null
  }
  console.log(`Chatwoot - eventMessages: Mensaje enviado por el usuario: ${userId} - ${platform}`)

  if (data.content_type !== 'text' && !data.attachments) {
    console.error(`Chatwoot - eventMessages: Tipo de contenido no soportado: ${data.content_type}`)
    return null
  }

  const message = []
  //SS AGREGAR TEXTO
  if (data.content) {
    message.push({ type: 'text', text: data.content })
  }

  //SS AGREGAR MEDIA
  if (data.attachments?.length > 0) {
    for (const attachment of data.attachments) {
      const fileType = validateUrlMedia(attachment.data_url, platform)
      if (!fileType) {
        console.error('Chatwoot - eventMessages: Tipo de media no soportado')
        continue
      }
      message.push({ type: 'media', media: { fileType, fileUrl: attachment.data_url } })
    }
  }
  if (message.length < 1) {
    console.error('Chatwoot - sendMessage: No se encontraron mensajes para enviar')
    return null
  }
  //SS ENVIAR MENSAJE
  providerSendMessage(userId, message, platform, 'assistant', 'outgoing', 'chatwoot').then((res) => {
    if (!res) {
      console.error('Chatwoot - sendMessage: Error al enviar el mensaje')
    } else {
      console.log('Chatwoot - sendMessage: Mensaje enviado')
      sendToChannels(res)
    }
  })

  return true
}
