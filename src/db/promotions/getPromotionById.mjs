import { PromotionsDb } from './data.mjs'
import { CacheData } from './cacheData.mjs'

export async function getPromotionById(promotionId) {
  try {
    // validar caché
    const cachePromotion = CacheData.get(promotionId)
    if (cachePromotion) {
      //console.info('Promoción obtenida de la caché')
      return cachePromotion
    }
    // obtener datos desde la base de datos
    const promotion = await PromotionsDb.getPromotionById(promotionId)
    console.log('Promoción obtenida de la base de datos: ', promotionId)

    // almacenar en caché
    CacheData.set(promotion.id, promotion)

    return promotion
  } catch (error) {
    console.error('getPromotionById: Error al obtener la promoción por ID:', error.message)
    return null
  }
}
