import { ClientsDb } from './data.mjs'
import { CacheData } from './cacheData.mjs'
import { deletePhoneExtension } from '#utilities/facturapp/formatPhone.mjs'

export async function getClientByPhone(phone) {
  try {
    // normalizar numero de telefono
    const cleanPhone = deletePhoneExtension(phone)
    // obtener datos desde la base de datos
    const client = await ClientsDb.getClientByPhone(cleanPhone)
    console.log('Cliente obtenido de la base de datos: ', cleanPhone)

    // almacenar en caché
    CacheData.set(client.codigoCliente, client)

    return client
  } catch (error) {
    console.error('getClientByPhone: Error al obtener el cliente por teléfono:', error.message)
    return null
  }
}
