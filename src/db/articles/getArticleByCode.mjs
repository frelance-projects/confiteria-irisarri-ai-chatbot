import { ArticlesDb } from './data.mjs'
import { CacheData } from './cacheData.mjs'

export async function getArticleByCode(code) {
  try {
    // validar caché
    const cacheArticle = CacheData.get(code)
    if (cacheArticle) {
      //console.info('Artículo obtenido de la caché')
      return cacheArticle
    }
    // obtener datos desde la base de datos
    const article = await ArticlesDb.getArticleByCode(code)
    console.log('Artículo obtenido de la base de datos: ', code)

    // almacenar en caché
    CacheData.set(article.codigo, article)

    return article
  } catch (error) {
    console.error('getArticleByCode: Error al obtener el artículo por código:', error.message)
    return null
  }
}
