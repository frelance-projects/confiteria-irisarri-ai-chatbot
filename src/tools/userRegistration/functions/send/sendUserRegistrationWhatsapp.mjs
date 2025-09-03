import { provider, providerSendMessage } from '#provider/provider.mjs'
//import { awaitTime } from '#utilities/dateFunctions/time.mjs'
import { sendLog } from '#logger/logger.mjs'
import { sendToChannels } from '#channels/channels.mjs'
import { addToQueue } from '#utilities/queuedExecution.mjs'
import { isProductionEnv } from '#config/config.mjs'
import { getRandomDelay } from '#utilities/dateFunctions/time.mjs'

export async function sendUserRegistrationWhatsapp(message, assistants) {
  //SS BAILEYS
  if (provider.whatsapp.provider === 'baileys') {
    for (const assistant of assistants) {
      if (!assistant.whatsappId) {
        console.info('sendRequestWhatsapp: no hay id de whatsapp para el asistente', assistant)
        continue
      }
      addToQueue(
        { data: { message, assistant }, callback: sendMessages, delay: 10000 + getRandomDelay(5000) },
        'sendWhatsappBaileys'
      )
    }
  }
  //SS META
  else if (provider.whatsapp.provider === 'meta') {
    //NEXT: FEATURE
    console.log('meta')
    return true
  } else {
    console.error('sendRequestWhatsapp: proveedor de whatsapp no soportado')
    return false
  }
}

//SS ENVIO DE MENSAJES
async function sendMessages({ message, assistant }) {
  if (!message || !assistant || !assistant.whatsappId) {
    console.error('sendMessages: Missing parameters')
    return false
  }
  if (!isProductionEnv()) {
    console.log('sendMessages: No se ejecuta en desarrollo')
    return false
  }
  const res = await providerSendMessage(
    assistant.whatsappId,
    { type: 'text', text: message },
    'whatsapp',
    'bot',
    'outgoing',
    'bot'
  )
  if (res) {
    sendToChannels(res)
    console.log('Mensaje enviado a whatsapp:', assistant.name)
  } else {
    console.error('Error al enviar mensaje a whatsapp:', assistant.whatsappId)
    sendLog(
      'error',
      'tools/userRegistration/functions/send/sendUserRegistrationWhatsapp',
      'sendMessages',
      `Error to send message to ${assistant.name}  whatsapp: ${assistant.whatsappId} message: ${message}`
    )
  }
}
