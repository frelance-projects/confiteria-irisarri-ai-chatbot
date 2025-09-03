import { ENV } from '#config/config.mjs'
//appsheet
import { loadToolSendRequestTags as loadToolSendRequestTagsAppsheet } from '#apps/appsheet/config/tools/toolSendRequestTags.mjs'

let TOOLS = null
let TOOLS_PROMISE = null

//TT OBTENER ETIQUETAS DE SOLICITUD
export async function getToolSendRequestTags() {
  // Si ya se cargó previamente, se retorna inmediatamente
  if (TOOLS) return TOOLS

  // Si no hay una promesa en curso, se crea una
  if (!TOOLS_PROMISE) {
    if (ENV.APP_FRONTEND === 'appsheet') {
      TOOLS_PROMISE = loadToolSendRequestTagsAppsheet('load')
    } else {
      console.error('plataforma de frontend no soportada')
      return null
    }
  }

  // Se espera a que se resuelva la promesa y se almacena el resultado
  TOOLS = await TOOLS_PROMISE
  return TOOLS
}

//TT OBTENER ETIQUETAS DE SOLICITUD
export async function getToolSendRequestTagsById(tagId) {
  const toolSendRequestTags = await getToolSendRequestTags()
  if (!toolSendRequestTags) {
    return null
  }
  const tag = toolSendRequestTags.find((obj) => obj.id === tagId)
  if (!tag) {
    return null
  }
  return tag
}

//TT ACTUALIZAR ETIQUEAS DE SOLICITUD
export function setToolSendRequestTags(obj) {
  TOOLS = obj
  // Se actualiza también la promesa para que futuras llamadas la utilicen
  TOOLS_PROMISE = Promise.resolve(obj)
  return obj
}
