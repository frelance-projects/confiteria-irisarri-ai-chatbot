//TT MODULES
import { sendButtons } from './send/sendButtons.mjs'
import { getCredentials } from './getCredentials.mjs'

//TT ENVIAR MENSAJE
export async function sendMessageInteractive(phone, messageContent, role, channel, app) {
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
        if (message.type === 'buttons') {
          const sentMsg = await sendButtons(phone, message.message, message.buttonList)

          // construir el texto completo del mensaje para el log
          const { body, header, footer } = message.message
          let allText = ''
          if (header && header.length > 0) allText += header + '\n\n'
          if (body && body.length > 0) allText += body + '\n\n'
          if (footer && footer.length > 0) allText += footer + '\n\n'
          // agregar los títulos de los botones al log
          if (message.buttonList && message.buttonList.length > 0) {
            const buttonTitles = message.buttonList.map((btn) => btn.title).join(' | ')
            allText += `Buttons: [${buttonTitles}]`
          }
          if (sentMsg) {
            //console.log(sentMsg)
            sentMsgs.push({
              timestamp: Date.now(),
              platform: 'whatsapp',
              provider: 'meta',
              status: 1,
              log: 'ok',
              app,
              role,
              channel,
              transmitter: meta.host,
              receiver: phone,
              message: {
                type: 'text',
                text: allText,
              },
            })
          }
        }
        //SS TIPO NO SOPORTADO
        else {
          console.error('Tipo de mensaje no soportado:', message.type)
          sentMsgs.push({
            timestamp: Date.now(),
            platform: 'whatsapp',
            provider: 'meta',
            status: 'error',
            log: 'Message type not supported: ' + message.type,
            app,
            role,
            channel,
            transmitter: meta.host,
            receiver: phone,
            message,
          })
        }
      } catch (error) {
        //SS ERROR
        console.error('Error al enviar el mensaje:', error)
        sentMsgs.push({
          timestamp: Date.now(),
          platform: 'whatsapp',
          provider: 'meta',
          status: 'error',
          log: 'Error sending message:' + error,
          app,
          role,
          channel,
          transmitter: meta.host,
          receiver: phone,
          message,
        })
      }
    }
    if (sentMsgs.length > 0) {
      return sentMsgs
    } else {
      console.error('No se pudo enviar ningún mensaje')
      return null
    }
  } catch (error) {
    console.error('Error al enviar los mensajes:', error)
    return null
  }
}
