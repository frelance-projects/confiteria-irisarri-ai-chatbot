import { UsersDb } from './data.mjs'
import { CacheData } from './cacheData.mjs'

export async function addUser(user) {
  try {
    // obtener datos desde la base de datos
    const newUser = await UsersDb.addUser(user)
    // almacenar en caché
    CacheData.set(newUser.id, newUser)
    return newUser
  } catch (error) {
    console.error('addUser: Error al agregar el usuario:', error.message)
    return null
  }
}
