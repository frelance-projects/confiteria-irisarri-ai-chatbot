export function clearPhoneNumber(phoneNumber) {
  try {
    // Mapa de configuraciones por país con longitud esperada
    const countryRules = {
      52: { prefix: '521', length: 12 }, // México (10 dígitos + código de país)
      54: { prefix: '549', length: 13 }, // Argentina (10 dígitos + código de país y "9")
      57: { prefix: '57', length: 12 }, // Colombia (10 dígitos + código de país)
      1: { prefix: '1', length: 11 } // EE. UU./Canadá (10 dígitos + código de país)
      // Agrega más reglas según sea necesario
    }

    // Limpia el número, eliminando caracteres no numéricos
    let cleanedNumber = phoneNumber.replace(/\D+/g, '')

    // Verifica si el número coincide con alguna regla de país
    for (const [countryCode, { prefix, length }] of Object.entries(countryRules)) {
      if (cleanedNumber.startsWith(countryCode)) {
        // Reemplaza el prefijo según la regla
        cleanedNumber = prefix + cleanedNumber.slice(countryCode.length)

        // Verifica la longitud
        if (cleanedNumber.length !== length) {
          throw new Error(
            `El número ${phoneNumber} no tiene la longitud esperada para el código ${countryCode}. Esperado: ${length}, Actual: ${cleanedNumber.length}`
          )
        }

        return cleanedNumber // Retorna el número formateado
      }
    }

    // Si no coincide con ninguna regla
    throw new Error(`El número ${phoneNumber} no coincide con ningún país soportado.`)
  } catch (error) {
    console.error(`Error al formatear el número: ${error.message}`)
    return null // Retorna null en caso de error
  }
}
