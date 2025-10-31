import { CacheData } from '#db/articles/cacheData.mjs'

//ss actualizar parámetros de artículos diarios
export async function updateDailyArticlesParameters(articles) {
  const updateArticles = []

  const noFoundCodes = []

  for (const article of articles) {
    const fullArticle = CacheData.get(article.codigo)
    if (!fullArticle) {
      noFoundCodes.push(article.codigo)
      continue
    }
    // copiar unidades y precios
    article.unidadMedida = fullArticle.unidadMedida
    article.precioVenta = fullArticle.precioVenta
    updateArticles.push(article)
  }
  if (noFoundCodes.length > 0) {
    console.warn(
      `updateDailyArticlesParameters: No se encontraron la siguiente cantidad de artículos diarios: ${noFoundCodes.length} de ${articles.length} totales`
    )
  }
  return updateArticles
}

//ss actualizar parámetros de artículo diario
export async function updateDailyArticleParameters(article) {
  const fullArticle = CacheData.get(article.codigo)
  if (!fullArticle) {
    console.warn(`updateDailyArticleParameters: No se encontró el artículo completo para el código ${article.codigo}`)
    return article
  }
  // copiar unidades y precios
  article.unidadMedida = fullArticle.unidadMedida
  article.precioVenta = fullArticle.precioVenta
  return article
}
