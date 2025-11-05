import { providerSendMessage } from '#provider/provider.mjs'
import { addToQueue } from '#utilities/queuedExecution.mjs'
import { sendToChannels } from '#channels/channels.mjs'
import { isProductionEnv } from '#config/config.mjs'
import { getRandomDelay } from '#utilities/dateFunctions/time.mjs'

export async function sendRequestWhatsappBaileys(message, assistants, data) {
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
  return true
}

//SS ENVIO DE MENSAJES
async function sendMessages({ message, assistant }) {
  if (!message || !assistant || !assistant.whatsappId) {
    console.error('sendMessages: Missing parameters')
    return false
  }
  if (!isProductionEnv()) {
    console.log('sendMessages: No se ejecuta en desarrollo')
    return
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
  }
}
