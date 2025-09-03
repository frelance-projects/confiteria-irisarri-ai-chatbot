import { ENV } from '#config/config.mjs'
//appsheet
import { loadUserRegistration as loadUserRegistrationAppsheet } from '#apps/appsheet/config/tools/toolUserRegistration.mjs'

let TOOLS = null
let TOOLS_PROMISE = null

//TT OBTENER SISTEMA DE REGISTRO DE USUARIOS
export async function getUserRegistration() {
  // Si ya se cargó previamente, se retorna inmediatamente
  if (TOOLS) return TOOLS

  // Si no hay una promesa en curso, se crea una
  if (!TOOLS_PROMISE) {
    if (ENV.APP_FRONTEND === 'appsheet') {
      TOOLS_PROMISE = loadUserRegistrationAppsheet('load')
    } else {
      console.error('plataforma de frontend no soportada')
      return null
    }
  }

  // Se espera a que se resuelva la promesa y se almacena el resultado
  TOOLS = await TOOLS_PROMISE
  return TOOLS
}

//TT OBTENER SISTEMA DE REGISTRO DE USUARIOS POR ID
export async function getUserRegistrationById(id) {
  const tools = await getUserRegistration()
  if (!tools) {
    return null
  }
  const tool = tools.find((obj) => obj.id === id)
  if (!tool) {
    return null
  }
  return tool
}

//TT ACTUALIZAR SISTEMA DE REGISTRO DE USUARIOS
export function setUserRegistration(obj) {
  TOOLS = obj
  // Se actualiza también la promesa para que futuras llamadas la utilicen
  TOOLS_PROMISE = Promise.resolve(obj)
  return obj
}
