import fs from 'fs/promises'
//TT MÓDULOS
import { getAssistantById } from '#config/assistants/assistants.mjs'
import { getEmailTemplateById } from '#config/resources/emailTemplates.mjs'
import { getMessageTemplateById } from '#config/resources/messageTemplates.mjs'
import { userRegistrationEmailFormat } from './functions/format/userRegistrationEmailFormat.mjs'
import { userRegistrationMessageFormat } from './functions/format/userRegistrationMessageFormat.mjs'
import { sendUserRegistrationEmail } from './functions/send/sendUserRegistrationEmail.mjs'
import { sendUserRegistrationWhatsapp } from './functions/send/sendUserRegistrationWhatsapp.mjs'

//TT CONSTANTES
const templatePath = './res/html/tamplates/templateUserRegistration.html'

//TT ENVIAR NOTIFICACIONES
export async function userRegistrationNotifications({ user, userIdKey, data, userRegistration }) {
  const platform = userIdKey.split('-*-')[1]
  //cargar asistentes
  const assistants = []
  for (const idAssistant of userRegistration.assistants) {
    const assistant = await getAssistantById(idAssistant)
    if (assistant && assistant.status) {
      assistants.push(assistant)
    }
  }
  if (assistants.length === 0) {
    console.warn('userRegistrationNotifications: No se encontraron asistentes para enviar la notificación')
    return true
  }

  //SS EMAIL
  if (userRegistration.channels.includes('email')) {
    console.log('enviado consulta por email')
    const emailTemplate = { suject: '', text: '', html: '' }
    //leer plantilla
    try {
      if (!userRegistration.emailTamplate) {
        emailTemplate.suject = 'Nuevo usuario registrado'
        emailTemplate.text = 'Nuevo usuario registrado'
        emailTemplate.html = await fs.readFile(templatePath, 'utf8')
      }
      //leer platilla de codigo
      else {
        const template = await getEmailTemplateById(userRegistration.emailTamplate)
        //verificar si la plantilla existe
        if (!template) {
          console.error(
            'userRegistrationNotifications: No se encontro la plantilla de email ' +
              userRegistration.emailTamplate
          )
          //asignar plantilla por defecto
          emailTemplate.suject = 'Nuevo usuario registrado'
          emailTemplate.text = 'Nuevo usuario registrado'
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

      //formatear texto
      emailTemplate.text = userRegistrationMessageFormat({
        user,
        platform,
        message: emailTemplate.text,
        data
      })
      //formatear asunto
      emailTemplate.suject = userRegistrationMessageFormat({
        user,
        platform,
        message: emailTemplate.suject,
        data
      })
      //formatear html
      emailTemplate.html = userRegistrationEmailFormat({
        user,
        platform,
        htmlTamplate: emailTemplate.html,
        data
      })

      //enviar email
      if (assistantsEmail && assistantsEmail.length > 0) {
        //enviar email
        sendUserRegistrationEmail(emailTemplate, assistantsEmail)
      } else {
        console.warn('sendRequestNotifications: No se encontraron emails para enviar la notificación')
      }
    } catch (error) {
      console.error('sendRequest: Error al leer la plantilla de email', error)
    }
  }

  //SS WHATSAPP
  if (userRegistration.channels.includes('whatsapp')) {
    console.log('enviado consulta por whatsapp')
    //leer plantilla
    const template = await getMessageTemplateById(userRegistration.messageTemplate)
    if (!template || !template.text) {
      console.error(
        'autoTagNotifications: No se encontro la plantilla de whatsapp ' + userRegistration.messageTemplate
      )
      return false
    }
    //formatear mensaje
    const message = userRegistrationMessageFormat({ user, platform, message: template.text, data })
    sendUserRegistrationWhatsapp(message, assistants)
  }
}
