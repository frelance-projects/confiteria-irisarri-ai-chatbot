const SCHEDULE = {
  // domingo (cerrado)
  0: {
    time: [],
  },
  // lunes
  1: {
    time: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
  },
  // martes
  2: {
    time: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
  },
  // miércoles
  3: {
    time: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
  },
  // jueves
  4: {
    time: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
  },
  // viernes
  5: {
    time: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
  },
  // sábado
  6: {
    time: ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
  },
}

export async function getShippingAvailability() {
  const today = new Date()

  // usar hora local sin zona horaria
  console.log('Fecha de hoy:', today.toLocaleString())

  // obtener los siguientes 7 días (omitiendo hoy) con formato YYYY-MM-DD HH:mm
  const availability = []
  for (let i = 1; i < 8; i++) {
    const nextDay = new Date(today)
    nextDay.setDate(today.getDate() + i)
    
    // Formatear fecha usando hora local en lugar de UTC
    const year = nextDay.getFullYear()
    const month = String(nextDay.getMonth() + 1).padStart(2, '0')
    const day = String(nextDay.getDate()).padStart(2, '0')
    const formattedDate = `${year}-${month}-${day}`
    
    const times = SCHEDULE[nextDay.getDay()].time
    times.forEach((time) => {
      availability.push(`${formattedDate} ${time}`)
    })
  }
  return availability
}
