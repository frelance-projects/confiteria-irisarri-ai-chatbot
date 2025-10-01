import { getArticlesDaily } from '#config/articles/articlesDaily.mjs'

//TT CONSTRUIR ARTÍCULOS
export async function buildArticlesDaily() {
  console.log('Construyendo artículos diarios...')
  const articles = await getArticlesDaily()
  if (!articles) {
    return 'No hay artículos diarios disponibles'
  }
  const activeArticles = articles.filter((article) => article.available && article.stock > 0)
  if (activeArticles.length === 0) {
    console.warn('No hay artículos diarios activos disponibles')
    return 'No hay artículos diarios activos disponibles'
  }

  console.log('Artículos diarios activos disponibles: ', activeArticles.length)

  let text = ''
  for (const article of activeArticles) {
    text += `- ${article.description}\n`
    if (article.advancedDescription && article.advancedDescription.length > 0) {
      text += `  * Descripción: ${article.advancedDescription}\n`
    }
    text += `  * Código: ${article.code}\n`
    text += `  * Precio de venta: ${article.salePrice}\n`
    text += `  * Familia: ${article.family}\n`
    text += `  * Grupo: ${article.group}\n`
    text += `  * Libre de azúcar: ${article.withoutSugar ? 'Sí' : 'No'}\n`
    text += `  * Apto para celíacos: ${article.suitableForCeliacs ? 'Sí' : 'No'}\n`
    text += `  * Libre de harina: ${article.withoutFlour ? 'Sí' : 'No'}\n`
    text += `  * Vegano: ${article.vegan ? 'Sí' : 'No'}\n`

    if (article.minimumQuantity && article.minimumQuantity > 0) {
      text += `  * Cantidad mínima: ${article.minimumQuantity}\n`
    }
    if (article.multipleOf && article.multipleOf > 0) {
      text += `  * Cantidad múltiple de: ${article.multipleOf}\n`
    }
    if (article.hoursInAdvance && article.hoursInAdvance > 0) {
      text += `  * Horas de anticipación: ${article.hoursInAdvance}\n`
    }
    text += `  * Imagen del artículo: ${article.urlImage || 'No disponible'}\n\n`
  }
  //console.info('appsheet: configuración de <articlesDaily> construida: ', text)
  return text
}
