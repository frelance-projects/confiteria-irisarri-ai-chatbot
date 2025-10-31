import { ArticlesDb } from './data.mjs'
import { CacheData } from './cacheData.mjs'

export async function getUpdatedArticles(sinceDate) {
  try {
    // obtener datos desde la base de datos
    const articles = await ArticlesDb.getUpdatedArticles(sinceDate)

    // actualizar caché de todos los artículos
    if (articles.length > 0) {
      CacheData.hasAllArticles(articles)
    }

    return CacheData.getAllArticles() || []
  } catch (error) {
    console.error('getUpdatedArticles: Error al obtener artículos actualizados:', error.message)
    return []
  }
}
