import { PromotionsDb } from './data.mjs'
import { CacheData } from './cacheData.mjs'

export async function getAllPromotions(brainId) {
  try {
    // validar caché
    const cachePromotions = CacheData.getAll()
    if (cachePromotions) {
      console.info('Promociones obtenidas de la caché')
      return cachePromotions
    }
    // obtener datos desde la base de datos
    const promotions = await PromotionsDb.getAllPromotions()
    console.info('Promociones obtenidas de la base de datos: ', promotions.length)

    // almacenar en caché
    CacheData.setAllPromotions(promotions)

    return promotions
  } catch (error) {
    console.error('getAllPromotions: Error al obtener todas las promociones:', error.message)
    return []
  }
}
