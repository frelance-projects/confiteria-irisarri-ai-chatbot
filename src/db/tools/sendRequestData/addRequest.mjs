import { SendRequestDataDb } from './data.mjs'

export async function addRequest(request) {
  try {
    // obtener datos desde la base de datos
    const newRequest = await SendRequestDataDb.addRequest(request)
    return newRequest
  } catch (error) {
    console.error('addRequest: Error al agregar la solicitud:', error.message)
    return null
  }
}
