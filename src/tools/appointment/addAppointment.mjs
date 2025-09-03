import { isProductionEnv } from '#config/config.mjs'
import { createIdNumber } from '#utilities/createId.mjs'
import { addAppointment as addNewAppointment, loadAppointments } from '#config/data/appointment.mjs'
import { addAppointmentData } from '#config/data/appointmentData.mjs'
import { addAppointmentNotifications } from './addAppointmentNotifications.mjs'

const week = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

export async function addAppointment(toolAppointment, agenda, date, time, data, user, userIdKey) {
  //verificar si la fecha es valida
  const [_day, _month, _year] = date.split('/').map(Number)
  const [hour, minute] = time.split(':').map(Number)

  //verificar si la fecha es valida
  const start = new Date(_year, _month - 1, _day, hour, minute)
  const end = new Date(start)
  end.setMinutes(end.getMinutes() + toolAppointment.duration)

  // Calcula la fecha de inicio y fin según los días de antelación configurados
  const initDate = new Date()
  initDate.setDate(initDate.getDate() + toolAppointment.minDaysAnticipation)
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + toolAppointment.maxDaysAnticipation)

  // Verifica si la fecha de inicio está dentro del rango de días de anticipación
  if (start < initDate || start > endDate) {
    console.log('Fuera de rango')
    return {
      error: `the dateTime is out of range, please choose another one in: ${initDate.toLocaleDateString()} to ${endDate.toLocaleDateString()} days range`
    }
  }

  const dayName = week[start.getDay()]
  const schedule = agenda.schedule[dayName]
  if (!schedule || schedule.length === 0) {
    console.log('Dia no disponible')
    return { error: 'the day is not available, please choose another one' }
  }

  //Verifica si la hora está disponible
  const timeString = time.split(':')
  if (!schedule.includes(timeString[0].padStart(2, '0') + ':' + timeString[1].padStart(2, '0'))) {
    console.log('Hora no disponible')
    return {
      error: 'the time is not available, please choose another in the schedule: ' + schedule.join(', ')
    }
  }

  // Verifica si la agenda está activa
  const minRange = new Date(_year, _month - 1, _day, 0, 0, 0, 0)
  const maxRange = new Date(_year, _month - 1, _day, 23, 59, 59, 999)

  let currentAppointments
  // Si la agenda tiene citas ilimitadas, no se cargan citas
  if (agenda.unlimitedAppointments) {
    currentAppointments = []
  }
  // Si la agenda tiene citas limitadas, se cargan las citas
  else {
    currentAppointments = await loadAppointments(minRange, maxRange, agenda.id)
  }
  if (currentAppointments.length > 0) {
    let count = 0
    for (const app of currentAppointments) {
      // Verifica si la cita está cancelada o completada
      if (app.status === 'canceled' || app.status === 'complete') {
        continue
      }
      // Verifica si la fecha y hora están ocupadas
      const startApp = new Date(app.startDate)
      const endApp = new Date(app.endDate)
      if (start < endApp && end > startApp) {
        count++
        // Verifica si la cita está ocupada
        if (count >= agenda.maxAppointments) {
          console.info('Fecha ocupada')
          return { error: 'the dateTime is already taken, please choose another one' }
        }
      }
    }
  }

  // Construye la cita
  const appointment = buildAppointment(agenda, start, end, user)
  const resAppointment = await addNewAppointment(appointment)

  // Verifica si la cita fue agregada
  if (resAppointment && resAppointment.length > 0) {
    // Verifica si hay datos adicionales
    if (!data || data.length === 0) {
      console.info('Enviando notificaciones')
      if (isProductionEnv()) {
        addAppointmentNotifications(user, userIdKey, agenda, toolAppointment, appointment, data)
      } else {
        console.warn('addAppointmentNotifications: No se ejecuta en desarrollo')
      }
      // Agrega las notificaciones
      return 'appointment added'
    }
    const newData = data.map((obj) => ({
      ...obj,
      id: 'dat-' + createIdNumber(),
      appointmentId: resAppointment[0].id
    }))

    // Agrega los datos adicionales
    const resData = await addAppointmentData(newData)
    if (resData) {
      // Agrega las notificaciones
      addAppointmentNotifications(user, userIdKey, agenda, toolAppointment, appointment, data)
      return 'appointment added'
    }
    // Error al agregar los datos adicionales
    else {
      return { error: 'error adding appointmentData' }
    }
  }

  // Error al agregar la cita
  else {
    return { error: 'error adding appointment' }
  }
}

//SS CREAR FORMATO DE CITA
function buildAppointment(agenda, start, end, user) {
  const appointment = {
    id: 'app-' + createIdNumber(),
    agenda: agenda.id,
    startDate: start,
    endDate: end,
    user: user.userId,
    status: 'pending',
    note: ''
  }
  return appointment
}
