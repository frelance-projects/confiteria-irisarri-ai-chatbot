import { ArticlesDb } from './data.mjs'
import { CacheData } from './cacheData.mjs'

export async function getAllArticles() {
  try {
    // validar caché
    const cacheArticles = CacheData.getAllArticles()
    if (cacheArticles) {
      console.info('Artículos obtenidos de la caché')
      return cacheArticles
    }

    // obtener datos desde la base de datos
    const articles = await ArticlesDb.getAllArticles()

    // actualizar caché de todos los artículos
    CacheData.hasAllArticles(articles)

    return articles
  } catch (error) {
    console.error('getLastContactById: Error al obtener el último contacto por ID:', error.message)
    return null
  }
}
