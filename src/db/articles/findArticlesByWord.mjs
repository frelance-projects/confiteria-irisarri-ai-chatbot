import { CacheData } from './cacheData.mjs'

export async function findArticlesByWord(word) {
  const cacheArticles = CacheData.getAllArticles()
  if (!cacheArticles) {
    console.error('findArticlesByWord: No hay artículos en caché para obtener filtros')
    return null
  }

  // buscar articulos que contengan la palabra
  const articles = cacheArticles.filter((article) => {
    // Convertir la palabra de búsqueda a minúsculas para hacer la búsqueda case-insensitive
    const searchWord = word.toLowerCase()

    // Buscar en el nombre del artículo
    if (article.descripcion && article.descripcion.toLowerCase().includes(searchWord)) {
      return true
    }

    // Buscar en la descripción del artículo
    if (article.descripcionAvanzada && article.descripcionAvanzada.toLowerCase().includes(searchWord)) {
      return true
    }

    // Buscar en las familias
    if (article.familia && article.familia.toLowerCase().includes(searchWord)) {
      return true
    }

    // Buscar en el ramo
    if (article.ramo && article.ramo.toLowerCase().includes(searchWord)) {
      return true
    }

    // Buscar en el grupo
    if (article.grupo && article.grupo.toLowerCase().includes(searchWord)) {
      return true
    }
    return false
  })

  if (articles.length === 0) {
    console.log('No se encontró artículos con la palabra ' + word)
  }

  return articles
}
