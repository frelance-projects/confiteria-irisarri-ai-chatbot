import { getArticlesDaily } from '#config/articles/articlesDaily.mjs'

//TT CONSTRUIR ARTÍCULOS
export async function buildArticlesDaily() {
  const articles = await getArticlesDaily()
  if (!articles) {
    return 'No hay artículos diarios disponibles'
  }
  const activeArticles = articles.filter((article) => article.availableToday)
  if (activeArticles.length === 0) {
    return 'No hay artículos diarios activos disponibles'
  }

  console.log('Artículos diarios activos disponibles: ', activeArticles.length)

  let text = ''
  for (const article of activeArticles) {
    text += `- ${article.description}\n`
    text += `  * Código: ${article.code}\n`
    text += `  * Precio de venta: ${article.salePrice}\n`
    text += `  * Familia: ${article.family}\n`
    text += `  * Grupo: ${article.group}\n`
    text += `  * Imagen del artículo: ${article.urlImage || 'No disponible'}\n`
    text += `\n`
  }
  //console.info('appsheet: configuración de <articlesDaily> construida: ', text)
  return text
}
