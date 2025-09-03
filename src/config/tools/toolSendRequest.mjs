import { ENV } from '#config/config.mjs'
//appsheet
import { loadToolSendRequest as loadToolSendRequestAppsheet } from '#apps/appsheet/config/tools/toolSendRequest.mjs'

let TOOLS = null
let TOOLS_PROMISE = null

//TT OBTENER SOLICITUDES DE ENVIO
export async function getSendRequestTool() {
  // Si ya se cargó previamente, se retorna inmediatamente
  if (TOOLS) return TOOLS

  // Si no hay una promesa en curso, se crea una
  if (!TOOLS_PROMISE) {
    if (ENV.APP_FRONTEND === 'appsheet') {
      TOOLS_PROMISE = loadToolSendRequestAppsheet('load')
    } else {
      console.error('plataforma de frontend no soportada')
      return null
    }
  }

  // Se espera a que se resuelva la promesa y se almacena el resultado
  TOOLS = await TOOLS_PROMISE
  return TOOLS
}

//TT OBTENER SOLICITUD DE ENVIO POR ID
export async function getSendRequestToolById(sendRequestId) {
  const toolSendRequest = await getSendRequestTool()
  if (!toolSendRequest) {
    return null
  }
  const tool = toolSendRequest.find((obj) => obj.id === sendRequestId)
  if (!tool) {
    return null
  }
  return tool
}

//TT ACTUALIZAR SOLICITUDES DE ENVIO
export function setSendRequestConfig(obj) {
  TOOLS = obj
  // Se actualiza también la promesa para que futuras llamadas la utilicen
  TOOLS_PROMISE = Promise.resolve(obj)
  return obj
}
