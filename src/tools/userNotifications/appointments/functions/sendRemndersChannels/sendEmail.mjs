import fs from 'fs/promises'
import { reminderEmailFormat } from '../format/reminderEmailFormat.mjs'
import { buildIcs } from '../buildIcs.mjs'
import { sendEmailWithIcs } from '#utilities/sendEmail/sendEmail.mjs'
import { updateAppointment } from '#config/data/appointment.mjs'
import { addToQueue } from '#utilities/queuedExecution.mjs'
import { reminderMessageFormat } from '../format/reminderMessageFormat.mjs'
import { getEmailTemplateById } from '#config/resources/emailTemplates.mjs'
import { isProductionEnv } from '#config/config.mjs'
import { getRandomDelay } from '#utilities/dateFunctions/time.mjs'

//TT CONSTANTES
const templatePath = './res/html/tamplates/templateReminderAppointment.html'

export async function sendEmail(user, appointment, agendaAppointment, toolAppointment) {
  if (!user || !appointment || !agendaAppointment || !toolAppointment) {
    console.error('sendEmail: Missing parameters')
    return false
  }
  //agregar a cola
  addToQueue(
    {
      data: { user, appointment, agendaAppointment, toolAppointment },
      callback: sendEmailQueue,
      delay: 20 * 1000 + getRandomDelay(5000)
    },
    'sendEmail'
  )
  console.info('sendEmail: Mensaje agregado a la cola para enviar por email')
}

//SS ENVIAR EMAIL
async function sendEmailQueue({ user, appointment, agendaAppointment, toolAppointment }) {
  if (!user || !appointment || !agendaAppointment || !toolAppointment) {
    console.error('sendEmail: Missing parameters')
    return false
  }
  const emailTemplate = { suject: '', text: '', html: '' }
  //leer plantilla
  try {
    if (!toolAppointment.reminderEmailTamplate) {
      emailTemplate.suject = 'Recordatorio de cita {agenda}'
      emailTemplate.text = 'Recordatorio de cita {agenda}'
      emailTemplate.html = await fs.readFile(templatePath, 'utf8')
    }
    //leer platilla de codigo
    else {
      const template = await getEmailTemplateById(toolAppointment.reminderEmailTamplate)
      if (!template) {
        console.error(
          'sendEmail: No se encontro la plantilla de email ' + toolAppointment.reminderEmailTamplate
        )
        //asignar plantilla por defecto
        emailTemplate.suject = 'Recordatorio de cita {agenda}'
        emailTemplate.text = 'Recordatorio de cita {agenda}'
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
    emailTemplate.suject = reminderMessageFormat(
      user,
      emailTemplate.suject,
      agendaAppointment.name,
      appointment.startDate,
      appointment.note
    )

    //formatear mensaje
    emailTemplate.text = reminderMessageFormat(
      user,
      emailTemplate.text,
      agendaAppointment.name,
      appointment.startDate,
      appointment.note
    )

    //formatear email
    emailTemplate.html = reminderEmailFormat(
      user,
      emailTemplate.html,
      agendaAppointment.name,
      appointment.startDate,
      appointment.note
    )

    const ics = buildIcs(user, agendaAppointment, appointment)

    if (!isProductionEnv()) {
      console.log('sendEmail: No se ejecuta en desarrollo')
      return
    }

    const res = await sendEmailWithIcs(
      user.email,
      emailTemplate.suject,
      emailTemplate.text,
      emailTemplate.html,
      ics
    )
    if (res) {
      //actualizar logs
      appointment.reminderLogs = appointment.reminderLogs
        ? appointment.reminderLogs + '\n> appointment email reminder sent'
        : '> appointment email reminder sent'

      console.info(
        'sendEmail: Recordatorio de cita enviado por email' +
          user.name +
          ' email: ' +
          user.email +
          ' cita: ' +
          appointment.id
      )
      await updateAppointment(appointment)
      return res
    } else {
      console.error('sendEmail: Error al enviar recordatorio de cita por email')
      return null
    }
  } catch (error) {
    console.error('sendRequest: Error al leer la plantilla de email', error)
    return null
  }
}
