import path from 'path'

import { ENV } from '#config/config.mjs'
import { storagePath } from '#config/paths.mjs'

export function localToLocalUrl(filePath) {
  try {
    console.log(`filePath: ${filePath}`)
    // Validar que filePath sea una cadena de texto
    if (typeof filePath !== 'string') {
      throw new TypeError('El argumento "filePath" debe ser una cadena de texto.')
    }

    const list = storagePath.split('/')
    console.log(list)

    // Validar que la ruta contiene "locaStorage"
    if (!filePath.includes(...list)) {
      throw new Error('La ruta proporcionada no contiene "storage".')
    }

    // Asegurarse de que SERVICE_URL termina con '/'
    const urlBase = ENV.SERVICE_URL.endsWith('/') ? ENV.SERVICE_URL : `${ENV.SERVICE_URL}/`

    // Obtener la parte relativa después de "locaStorage/"
    const relativePath = path
      .normalize(filePath) // Normalizar la ruta para evitar inconsistencias
      .split(path.sep) // Dividir en segmentos según el separador del sistema
      .slice(filePath.split(path.sep).findIndex((segment) => segment === list[list.length - 1]) + 1) // Tomar todo después de "storage"
      .join('/') // Unir usando el separador estándar de URL

    // Construir la URL final
    const url = `${urlBase}${list[list.length - 1]}/${relativePath}`

    console.log(`url: ${url}`)
    return url
  } catch (error) {
    console.error('Error al generar la URL:', error)
    return null
  }
}
