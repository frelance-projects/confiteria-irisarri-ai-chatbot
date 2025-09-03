//TT CONSTRUIR MENSAJE EMAIL
export function reminderEmailFormat(user, htmlTamplate, agendaName, appointmentStart, note) {
  let txt = htmlTamplate.replaceAll('{user_name}', user.name)
  txt = txt.replaceAll('{agenda}', agendaName)
  txt = txt.replaceAll('{appointment_start}', revertDateTimeEmail(appointmentStart, true))
  txt = txt.replaceAll('{appointment_note}', note || 'sin notas adicionales')
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
