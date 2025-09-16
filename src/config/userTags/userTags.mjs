//TT MÓDULOS
import { ENV } from '#config/config.mjs'
//appsheet
import { loadUserTags as loadUserTagsAppsheet } from '#apps/appsheet/config/userTags.mjs'

let USERSTAGS = null
let PROMISE = null

//TT OBTENER ETIQUETAS DE USUARIOS
export async function getUserTags() {
  // Si ya se cargó previamente, se retorna inmediatamente
  if (USERSTAGS) return USERSTAGS

  // Si no hay una promesa en curso, se crea una
  if (!PROMISE) {
    if (ENV.APP_FRONTEND === 'appsheet') {
      PROMISE = loadUserTagsAppsheet('load')
    } else {
      console.error('plataforma de frontend no soportada')
      return null
    }
  }

  // Se espera a que se resuelva la promesa y se almacena el resultado
  USERSTAGS = await PROMISE
  return USERSTAGS
}

//TT OBTENER ETIQUETAS DE USUARIOS POR ID
export async function getUserTagsById(tagId) {
  const usersTags = await getUserTags()
  if (!usersTags) {
    return null
  }
  const tag = usersTags.find((obj) => obj.id === tagId)
  if (!tag) {
    console.error(`getBrain: No se ha encontrado el cerebro ${tagId}`)
    return null
  }
  return tag
}

//TT ACTUALIZAR ETIQUETAS DE USUARIOS
export function setUserTags(obj) {
  USERSTAGS = obj
  // Se actualiza también la promesa para que futuras llamadas la utilicen
  PROMISE = Promise.resolve(obj)
  return obj
}
