import { getCacheDuration } from '#config/config.mjs'
import { CacheManager } from '#db/cache/cacheManager.mjs'

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

  // Obtener todos los clientes en caché
  static getAllClients() {
    const clients = []

    // Recopilar clientes válidos e identificar claves expiradas
    for (const cached of this.cache.values()) {
      clients.push(cached.value)
    }

    // Si no hay clientes válidos, limpiar el timestamp
    if (clients.length === 0) {
      this.clear()
      return null
    }

    return clients
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

CacheManager.addData('clients', CacheData)
