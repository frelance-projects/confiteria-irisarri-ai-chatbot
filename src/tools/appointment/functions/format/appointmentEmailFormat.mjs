import { getFullDateFormatGB, getFullDateFormatUS, getTimeFormat } from '#utilities/dateFunctions/dateNow.mjs'

//TT CONSTRUIR MENSAJE EMAIL
export function appointmentEmailFormat(
  user,
  platform,
  htmlTamplate,
  agendaName,
  appointmentStart,
  data,
  reminderLogs = '',
  updateLogs = '',
  note = ''
) {
  const userid = user[platform].id
  let txt = htmlTamplate.replaceAll('{user_name}', user.name)
  txt = txt.replaceAll('{user_id}', userid)
  txt = txt.replaceAll('{platform}', platform)
  txt = txt.replaceAll('{agenda}', agendaName)
  txt = txt.replaceAll('{date_now}', getFullDateFormatGB())
  txt = txt.replaceAll('{date_now_us}', getFullDateFormatUS())
  txt = txt.replaceAll('{time_now}', getTimeFormat())
  txt = txt.replaceAll('{appointment_start}', revertDateTimeEmail(appointmentStart, true))
  txt = txt.replaceAll('{appointment_data}', builtDataFormat(data))
  txt = txt.replaceAll('{app_reminder_logs}', builtLogsFormat(reminderLogs))
  txt = txt.replaceAll('{app_update_logs}', builtLogsFormat(updateLogs))
  txt = txt.replaceAll('{appointment_note}', note)
  return txt
}

//SS CONSTRUIR DATOS DE LA CITA
function builtDataFormat(data) {
  let txt = ''
  if (!data || data.length === 0) {
    return '<p>No hay datos asociados a la cita</p>'
  }
  for (const dat of data) {
    txt += `<p>${dat.name}: ${dat.value}</p>`
  }
  return txt
}

//SS CONSTRIUR LOGS
function builtLogsFormat(logs) {
  if (!logs || logs.length === 0) {
    return '<p>Sin registros</p>'
  }
  let txt = ''
  for (const log of logs) {
    txt += `<p>${log}</p>`
  }
  return txt
}

//SS CREAR FORMATO DE FECHA Y HORA
function revertDateTimeEmail(dateTime, gb = true) {
  if (!dateTime) {
    console.error('Error al formatear fecha y hora: dateTime no definido')
    return 'sin fecha'
  }
  try {
    const date = dateTime.getDate()
    const month = dateTime.getMonth() + 1
    const year = dateTime.getFullYear()
    const hours = dateTime.getHours()
    const minutes = dateTime.getMinutes()
    if (gb) {
      return `${date}/${month}/${year} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    } else {
      return `${month}/${date}/${year} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    }
  } catch (error) {
    console.error('Error al formatear fecha y hora:', error)
    return null
  }
}
