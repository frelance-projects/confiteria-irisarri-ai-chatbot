import fs from 'fs/promises'
//TT MÓDULOS
import { ENV } from '#config/config.mjs'
import { getAssistantById } from '#config/assistants/assistants.mjs'
import { appointmentMessageFormat } from './functions/format/appointmentMessageFormat.mjs'
import { appointmentEmailFormat } from './functions/format/appointmentEmailFormat.mjs'
import { appointmentWaTemplate } from './functions/format/appointmentWaTemplate.mjs'
import { sendAppointmentEmail } from './functions/send/sendAppointmentEmail.mjs'
import { sendAppointmentWhatsappBaileys } from './functions/send/sendAppointmentWhatsappBaileys.mjs'
import { sendAppointmentWhatsappMeta } from './functions/send/sendAppointmentWhatsappMeta.mjs'
import { buildIcs } from './functions/buildIcs.mjs'
import { getEmailTemplateById } from '#config/resources/emailTemplates.mjs'
import { getMessageTemplateById } from '#config/resources/messageTemplates.mjs'
import { getWaTemplatesById } from '#config/resources/waTemplates.mjs'

//TT CONSTANTES
const templatePath = './res/html/tamplates/templateAppointment.html'

export async function addAppointmentNotifications(
  user,
  userIdKey,
  agenda,
  toolAppointment,
  appointment,
  data
) {
  //verificar parametros
  const platform = userIdKey.split('-*-')[1]

  //cargar asistentes
  const assistants = []
  for (const idAssistant of agenda.assistants) {
    const assistant = await getAssistantById(idAssistant)
    if (assistant && assistant.status) {
      assistants.push(assistant)
    }
  }
  if (assistants.length === 0) {
    console.warn('addAppointmentNotifications: No se encontraron asistentes para enviar la notificación')
    return true
  }

  //SS EMAIL
  if (toolAppointment.channels.includes('email')) {
    console.info('enviado notificacion de cita por email')
    const emailTemplate = { suject: '', text: '', html: '' }
    //leer plantilla
    try {
      if (!toolAppointment.emailTamplate) {
        emailTemplate.suject = 'Nueva cita con usuario {agenda}'
        emailTemplate.text = 'Nueva cita con usuario {agenda}'
        emailTemplate.html = await fs.readFile(templatePath, 'utf8')
      }
      //leer platilla de codigo
      else {
        const template = await getEmailTemplateById(toolAppointment.emailTamplate)
        //verificar si la plantilla existe
        if (!template) {
          console.error(
            'addAppointmentNotifications: No se encontro la plantilla de email ' +
              toolAppointment.emailTamplate
          )
          //asignar plantilla por defecto
          emailTemplate.suject = 'Nueva cita con usuario {agenda}'
          emailTemplate.text = 'Nueva cita con usuario {agenda}'
          emailTemplate.html = await fs.readFile(templatePath, 'utf8')
        }
        //asignar plantilla
        else {
          emailTemplate.suject = template.suject
          emailTemplate.text = template.text
          emailTemplate.html = template.html
        }
      }
      //formatear asunto
      emailTemplate.suject = appointmentMessageFormat(
        user,
        platform,
        emailTemplate.suject,
        agenda.name,
        appointment.startDate,
        data,
        appointment.reminderLogs ? appointment.reminderLogs.split('\n') : [],
        appointment.updateLogs ? appointment.updateLogs.split('\n') : [],
        appointment.note ? appointment.note : ''
      )
      //formatear texto
      emailTemplate.text = appointmentMessageFormat(
        user,
        platform,
        emailTemplate.text,
        agenda.name,
        appointment.startDate,
        data,
        appointment.reminderLogs ? appointment.reminderLogs.split('\n') : [],
        appointment.updateLogs ? appointment.updateLogs.split('\n') : [],
        appointment.note ? appointment.note : ''
      )
      //formatear email
      emailTemplate.html = appointmentEmailFormat(
        user,
        platform,
        emailTemplate.html,
        agenda.name,
        appointment.startDate,
        data,
        appointment.reminderLogs ? appointment.reminderLogs.split('\n') : [],
        appointment.updateLogs ? appointment.updateLogs.split('\n') : [],
        appointment.note ? appointment.note : ''
      )
      //filtrar emails
      const assistantsEmail = assistants
        .map((assistant) => assistant.email)
        .filter((email) => email !== '' && email !== null && email !== undefined)

      //enviar email
      if (assistantsEmail && assistantsEmail.length > 0) {
        //enviar email
        const ics = buildIcs(user, agenda, appointment)
        sendAppointmentEmail(emailTemplate, assistantsEmail, ics)
        console.info('Email enviado')
      } else {
        console.warn('sendRequestNotifications: No se encontraron emails para enviar la notificación')
      }
    } catch (error) {
      console.error('sendRequest: Error al leer la plantilla de email', error)
    }
  }

  //SS WHATSAPP
  if (toolAppointment.channels.includes('whatsapp')) {
    //baileys
    if (ENV.PROV_WHATSAPP === 'baileys') {
      console.info('enviado notificacion de cita por whatsapp con baileys')
      const messageTemplate = await getMessageTemplateById(toolAppointment.messageTemplate)
      if (!messageTemplate || !messageTemplate.text) {
        console.error(
          'addAppointmentNotifications: No se encontro la plantilla de whatsapp ' +
            toolAppointment.messageTemplate
        )
        return false
      }
      //formatear mensaje
      const message = appointmentMessageFormat(
        user,
        platform,
        messageTemplate.text,
        agenda.name,
        appointment.startDate,
        data,
        appointment.reminderLogs ? appointment.reminderLogs.split('\n') : [],
        appointment.updateLogs ? appointment.updateLogs.split('\n') : [],
        appointment.note ? appointment.note : ''
      )
      sendAppointmentWhatsappBaileys(message, assistants)
    }
    //meta
    else if (ENV.PROV_WHATSAPP === 'meta') {
      console.info('enviado notificacion de cita por whatsapp con meta')
      const template = await getWaTemplatesById(toolAppointment.tamplateId)
      if (!template || !template.name || !template.language) {
        console.error('addAppointmentNotifications: Error al cargar la plantilla de WhatsApp Meta')
        return false
      }
      const parameters = appointmentWaTemplate(
        template,
        user,
        platform,
        agenda.name,
        appointment.startDate,
        data,
        appointment.reminderLogs ? appointment.reminderLogs.split('\n') : [],
        appointment.updateLogs ? appointment.updateLogs.split('\n') : [],
        appointment.note ? appointment.note : ''
      )

      sendAppointmentWhatsappMeta(template, assistants, parameters)
    }
  }
}
