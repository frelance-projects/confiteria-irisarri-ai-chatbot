import { AssistantsDb } from './data.mjs'
import { CacheData } from './cacheData.mjs'

export async function getAllAssistants() {
  try {
    // validar caché
    const cacheAssistants = CacheData.getAllAssistants()
    if (cacheAssistants) {
      console.info('Asistentes obtenidos de la caché')
      return cacheAssistants
    }

    // obtener datos desde la base de datos
    const assistants = await AssistantsDb.getAllAssistants()
    console.info('Asistentes obtenidos de la base de datos')

    // actualizar caché de todos los asistentes
    CacheData.hasAllAssistants(assistants)

    return assistants
  } catch (error) {
    console.error('getAllAssistants: Error al obtener todos los asistentes:', error.message)
    return []
  }
}
