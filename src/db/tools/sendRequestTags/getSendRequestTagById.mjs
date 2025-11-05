import { SendRequestTagsDb } from './data.mjs'
import { CacheData } from './cacheData.mjs'

export async function getSendRequestTagById(sendRequestTagId) {
  try {
    // validar caché
    const cacheSendRequestTag = CacheData.get(sendRequestTagId)
    if (cacheSendRequestTag) {
      return cacheSendRequestTag
    }
    // obtener datos desde la base de datos
    const sendRequestTag = await SendRequestTagsDb.getSendRequestTagById(sendRequestTagId)
    console.info('SendRequestTag obtenido de la base de datos: ', sendRequestTagId)

    // almacenar en caché
    CacheData.set(sendRequestTagId, sendRequestTag)
    return sendRequestTag
  } catch (error) {
    console.error('getSendRequestTagById: Error al obtener el sendRequestTag por ID:', error.message)
    return null
  }
}
