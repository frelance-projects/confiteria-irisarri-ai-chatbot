import { getCacheDuration } from '#config/config.mjs'
import { CacheManager } from '#db/cache/cacheManager.mjs'
import { getDailyArticleByCode } from '#db/dailyArticles/getDailyArticleByCode.mjs'

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

  // Obtener todos los artículos en caché
  static getAllDailyArticles() {
    const articles = []

    // Recopilar artículos válidos e identificar claves expiradas
    for (const cached of this.cache.values()) {
      articles.push(cached.value)
    }

    // Si no hay artículos válidos, limpiar el timestamp
    if (articles.length === 0) {
      this.clear()
      return null
    }

    return articles
  }

  // Establecer dato en la caché
  static set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    })
  }

  // establecer todos los artículos en caché
  static hasAllDailyArticles(data) {
    for (const article of data) {
      this.set(article.codigo, article)
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
    const article = await getDailyArticleByCode(key)
    if (article) {
      console.info(`Artículo diario recargado en caché para código ${key}`)
    }
  }
}

CacheManager.addData('dailyArticles', CacheData)
