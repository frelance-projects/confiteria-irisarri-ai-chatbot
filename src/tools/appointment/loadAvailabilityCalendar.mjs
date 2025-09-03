import { loadAppointments } from '#config/data/appointment.mjs'

const week = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

export async function loadAvailabilityCalendar(toolAppointment, agenda, startDate, endDate) {
  // Calcula la fecha de inicio y fin según los días de antelación configurados
  const _minDate = new Date()
  _minDate.setDate(_minDate.getDate() + toolAppointment.minDaysAnticipation)
  const _maxDate = new Date()
  _maxDate.setDate(_maxDate.getDate() + toolAppointment.maxDaysAnticipation)
  _maxDate.setHours(23, 59, 59, 999)

  let start
  let end

  if (!startDate) {
    start = _minDate
  } else {
    start = startDate < _minDate ? _minDate : startDate
  }

  if (!endDate) {
    end = _maxDate
  } else {
    end = endDate > _maxDate ? _maxDate : endDate
  }

  let appointments
  // Si la agenda tiene citas ilimitadas, no se cargan citas
  if (agenda.unlimitedAppointments) {
    appointments = []
  }
  // Si la agenda tiene citas limitadas, se cargan las citas
  else {
    appointments = await loadAppointments(start, end, agenda.id)
  }

  const list = []
  const max = 100

  // Recorre cada día entre initDate y endDate (máximo 100 días)
  for (
    let date = new Date(start);
    date <= end && list.length < max; //
    date = new Date(date.setDate(date.getDate() + 1))
  ) {
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    const dayName = week[date.getDay()]
    const schedule = agenda.schedule[dayName]

    let timeAvailable = []
    let status = 'unavailable'

    if (schedule && schedule.length > 0) {
      // Filtra las citas que ocurren en el día actual
      const appointmentsForDate = appointments.filter((appointment) => {
        const start = new Date(appointment.startDate)
        const end = new Date(appointment.endDate)
        return isSameDay(start, date) || isSameDay(end, date)
      })

      // Si hay citas, calcula la disponibilidad; si no, se asume disponibilidad total
      if (appointmentsForDate.length > 0) {
        //console.log('appointmentsForDate', appointmentsForDate)
        timeAvailable = calculateAvailability(appointmentsForDate, date, toolAppointment, agenda)
      } else {
        timeAvailable = schedule
      }
      status = timeAvailable.length > 0 ? 'available' : 'unavailable'
    }

    const obj = {
      _formatDate: 'D/M/YYYY',
      _formatTime: 'HH:mm',
      date: formattedDate,
      status,
      day: week[date.getDay()],
      timeAvailable
    }
    //console.log('timeAvailable', obj)
    list.push(obj)
  }

  //console.log(list)
  return list
}

// Función auxiliar para comparar si dos fechas son el mismo día
function isSameDay(date1, date2) {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  )
}

// Función auxiliar para calcular la disponibilidad de un día
function calculateAvailability(appointments, date, toolAppointment, agenda) {
  const dayName = week[date.getDay()]
  const scheduleTimes = agenda.schedule[dayName]
  const availableTimes = []

  if (scheduleTimes && scheduleTimes.length > 0) {
    for (const time of scheduleTimes) {
      // Separa la hora y minutos (ej: "14:30")
      const [_h, _m] = time.split(':')
      // Establece el inicio del intervalo en la fecha con la hora y minutos indicados
      const timeSlotStart = new Date(date)
      timeSlotStart.setHours(Number(_h), Number(_m), 0, 0)
      // Calcula el final del intervalo sumándole la duración configurada
      const timeSlotEnd = new Date(timeSlotStart)
      timeSlotEnd.setMinutes(timeSlotEnd.getMinutes() + toolAppointment.duration)

      // Verifica si el intervalo se solapa con alguna cita existente
      let count = 0
      let isFree = true
      for (const appointment of appointments) {
        // Ignora citas canceladas o completadas
        if (appointment.status === 'canceled' || appointment.status === 'complete') {
          continue
        }
        // Verifica si el intervalo se solapa con la cita
        const appointmentStart = new Date(appointment.startDate)
        const appointmentEnd = new Date(appointment.endDate)
        if (timeSlotStart < appointmentEnd && timeSlotEnd > appointmentStart) {
          count++
          if (count >= agenda.maxAppointments) {
            isFree = false
            break
          }
        }
      }
      // Si no hay solapamientos, añade el intervalo a la lista de tiempos disponibles
      if (isFree) {
        availableTimes.push(time)
      }
    }
  }
  return availableTimes
}
