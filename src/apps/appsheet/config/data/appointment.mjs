//TT MÓDULOS
import { appsheetTablesData } from '../../tablesId.mjs'
import { getTable } from '../../api/getTable.mjs'
import { ENV } from '#config/config.mjs'
import { postTable } from '../../api/postTable.mjs'
import { patchTable } from '../../api/patchTable.mjs'
import { getFullDateFormatGB, getTimeFormat } from '#utilities/dateFunctions/dateNow.mjs'
import { revertDateTime, buildFormatDateTime } from '#utilities/appsheetTools/formatDateTime.mjs'

//TT CARGAR CITAS
export async function loadAppointments(start = null, end = null, agendaId = null) {
  const realStart = revertDateTime(start, false)
  const realEnd = revertDateTime(end, false)
  let events
  //con rangos
  if (realStart && realEnd) {
    //sin agenda
    if (!agendaId) {
      events = await getTable(appsheetTablesData.toolAppointmentCalendar, [], {
        Selector: `FILTER(${appsheetTablesData.toolAppointmentCalendar}, AND([START_DATE] >= "${realStart}", [END_DATE] <= "${realEnd}"))`,
        Locale: 'en-GB',
        Timezone: ENV.TZ,
        UserSettings: { FROM_API: true }
      })
    }
    //con agenda
    else {
      events = await getTable(appsheetTablesData.toolAppointmentCalendar, [], {
        Selector: `FILTER(${appsheetTablesData.toolAppointmentCalendar}, AND([START_DATE] >= "${realStart}", [END_DATE] <= "${realEnd}", [TOOL_APPOINTMENT_AGENDAS] = "${agendaId}"))`,
        Locale: 'en-GB',
        Timezone: ENV.TZ,
        UserSettings: { FROM_API: true }
      })
    }
  }
  // sin rangos
  else {
    //sin agenda
    if (!agendaId) {
      events = await getTable(appsheetTablesData.toolAppointmentCalendar)
    }
    //con agenda
    else {
      events = await getTable(appsheetTablesData.toolAppointmentCalendar, [], {
        Selector: `FILTER(${appsheetTablesData.toolAppointmentCalendar}, [TOOL_APPOINTMENT_AGENDAS] = "${agendaId}")`,
        Locale: 'en-GB',
        Timezone: ENV.TZ,
        UserSettings: { FROM_API: true }
      })
    }
  }
  if (events) {
    //console.info(`Citas cargadas de AppSheet:\n${JSON.stringify(events, null, 2)}`)
    return buildFormat(events)
  } else {
    console.error('appsheet: citas no cargadas')
    return null
  }
}

//TT CARGAR CITA POR ID
export async function loadAppointmentById(id) {
  const events = await getTable(appsheetTablesData.toolAppointmentCalendar, [], {
    Selector: `FILTER(${appsheetTablesData.toolAppointmentCalendar}, [ID] = "${id}")`,
    Locale: 'en-GB',
    Timezone: ENV.TZ,
    UserSettings: { FROM_API: true }
  })
  if (events) {
    const appointments = buildFormat(events)
    return appointments.length > 0 ? appointments[0] : null
  } else {
    console.error('Error al cargar la cita de AppSheet')
    return null
  }
}

//TT CARGAR CITA POR USUARIO
export async function loadAppointmentsByUser(userId) {
  const events = await getTable(appsheetTablesData.toolAppointmentCalendar, [], {
    Selector: `FILTER(${appsheetTablesData.toolAppointmentCalendar}, [USER] = "${userId}")`,
    Locale: 'en-GB',
    Timezone: ENV.TZ,
    UserSettings: { FROM_API: true }
  })
  if (events) {
    return buildFormat(events)
  } else {
    console.error('Error al cargar las citas de AppSheet')
    return null
  }
}

//TT AGREGAR CITA
export async function addAppointment(appointment) {
  const newAppointment = Array.isArray(appointment) ? appointment : [appointment]
  const data = revetFormat(newAppointment)
  const res = await postTable(appsheetTablesData.toolAppointmentCalendar, data)
  if (res) {
    return buildFormat(res)
  } else {
    console.error('Error al agregar la cita a AppSheet')
    return null
  }
}

//TT ACTUALIZAR CITA
export async function updateAppointment(appointment) {
  const newData = Array.isArray(appointment) ? appointment : [appointment]
  const data = revetFormat(newData)
  const res = await patchTable(appsheetTablesData.toolAppointmentCalendar, data)
  if (res) {
    return buildFormat(res)
  } else {
    console.error('Error al actualizar la cita en AppSheet')
    return null
  }
}

//SS DAR FORMATO A CITA
function buildFormat(data = []) {
  const appointments = []
  for (const obj of data) {
    const appointment = {
      id: obj.ID,
      timestamp: buildFormatDateTime(obj.TIMESTAMP),
      agenda: obj.TOOL_APPOINTMENT_AGENDAS,
      startDate: buildFormatDateTime(obj.START_DATE),
      endDate: buildFormatDateTime(obj.END_DATE),
      user: obj.USER,
      status: obj.STATUS,
      note: obj.NOTE,
      updateLogs: obj.UPDATE_LOGS || '',
      reminderLogs: obj.REMINDER_LOGS || ''
    }
    appointments.push(appointment)
  }
  return appointments
}

//SS REVERTIT FORMATO DE CITA
function revetFormat(data = []) {
  const appointments = []
  for (const obj of data) {
    const appointment = {
      ID: obj.id,
      TIMESTAMP: revertDateTime(obj.timestamp) || getFullDateFormatGB() + ' ' + getTimeFormat(),
      TOOL_APPOINTMENT_AGENDAS: obj.agenda,
      START_DATE: revertDateTime(obj.startDate, true),
      END_DATE: revertDateTime(obj.endDate, true),
      USER: obj.user,
      STATUS: obj.status,
      NOTE: obj.note,
      UPDATE_LOGS: obj.updateLogs || '',
      REMINDER_LOGS: obj.reminderLogs || ''
    }
    appointments.push(appointment)
  }
  return appointments
}
