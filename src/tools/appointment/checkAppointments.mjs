import { loadAppointmentsByUser } from '#config/data/appointment.mjs'
import { revertDateTime } from '#utilities/appsheetTools/formatDateTime.mjs'

export async function checkAppointments(user) {
  const appointments = await loadAppointmentsByUser(user.userId)
  if (!appointments) {
    console.error('checkAppointments: Error al cargar las citas')
    return { error: 'error loading appointments' }
  }
  if (appointments.length === 0) {
    console.log('checkAppointments: No hay citas')
    return []
  }

  const formattedAppointments = []
  for (const appointment of appointments) {
    const fullDate = revertDateTime(appointment.startDate, true)
    const [date, time] = fullDate.split(' ')
    formattedAppointments.push({
      id: appointment.id,
      agendaId: appointment.agenda,
      status: appointment.status,
      date,
      time,
      note: appointment.note
    })
  }
  console.log('Citas cargadas', formattedAppointments)
  return formattedAppointments
}
