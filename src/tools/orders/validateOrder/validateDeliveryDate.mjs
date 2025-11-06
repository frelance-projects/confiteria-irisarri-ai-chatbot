export async function validateDeliveryDate(deliveryDate) {
  const errors = []

  // Validar que la fecha de entrega es una cadena no vacía
  if (!deliveryDate || typeof deliveryDate !== 'string') {
    console.error('Fecha de entrega inválida o no proporcionada:', deliveryDate)
    errors.push('La fecha de entrega es obligatoria y debe ser una cadena de texto.')
    return errors
  }

  // validar formato AAAA-MM-DD HH:MM
  if (!isValidDateTime(deliveryDate)) {
    console.error('Formato de fecha de entrega inválido:', deliveryDate)
    errors.push("El formato de la fecha de entrega debe ser 'AAAA-MM-DD HH:MM'.")
    return errors
  }
  return errors
}

function isValidDateTime(dateTimeString) {
  // Validar formato exacto con regex
  const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/
  if (!regex.test(dateTimeString)) return false

  // Separar componentes
  const [datePart, timePart] = dateTimeString.split(' ')
  const [year, month, day] = datePart.split('-').map(Number)
  const [hour, minute] = timePart.split(':').map(Number)

  // Validar rangos de fecha y hora
  if (month < 1 || month > 12) return false
  if (day < 1 || day > 31) return false
  if (hour < 0 || hour > 23) return false
  if (minute < 0 || minute > 59) return false

  // Validar existencia real del día (por ejemplo, 30 feb no es válido)
  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
    return false
  }

  return true
}
