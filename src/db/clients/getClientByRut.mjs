import { ClientsDb } from './data.mjs'
import { CacheData } from './cacheData.mjs'

export async function getClientByRut(rut) {
  try {
    // obtener datos desde la base de datos
    const client = await ClientsDb.getClientByRut(rut)
    console.log('Cliente obtenido de la base de datos: ', rut)

    // almacenar en caché
    CacheData.set(client.codigoCliente, client)

    return client
  } catch (error) {
    console.error('getClientByRut: Error al obtener el cliente por RUT:', error.message)
    return null
  }
}
