import { getBrainById } from '#config/brain/brain.mjs'
import { getAutoAppointmentToolById } from '#config/tools/toolAppointment.mjs'

//tools
import { getJson as jsonSendRequest } from './tools/jsonSendRequest.mjs'
import { getJson as jsonSendCatalogPage } from './tools/jsonSendCatalogPage.mjs'
import { getJson as jsonAddAppointment } from './tools/jsonAddAppointment.mjs'
import { getJson as jsonLoadAvailabilityCalendar } from './tools/jsonLoadAvailabilityCalendar.mjs'
import { getJson as jsonCheckAppointments } from './tools/jsonCheckAppointments.mjs'
import { getJson as jsonCancelAppointment } from './tools/jsonCancelAppointment.mjs'
import { getJson as jsonUserRegistration } from './tools/jsonUserRegistration.mjs'

export async function getToolsOpenAi(brainId) {
  const tools = []
  const brain = await getBrainById(brainId)
  if (!brain) {
    console.error('getToolsOpenAi: No se ha encontrado el cerebro')
    return tools
  }
  //UserRegistration
  if (brain.toolUserRegistration) {
    const userRegistrationJson = await jsonUserRegistration(brain.toolUserRegistration)
    if (userRegistrationJson) {
      tools.push(userRegistrationJson)
    }
  }
  //sendRequest
  if (brain.toolSendRequest) {
    const sendRequestJson = await jsonSendRequest(brain.toolSendRequest)
    if (sendRequestJson) {
      tools.push(sendRequestJson)
    }
  }
  //SendCatalog
  if (brain.toolCatalog) {
    const sendCatalogJson = await jsonSendCatalogPage()
    if (sendCatalogJson) {
      tools.push(sendCatalogJson)
    }
  }
  //addAppointment
  if (brain.toolAppointment) {
    const addAppointmentJson = await jsonAddAppointment(brain.toolAppointment)
    const loadAvailabilityCalendarJson = await jsonLoadAvailabilityCalendar()
    if (addAppointmentJson && loadAvailabilityCalendarJson) {
      tools.push(loadAvailabilityCalendarJson)
      tools.push(addAppointmentJson)

      //checkAppointments
      const toolAppointment = await getAutoAppointmentToolById(brain.toolAppointment)
      //checkAppointments
      if (toolAppointment && toolAppointment.checkAppointments) {
        const checkAppointmentsJson = await jsonCheckAppointments()
        if (checkAppointmentsJson) {
          tools.push(checkAppointmentsJson)
        }
      }
      //cancelAppointment
      if (toolAppointment && toolAppointment.cancelAppointment !== 'no') {
        const cancelAppointmentJson = await jsonCancelAppointment()
        if (cancelAppointmentJson) {
          tools.push(cancelAppointmentJson)
        }
      }
    }
  }
  //console.log('getToolsOpenAi: ', tools)
  return tools
}
