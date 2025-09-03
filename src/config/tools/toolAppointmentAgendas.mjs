import { ENV } from '#config/config.mjs'
//appsheet
import { loadToolAppointmentAgendas as loadToolAppointmentAgendasAppsheet } from '#apps/appsheet/config/tools/toolAppointmentAgendas.mjs'

let TOOLS = null
let TOOLS_PROMISE = null

//TT OBTENER AGENDAS
export async function getAppointmentAgendasTool() {
  // Si ya se cargó previamente, se retorna inmediatamente
  if (TOOLS) return TOOLS

  // Si no hay una promesa en curso, se crea una
  if (!TOOLS_PROMISE) {
    if (ENV.APP_FRONTEND === 'appsheet') {
      TOOLS_PROMISE = loadToolAppointmentAgendasAppsheet('load')
    } else {
      console.error('plataforma de frontend no soportada')
      return null
    }
  }

  // Se espera a que se resuelva la promesa y se almacena el resultado
  TOOLS = await TOOLS_PROMISE
  return TOOLS
}

//TT OBTENER AGENDAS POR ID
export async function getAppointmentAgendasToolById(agendaId) {
  const toolAppointmentAgendas = await loadToolAppointmentAgendasAppsheet()
  if (!toolAppointmentAgendas) {
    return null
  }
  const agenda = toolAppointmentAgendas.find((obj) => obj.id === agendaId)
  if (!agenda) {
    return null
  }
  return agenda
}

//TT OBTENER AGENDAS POR ID DE APPONTMENT
export async function getAppointmentAgendasToolByAppointmentToolId(appointmentToolId) {
  const toolAppointmentAgendas = await loadToolAppointmentAgendasAppsheet()
  if (!toolAppointmentAgendas) {
    return null
  }
  const agenda = toolAppointmentAgendas.filter((obj) => obj.toolAppointment === appointmentToolId)
  if (!agenda || agenda.length === 0) {
    return null
  }
  return agenda
}

//TT ACTUALIZAR AGENDAS
export function setAppointmentAgendasTool(obj) {
  TOOLS = obj
  // Se actualiza también la promesa para que futuras llamadas la utilicen
  TOOLS_PROMISE = Promise.resolve(obj)
  return obj
}
