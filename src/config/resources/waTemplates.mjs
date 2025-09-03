import { ENV } from '#config/config.mjs'
//appsheet
import {
  updateWaTemplates as updateWaTemplatesAppsheet,
  loadWaTemplates as loadWaTemplatesAppsheet
} from '#apps/appsheet/config/resources/waTemplates.mjs'

let TEMPLATES = null
let TEMPLATES_PROMISE = null

// TT OBTENER PLANTILLAS DE WHATSAPP
export async function updateWaTemplates(templates) {
  if (ENV.APP_FRONTEND === 'appsheet') {
    const request = await updateWaTemplatesAppsheet(templates)
    setWaTemplates(request)
    return request
  } else {
    console.error('loadAppointmentById: frontend no soportado')
    return null
  }
}

// TT OBTENER PLANTILLAS DE MENSAJES
export async function getWaTemplates() {
  // Si ya se cargó previamente, se retorna inmediatamente
  if (TEMPLATES) return TEMPLATES

  // Si no hay una promesa en curso, se crea una
  if (!TEMPLATES_PROMISE) {
    if (ENV.APP_FRONTEND === 'appsheet') {
      TEMPLATES_PROMISE = loadWaTemplatesAppsheet('load')
    } else {
      console.error('plataforma de frontend no soportada')
      return null
    }
  }

  // Se espera a que se resuelva la promesa y se almacena el resultado
  TEMPLATES = await TEMPLATES_PROMISE
  return TEMPLATES
}

//TT OBTENER PLANTILLAS DE MENSAJES POR ID
export async function getWaTemplatesById(id) {
  const messageTemplates = await getWaTemplates()
  if (!messageTemplates) {
    return null
  }
  const template = messageTemplates.find((obj) => obj.id === id)
  if (!template) {
    return null
  }
  return template
}

//TT ACTUALIZAR PLANTILLAS DE MENSAJES
export function setWaTemplates(obj) {
  TEMPLATES = obj
  // Se actualiza también la promesa para que futuras llamadas la utilicen
  TEMPLATES_PROMISE = Promise.resolve(obj)
  return obj
}
