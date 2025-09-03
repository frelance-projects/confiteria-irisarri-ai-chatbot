import fs from 'fs/promises'
//TT MÓDULOS
import { getAssistantById } from '#config/assistants/assistants.mjs'
import { autoTagMessageFormat } from './functions/format/autoTagMessageFormat.mjs'
import { autoTagEmailFormat } from './functions/format/autoTagEmailFormat.mjs'
import { sendAutoTagWhatsapp } from './functions/send/sendAutoTagWhatsapp.mjs'
import { sendAutoTagEmail } from './functions/send/sendAutoTagEmail.mjs'
import { getEmailTemplateById } from '#config/resources/emailTemplates.mjs'
import { getMessageTemplateById } from '#config/resources/messageTemplates.mjs'

//TT CONSTANTES
const templatePath = './res/html/tamplates/templateAutoTag.html'

//TT ENVIAR NOTIFICACIONES
export async function autoTagNotifications(user, userIdKey, tag, autoTag) {
  const platform = userIdKey.split('-*-')[1]
  //cargar asistentes
  const assistants = []
  for (const idAssistant of tag.assistants) {
    const assistant = await getAssistantById(idAssistant)
    if (assistant && assistant.status) {
      assistants.push(assistant)
    }
  }
  if (assistants.length === 0) {
    console.warn('autoTagNotifications: No se encontraron asistentes para enviar la notificación')
    return true
  }

  //SS EMAIL
  if (autoTag.channels.includes('email')) {
    console.log('enviado consulta por email')
    const emailTemplate = { suject: '', text: '', html: '' }
    //leer plantilla
    try {
      if (!autoTag.emailTamplate) {
        emailTemplate.suject = 'Nuevo usuario etiquetado {tag}'
        emailTemplate.text = 'Nuevo usuario etiquetado {tag}'
        emailTemplate.html = await fs.readFile(templatePath, 'utf8')
      }
      //leer platilla de codigo
      else {
        const template = await getEmailTemplateById(autoTag.emailTamplate)
        //verificar si la plantilla existe
        if (!template) {
          console.error(
            'addAppointmentNotifications: No se encontro la plantilla de email ' + autoTag.emailTamplate
          )
          //asignar plantilla por defecto
          emailTemplate.suject = 'Nuevo usuario etiquetado {tag}'
          emailTemplate.text = 'Nuevo usuario etiquetado {tag}'
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
      emailTemplate.suject = autoTagMessageFormat(user, platform, emailTemplate.suject, tag.name)
      //formatear texto
      emailTemplate.text = autoTagMessageFormat(user, platform, emailTemplate.text, tag.name)
      //formatear html
      emailTemplate.html = autoTagEmailFormat(user, platform, emailTemplate.html, tag.name)
      //enviar email
      if (assistantsEmail && assistantsEmail.length > 0) {
        //enviar email
        sendAutoTagEmail(emailTemplate, assistantsEmail)
      } else {
        console.warn('sendRequestNotifications: No se encontraron emails para enviar la notificación')
      }
    } catch (error) {
      console.error('sendRequest: Error al leer la plantilla de email', error)
    }
  }

  //SS WHATSAPP
  if (autoTag.channels.includes('whatsapp')) {
    console.log('enviado consulta por whatsapp')
    //leer plantilla
    const template = await getMessageTemplateById(autoTag.messageTemplate)
    if (!template || !template.text) {
      console.error(
        'autoTagNotifications: No se encontro la plantilla de whatsapp ' + autoTag.messageTemplate
      )
      return false
    }
    //formatear mensaje
    const message = autoTagMessageFormat(user, platform, template.text, tag.name)
    sendAutoTagWhatsapp(message, assistants, { tag, platform, user })
  }
}
