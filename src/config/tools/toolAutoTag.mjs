import { ENV } from '#config/config.mjs'
//appsheet
import { loadToolAutoTag as loadToolAutoTagAppsheet } from '#apps/appsheet/config/tools/toolAutoTag.mjs'

let TOOLS = null
let TOOLS_PROMISE = null

//TT OBTENER AUTOETIQUETAS
export async function getAutoTagTool() {
  // Si ya se cargó previamente, se retorna inmediatamente
  if (TOOLS) return TOOLS

  // Si no hay una promesa en curso, se crea una
  if (!TOOLS_PROMISE) {
    if (ENV.APP_FRONTEND === 'appsheet') {
      TOOLS_PROMISE = loadToolAutoTagAppsheet('load')
    } else {
      console.error('plataforma de frontend no soportada')
      return null
    }
  }

  // Se espera a que se resuelva la promesa y se almacena el resultado
  TOOLS = await TOOLS_PROMISE
  return TOOLS
}

//TT OBTENER AUTOETIQUETAS POR ID
export async function getAutoTagToolById(autoTagId) {
  const toolAutoTag = await getAutoTagTool()
  if (!toolAutoTag) {
    return null
  }
  const autoTag = toolAutoTag.find((obj) => obj.id === autoTagId)
  if (!autoTag) {
    return null
  }
  return autoTag
}

//TT ACTUALIZAR AUTOETIQUETAS
export function setAutoTagTool(obj) {
  TOOLS = obj
  // Se actualiza también la promesa para que futuras llamadas la utilicen
  TOOLS_PROMISE = Promise.resolve(obj)
  return obj
}
