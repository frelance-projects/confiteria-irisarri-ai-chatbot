import { getFullDateFormatGB, getFullDateFormatUS, getTimeFormat } from '#utilities/dateFunctions/dateNow.mjs'
import { revertDateTimeTextMessage, builtLogsFormat, builtDataFormat } from './utils.mjs'

//TT CONSTRUIR MENSAJE BASE
export function appointmentMessageFormat(
  user,
  platform,
  message,
  agendaName,
  appointmentStart,
  data,
  reminderLogs = '',
  updateLogs = '',
  note = ''
) {
  const userid = user[platform].id
  let txt = message.replaceAll('{user_name}', user.name)
  txt = txt.replaceAll('{user_id}', userid)
  txt = txt.replaceAll('{platform}', platform)
  txt = txt.replaceAll('{agenda}', agendaName)
  txt = txt.replaceAll('{date_now}', getFullDateFormatGB())
  txt = txt.replaceAll('{date_now_us}', getFullDateFormatUS())
  txt = txt.replaceAll('{time_now}', getTimeFormat())
  txt = txt.replaceAll('{appointment_start}', revertDateTimeTextMessage(appointmentStart, true))
  txt = txt.replaceAll('{appointment_data}', builtDataFormat(data))
  txt = txt.replaceAll('{app_reminder_logs}', builtLogsFormat(reminderLogs))
  txt = txt.replaceAll('{app_update_logs}', builtLogsFormat(updateLogs))
  txt = txt.replaceAll('{appointment_note}', note)

  return txt
}

//txt = txt.replaceAll('{appointment_reminder_logs}', builtLogsFormat(reminderLogs))
//txt = txt.replaceAll('{appointment_update_logs}', builtLogsFormat(updateLogs))
