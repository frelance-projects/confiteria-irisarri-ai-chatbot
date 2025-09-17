//TT MÓDULOS
import { ENV } from '#config/config.mjs'
//appsheet
import { loadArticlesDaily as loadArticlesDailyAppsheet } from '#apps/appsheet/config/articles/articlesDaily.mjs'

let ARTICLES_DAILY = null
let PROMISE = null

//TT OBTENER ARTÍCULOS
export async function getArticlesDaily() {
  // Si ya se cargó previamente, se retorna inmediatamente
  if (ARTICLES_DAILY) return ARTICLES_DAILY

  // Si no hay una promesa en curso, se crea una
  if (!PROMISE) {
    if (ENV.APP_FRONTEND === 'appsheet') {
      PROMISE = loadArticlesDailyAppsheet('load')
    } else {
      console.error('plataforma de frontend no soportada')
      return null
    }
  }

  // Se espera a que se resuelva la promesa y se almacena el resultado
  ARTICLES_DAILY = await PROMISE
  return ARTICLES_DAILY
}

export async function getArticleDailyByCode(code) {
  const articles = await getArticlesDaily()
  if (!articles) {
    return null
  }
  return articles.find((article) => String(article.code) === String(code)) || null
}

export function setArticlesDaily(obj) {
  ARTICLES_DAILY = obj
  // Se actualiza también la promesa para que futuras llamadas la utilicen
  PROMISE = Promise.resolve(obj)
  return obj
}
