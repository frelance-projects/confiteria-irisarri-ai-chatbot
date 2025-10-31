import { ClientsDb } from './data.mjs'
import { CacheData } from './cacheData.mjs'

export async function getClientByCode(code) {
  try {
    // validar caché
    const cacheClient = CacheData.get(code)
    if (cacheClient) {
      console.info('Cliente obtenido de la caché')
      return cacheClient
    }
    // obtener datos desde la base de datos
    const client = await ClientsDb.getClientByCode(code)

    // almacenar en caché
    CacheData.set(client.codigoCliente, client)

    return client
  } catch (error) {
    console.error('getClientByCode: Error al obtener el cliente por código:', error.message)
    return null
  }
}
