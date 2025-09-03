//SS FUNCIONES
import { sendRequest } from './functionCalling/sendRequest.mjs'
import { sendCatalogPage } from './functionCalling/sendCatalogPage.mjs'
import { loadAvailabilityCalendar } from './functionCalling/loadAvailabilityCalendar.mjs'
import { addAppointment } from './functionCalling/addAppointment.mjs'
import { checkAppointments } from './functionCalling/checkAppointments.mjs'
import { cancelAppointment } from './functionCalling/cancelAppointment.mjs'
import { userRegistration } from './functionCalling/userRegistration.mjs'

//SS NOMBRES
import { functionName as sendCatalogName } from './tools/jsonSendCatalogPage.mjs'
import { functionName as sendRequestName } from './tools/jsonSendRequest.mjs'
import { functionName as loadAvailabilityCalendarName } from './tools/jsonLoadAvailabilityCalendar.mjs'
import { functionName as addAppointmentName } from './tools/jsonAddAppointment.mjs'
import { functionName as checkAppointmentsName } from './tools/jsonCheckAppointments.mjs'
import { functionName as cancelAppointmentName } from './tools/jsonCancelAppointment.mjs'
import { functionName as userRegistrationName } from './tools/jsonUserRegistration.mjs'

// TT COMPROBAR LLAMADA A FUNCTION
export async function functionCalling(aiFunction, user, userIdKey) {
  //Cargar argumentos
  const functionName = aiFunction.name
  const functionArgs = JSON.parse(aiFunction.arguments)
  console.log(`🔹 se llamo a una function para ${user.name} desde IA: ${functionName}`, functionArgs)

  const handlers = {
    //registrar usuario
    [userRegistrationName]: userRegistration,
    //enviar solicitud
    [sendRequestName]: sendRequest,
    //enviar catalogo
    [sendCatalogName]: sendCatalogPage,
    //cargar calendario de disponibilidad
    [loadAvailabilityCalendarName]: loadAvailabilityCalendar,
    //agregar cita
    [addAppointmentName]: addAppointment,
    //comprobar citas
    [checkAppointmentsName]: checkAppointments,
    //cancelar cita
    [cancelAppointmentName]: cancelAppointment
  }

  let result
  if (handlers[functionName]) {
    try {
      const res = await handlers[functionName](functionArgs, user, userIdKey)
      result = JSON.stringify(res, null, 2)
    } catch (error) {
      console.error('Error al llamar a la function', functionName, error)
      result = JSON.stringify({ response: 'error: function failed' })
    }
  } else {
    result = JSON.stringify({ response: 'error: function not found' })
  }

  //SS REGRESAR LLAMADA
  const response = { type: 'function_call_output', call_id: aiFunction.call_id, output: result }
  console.info('Respuesta de la function:\n', result)
  return response
}
