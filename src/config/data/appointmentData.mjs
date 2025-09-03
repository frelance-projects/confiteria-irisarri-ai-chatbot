import { ENV } from '#config/config.mjs'
import {
  addAppointmentData as addAppointmentDataAppsheet,
  getAppointmentDataByAppointmentId as getAppointmentDataByAppointmentIdAppsheet
} from '#apps/appsheet/config/data/appointmentData.mjs'

//TT CARGAR DATOS DE CITA POR ID DE CITA
export async function getAppointmentDataByAppointmentId(appointmentId) {
  if (ENV.APP_FRONTEND === 'appsheet') {
    const request = await getAppointmentDataByAppointmentIdAppsheet(appointmentId)
    return request
  } else {
    console.error('getAppointmentDataById: frontend no soportado')
    return null
  }
}

//TT AGREGAR DATOS DE CITAS
export async function addAppointmentData(appointmentData) {
  if (ENV.APP_FRONTEND === 'appsheet') {
    const request = await addAppointmentDataAppsheet(appointmentData)
    return request
  } else {
    console.error('addRequest: frontend no soportado')
    return null
  }
}
