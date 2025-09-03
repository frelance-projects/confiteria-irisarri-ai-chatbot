export function revertPhoneNumber(formattedNumber) {
  try {
    // Mapa de configuraciones por país con prefijo y longitud
    const countryRules = {
      521: { countryCode: '+52', length: 12 }, // México
      549: { countryCode: '+54', length: 13 }, // Argentina
      57: { countryCode: '+57', length: 12 }, // Colombia
      1: { countryCode: '+1', length: 11 } // EE. UU./Canadá
      // Agrega más reglas según sea necesario
    }

    // Encuentra la regla que aplica al número
    for (const [prefix, { countryCode, length }] of Object.entries(countryRules)) {
      if (formattedNumber.startsWith(prefix)) {
        // Remueve el prefijo
        const localNumber = formattedNumber.slice(prefix.length)

        // Valida la longitud del número local
        if (formattedNumber.length !== length) {
          throw new Error(
            `El número ${formattedNumber} no tiene la longitud esperada. Esperado: ${length}, Actual: ${formattedNumber.length}`
          )
        }

        // Retorna el número en el formato deseado
        return `${countryCode}${localNumber}`
      }
    }

    throw new Error(`El número ${formattedNumber} no coincide con ningún país soportado.`)
  } catch (error) {
    console.error(`Error al revertir el número: ${error.message}`)
    return null
  }
}
