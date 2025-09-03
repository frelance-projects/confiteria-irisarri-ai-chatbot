//TT MODULES
import { getProviderHost } from '#provider/provider.mjs'
import { sendText } from './sends/sendText.mjs'
import { sendMedia } from './sends/sendMedia.mjs'
import { sendLog } from '#logger/logger.mjs'

//TT ENVIAR MENSAJE
export async function sendMessageWhatsappBaileys(phone, messageContent, role, channel, app) {
  try {
    const messages = Array.isArray(messageContent) ? messageContent : [messageContent]
    const sentMsgs = []
    for (const message of messages) {
      try {
        const transmitter = getProviderHost('whatsapp')
        if (!transmitter) {
          console.error('Error al obtener el host del proveedor')
          return null
        }
        //SS ENVIAR TEXTO
        if (message.type === 'text') {
          const sentMsg = await sendText(phone, message.text, role)
          if (sentMsg) {
            sentMsgs.push({
              timestamp: Date.now(),
              platform: 'whatsapp',
              provider: 'baileys',
              status: sentMsg.status,
              log: 'ok',
              app,
              role,
              channel,
              transmitter,
              receiver: phone,
              message
            })
          }
        }
        //SS ENVIAR MEDIA
        else if (message.type === 'media') {
          const sentMsg = await sendMedia(phone, message.media, role)
          if (sentMsg) {
            sentMsgs.push({
              timestamp: Date.now(),
              platform: 'whatsapp',
              provider: 'baileys',
              status: sentMsg.status,
              log: 'ok',
              app,
              role,
              channel,
              transmitter,
              receiver: phone,
              message
            })
          }
        }
        //SS ENVIAR TEXTO & MEDIA
        else if (message.type === 'text_&_media') {
          const sentMsg = await sendText(phone, message.text, message.media)
          if (sentMsg) {
            sentMsgs.push({
              timestamp: Date.now(),
              platform: 'whatsapp',
              provider: 'baileys',
              status: sentMsg.status,
              log: 'ok',
              app,
              role,
              channel,
              transmitter,
              receiver: phone,
              message
            })
          }
        }
        //SS TIPO NO SOPORTADO
        else {
          console.error('Tipo de mensaje no soportado:', message.type)
          sentMsgs.push({
            timestamp: Date.now(),
            platform: 'whatsapp',
            provider: 'baileys',
            status: 'error',
            log: 'Message type not supported: ' + message.type,
            app,
            role,
            channel,
            transmitter,
            receiver: phone,
            message
          })
        }
      } catch (error) {
        //SS ERROR
        console.error('Error al enviar el mensaje:', error)
        sentMsgs.push({
          timestamp: Date.now(),
          platform: 'whatsapp',
          provider: 'baileys',
          status: 'error',
          log: 'Error sending message:' + error,
          app,
          role,
          channel,
          transmitter: 'n/a',
          receiver: phone,
          message
        })
      }
    }
    if (sentMsgs.length > 0) {
      return sentMsgs
    } else {
      sendLog('error', 'provider/baileys/functions/sendMessage', 'No messages sent')
      console.error('No se pudo enviar ningún mensaje')
      return null
    }
  } catch (error) {
    sendLog('error', 'provider/baileys/functions/sendMessage', 'Error sending messages')
    console.error('Error al enviar los mensajes:', error)
    return null
  }
}
