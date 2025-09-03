import { ENV } from '#config/config.mjs'
//appsheet
import {
  loadUserRegistrationProfilesData as loadUserRegistrationProfilesDataAppsheet,
  addUserRegistrationProfilesData as addUserRegistrationProfilesDataAppsheet
} from '#apps/appsheet/config/tools/toolUserRegistrationProfilesData.mjs'

let TOOLS = null
let TOOLS_PROMISE = null

//TT OBTENER DATOS DE PERFILES DE USUARIOS
export async function getUserRegistrationProfilesData() {
  // Si ya se cargó previamente, se retorna inmediatamente
  if (TOOLS) return TOOLS

  // Si no hay una promesa en curso, se crea una
  if (!TOOLS_PROMISE) {
    if (ENV.APP_FRONTEND === 'appsheet') {
      TOOLS_PROMISE = loadUserRegistrationProfilesDataAppsheet('load')
    } else {
      console.error('plataforma de frontend no soportada')
      return null
    }
  }

  // Se espera a que se resuelva la promesa y se almacena el resultado
  TOOLS = await TOOLS_PROMISE
  return TOOLS
}

//TT OBTENER DATOS DE PERFILES DE USUARIOS POR ID
export async function getUserRegistrationProfilesDataById(id) {
  const tools = await getUserRegistrationProfilesData()
  if (!tools) {
    return null
  }
  const tool = tools.find((obj) => obj.id === id)
  if (!tool) {
    return null
  }
  return tool
}

//TT AGREGAR DATOS NUEVOS
export async function addUserRegistrationProfilesData(profileData) {
  if (ENV.APP_FRONTEND === 'appsheet') {
    const request = await addUserRegistrationProfilesDataAppsheet(profileData)
    return request
  } else {
    console.error('plataforma de frontend no soportada')
    return null
  }
}

//TT ACTUALIZAR DATOS DE PERFILES DE USUARIOS
export function setUserRegistrationProfilesData(obj) {
  TOOLS = obj
  // Se actualiza también la promesa para que futuras llamadas la utilicen
  TOOLS_PROMISE = Promise.resolve(obj)
  return obj
}
