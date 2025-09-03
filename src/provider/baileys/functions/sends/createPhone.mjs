export function createPhone(str) {
  // si ya tiene el formato correcto, devolverlo
  if (str.includes('@s.whatsapp.net')) {
    return str
  }
  // si tiene formato anónimo, devolverlo
  else if (str.includes('@lid')) {
    return str
  }
  // si solo son números
  else if (/^\d+$/.test(str)) {
    return `${str}@s.whatsapp.net`
  }
  console.error('createPhone: El número de teléfono no es válido:', str)
  return str
}
