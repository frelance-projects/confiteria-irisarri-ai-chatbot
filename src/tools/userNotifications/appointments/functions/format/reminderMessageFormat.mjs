import { revertDateTimeTextMessage } from './utils.mjs'

//TT CONSTRUIR MENSAJE BASE
export function reminderMessageFormat(user, message, agendaName, appointmentStart, note) {
  let txt = message.replaceAll('{user_name}', user.name)
  txt = txt.replaceAll('{agenda}', agendaName)
  txt = txt.replaceAll('{appointment_start}', revertDateTimeTextMessage(appointmentStart, true))
  txt = txt.replaceAll('{appointment_note}', note || 'sin notas adicionales')
  return txt
}
