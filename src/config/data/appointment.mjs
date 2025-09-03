import { ENV } from '#config/config.mjs'
import {
  loadAppointments as loadAppointmentsAppsheet,
  addAppointment as addAppointmentppsheet,
  updateAppointment as updateAppointmentAppsheet,
  loadAppointmentById as loadAppointmentByIdAppsheet,
  loadAppointmentsByUser as loadAppointmentsByUserAppsheet
} from '#apps/appsheet/config/data/appointment.mjs'

//TT CARGAR CITAS
export async function loadAppointments(star, end, agendaId) {
  if (ENV.APP_FRONTEND === 'appsheet') {
    const request = await loadAppointmentsAppsheet(star, end, agendaId)
    return request
  } else {
    console.error('loadAppointmentById: frontend no soportado')
    return null
  }
}

//TT CARGAR CITA POR ID
export async function loadAppointmentById(id) {
  if (ENV.APP_FRONTEND === 'appsheet') {
    const request = await loadAppointmentByIdAppsheet(id)
    return request
  } else {
    console.error('loadAppointmentById: frontend no soportado')
    return null
  }
}

//TT CARGAR CITA POR USUARIO
export async function loadAppointmentsByUser(userId) {
  if (ENV.APP_FRONTEND === 'appsheet') {
    const request = await loadAppointmentsByUserAppsheet(userId)
    return request
  } else {
    console.error('loadAppointmentsByUser: frontend no soportado')
    return null
  }
}

//TT AGREGAR CITA
export async function addAppointment(appointment) {
  if (ENV.APP_FRONTEND === 'appsheet') {
    const request = await addAppointmentppsheet(appointment)
    return request
  } else {
    console.error('addRequest: frontend no soportado')
    return null
  }
}

//TT ACTUALIZAR CITA
export async function updateAppointment(appointment) {
  if (ENV.APP_FRONTEND === 'appsheet') {
    const request = await updateAppointmentAppsheet(appointment)
    return request
  } else {
    console.error('updateRequest: frontend no soportado')
    return null
  }
}
