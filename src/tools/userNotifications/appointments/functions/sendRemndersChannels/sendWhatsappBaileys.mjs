import { providerSendMessage } from '#provider/provider.mjs'
import { addToQueue } from '#utilities/queuedExecution.mjs'
import { updateAppointment, loadAppointmentById } from '#config/data/appointment.mjs'
import { getAutoAppointmentToolById } from '#config/tools/toolAppointment.mjs'
import { sendToChannels } from '#channels/channels.mjs'
import { getMessageTemplateById } from '#config/resources/messageTemplates.mjs'
import { reminderMessageFormat } from '../format/reminderMessageFormat.mjs'
import { getRandomDelay } from '#utilities/dateFunctions/time.mjs'

export async function sendWhatsappBaileys(user, appointment, agendaAppointment, toolAppointment) {
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
      callback: sendMessage,
      delay: 5 * 60 * 1000 + getRandomDelay(120000)
    },
    'sendWhatsappBaileys'
  )
}

async function sendMessage({ user, appointment, agendaAppointment, toolAppointment }) {
  const messageTemplate = await getMessageTemplateById(toolAppointment.reminderMessageTemplate)
  if (!messageTemplate || !messageTemplate.text) {
    console.error('sendWhatsapp: Error al cargar la plantilla de mensaje')
    return false
  }
  //formatear mensaje
  const textMessage = reminderMessageFormat(
    user,
    messageTemplate.text,
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
      const res = await providerSendMessage(
        user.whatsapp.id,
        { type: 'text', text: textMessage },
        'whatsapp',
        'bot',
        'outgoing',
        'bot'
      )
      if (res) {
        sendToChannels(res)
        //actualizar logs
        upAapointment.reminderLogs = upAapointment.reminderLogs
          ? upAapointment.reminderLogs + '\n> appointment whatsapp reminder sent'
          : '> appointment whatsapp reminder sent'

        console.info(
          'sendEmail: Recordatorio de cita enviado por whatsapp' +
            user.name +
            ' whatsapp: ' +
            user.whatsapp.id +
            ' cita: ' +
            appointment.id
        )
        updateAppointment(upAapointment)
      } else {
        console.error('Error al enviar mensaje a whatsapp:', user.whatsapp.id)
      }
    }
  } catch (error) {
    console.error('Error al enviar mensaje a whatsapp:', user.whatsapp.id)
    return false
  }
}
