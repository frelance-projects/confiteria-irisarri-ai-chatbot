import { ENV } from '#config/config.mjs'
//appsheet
import { loadToolAppointmentRequiredData as loadToolAppointmentRequiredDataAppsheet } from '#apps/appsheet/config/tools/toolAppointmentRequiredData.mjs'

let TOOLS = null
let TOOLS_PROMISE = null

//TT OBTENER APPOINTMENT
export async function getAppointmentRequiredDataTool() {
  // Si ya se cargó previamente, se retorna inmediatamente
  if (TOOLS) return TOOLS

  // Si no hay una promesa en curso, se crea una
  if (!TOOLS_PROMISE) {
    if (ENV.APP_FRONTEND === 'appsheet') {
      TOOLS_PROMISE = loadToolAppointmentRequiredDataAppsheet('load')
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
export async function getAppointmentRequiredDataToolById(dataId) {
  const toolAppointmentRequiredData = await getAppointmentRequiredDataTool()
  if (!toolAppointmentRequiredData) {
    return null
  }
  const data = toolAppointmentRequiredData.find((obj) => obj.id === dataId)
  if (!data) {
    return null
  }
  return data
}

//TT OBTENER APPOINTMENT POR ID DE APPONTMENT
export async function getAppointmentRequiredDataToolByAppointmentToolId(appointmentToolId) {
  const toolAppointmentRequiredData = await getAppointmentRequiredDataTool()
  if (!toolAppointmentRequiredData) {
    return null
  }
  const data = toolAppointmentRequiredData.filter((obj) => obj.toolAppointment === appointmentToolId)
  return data
}

//TT ACTUALIZAR APPOINTMENT
export function setAppointmentRequiredDataTool(obj) {
  TOOLS = obj
  // Se actualiza también la promesa para que futuras llamadas la utilicen
  TOOLS_PROMISE = Promise.resolve(obj)
  return obj
}
