import { getCacheDuration } from '#config/config.mjs'
import { CacheManager } from '#db/cache/cacheManager.mjs'
import { getAssistantById } from '#db/assistants/getAssistantById.mjs'

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
  static getAllAssistants() {
    const assistants = []

    // Recopilar asistentes válidos e identificar claves expiradas
    for (const cached of this.cache.values()) {
      assistants.push(cached.value)
    }

    // Si no hay asistentes válidos, limpiar el timestamp
    if (assistants.length === 0) {
      this.clear()
      return null
    }

    return assistants
  }

  // Establecer dato en la caché
  static set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    })
  }

  // establecer todos los asistentes en caché
  static hasAllAssistants(data) {
    for (const assistant of data) {
      this.set(assistant.id, assistant)
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
    const assistant = await getAssistantById(key)
    if (assistant) {
      console.info(`Recargando asistente en caché con ID: ${key}`)
    } else {
      console.info(`No se encontró asistente para recargar con ID: ${key}`)
    }
  }
}

CacheManager.addData('assistants', CacheData)
