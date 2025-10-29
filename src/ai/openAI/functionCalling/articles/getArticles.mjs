import { getArticlesByFilter } from '#db/articles/getArticlesByFilter.mjs'
import { findArticlesByWord } from '#db/articles/findArticlesByWord.mjs'
import { formatToAi } from '#utilities/articles/formatToAi.mjs'

export async function getArticles(args, user, userIdKey) {
  const { family, group, word } = args

  if (!family && !group && !word) {
    console.error('getArticles: Al menos un filtro debe ser proporcionado')
    return { error: 'Al menos un filtro debe ser proporcionado' }
  }

  // Usar un Set para evitar artículos duplicados
  const articlesSet = new Set()

  // filtrar por familia
  if (family) {
    const articlesByFamily = await getArticlesByFilter('familia', family)
    if (articlesByFamily) {
      articlesByFamily.forEach((article) => articlesSet.add(article))
    }
  }

  // filtrar por grupo
  if (group) {
    const articlesByGroup = await getArticlesByFilter('grupo', group)
    if (articlesByGroup) {
      articlesByGroup.forEach((article) => articlesSet.add(article))
    }
  }

  // filtrar por palabra clave
  if (word) {
    const articlesByWord = await findArticlesByWord(word)
    if (articlesByWord) {
      articlesByWord.forEach((article) => articlesSet.add(article))
    }
  }

  const articles = Array.from(articlesSet)
  const formattedArticles = formatToAi(articles)

  console.info(`getArticles: Se encontraron ${formattedArticles.length} artículos con los filtros proporcionados.`)
  return formattedArticles
}
