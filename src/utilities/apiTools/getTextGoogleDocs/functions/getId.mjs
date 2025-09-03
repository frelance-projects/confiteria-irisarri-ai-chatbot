export function getId(input) {
  try {
    // Validar que la entrada 'input' es una cadena de texto no vacía
    if (!input || typeof input !== 'string') {
      throw new Error('A valid string must be provided.')
    }

    // Verificar si el input ya es un ID (alfanumérico con guiones o guiones bajos)
    if (/^[a-zA-Z0-9-_]+$/.test(input)) {
      return input
    }

    // Intentar extraer el ID de una URL
    const regex = /\/document\/d\/([a-zA-Z0-9-_]+)/
    const matches = input.match(regex)

    if (matches && matches[1]) {
      return matches[1] // El ID del documento
    } else {
      throw new Error('Could not extract the document ID from the provided input.')
    }
  } catch (error) {
    console.error('Error:', error.message)
    return null
  }
}
