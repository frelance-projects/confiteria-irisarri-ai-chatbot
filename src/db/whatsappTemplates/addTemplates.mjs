import { WhatsappTemplatesDb } from './data.mjs'
import { CacheData } from './cacheData.mjs'

export async function addTemplates(templates) {
  try {
    // obtener datos desde la base de datos
    const newTemplates = await WhatsappTemplatesDb.addTemplates(templates)
    // almacenar en caché
    if (Array.isArray(newTemplates)) {
      newTemplates.forEach((template) => {
        CacheData.set(template.id, template)
      })
    } else {
      CacheData.set(newTemplates.id, newTemplates)
    }
    return newTemplates
  } catch (error) {
    console.error('addTemplates: Error al agregar las plantillas:', error.message)
    return null
  }
}
