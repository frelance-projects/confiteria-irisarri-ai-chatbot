//TT MÓDULOS
import { ENV } from '#config/config.mjs'
//appsheet
import { loadAssistants as loadAssistantsAppsheet } from '#apps/appsheet/config/assistants.mjs'

let ASSISTANTS = null
let PROMISE = null

//TT OBTENER ASISTENTES
export async function getAssistants() {
  // Si ya se cargó previamente, se retorna inmediatamente
  if (ASSISTANTS) return ASSISTANTS

  // Si no hay una promesa en curso, se crea una
  if (!PROMISE) {
    if (ENV.APP_FRONTEND === 'appsheet') {
      PROMISE = loadAssistantsAppsheet('load')
    } else {
      console.error('plataforma de frontend no soportada')
      return null
    }
  }

  // Se espera a que se resuelva la promesa y se almacena el resultado
  ASSISTANTS = await PROMISE
  return ASSISTANTS
}

//TT OBTENER ASISTENTE POR ID
export async function getAssistantById(assistantId) {
  const assistants = await getAssistants()
  if (!assistants) {
    return null
  }
  const assistant = assistants.find((obj) => obj.id === assistantId)
  if (!assistant) {
    return null
  }
  return assistant
}

//TT ACTUALIZAR USUARIOS
export function setAssistants(obj) {
  ASSISTANTS = obj
  // Se actualiza también la promesa para que futuras llamadas la utilicen
  PROMISE = Promise.resolve(obj)
  return obj
}
