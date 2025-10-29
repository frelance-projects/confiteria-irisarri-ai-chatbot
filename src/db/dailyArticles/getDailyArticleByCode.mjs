import { DailyArticlesDb } from './data.mjs'
import { CacheData } from './cacheData.mjs'
import { updateDailyArticleParameters } from './utils.mjs'

export async function getDailyArticleByCode(code) {
  try {
    // validar caché
    const cacheArticle = CacheData.get(code)
    if (cacheArticle) {
      console.info('Artículo obtenido de la caché')
      return cacheArticle
    }
    // obtener datos desde la base de datos
    const article = await DailyArticlesDb.getDailyArticleByCode(code)

    //fix: actualizar parámetros de artículo diario
    const updatedArticle = await updateDailyArticleParameters(article)

    // almacenar en caché
    CacheData.set(updatedArticle.codigo, updatedArticle)

    return updatedArticle
  } catch (error) {
    console.error('getDailyArticleByCode: Error al obtener el artículo por código:', error.message)
    return null
  }
}
