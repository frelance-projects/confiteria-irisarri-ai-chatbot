import { getCacheDuration } from '#config/config.mjs'

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

  // Obtener dato de la caché por plataforma
  static getByPlatform(id, platform) {
    const currentTime = Date.now()
    
    for (const cached of this.cache.values()) {
      // Solo verificar validez del cache sin eliminarlo
      if (currentTime - cached.timestamp < CACHE_TTL) {
        const platformData = cached.value[platform]
        if (platformData?.id === id) {
          return cached.value
        }
      }
    }
    return null
  }

  // Establecer dato en la caché
  static set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    })
  }

  // Eliminar dato de la caché
  static delete(key) {
    this.cache.delete(key)
  }

  // Limpiar la caché
  static clear() {
    this.cache.clear()
  }
}
