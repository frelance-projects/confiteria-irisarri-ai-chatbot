import { isProductionEnv } from '#config/config.mjs'
import { getServices } from '../config/services/services.mjs'
import { sendToChatwoot } from './chatwoot/sendToChatwoot.mjs'
import { sendToAppsheet } from '#apps/appsheet/sendToAppsheet.mjs'

export async function sendToChannels(messages) {
  /*
  if (!isProductionEnv()) {
    console.log('sendToChannels: No se ejecuta en desarrollo')
    return null
  }
    */
  if (!Array.isArray(messages)) {
    return console.error('sendToChannels: messages no es un array')
  }
  if (messages.length < 1) {
    return console.error('sendToChannels: messages está vacío')
  }

  //console.log('channels', JSON.stringify(messages, null, 2))
  const services = await getServices()
  if (!services) {
    console.error('sendToChannels: No se encontraron servicios')
    return null
  }

  //SS CHATWOOT
  const chatwoot = services.find((service) => service.platform === 'chatwoot')
  if (chatwoot && isProductionEnv()) {
    console.log('Canal de chatwoot activo')
    const chatwootMessages = filterByChannel(messages, 'chatwoot')
    if (chatwootMessages.length > 0) {
      sendToChatwoot(chatwootMessages, chatwoot)
    }
  }
  //SS APPSHEET
  const appsheet = services.find((service) => service.platform === 'appsheet' && service.inbox)
  if (appsheet && isProductionEnv()) {
    console.log('Canal de appsheet activo')
    const appsheetMessages = filterByChannel(messages, 'appsheet')
    if (appsheetMessages.length > 0) {
      sendToAppsheet(appsheetMessages)
    }
  }
}

function filterByChannel(messages, channel) {
  return messages.filter((message) => message.app !== channel)
}
