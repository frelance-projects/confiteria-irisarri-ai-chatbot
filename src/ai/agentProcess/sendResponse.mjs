import { providerSendMessage, providerSendPresence, providerMarkReadMessage } from '#provider/provider.mjs'
import { addTextMessageToHistory } from './addMessageToHistory.mjs'
import { detectUrlMedia } from './detectMediaUrlResponse.mjs'

//TT PRUEBA DE MENSAJES
/*
  const video = {
    type: 'media',
    media: {
      fileType: 'video',  //image, video, audio, document
      fileUrl: 'https://ik.imagekit.io/johan12361/infinitybot/Video%20de%20WhatsApp%202024-12-20%20a%20las%2020.23.27_7a795ea1.mp4',
    }
  }
  const image = {
    type: 'media',
    media: {
      fileType: 'image',
      fileUrl: 'https://ik.imagekit.io/johan12361/infinitybot/0ef1511d45199b126b0e6816d9cfb45a6bbfdadc.jpg?updatedAt=1737864574843',
      caption: 'esto es una prueba'
    }
  }
  const texto = {
    type: 'text',
    text: 'esto es una prueba'
  }
    */
export async function sendResponse(
  agentConfig,
  resAi,
  userId,
  userIdKey,
  platform = 'whatsapp',
  originalMessage = [],
  user
) {
  try {
    // Marcar el mensaje como leído y enviar presencia
    providerMarkReadMessage(originalMessage, platform)
    providerSendPresence(userId, 'composing', platform)

    // Usar una promesa para manejar el setTimeout
    const result = await new Promise((resolve) => {
      setTimeout(async () => {
        const totalMessages = [resAi]
        let urlMedia = null
        if (resAi.type === 'text') {
          urlMedia = detectUrlMedia(resAi.text)
        }
        if (urlMedia) {
          const mediaMessages = urlMedia.map((url) => ({
            type: 'media',
            media: {
              fileType: url.fileType,
              fileUrl: url.fileUrl,
            },
          }))
          totalMessages.push(...mediaMessages)
        }
        try {
          const estate = await providerSendMessage(userId, totalMessages, platform, 'bot', 'outgoing', 'bot')
          if (estate) {
            // Guardar historial si el mensaje es de tipo texto
            if (resAi.type === 'text') {
              if (agentConfig.ai.provider === 'openai') {
                addTextMessageToHistory(userIdKey, resAi.text, agentConfig.ai.provider, 'assistant', user)
              } else {
                console.error('Agente: Proveedor de IA no soportado:', agentConfig.ai.provider)
              }
            } else {
              console.error('Agente: Tipo de mensaje no soportado:', resAi.type)
            }
            resolve(estate) // Resolver la promesa con el estado
          } else {
            console.error('Agente: No se pudo enviar el mensaje.', totalMessages)
            console.error('Agente: Error al enviar el mensaje.', estate)
            resolve(null) // Resolver la promesa con null en caso de error
          }
        } catch (error) {
          console.error('Agente: Error inesperado al enviar el mensaje:', error)
          resolve(null) // Resolver la promesa con null en caso de excepción
        }
      }, agentConfig.awaitResponse || 1000)
    })

    return result // Retornar el resultado de la promesa
  } catch (error) {
    console.error('Agente: Error inesperado en sendResponse:', error)
    return null
  }
}
