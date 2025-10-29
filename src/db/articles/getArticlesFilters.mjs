import { CacheData } from './cacheData.mjs'

let CACHE_FILTERS = null

export async function getArticlesFilters() {
  try {
    if (CACHE_FILTERS) {
      return CACHE_FILTERS
    }

    const cacheArticles = CacheData.getAllArticles()
    if (!cacheArticles) {
      console.error('getArticlesFilters: No hay artículos en caché para obtener filtros')
      return null
    }

    const data = {
      branch: new Set(),
      family: new Set(),
      group: new Set(),
      unit: new Set(),
    }

    for (const article of cacheArticles) {
      data.branch.add(article.ramo)
      data.family.add(article.familia)
      data.group.add(article.grupo)
      data.unit.add(article.unidadMedida)
    }

    data.branch = Array.from(data.branch).filter(Boolean).sort()
    data.family = Array.from(data.family).filter(Boolean).sort()
    data.group = Array.from(data.group).filter(Boolean).sort()
    data.unit = Array.from(data.unit).filter(Boolean).sort()

    CACHE_FILTERS = data

    return data
  } catch (error) {
    console.error('getArticlesFilters: Error al obtener los filtros:', error.message)
    return null
  }
}
