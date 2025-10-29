import { DailyArticlesDb } from './data.mjs'
import { CacheData } from './cacheData.mjs'
import { updateDailyArticlesParameters } from './utils.mjs'

export async function getAllDailyArticles() {
  try {
    // validar caché
    const cacheArticles = CacheData.getAllDailyArticles()
    if (cacheArticles) {
      console.info('Artículos obtenidos de la caché')
      return cacheArticles
    }

    // obtener datos desde la base de datos
    const articles = await DailyArticlesDb.getAllDailyArticles()

    //fix: actualizar parámetros de artículos diarios
    const updatedArticles = await updateDailyArticlesParameters(articles)

    // actualizar caché de todos los artículos
    CacheData.hasAllDailyArticles(updatedArticles)

    return updatedArticles
  } catch (error) {
    console.error('getAllDailyArticles: Error al obtener todos los artículos:', error.message)
    return null
  }
}
