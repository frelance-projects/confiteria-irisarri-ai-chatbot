import { UsersDb } from './data.mjs'
import { CacheData } from './cacheData.mjs'

export async function getUserById(userId) {
  try {
    // validar caché
    const cacheUser = CacheData.get(userId)
    if (cacheUser) {
      console.info('Usuario obtenido de la caché')
      return cacheUser
    }
    // obtener datos desde la base de datos
    const user = await UsersDb.getUserById(userId)

    // almacenar en caché
    CacheData.set(userId, user)
    return user
  } catch (error) {
    console.error('getUserById: Error al obtener el usuario por ID:', error.message)
    return null
  }
}
