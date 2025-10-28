import { UsersDb } from './data.mjs'
import { CacheData } from './cacheData.mjs'

export async function updateUser(user) {
  try {
    // obtener datos desde la base de datos
    const updatedUser = await UsersDb.updateUser(user)
    // almacenar en caché
    CacheData.set(updatedUser.id, updatedUser)
    return updatedUser
  } catch (error) {
    console.error('updateUser: Error al actualizar el usuario:', error.message)
    return null
  }
}
