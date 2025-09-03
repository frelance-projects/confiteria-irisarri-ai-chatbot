import { ENV } from '#config/config.mjs'
//appsheet
import { loadToolAppointment as loadToolAppointmentAppsheet } from '#apps/appsheet/config/tools/toolAppointment.mjs'

let TOOLS = null
let TOOLS_PROMISE = null

// TT OBTENER APPOINTMENT
export async function getAppointmentTool() {
  // Si ya se cargó previamente, se retorna inmediatamente
  if (TOOLS) return TOOLS

  // Si no hay una promesa en curso, se crea una
  if (!TOOLS_PROMISE) {
    if (ENV.APP_FRONTEND === 'appsheet') {
      TOOLS_PROMISE = loadToolAppointmentAppsheet('load')
    } else {
      console.error('plataforma de frontend no soportada')
      return null
    }
  }

  // Se espera a que se resuelva la promesa y se almacena el resultado
  TOOLS = await TOOLS_PROMISE
  return TOOLS
}

//TT OBTENER APPONTMENT POR ID
export async function getAutoAppointmentToolById(appointmentId) {
  const toolAppointment = await getAppointmentTool()
  if (!toolAppointment) {
    return null
  }
  const appointment = toolAppointment.find((obj) => obj.id === appointmentId)
  if (!appointment) {
    return null
  }
  return appointment
}

//TT ACTUALIZAR APPOINTMENT
export function setAppointmentTool(obj) {
  TOOLS = obj
  // Se actualiza también la promesa para que futuras llamadas la utilicen
  TOOLS_PROMISE = Promise.resolve(obj)
  return obj
}
