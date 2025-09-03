import { getAppointmentTool } from '#config/tools/toolAppointment.mjs'
import { getAppointmentAgendasToolByAppointmentToolId } from '#config/tools/toolAppointmentAgendas.mjs'
import { sendReminders } from './sendReminders.mjs'

export async function appointmentReminders() {
  //comprobar sistema de citas
  const allToolAppointments = await getAppointmentTool()
  if (!allToolAppointments || allToolAppointments.length === 0) {
    console.log('No hay sistemas de citas')
    return
  }

  //comprobar si hay sistemas de citas activos
  const activeToolAppointments = allToolAppointments.filter((toolAppointment) => toolAppointment.sendReminder)
  if (activeToolAppointments.length === 0) {
    console.log('No hay sistemas de citas activos')
    return
  }

  //enviar recordatorios
  for (const toolAppointment of activeToolAppointments) {
    //comprobar agendas
    const agendas = await getAppointmentAgendasToolByAppointmentToolId(toolAppointment.id)
    if (!agendas || agendas.length === 0) {
      console.log(`No hay agendas activas para el sistema de citas: ${toolAppointment.id}`)
      continue
    }
    //comprobar agendas activas
    const activeAgendas = agendas.filter((agenda) => toolAppointment.notifyAgendas.includes(agenda.id))
    if (activeAgendas.length === 0) {
      console.log(`No hay agendas activas para el sistema de citas: ${toolAppointment.id}`)
      continue
    }
    //enviar
    sendReminders(toolAppointment, activeAgendas)
  }
}
