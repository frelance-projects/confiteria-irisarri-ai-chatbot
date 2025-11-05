import { SendRequestDb } from './data.mjs'
import { CacheData } from './cacheData.mjs'

export async function getSendRequestById(sendRequestId) {
  try {
    // validar caché
    const cacheSendRequest = CacheData.get(sendRequestId)
    if (cacheSendRequest) {
      return cacheSendRequest
    }
    // obtener datos desde la base de datos
    const sendRequest = await SendRequestDb.getSendRequestById(sendRequestId)
    console.info('SendRequest obtenido de la base de datos: ', sendRequestId)

    // almacenar en caché
    CacheData.set(sendRequestId, sendRequest)
    return sendRequest
  } catch (error) {
    console.error('getSendRequestById: Error al obtener el sendRequest por ID:', error.message)
    return null
  }
}
