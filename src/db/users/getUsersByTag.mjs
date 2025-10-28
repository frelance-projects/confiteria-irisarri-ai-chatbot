import { UsersDb } from './data.mjs'

export async function getUsersByTag(tag) {
  try {
    // obtener datos desde la base de datos
    const users = await UsersDb.getUsersByTag(tag)
    return users
  } catch (error) {
    console.error('getUsersByTag: Error al obtener los usuarios por etiqueta:', error.message)
    return []
  }
}
