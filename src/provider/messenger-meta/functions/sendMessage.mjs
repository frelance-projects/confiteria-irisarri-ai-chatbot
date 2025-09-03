//TT MODULES
import { sendText } from './send/sendText.mjs'
import { sendMedia } from './send/sendMedia.mjs'
import { getCredentials } from './getCredentials.mjs'
import { sendLog } from '#logger/logger.mjs'

//TT ENVIAR MENSAJE
export async function sendMessageMessengerMeta(userId, messageContent, role, channel, app) {
  try {
    const meta = await getCredentials()
    if (!meta) {
      console.error('Error al obtener las credenciales de Meta')
      return null
    }
    const messages = Array.isArray(messageContent) ? messageContent : [messageContent]
    const sentMsgs = []
    for (const message of messages) {
      try {
        //SS ENVIAR TEXTO
        if (message.type === 'text') {
          const sentMsg = await sendText(userId, message.text)
          if (sentMsg) {
            //console.log(sentMsg)
            sentMsgs.push({
              timestamp: Date.now(),
              platform: 'messenger',
              provider: 'meta',
              status: 1,
              log: 'ok',
              app,
              role,
              channel,
              transmitter: meta.pageid,
              receiver: userId,
              message
            })
          }
        }
        //SS ENVIAR MEDIA
        else if (message.type === 'media') {
          const sentMsg = await sendMedia(userId, message.media)
          if (sentMsg) {
            //console.log(sentMsg)
            sentMsgs.push({
              timestamp: Date.now(),
              platform: 'messenger',
              provider: 'meta',
              status: 1,
              log: 'ok',
              app,
              role,
              channel,
              transmitter: meta.pageid,
              receiver: userId,
              message
            })
          }
        }
        //SS TIPO NO SOPORTADO
        else {
          console.error('Tipo de mensaje no soportado:', message.type)
          sentMsgs.push({
            timestamp: Date.now(),
            platform: 'messenger',
            provider: 'meta',
            status: 'error',
            log: 'Message type not supported: ' + message.type,
            app,
            role,
            channel,
            transmitter: meta.pageid,
            receiver: userId,
            message
          })
        }
      } catch (error) {
        //SS ERROR
        console.error('Error al enviar el mensaje:', error)
        sentMsgs.push({
          timestamp: Date.now(),
          platform: 'messenger',
          provider: 'meta',
          status: 'error',
          log: 'Error sending message:' + error,
          app,
          role,
          channel,
          transmitter: meta.pageid,
          receiver: userId,
          message
        })
      }
    }
    if (sentMsgs.length > 0) {
      return sentMsgs
    } else {
      console.error('No se pudo enviar ningún mensaje')
      sendLog('error', 'provider/messenger-meta/functions/sendMessage', 'No messages sent')
      return null
    }
  } catch (error) {
    sendLog('error', 'provider/messenger-meta/functions/sendMessage', 'Error sending messages')
    console.error('Error al enviar los mensajes:', error)
    return null
  }
}
