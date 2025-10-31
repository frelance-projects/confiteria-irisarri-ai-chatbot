import { getDailyArticlesByFilter } from '#db/dailyArticles/getDailyArticlesByFilter.mjs'
import { findDailyArticlesByWord } from '#db/dailyArticles/findDailyArticlesByWord.mjs'
import { formatToAi } from '#utilities/dailyArticles/formatToAi.mjs'

export async function getDailyArticles(args, user, userIdKey) {
  const { family, group, word } = args

  if (!family && !group && !word) {
    console.error('getDailyArticles: Al menos un filtro debe ser proporcionado')
    return { error: 'Al menos un filtro debe ser proporcionado' }
  }

  // Usar un Set para evitar artículos duplicados
  const articlesSet = new Set()

  // filtrar por familia
  if (family) {
    const articlesByFamily = await getDailyArticlesByFilter('familia', family)
    if (articlesByFamily) {
      articlesByFamily.forEach((article) => articlesSet.add(article))
    }
  }

  // filtrar por grupo
  if (group) {
    const articlesByGroup = await getDailyArticlesByFilter('grupo', group)
    if (articlesByGroup) {
      articlesByGroup.forEach((article) => articlesSet.add(article))
    }
  }

  // filtrar por palabra clave
  if (word) {
    const articlesByWord = await findDailyArticlesByWord(word)
    if (articlesByWord) {
      articlesByWord.forEach((article) => articlesSet.add(article))
    }
  }

  // Convertir el Set de nuevo a un array
  const articles = Array.from(articlesSet)
  // Formatear los artículos para la respuesta de la IA
  const formattedArticles = formatToAi(articles)

  console.info(
    `🧩 Respuesta de función: Se encontraron ${formattedArticles.length} artículos diarios con los filtros proporcionados.`
  )
  return formattedArticles
}
