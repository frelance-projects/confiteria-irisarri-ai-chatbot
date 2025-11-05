import { addToQueue } from '#utilities/queuedExecution.mjs'
import { sentNotificationTemplate } from '#provider/whatsapp-meta/templates/sentNotificationTemplate.mjs'
import { getRandomDelay } from '#utilities/dateFunctions/time.mjs'

export async function sendRequestWhatsappMeta(template, assistants, parameters) {
  for (const assistant of assistants) {
    if (!assistant.whatsappId) {
      console.info('sendRequestWhatsapp: no hay id de whatsapp para el asistente', assistant)
      continue
    }
    addToQueue(
      {
        data: { template, assistant, parameters },
        callback: sendTemplate,
        delay: 10000 + getRandomDelay(5000)
      },
      'sendWaTemplateMeta'
    )
  }
  return true
}

//SS ENVIO DE PLANTILLAS
async function sendTemplate({ template, assistant, parameters }) {
  if (!template || !assistant || !assistant.whatsappId) {
    console.error('sendMessages: Missing parameters')
    return false
  }

  const res = await sentNotificationTemplate({
    userPhone: assistant.whatsappId,
    templateName: template.name,
    languageCode: template.language,
    parameters
  })
  if (res) {
    console.log('platilla enviada a whatsapp:', assistant.name)
  } else {
    console.error('Error al enviar platilla a whatsapp:', assistant.whatsappId)
  }
}
