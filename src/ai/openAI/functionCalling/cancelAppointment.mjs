import { getBrainById } from '#config/brain/brain.mjs'
import { getAutoAppointmentToolById } from '#config/tools/toolAppointment.mjs'
import { cancelAppointment as cancelAppointmentTool } from '#tools/appointment/cancelAppointment.mjs'
import { loadAppointmentById } from '#config/data/appointment.mjs'

export async function cancelAppointment(args, user, userIdKey) {
  //verificar brain
  const brain = await getBrainById(user.brain)
  const appointmentId = args.appointmentId
  if (!appointmentId) {
    console.error('cancelAppointment: Faltan parametros')
    return { response: 'error: missing parameter appointmentId' }
  }
  //verificar brain
  if (!brain) {
    console.error('addAppointment: No se ha encontrado el cerebro')
    return { response: 'error: brain not found' }
  }

  //cargar herramienta de appointment
  const toolAppointment = await getAutoAppointmentToolById(brain.toolAppointment)
  if (!toolAppointment) {
    console.error('addAppointment: No se ha encontrado la herramienta de appointment')
    return { response: 'error: appointment tool not found' }
  }

  //verificar si la herramienta de appointment tiene checkAppointments
  if (!toolAppointment.checkAppointments) {
    console.error('checkAppointments: No se ha encontrado la herramienta de checkAppointments')
    return { response: 'error: checkAppointments tool not found' }
  }
  // verificar si la herramienta de appointment tiene cancelAppointment
  if (toolAppointment.cancelAppointment === 'no') {
    console.error('cancelAppointment: No se ha encontrado la herramienta de cancelAppointment')
    return { response: 'error: cancelAppointment tool not found' }
  }

  //cargar cita
  const appointment = await loadAppointmentById(appointmentId)
  if (!appointment) {
    console.error('cancelAppointment: No se ha encontrado la cita')
    return { response: 'error: appointment not found' }
  }

  //verificar si el usuario tiene permisos para cancelar la cita
  if (appointment.user !== user.userId) {
    console.warn('cancelAppointment: No tienes permisos para cancelar esta cita')
    return { response: "error: you don't have permission to cancel this appointment" }
  }

  //verificar si la cita ya ha sido cancelada
  if (appointment.status === 'canceled') {
    console.info('cancelAppointment: La cita ya ha sido cancelada')
    return { response: 'error: appointment already canceled' }
  }
  //verificar si la cita ya ha sido completada
  if (appointment.status === 'complete') {
    console.info('cancelAppointment: La cita ya ha sido completada')
    return { response: 'error: appointment already completed' }
  }
  //verificar si la cita ya ha pasado
  const today = new Date()
  if (appointment.startDate < today) {
    console.info('cancelAppointment: La cita ya ha pasado')
    return { response: 'error: appointment already passed' }
  }

  //ss cancelar cita
  const res = await cancelAppointmentTool(user, userIdKey, appointment, toolAppointment)
  if (res) {
    //verificar si hay error
    if (res.error) {
      console.error('cancelAppointment: ', res.error)
      return { response: 'error: error canceling appointment', error: res.error }
    }
    //verificar si hay respuesta
    else {
      console.log('Cita cancelada')
      return { response: 'success: appointment canceled', appointment: res }
    }
  }
  //verificar si no hay respuesta
  else {
    console.error('cancelAppointment: Error al cancelar la cita')
    return { response: 'error: error canceling appointment' }
  }
}
