import { provider, providerSendMessage } from '#provider/provider.mjs'
import { addToQueue } from '#utilities/queuedExecution.mjs'
import { checkFollowUp } from '../checkFollowUp.mjs'
import { checkPostFollowUp } from '../checkPostFollowUp.mjs'
import { updateFollowUpLog } from '#config/data/followUpLog.mjs'
import { sendToChannels } from '#channels/channels.mjs'
import { getMessageTemplateById } from '#config/resources/messageTemplates.mjs'
import { followUpMessageFormat } from '../format/followUpMessageFormat.mjs'
import { isProductionEnv } from '#config/config.mjs'

export async function sendWhatsapp(user, followUp, followUpMessage, key) {
  if (!user || !followUp || !followUpMessage) {
    console.error('sendWhatsapp: Missing parameters')
    return false
  }
  if (!user.whatsapp || !user.whatsapp.id) {
    console.warn('sendWhatsapp: Missing whatsapp id')
    return false
  }
  //SS BAILEYS
  if (provider.whatsapp.provider === 'baileys') {
    //const keyPlatform = `${key} whatsapp`
    const log = await checkFollowUp(user, followUp, key, 'whatsapp', followUpMessage)
    if (!log) {
      return
    }
    //agregar a cola
    addToQueue(
      {
        data: { user, followUp, followUpMessage, key },
        callback: sendWhatsappBaileys,
        delay: 5 * 60 * 1000 + getRandomDelay()
      },
      'sendWhatsappBaileys'
    )
  }
}

//SS OBTENER RETRASO ALEATORIO
function getRandomDelay() {
  const maxDelay = 2 * 60 * 1000 // 2 minutos en milisegundos
  return Math.floor(Math.random() * maxDelay)
}

//SS ENVIAR MENSAJE POR WHATSAPP
async function sendWhatsappBaileys({ user, followUp, followUpMessage, key }) {
  if (!user || !followUp || !followUpMessage) {
    console.error('sendWhatsapp: Missing parameters')
    return false
  }
  const messageTemplate = await getMessageTemplateById(followUpMessage.messageTemplate)
  if (!messageTemplate || !messageTemplate.text) {
    console.error('sendWhatsapp: Error al cargar la plantilla de mensaje')
    return false
  }
  //formatear mensaje
  const textMessage = followUpMessageFormat(user, messageTemplate.text)
  const keyPlatform = `${key} whatsapp`
  const log = await checkFollowUp(user, followUp, key, 'whatsapp', followUpMessage)
  if (!log) {
    console.info('sendWhatsapp: Ya no se cumple la condición para enviar el mensaje por whatsapp')
    return
  }
  if (!isProductionEnv()) {
    console.log('sendWhatsapp: No se ejecuta en desarrollo')
    return
  }
  try {
    const res = await providerSendMessage(
      user.whatsapp.id,
      { type: 'text', text: textMessage },
      'whatsapp',
      'bot',
      'outgoing',
      'bot'
    )
    if (res) {
      sendToChannels(res)
      log.followUpLogs = log.followUpLogs ? `${log.followUpLogs}\n> ${keyPlatform}` : `> ${keyPlatform}`
      console.info(
        'sendWhatsapp: Seguimiento enviado por whatsapp' + user.name + ' whatsapp: ' + user.whatsapp.id
      )
      const newLog = await updateFollowUpLog(log)
      if (!newLog || newLog.length === 0) {
        console.error('sendEmail: Error al actualizar el log')
        return null
      }
      //comprobar post seguimiento
      checkPostFollowUp(followUp, newLog[0])
    } else {
      console.error('Error al enviar mensaje a whatsapp:', user.whatsappId)
    }
  } catch (error) {
    console.error('Error al enviar mensaje a whatsapp:', user.whatsappId)
  }
}
