import { ENV } from '#config/config.mjs'
//appsheet
import { loadMessageTemplates as loadMessageTemplatesAppsheet } from '#apps/appsheet/config/resources/messageTemplates.mjs'

let TEMPLATES = null
let TEMPLATES_PROMISE = null

// TT OBTENER PLANTILLAS DE MENSAJES
export async function getMessageTemplates() {
  // Si ya se cargó previamente, se retorna inmediatamente
  if (TEMPLATES) return TEMPLATES

  // Si no hay una promesa en curso, se crea una
  if (!TEMPLATES_PROMISE) {
    if (ENV.APP_FRONTEND === 'appsheet') {
      TEMPLATES_PROMISE = loadMessageTemplatesAppsheet('load')
    } else {
      console.error('plataforma de frontend no soportada')
      return null
    }
  }

  // Se espera a que se resuelva la promesa y se almacena el resultado
  TEMPLATES = await TEMPLATES_PROMISE
  return TEMPLATES
}

export async function getMessageTemplateById(appointmentId) {
  //TT OBTENER PLANTILLAS DE MENSAJES POR ID
  const messageTemplates = await getMessageTemplates()
  if (!messageTemplates) {
    return null
  }
  const template = messageTemplates.find((obj) => obj.id === appointmentId)
  if (!template) {
    return null
  }
  return template
}

//TT ACTUALIZAR PLANTILLAS DE MENSAJES
export function setMessagelTemplates(obj) {
  TEMPLATES = obj
  // Se actualiza también la promesa para que futuras llamadas la utilicen
  TEMPLATES_PROMISE = Promise.resolve(obj)
  return obj
}
