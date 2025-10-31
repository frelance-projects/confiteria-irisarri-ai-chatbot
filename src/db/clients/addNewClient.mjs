import { ClientsDb } from './data.mjs'
import { CacheData } from './cacheData.mjs'

export async function addNewClient(client) {
  try {
    //TODO: agregar validación de ser necesario

    // agregar a base de datos
    const newUser = await ClientsDb.addNewClient(client)
    // almacenar en caché
    CacheData.set(newUser.codigoCliente, newUser)
    return newUser
  } catch (error) {
    console.error('addNewClient: Error al agregar nuevo cliente:', error.message)
    return null
  }
}
