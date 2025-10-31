//TT CREAR FORMATO DE FECHA Y HORA
export function buildFormatDateTime(dateTime) {
  const [date, time] = dateTime.split(' ')
  const [year, month, day] = date.split('-').map(Number)
  const [hours, minutes] = time.split(':').map(Number)
  return new Date(year, month - 1, day, hours, minutes, 0)
}

//TT REVERSAR FORMATO DE FECHA Y HORA
export function revertFormatDateTime(dateObj) {
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0') // meses empiezan en 0
  const day = String(dateObj.getDate()).padStart(2, '0')
  const hours = String(dateObj.getHours()).padStart(2, '0')
  const minutes = String(dateObj.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}`
}
