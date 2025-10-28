//TT CREAR FORMATO DE FECHA Y HORA
export function buildFormatDateTime(dateTime) {
  const [date, time] = dateTime.split(' ')
  const [month, day, year] = date.split('/').map(Number)
  const [hours, minutes, seconds] = time.split(':').map(Number)
  return new Date(year, month - 1, day, hours, minutes, seconds)
}
