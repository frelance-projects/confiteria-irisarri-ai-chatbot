//TT MÓDULOS
import { ENV } from '#config/config.mjs'
//appsheet
import { loadArticles as loadArticlesAppsheet } from '#apps/appsheet/config/articles/articles.mjs'

let ARTICLES = null
let PROMISE = null

//TT OBTENER ARTÍCULOS
export async function getArticles() {
  // Si ya se cargó previamente, se retorna inmediatamente
  if (ARTICLES) return ARTICLES

  // Si no hay una promesa en curso, se crea una
  if (!PROMISE) {
    if (ENV.APP_FRONTEND === 'appsheet') {
      PROMISE = loadArticlesAppsheet('load')
    } else {
      console.error('plataforma de frontend no soportada')
      return null
    }
  }

  // Se espera a que se resuelva la promesa y se almacena el resultado
  ARTICLES = await PROMISE
  return ARTICLES
}

export function setArticles(obj) {
  ARTICLES = obj
  // Se actualiza también la promesa para que futuras llamadas la utilicen
  PROMISE = Promise.resolve(obj)
  return obj
}
