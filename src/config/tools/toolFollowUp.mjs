import { ENV } from '#config/config.mjs'
//appsheet
import { loadToolFollowUp as loadToolFollowUpAppsheet } from '#apps/appsheet/config/tools/toolFollowUp.mjs'

let TOOLS = null
let TOOLS_PROMISE = null

//TT OBTENER SEGUIMIENTO
export async function getFollowUps() {
  // Si ya se cargó previamente, se retorna inmediatamente
  if (TOOLS) return TOOLS

  // Si no hay una promesa en curso, se crea una
  if (!TOOLS_PROMISE) {
    if (ENV.APP_FRONTEND === 'appsheet') {
      TOOLS_PROMISE = loadToolFollowUpAppsheet('load')
    } else {
      console.error('plataforma de frontend no soportada')
      return null
    }
  }

  // Se espera a que se resuelva la promesa y se almacena el resultado
  TOOLS = await TOOLS_PROMISE
  return TOOLS
}

//TT OBTENER SEGUIMIENTO POR ID
export async function getFollowUpByTag(tagId) {
  const followUps = await getFollowUps()
  if (!followUps) {
    return null
  }
  const tool = followUps.find((obj) => obj.tag === tagId)
  if (!tool) {
    return null
  }
  return tool
}

//TT ACTUALIZAR SEGUIMIENTO
export function setFollowUp(obj) {
  TOOLS = obj
  // Se actualiza también la promesa para que futuras llamadas la utilicen
  TOOLS_PROMISE = Promise.resolve(obj)
  return obj
}
