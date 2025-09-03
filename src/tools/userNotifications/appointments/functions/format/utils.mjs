//SS CREAR FORMATO DE FECHA Y HORA
export function revertDateTimeTextMessage(dateTime, gb = true) {
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
