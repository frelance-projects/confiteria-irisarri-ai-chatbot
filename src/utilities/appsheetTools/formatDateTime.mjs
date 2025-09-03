//TT CREAR FORMATO DE FECHA Y HORA
export function revertDateTime(dateTime, gb = true) {
  if (!dateTime) {
    return null
  }
  try {
    const date = dateTime.getDate()
    const month = dateTime.getMonth() + 1
    const year = dateTime.getFullYear()
    const hours = dateTime.getHours()
    const minutes = dateTime.getMinutes()
    const seconds = dateTime.getSeconds()
    if (gb) {
      return `${String(date).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year} ${String(
        hours
      ).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    } else {
      return `${String(month).padStart(2, '0')}/${String(date).padStart(2, '0')}/${year} ${String(
        hours
      ).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    }
  } catch (error) {
    console.error('Error al formatear fecha y hora:', error)
    return ''
  }
}

//TT CREAR FORMATO DE FECHA Y HORA
export function buildFormatDateTime(dateTime) {
  if (!dateTime) {
    return null
  }
  try {
    const [date, time] = dateTime.split(' ')
    const [month, day, year] = date.split('/').map(Number)
    const [hours, minutes, seconds] = time.split(':').map(Number)
    return new Date(year, month - 1, day, hours, minutes, seconds)
  } catch (error) {
    console.error('Error al formatear fecha y hora:', error)
    return null
  }
}
