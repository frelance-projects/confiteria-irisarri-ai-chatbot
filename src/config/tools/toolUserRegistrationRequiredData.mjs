import { ENV } from '#config/config.mjs'
//appsheet
import { loadUserRegistrationRequiredData as loadUserRegistrationRequiredDataAppsheet } from '#apps/appsheet/config/tools/toolUserRegistrationRequiredData.mjs'

let TOOLS = null
let TOOLS_PROMISE = null

//TT OBTENER DATOS REQUERIDOS PARA EL REGISTRO DE USUARIOS
export async function getUserRegistrationRequiredData() {
  // Si ya se cargó previamente, se retorna inmediatamente
  if (TOOLS) return TOOLS

  // Si no hay una promesa en curso, se crea una
  if (!TOOLS_PROMISE) {
    if (ENV.APP_FRONTEND === 'appsheet') {
      TOOLS_PROMISE = loadUserRegistrationRequiredDataAppsheet('load')
    } else {
      console.error('plataforma de frontend no soportada')
      return null
    }
  }

  // Se espera a que se resuelva la promesa y se almacena el resultado
  TOOLS = await TOOLS_PROMISE
  return TOOLS
}

//TT OBTENER DATOS REQUERIDOS PARA EL REGISTRO DE USUARIOS POR ID
export async function getUserRegistrationRequiredDataById(id) {
  const tools = await getUserRegistrationRequiredData()
  if (!tools) {
    return null
  }
  const tool = tools.find((obj) => obj.id === id)
  if (!tool) {
    return null
  }
  return tool
}

//TT OBTENER DATOS REQUERIDOS POR SISTEMA
export async function getUserRegistrationRequiredDataByTool(toolId) {
  const tools = await getUserRegistrationRequiredData()
  if (!tools) {
    return null
  }
  const tool = tools.filter((obj) => obj.toolUserRegistration === toolId)
  return tool
}

//TT ACTUALIZAR  DATOS REQUERIDOS PARA EL REGISTRO DE USUARIOS
export function SetUserRegistrationRequiredData(obj) {
  TOOLS = obj
  // Se actualiza también la promesa para que futuras llamadas la utilicen
  TOOLS_PROMISE = Promise.resolve(obj)
  return obj
}
