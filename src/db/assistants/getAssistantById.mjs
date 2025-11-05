import { AssistantsDb } from './data.mjs'
import { CacheData } from './cacheData.mjs'

export async function getAssistantById(assistantId) {
  try {
    // validar caché
    const cacheAssistant = CacheData.get(assistantId)
    if (cacheAssistant) {
      return cacheAssistant
    }
    // obtener datos desde la base de datos
    const assistant = await AssistantsDb.getAssistantById(assistantId)
    console.info('Assistant obtenido de la base de datos: ', assistantId)

    // almacenar en caché
    CacheData.set(assistantId, assistant)
    return assistant
  } catch (error) {
    console.error('getAssistantById: Error al obtener el assistant por ID:', error.message)
    return null
  }
}
