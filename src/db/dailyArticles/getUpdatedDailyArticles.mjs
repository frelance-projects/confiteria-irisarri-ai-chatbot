import { DailyArticlesDb } from './data.mjs'
import { CacheData } from './cacheData.mjs'
import { updateDailyArticlesParameters } from './utils.mjs'

export async function getUpdatedDailyArticles(sinceDate) {
  try {
    // obtener datos desde la base de datos
    const articles = await DailyArticlesDb.getUpdatedDailyArticles(sinceDate)

    //fix: actualizar parámetros de artículos diarios
    const updatedArticles = await updateDailyArticlesParameters(articles)

    // actualizar caché de todos los artículos
    if (updatedArticles.length > 0) {
      CacheData.hasAllDailyArticles(updatedArticles)
    }

    return CacheData.getAllDailyArticles() || []
  } catch (error) {
    console.error('getUpdatedDailyArticles: Error al obtener artículos actualizados:', error.message)
    return []
  }
}
