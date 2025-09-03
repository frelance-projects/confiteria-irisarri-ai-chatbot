import { getAppointmentAgendasToolById } from '#config/tools/toolAppointmentAgendas.mjs'
import { getBrainById } from '#config/brain/brain.mjs'
import { getAutoAppointmentToolById } from '#config/tools/toolAppointment.mjs'
import { loadAvailabilityCalendar as loadAvailabilityCalendarTool } from '#tools/appointment/loadAvailabilityCalendar.mjs'

//TT CARGAR CALENDARIO DE DISPONIBILIDAD
export async function loadAvailabilityCalendar(args, user, userIdKey) {
  const starDate = toDate(args.startDate, true)
  const endDate = toDate(args.endDate, false)
  const agendaId = args.agendaId

  //verificar brain
  const brain = await getBrainById(user.brain)
  if (!brain) {
    console.error('loadAvailabilityCalendar: No se ha encontrado el cerebro')
    return { response: 'error: brain not found' }
  }
  //verificar herramienta de appointment
  if (!brain.toolAppointment) {
    console.error('loadAvailabilityCalendar: No se ha encontrado la herramienta de appointment')
    return { response: 'error: appointment tool not found' }
  }
  //cargar herramienta de appointment
  const toolAppointment = await getAutoAppointmentToolById(brain.toolAppointment)
  if (!toolAppointment) {
    console.error('loadAvailabilityCalendar: No se ha encontrado la herramienta de appointment')
    return { response: 'error: appointment tool not found' }
  }

  //cargar agenda
  const agenda = await getAppointmentAgendasToolById(agendaId)
  if (!agenda) {
    console.error('loadAvailabilityCalendar: No se ha encontrado la agenda')
    return { response: `error: agenda ${agendaId} not found` }
  }
  //verificar si la agenda pertenece a la herramienta de appointment
  if (agenda.toolAppointment !== brain.toolAppointment) {
    console.error('loadAvailabilityCalendar: La agenda no pertenece a la herramienta de appointment')
    return { response: 'error: agenda not belong to appointment tool' }
  }
  //verificar si la agenda esta activa
  if (!agenda.status) {
    console.error('loadAvailabilityCalendar: La agenda no esta activa')
    return { response: 'error: agenda not active' }
  }

  //ss cargar calendario
  const res = await loadAvailabilityCalendarTool(toolAppointment, agenda, starDate, endDate)
  if (res) {
    //verificar si hay error
    if (res.error) {
      console.error('loadAvailabilityCalendar: ', res.error)
      return { response: 'error: error loading calendar', error: res.error }
    }
    //verificar si hay respuesta
    else {
      console.log('Calendario cargado')
      return { response: 'success: calendar loaded', calendar: res }
    }
  }
  //error al cargar el calendario
  else {
    console.error('Error al cargar el calendario')
    return { response: 'error: error loading calendar' }
  }
}

//SS FORMATEAR FECHA
function toDate(date, start = true) {
  try {
    if (!date || typeof date !== 'string') {
      return null
    }
    const [day, month, year] = date.split('/').map(Number)
    const newDate = new Date(year, month - 1, day)
    if (start) {
      newDate.setHours(0, 0, 0, 0)
    } else {
      newDate.setHours(23, 59, 59, 999)
    }
    return newDate
  } catch (error) {
    console.error('toDate: ', error)
    return null
  }
}
