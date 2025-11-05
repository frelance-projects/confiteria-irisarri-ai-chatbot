import { EmailTemplatesDb } from './data.mjs'
import { CacheData } from './cacheData.mjs'

export async function getTemplateById(templateId) {
  try {
    // validar caché
    const cacheTemplate = CacheData.get(templateId)
    if (cacheTemplate) {
      return cacheTemplate
    }
    // obtener datos desde la base de datos
    const template = await EmailTemplatesDb.getTemplateById(templateId)
    console.info('Template obtenido de la base de datos: ', templateId)

    // almacenar en caché
    CacheData.set(templateId, template)
    return template
  } catch (error) {
    console.error('getTemplateById: Error al obtener el template por ID:', error.message)
    return null
  }
}
