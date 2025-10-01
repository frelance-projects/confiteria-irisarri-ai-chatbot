import { getArticles } from '#config/articles/articles.mjs'

//TT CONSTRUIR ARTÍCULOS
export async function buildArticles() {
  const articles = await getArticles()
  if (!articles) {
    return 'No hay artículos disponibles'
  }
  const activeArticles = articles.filter((article) => article.stock > 0 && article.active)
  if (activeArticles.length === 0) {
    return 'No hay artículos activos disponibles'
  }

  console.log('Artículos activos disponibles: ', activeArticles.length)

  let text = ''
  for (const article of activeArticles) {
    text += `- ${article.description}\n`
    text += `  * Código: ${article.code}\n`
    text += `  * Descripción: ${article.advancedDescription}\n`
    text += `  * Precio de venta: ${article.salePrice}\n`
    text += `  * Unidad de medida: ${article.unit}\n`
    text += `  * Familia: ${article.family}\n`
    text += `  * Grupo: ${article.group}\n\n`
  }
  //console.info('appsheet: configuración de <articles> construida: ', text)
  return text
}
