import { CacheData } from './cacheData.mjs'

export async function getArticlesByFilter(filter, value) {
  const cacheArticles = CacheData.getAllArticles()
  if (!cacheArticles) {
    console.error('findArticlesByWord: No hay artículos en caché para obtener filtros')
    return null
  }

  const articles = cacheArticles.filter((article) => article[filter] === value)

  if (articles.length === 0) {
    console.log(`No se encontró artículos con el filtro ${filter} y valor ${value}`)
  }

  return articles
}
