import { ENV } from '#config/config.mjs'
//appsheet
import { loadToolFollowUpMessages as loadToolFollowUpMessagesAppsheet } from '#apps/appsheet/config/tools/toolFollowUpMessages.mjs'

let TOOLS = null
let TOOLS_PROMISE = null

//TT OBTENER SEGUIMIENTO DE MENSAJES
export async function getFollowUpMessages() {
  // Si ya se cargó previamente, se retorna inmediatamente
  if (TOOLS) return TOOLS

  // Si no hay una promesa en curso, se crea una
  if (!TOOLS_PROMISE) {
    if (ENV.APP_FRONTEND === 'appsheet') {
      TOOLS_PROMISE = loadToolFollowUpMessagesAppsheet('load')
    } else {
      console.error('plataforma de frontend no soportada')
      return null
    }
  }

  // Se espera a que se resuelva la promesa y se almacena el resultado
  TOOLS = await TOOLS_PROMISE
  return TOOLS
}

//TT OBTENER SEGUIMIENTO DE MENSAJES POR ID
export async function getFollowUpMessagesById(id) {
  const followUps = await getFollowUpMessages()
  if (!followUps) {
    return null
  }
  const tool = followUps.find((obj) => obj.id === id)
  if (!tool) {
    return null
  }
  return tool
}

//TT ACTUALIZAR SEGUIMIENTO DE MENSAJES
export function setFollowUpMessages(obj) {
  TOOLS = obj
  // Se actualiza también la promesa para que futuras llamadas la utilicen
  TOOLS_PROMISE = Promise.resolve(obj)
  return obj
}
