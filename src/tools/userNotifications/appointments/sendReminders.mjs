import { ENV } from '#config/config.mjs'
import { loadAppointments } from '#config/data/appointment.mjs'
import { getUserById } from '#config/users/users.mjs'
import { sendEmail } from './functions/sendRemndersChannels/sendEmail.mjs'
import { sendWhatsappBaileys } from './functions/sendRemndersChannels/sendWhatsappBaileys.mjs'
import { sendWhatsappMeta } from './functions/sendRemndersChannels/sendWhatsappMeta.mjs'

export async function sendReminders(toolAppointment, agendas) {
  //crear fecha de recordatorio
  const today = new Date()
  const reminderDate = new Date(today)
  reminderDate.setHours(reminderDate.getHours() + toolAppointment.reminderTime)

  //cargar citas
  const appointments = await loadAppointments(today, reminderDate, null)

  if (!appointments || appointments.length === 0) {
    console.log('todas las citas ya han sido recordadas')
    return
  }

  //enviar recordatorios
  for (const appointment of appointments) {
    //agenda
    const agendaAppointment = agendas.find((agenda) => agenda.id === appointment.agenda)
    if (!agendaAppointment) {
      console.log(`No se encontro la agenda de la cita: ${appointment.id}`)
      continue
    }
    //usuario
    const user = await getUserById(appointment.user)
    if (!user) {
      console.log(`No se encontro el usuario de la cita: ${appointment.id}`)
      continue
    }

    //ss email
    if (toolAppointment.reminderChannel === 'email') {
      console.info('enviar recordatorio por email')
      //comprobar email
      if (!user.email) {
        console.log(`No se encontro el email del usuario: ${appointment.user}`)
      }
      //comprobar si ya se envio el recordatorio
      else if (appointment.reminderLogs.includes('> appointment email reminder sent')) {
        console.log(
          `El recordatorio de la cita por email ya fue enviado al usuario: ${appointment.user} cita: ${appointment.id}`
        )
      }
      //enviar
      else {
        sendEmail(user, appointment, agendaAppointment, toolAppointment)
      }
    }
    //ss whatsapp
    else if (toolAppointment.reminderChannel === 'whatsapp') {
      //comprobar whatsapp
      if (!user.whatsapp || !user.whatsapp.id) {
        console.warn(`No se encontro el whatsapp del usuario: ${appointment.user}`)
        continue
      }
      //comprobar si ya se envio el recordatorio
      if (appointment.reminderLogs.includes('> appointment whatsapp reminder sent')) {
        console.log(
          `El recordatorio de la cita por whatsapp ya fue enviado al usuario: ${appointment.user} cita: ${appointment.id}`
        )
        continue
      }
      //baileys
      if (ENV.PROV_WHATSAPP === 'baileys') {
        console.info('enviar recordatorio por whatsapp baileys')
        sendWhatsappBaileys(user, appointment, agendaAppointment, toolAppointment)
      }
      //meta
      else if (ENV.PROV_WHATSAPP === 'meta') {
        console.info('enviar recordatorio por whatsapp meta')
        sendWhatsappMeta(user, appointment, agendaAppointment, toolAppointment)
      }
    } else {
      console.error('No se encontro el canal de recordatorio')
      continue
    }
  }
}
