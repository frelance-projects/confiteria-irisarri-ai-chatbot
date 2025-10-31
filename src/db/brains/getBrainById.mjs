import { BrainsDb } from './data.mjs'
import { CacheData } from './cacheData.mjs'

export async function getBrainById(brainId) {
  try {
    // validar caché
    const cacheBrain = CacheData.get(brainId)
    if (cacheBrain) {
      return cacheBrain
    }
    // obtener datos desde la base de datos
    const brain = await BrainsDb.getBrainById(brainId)
    console.info('Brain obtenido de la base de datos: ', brainId)

    // almacenar en caché
    CacheData.set(brainId, brain)
    return brain
  } catch (error) {
    console.error('getBrainById: Error al obtener el brain por ID:', error.message)
    return null
  }
}
