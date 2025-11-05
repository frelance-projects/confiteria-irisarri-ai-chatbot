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

  // Obtener todos los asistentes en caché
  static getAllSendRequestTags() {
    const sendRequestTags = []

    // Recopilar etiquetas de solicitud válidas e identificar claves expiradas
    for (const cached of this.cache.values()) {
      sendRequestTags.push(cached.value)
    }

    // Si no hay etiquetas de solicitud válidas, limpiar el timestamp
    if (sendRequestTags.length === 0) {
      this.clear()
      return null
    }

    return sendRequestTags
  }

  // Establecer dato en la caché
  static set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    })
  }

  // establecer todos los asistentes en caché
  static hasAllSendRequestTags(data) {
    const all = Array.isArray(data) ? data : []
    for (const sendRequestTag of all) {
      this.set(sendRequestTag.id, sendRequestTag)
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
}

CacheManager.addData('toolSendRequestTags', CacheData)
