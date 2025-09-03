import { isProductionEnv } from '#config/config.mjs'
import { updateAppointment } from '#config/data/appointment.mjs'
import { revertDateTime } from '#utilities/appsheetTools/formatDateTime.mjs'
import { cancelAppointmentNotifications } from './cancelAppointmentNotifications.mjs'

export async function cancelAppointment(user, userIdKey, appointment, toolAppointment) {
  //verificar si la cita puede ser cancelada
  const today = new Date()
  today.setHours(today.getHours() + toolAppointment.cancelRange)
  if (appointment.startDate < today) {
    console.info(
      'cancelAppointment: La cita no puede ser cancelada, porque el tiempo de cancelación ha pasado'
    )
    return { response: 'error: appointment cannot be canceled, because the cancel time has passed' }
  }

  //actualizar cita
  appointment.status = 'canceled'
  appointment.updateLogs = appointment.updateLogs ? appointment.updateLogs + '\n' : ''
  appointment.updateLogs += `> ${revertDateTime(new Date())}: cita cancelada por el usuario ${user.name} `
  const res = await updateAppointment(appointment)
  if (res && res.length > 0) {
    console.info('cancelAppointment: Cita cancelada')
    if (toolAppointment.cancelAppointment === 'cancel and notify') {
      if (isProductionEnv()) {
        cancelAppointmentNotifications(user, userIdKey, res[0], toolAppointment)
      } else {
        console.warn('cancelAppointmentNotifications: No se ejecuta en desarrollo')
      }
    }
    const fullDate = revertDateTime(res[0].startDate, true)
    const [date, time] = fullDate.split(' ')
    const upDate = {
      id: res[0].id,
      agendaId: res[0].agenda,
      status: res[0].status,
      date,
      time,
      note: res[0].note
    }
    return upDate
  } else {
    console.error('cancelAppointment: Error al cancelar la cita')
    return { response: 'error: error canceling appointment' }
  }
}
