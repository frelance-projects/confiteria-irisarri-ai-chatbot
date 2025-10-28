export function formatData(array) {
  // Validar que el parámetro sea un array
  if (Array.isArray(array)) {
    if (array.length > 0) {
      for (let i = 0; i < array.length; i++) {
        for (const key in array[i]) {
          // Extraer booleanos
          array[i][key] = array[i][key] === 'Y' ? true : array[i][key] === 'N' ? false : array[i][key]
          // Extracción de URL
          if (String(array[i][key]).includes('Url') && String(array[i][key]).includes('LinkText')) {
            array[i][key] = JSON.parse(array[i][key]).Url
          }
        }
      }
    }
  } else {
    console.error('appsheet-formatData: El parámetro ingresado no es un array', array)
    throw new Error('appsheet-formatData: El parámetro ingresado no es un array')
  }
  return array
}
