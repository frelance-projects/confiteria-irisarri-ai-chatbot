import { getArticleByCode } from '#db/articles/getArticleByCode.mjs'

//ss actualizar parámetros de artículos diarios
export async function updateDailyArticlesParameters(articles) {
  const updateArticles = []

  for (const article of articles) {
    const fullArticle = await getArticleByCode(article.codigo)
    if (!fullArticle) {
      console.warn(
        `updateDailyArticlesParameters: No se encontró el artículo completo para el código ${article.codigo}`
      )
      updateArticles.push(article)
      continue
    }
    // copiar unidades y precios
    article.unidadMedida = fullArticle.unidadMedida
    article.precioVenta = fullArticle.precioVenta
    updateArticles.push(article)
  }
  return updateArticles
}

//ss actualizar parámetros de artículo diario
export async function updateDailyArticleParameters(article) {
  const fullArticle = await getArticleByCode(article.codigo)
  if (!fullArticle) {
    console.warn(`updateDailyArticleParameters: No se encontró el artículo completo para el código ${article.codigo}`)
    return article
  }
  // copiar unidades y precios
  article.unidadMedida = fullArticle.unidadMedida
  article.precioVenta = fullArticle.precioVenta
  return article
}
