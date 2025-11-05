import { SendRequestTagsDb } from './data.mjs'
import { CacheData } from './cacheData.mjs'

export async function getAllSendRequestTags() {
  try {
    // validar caché
    const cacheSendRequestTags = CacheData.getAllSendRequestTags()
    if (cacheSendRequestTags) {
      console.info('Etiquetas de solicitud obtenidas de la caché')
      return cacheSendRequestTags
    }

    // obtener datos desde la base de datos
    const sendRequestTags = await SendRequestTagsDb.getAllSendRequestTags()
    console.info('Etiquetas de solicitud obtenidas de la base de datos')

    // actualizar caché de todos los sendRequestTags
    CacheData.hasAllSendRequestTags(sendRequestTags)

    return Array.isArray(sendRequestTags) ? sendRequestTags : []
  } catch (error) {
    console.error('getAllSendRequestTags: Error al obtener todos los sendRequestTags:', error.message)
    return []
  }
}
