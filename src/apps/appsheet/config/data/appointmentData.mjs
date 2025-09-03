//TT MÓDULOS
import { ENV } from '#config/config.mjs'

import { appsheetTablesData } from '../../tablesId.mjs'
import { postTable } from '../../api/postTable.mjs'
import { getTable } from '../../api/getTable.mjs'

//TT CARGAR DATOS DE CITA POR ID DE CITA
export async function getAppointmentDataByAppointmentId(appointmentId) {
  const appointmentData = await getTable(appsheetTablesData.toolAppointmentCalendarData, [], {
    Selector: `FILTER(${appsheetTablesData.toolAppointmentCalendarData}, [TOOL_APPOINTMENT_CALENDAR] = "${appointmentId}")`,
    Locale: 'en-GB',
    Timezone: ENV.TZ,
    UserSettings: { FROM_API: true }
  })
  if (!appointmentData) {
    return null
  }
  const data = buildFormat(appointmentData)
  if (!data) {
    return null
  }
  return data
}

//TT AGREGAR DATOS DE CITAS
export async function addAppointmentData(appointmentData) {
  const newAppointmentData = Array.isArray(appointmentData) ? appointmentData : [appointmentData]
  const data = revetFormat(newAppointmentData)
  //console.info(`Datos de cita a agregar a AppSheet:\n${JSON.stringify(data, null, 2)}`)
  const res = await postTable(appsheetTablesData.toolAppointmentCalendarData, data)
  if (res) {
    //console.info(`Datos de cita agregados a AppSheet:\n${JSON.stringify(res, null, 2)}`)
    return res
  } else {
    console.error('appsheet: datos de cita no agregados')
    return null
  }
}

//SS DAR FORMATO A DATOS DE CITAS
function buildFormat(data = []) {
  const appointments = data.map((obj) => ({
    id: obj.ID,
    appointmentId: obj.TOOL_APPOINTMENT_CALENDAR,
    name: obj.NAME,
    value: obj.VALUE
  }))
  return appointments
}

//SS REVERTIR FORMATO DE DATOS DE CITAS
function revetFormat(data = []) {
  const appointments = data.map((obj) => ({
    ID: obj.id,
    TOOL_APPOINTMENT_CALENDAR: obj.appointmentId,
    NAME: obj.name,
    VALUE: obj.value
  }))
  return appointments
}
