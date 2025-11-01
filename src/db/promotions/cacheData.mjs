import { getCacheDuration } from '#config/config.mjs'
import { CacheManager } from '#db/cache/cacheManager.mjs'
import { getPromotionById } from '#db/promotions/getPromotionById.mjs'

const CACHE_TTL = getCacheDuration()

export class CacheData {
  static cache = new Map()

  // Obtener dato de la caché
  static get(key) {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.value
    }
    this.cache.delete(key)
    return null
  }

  static getAll() {
    const promotions = []

    // Recopilar artículos válidos e identificar claves expiradas
    for (const cached of this.cache.values()) {
      promotions.push(cached.value)
    }

    // Si no hay artículos válidos, limpiar el timestamp
    if (promotions.length === 0) {
      this.clear()
      return null
    }

    return promotions
  }

  // Establecer dato en la caché
  static set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    })
  }

  // establecer todos los artículos en caché
  static setAllPromotions(data) {
    for (const promotion of data) {
      this.set(promotion.id, promotion)
    }
  }

  // Eliminar dato de la caché
  static delete(key) {
    this.cache.delete(key)
  }

  // Limpiar la caché
  static clear() {
    this.cache.clear()
  }

  // Recargar dato específico
  static async reload(key) {
    const promotion = await getPromotionById(key)
    if (promotion) {
      console.info(`Promoción recargada en caché para ID ${key}`)
    }
  }
}

CacheManager.addData('promotions', CacheData)
