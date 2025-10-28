import { UsersDb } from './data.mjs'
import { CacheData } from './cacheData.mjs'

export async function getUserByPlatform(id, platform) {
  try {
    // validar caché
    const cacheUser = CacheData.getByPlatform(id, platform)
    if (cacheUser) {
      console.info('Usuario obtenido de la caché')
      return cacheUser
    }
    // obtener datos desde la base de datos
    const user = await UsersDb.getUserByPlatform(id, platform)

    // almacenar en caché
    CacheData.set(user.id, user)
    return user
  } catch (error) {
    console.warn(`getUserByPlatform: Error al obtener el usuario por plataforma: ${platform}, id: ${id}`)
    return null
  }
}
