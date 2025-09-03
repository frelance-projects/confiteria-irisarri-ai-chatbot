export function formatData(array) {
  try {
    if (Array.isArray(array)) {
      if (array.length > 0) {
        for (let i = 0; i < array.length; i++) {
          for (const key in array[i]) {
            // Boolean conversion
            array[i][key] = array[i][key] === 'Y' ? true : array[i][key] === 'N' ? false : array[i][key]
            // URL extraction
            if (String(array[i][key]).includes('Url') && String(array[i][key]).includes('LinkText')) {
              array[i][key] = JSON.parse(array[i][key]).Url
            }
          }
        }
      }
    } else {
      throw new Error('appsheet - formatData: El parametro ingresado no es un array')
    }
    return array
  } catch (error) {
    console.error('appsheet - formatData: Error al dar formato a los datos', error)
    return null
  }
}
