import { ClientsDb } from './data.mjs'
import { CacheData } from './cacheData.mjs'

export async function getClientByDni(dni) {
  try {
    // obtener datos desde la base de datos
    const client = await ClientsDb.getClientByDni(dni)
    console.log('Cliente obtenido de la base de datos: ', dni)

    // almacenar en caché
    CacheData.set(client.codigoCliente, client)

    return client
  } catch (error) {
    console.error('getClientByDni: Error al obtener el cliente por DNI:', error.message)
    return null
  }
}
