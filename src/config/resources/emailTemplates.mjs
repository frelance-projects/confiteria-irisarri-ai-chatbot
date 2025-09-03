import { ENV } from '#config/config.mjs'
//appsheet
import { loadEmailTemplates as loadEmailTemplatesAppsheet } from '#apps/appsheet/config/resources/emailTemplates.mjs'

let TEMPLATES = null
let TEMPLATES_PROMISE = null

// TT OBTENER PLANTILLAS DE EMAIL
export async function getEmailTemplates() {
  // Si ya se cargó previamente, se retorna inmediatamente
  if (TEMPLATES) return TEMPLATES

  // Si no hay una promesa en curso, se crea una
  if (!TEMPLATES_PROMISE) {
    if (ENV.APP_FRONTEND === 'appsheet') {
      TEMPLATES_PROMISE = loadEmailTemplatesAppsheet('load')
    } else {
      console.error('plataforma de frontend no soportada')
      return null
    }
  }

  // Se espera a que se resuelva la promesa y se almacena el resultado
  TEMPLATES = await TEMPLATES_PROMISE
  return TEMPLATES
}

//TT OBTENER PLANTILLAS DE EMAIL POR ID
export async function getEmailTemplateById(templateId) {
  const emailTemplates = await getEmailTemplates()
  if (!emailTemplates) {
    return null
  }
  const template = emailTemplates.find((obj) => obj.id === templateId)
  if (!template) {
    return null
  }
  return template
}

//TT ACTUALIZAR PLANTILLAS DE EMAIL
export function setEmailTemplates(obj) {
  TEMPLATES = obj
  // Se actualiza también la promesa para que futuras llamadas la utilicen
  TEMPLATES_PROMISE = Promise.resolve(obj)
  return obj
}
