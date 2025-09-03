export function getFullDateFormatGB() {
  const fecha = new Date()
  const dia = String(fecha.getDate()).padStart(2, '0') // Asegura dos dígitos
  const mes = String(fecha.getMonth() + 1).padStart(2, '0') // getMonth() devuelve 0-11
  const anio = fecha.getFullYear() // Año con cuatro dígitos
  return `${dia}/${mes}/${anio}`
}

export function getFullDateFormatUS() {
  const fecha = new Date()
  const dia = String(fecha.getDate()).padStart(2, '0') // Asegura dos dígitos
  const mes = String(fecha.getMonth() + 1).padStart(2, '0') // getMonth() devuelve 0-11
  const anio = fecha.getFullYear() // Año con cuatro dígitos
  return `${mes}/${dia}/${anio}`
}

export function getTimeFormat() {
  const fecha = new Date()
  const horas = String(fecha.getHours()).padStart(2, '0') // Hora en formato 24h
  const minutos = String(fecha.getMinutes()).padStart(2, '0') // Minutos con dos dígitos
  const segundos = String(fecha.getSeconds()).padStart(2, '0') // Segundos con dos dígitos

  return `${horas}:${minutos}:${segundos}`
}
