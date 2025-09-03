import fs from 'fs/promises'
//TT MÓDULOS
import { ENV } from '#config/config.mjs'
import { requestMessageFormat } from './functions/format/requestMessageFormat.mjs'
import { requestEmailFormat } from './functions/format/requestEmailFormat.mjs'
import { requestWaTemplate } from './functions/format/requestWaTemplate.mjs'
import { getAssistantById } from '#config/assistants/assistants.mjs'
import { sendRequestEmail } from './functions/send/sendRequestEmail.mjs'
import { sendRequestWhatsappBaileys } from './functions/send/sendRequestWhatsappBaileys.mjs'
import { sendRequestWhatsappMeta } from './functions/send/sendRequestWhatsappMeta.mjs'
import { getEmailTemplateById } from '#config/resources/emailTemplates.mjs'
import { getMessageTemplateById } from '#config/resources/messageTemplates.mjs'
import { getWaTemplatesById } from '#config/resources/waTemplates.mjs'

//TT CONSTANTES
const templatePath = './res/html/tamplates/templateRequest.html'

//TT ENVIAR CONSULTA
export async function sendRequestNotifications(user, request, platform, tag, sendRequestConfig) {
  if (tag.assistants.length === 0) {
    console.warn('sendRequestNotifications: No se encontraron asistentes para enviar la notificación')
    return true
  }
  const assistants = []
  for (const idAssistant of tag.assistants) {
    const assistant = await getAssistantById(idAssistant)
    if (assistant && assistant.status) {
      assistants.push(assistant)
    }
  }
  if (assistants.length === 0) {
    console.warn('sendRequestNotifications: No se encontraron asistentes para enviar la notificación')
    return true
  }

  //SS EMAIL
  if (sendRequestConfig.channels.includes('email')) {
    console.info('enviado consulta por email')
    const emailTemplate = { suject: '', text: '', html: '' }
    //leer plantilla
    try {
      if (!sendRequestConfig.emailTamplate) {
        emailTemplate.suject = 'Nueva solicitud {tag}'
        emailTemplate.text = 'Nueva solicitud {tag}'
        emailTemplate.html = await fs.readFile(templatePath, 'utf8')
      }
      //leer platilla de codigo
      else {
        const template = await getEmailTemplateById(sendRequestConfig.emailTamplate)
        //verificar si la plantilla existe
        if (!template) {
          console.error(
            'addAppointmentNotifications: No se encontro la plantilla de email ' +
              sendRequestConfig.emailTamplate
          )
          //asignar plantilla por defecto
          emailTemplate.suject = 'Nueva solicitud {tag}'
          emailTemplate.text = 'Nueva solicitud {tag}'
          emailTemplate.html = await fs.readFile(templatePath, 'utf8')
        }
        //asignar plantilla
        else {
          emailTemplate.suject = template.suject
          emailTemplate.text = template.text
          emailTemplate.html = template.html
        }
      }
      //filtrar emails
      const assistantsEmail = assistants
        .map((assistant) => assistant.email)
        .filter((email) => email !== '' && email !== null && email !== undefined)

      //formatear asunto
      emailTemplate.suject = requestMessageFormat(user, platform, emailTemplate.suject, request, tag.name)
      //formatear mensaje
      emailTemplate.text = requestMessageFormat(user, platform, emailTemplate.text, request, tag.name)
      //formatear email
      emailTemplate.html = requestEmailFormat(user, platform, emailTemplate.html, request, tag.name)

      //enviar email
      if (assistantsEmail && assistantsEmail.length > 0) {
        //enviar email
        sendRequestEmail(emailTemplate.html, emailTemplate.text, emailTemplate.suject, assistantsEmail)
      } else {
        console.warn('sendRequestNotifications: No se encontraron emails para enviar la notificación')
      }
    } catch (error) {
      console.error('sendRequest: Error al leer la plantilla de email', error)
    }
  }

  //SS WHATSAPP
  if (sendRequestConfig.channels.includes('whatsapp')) {
    //baileys
    if (ENV.PROV_WHATSAPP === 'baileys') {
      console.info('enviado consulta por whatsapp')
      const messageTemplate = await getMessageTemplateById(sendRequestConfig.messageTemplate)
      if (!messageTemplate || !messageTemplate.text) {
        console.error('sendRequest: Error al cargar la plantilla de mensaje')
        return false
      }
      const message = requestMessageFormat(user, platform, messageTemplate.text, request, tag.name)
      sendRequestWhatsappBaileys(message, assistants, { request, tag, platform, user })
    }
    //meta
    else if (ENV.PROV_WHATSAPP === 'meta') {
      console.info('enviado consulta por whatsapp meta')
      const template = await getWaTemplatesById(sendRequestConfig.tamplateId)
      if (!template || !template.name || !template.language) {
        console.error('sendRequest: Error al cargar la plantilla de WhatsApp Meta')
        return false
      }
      const parameters = requestWaTemplate(template, user, platform, request, tag.name)
      sendRequestWhatsappMeta(template, assistants, parameters)
    } else {
      console.error('sendRequest: Proveedor de WhatsApp no soportado')
      return false
    }
  }

  //SS SMS
  if (sendRequestConfig.channels.includes('sms')) {
    //NEXT: FEATURE
    console.log('sms')
    return true
  }
  return true
}
