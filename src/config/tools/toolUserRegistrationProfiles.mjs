import { ENV } from '#config/config.mjs'
//appsheet
import {
  loadUserRegistrationProfiles as loadUserRegistrationProfilesAppsheet,
  addUserRegistrationProfiles as addUserRegistrationProfilesAppsheet
} from '#apps/appsheet/config/tools/toolUserRegistrationProfiles.mjs'

let TOOLS = null
let TOOLS_PROMISE = null

//TT OBTENER PERFILES DE USUARIOS
export async function getUserRegistrationProfiles() {
  // Si ya se cargó previamente, se retorna inmediatamente
  if (TOOLS) return TOOLS

  // Si no hay una promesa en curso, se crea una
  if (!TOOLS_PROMISE) {
    if (ENV.APP_FRONTEND === 'appsheet') {
      TOOLS_PROMISE = loadUserRegistrationProfilesAppsheet('load')
    } else {
      console.error('plataforma de frontend no soportada')
      return null
    }
  }

  // Se espera a que se resuelva la promesa y se almacena el resultado
  TOOLS = await TOOLS_PROMISE
  return TOOLS
}

//TT OBTENER PERFILES DE USUARIOS POR ID
export async function getUserRegistrationProfilesById(id) {
  const tools = await getUserRegistrationProfiles()
  if (!tools) {
    return null
  }
  const tool = tools.find((obj) => obj.id === id)
  if (!tool) {
    return null
  }
  return tool
}

//TT OBTENER PERFIL DE USUARIP POR ID DE USUARIO & ID DE HERRAMIENTA
export async function getUserRegistrationProfilesByUserAndTool(userId, toolId) {
  const tools = await getUserRegistrationProfiles()
  if (!tools) {
    return null
  }
  const tool = tools.find((obj) => obj.toolUserRegistration === toolId && obj.user === userId)
  if (!tool) {
    return null
  }
  return tool
}

//TT AGREGAR PERFIL NUEVO
export async function addUserRegistrationProfiles(profile) {
  if (ENV.APP_FRONTEND === 'appsheet') {
    const request = await addUserRegistrationProfilesAppsheet(profile)
    return request
  } else {
    console.error('addUserRegistrationProfiles: frontend no soportado')
    return null
  }
}

//TT ACTUALIZAR  PERFILES DE USUARIOS
export function setUserRegistrationProfiles(obj) {
  TOOLS = obj
  // Se actualiza también la promesa para que futuras llamadas la utilicen
  TOOLS_PROMISE = Promise.resolve(obj)
  return obj
}
