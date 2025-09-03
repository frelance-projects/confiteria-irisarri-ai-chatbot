import { addToQueue } from '#utilities/queuedExecution.mjs'
import { updateAppointment, loadAppointmentById } from '#config/data/appointment.mjs'
import { getAutoAppointmentToolById } from '#config/tools/toolAppointment.mjs'

import { getRandomDelay } from '#utilities/dateFunctions/time.mjs'
import { getWaTemplatesById } from '#config/resources/waTemplates.mjs'
import { reminderWaTemplate } from '../format/reminderWaTemplate.mjs'
import { sentNotificationTemplate } from '#provider/whatsapp-meta/templates/sentNotificationTemplate.mjs'

export async function sendWhatsappMeta(user, appointment, agendaAppointment, toolAppointment) {
  if (!user || !appointment || !agendaAppointment || !toolAppointment) {
    console.error('sendWhatsapp: Missing parameters')
    return false
  }
  if (!user.whatsapp || !user.whatsapp.id) {
    console.warn('sendWhatsapp: Missing whatsapp id')
    return false
  }
  addToQueue(
    {
      data: { user, appointment, agendaAppointment, toolAppointment },
      callback: sendTemplate,
      delay: 5 * 60 * 1000 + getRandomDelay(120000)
    },
    'sendWaTemplateMeta'
  )
}

async function sendTemplate({ user, appointment, agendaAppointment, toolAppointment }) {
  const template = await getWaTemplatesById(toolAppointment.reminderTemplateId)
  if (!template || !template.name || !template.language) {
    console.error(
      'sendTemplate: Error al cargar la plantilla de mensaje: ',
      toolAppointment.reminderTemplateId
    )
    return false
  }
  const parameters = reminderWaTemplate(
    template,
    user,
    agendaAppointment.name,
    appointment.startDate,
    appointment.note
  )
  try {
    //refrescar datos
    const upAapointment = await loadAppointmentById(appointment.id)
    const upTolAppointment = await getAutoAppointmentToolById(toolAppointment.id)

    //enviar mensaje
    if (
      //usuario
      user.whatsapp &&
      user.whatsapp.id &&
      //cita
      upAapointment &&
      !upAapointment.reminderLogs.includes('> appointment whatsapp reminder sent') &&
      //sistema de citas
      upTolAppointment &&
      upTolAppointment.channels.includes('whatsapp') &&
      upTolAppointment.sendReminder
    ) {
      const res = await sentNotificationTemplate({
        userPhone: user.whatsapp.id,
        templateName: template.name,
        languageCode: template.language,
        parameters
      })
      if (res) {
        //actualizar logs
        upAapointment.reminderLogs = upAapointment.reminderLogs
          ? upAapointment.reminderLogs + '\n> appointment whatsapp reminder sent'
          : '> appointment whatsapp reminder sent'

        console.info(
          'sendTemplate: Recordatorio de cita enviado por whatsapp' +
            user.name +
            ' whatsapp: ' +
            user.whatsapp.id +
            ' cita: ' +
            appointment.id
        )
        updateAppointment(upAapointment)
      } else {
        console.error('Error al enviar platilla a whatsapp:', user.whatsapp.id)
      }
    }
  } catch (e) {
    console.error('Error al enviar oplatilla a whatsapp:', user.whatsapp.id)
    return false
  }
}
