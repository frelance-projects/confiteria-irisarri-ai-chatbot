import { UsersDb } from './data.mjs'
import { CacheData } from './cacheData.mjs'

export async function getLastContactById(userId) {
  try {
    // obtener datos desde la base de datos
    const user = await UsersDb.getLastContactById(userId)
    // almacenar en caché
    CacheData.set(userId, user)
    return user
  } catch (error) {
    console.error('getLastContactById: Error al obtener el último contacto por ID:', error.message)
    return null
  }
}
