import fs from 'fs/promises'
//TT MÓDULOS
import { ENV } from '#config/config.mjs'
import { getAppointmentAgendasToolById } from '#config/tools/toolAppointmentAgendas.mjs'
import { getAssistantById } from '#config/assistants/assistants.mjs'
import { getAppointmentDataByAppointmentId } from '#config/data/appointmentData.mjs'
import { appointmentEmailFormat } from './functions/format/appointmentEmailFormat.mjs'
import { appointmentWaTemplate } from './functions/format/appointmentWaTemplate.mjs'
import { sendAppointmentEmail } from './functions/send/sendAppointmentEmail.mjs'
import { appointmentMessageFormat } from './functions/format/appointmentMessageFormat.mjs'
import { sendAppointmentWhatsappBaileys } from './functions/send/sendAppointmentWhatsappBaileys.mjs'
import { sendAppointmentWhatsappMeta } from './functions/send/sendAppointmentWhatsappMeta.mjs'
import { getEmailTemplateById } from '#config/resources/emailTemplates.mjs'
import { getMessageTemplateById } from '#config/resources/messageTemplates.mjs'
import { getWaTemplatesById } from '#config/resources/waTemplates.mjs'

//TT CONSTANTES
const templatePath = './res/html/tamplates/templateCancelAppointment.html'

export async function cancelAppointmentNotifications(user, userIdKey, appointment, toolAppointment) {
  //verificar parametros
  const platform = userIdKey.split('-*-')[1]

  //verificar si la herramienta de appointment tiene agendar
  if (toolAppointment.notifyAgendas.length === 0) {
    console.warn('cancelAppointmentNotifications: No hay agendas para notificar')
    return false
  }

  //cargar agenda
  const agenda = await getAppointmentAgendasToolById(appointment.agenda)
  if (!agenda) {
    console.warn('cancelAppointmentNotifications: No se encontró la agenda')
    return false
  }

  //verificar si la agenda está configurada para notificar
  if (!toolAppointment.notifyAgendas.includes(agenda.id)) {
    console.info('cancelAppointmentNotifications: La agenda no está configurada para notificar')
    return true
  }

  //verificar si la agenda tiene asistentes
  if (agenda.assistants.length === 0) {
    console.info('cancelAppointmentNotifications: La agenda no tiene asistentes')
    return true
  }

  //cargar asistentes
  const assistants = []
  for (const idAssistant of agenda.assistants) {
    const assistant = await getAssistantById(idAssistant)
    if (assistant && assistant.status) {
      assistants.push(assistant)
    }
  }
  //verificar si hay asistentes
  if (assistants.length === 0) {
    console.info('cancelAppointmentNotifications: No se encontraron asistentes para enviar la notificación')
    return true
  }

  //cargar data
  const data = await getAppointmentDataByAppointmentId(appointment.id)
  if (!data) {
    console.error('cancelAppointmentNotifications: No se encontró la data de la cita')
    return false
  }

  //SS EMAIL
  if (toolAppointment.cancelChannels.includes('email')) {
    console.log('enviado notificacion de cita por email')
    const emailTemplate = { suject: '', text: '', html: '' }
    //leer plantilla
    try {
      if (!toolAppointment.cancelEmailTamplate) {
        emailTemplate.suject = 'Cita cancelada {agenda}'
        emailTemplate.text = 'Cita cancelada {agenda}'
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
          emailTemplate.suject = 'Cita cancelada {agenda}'
          emailTemplate.text = 'Cita cancelada {agenda}'
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
      //enviar email
      if (assistantsEmail && assistantsEmail.length > 0) {
        //enviar email
        sendAppointmentEmail(emailTemplate, assistantsEmail, null)
        console.info('Email enviado')
      } else {
        console.warn('sendRequestNotifications: No se encontraron emails para enviar la notificación')
      }
    } catch (error) {
      console.error('sendRequest: Error al leer la plantilla de email', error)
    }
  }

  //SS WHATSAPP
  if (toolAppointment.cancelChannels.includes('whatsapp')) {
    if (ENV.PROV_WHATSAPP === 'baileys') {
      console.log('enviado notificacion de cancelacion de cita por whatsapp con baileys')
      //leer plantilla
      const messageTemplate = await getMessageTemplateById(toolAppointment.cancelMessageTemplate)
      if (!messageTemplate || !messageTemplate.text) {
        console.error('sendRequest: No se encontró la plantilla de whatsapp')
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
      console.info('enviado notificacion de cancelacion de cita por whatsapp con meta')
      const template = await getWaTemplatesById(toolAppointment.cancelTemplateId)
      if (!template || !template.name || !template.language) {
        console.error('cancelAppointmentNotifications: Error al cargar la plantilla de WhatsApp Meta')
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
