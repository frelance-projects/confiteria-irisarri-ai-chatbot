//TT MÓDULOS
import { getFullDateFormatGB, getFullDateFormatUS, getTimeFormat } from '#utilities/dateFunctions/dateNow.mjs'
import { sendLog } from '#logger/logger.mjs'

//TT CONSTRUIR PROMPTS
import { buildRequestTags } from './buildPrompt/toolSendRequest.mjs'
import { buildArticles } from './buildPrompt/articles.mjs'
import { buildArticlesDaily } from './buildPrompt/articlesDaily.mjs'
import { buildPromotions } from './buildPrompt/promotions.mjs'

//TT CONSTRUIR PROMPTS
export async function buildPrompt(brain, user) {
  try {
    //SS ESTRUCTURA
    //cargar base
    const head = brain.headPrompt
    const body = brain.prompt
    const footer = brain.footerPrompt
    let txt = ''

    //construir base
    if (head) txt += head + '\n'
    if (body) txt += '\n- - -\n\n' + body + '\n\n- - -\n'
    if (footer) txt += '\n' + footer

    //SS GENERAL
    //usuario
    const userName = user.name || 'desconocido'
    const userNameRegistered = user.registeredName || 'desconocido'
    const userEmail = user.email || 'desconocido'
    txt = txt.replaceAll('{user_name}', userName)
    txt = txt.replaceAll('{user_name_registered}', userNameRegistered)
    txt = txt.replaceAll('{user_email}', userEmail)

    // datos de cliente
    const clientDni = user.dni || 'desconocido'
    const clientPhone = user.clientPhone || 'desconocido'
    txt = txt.replaceAll('{client_dni}', clientDni)
    txt = txt.replaceAll('{client_phone}', clientPhone)
    //fecha
    txt = txt.replaceAll('{date_now}', getFullDateFormatGB())
    txt = txt.replaceAll('{date_now_us}', getFullDateFormatUS())
    txt = txt.replaceAll('{time_now}', getTimeFormat())

    //SS ARTÍCULOS Y PROMOCIONES
    //artículos
    if (txt.includes('{articles}')) {
      const articles = await buildArticles()
      txt = txt.replaceAll('{articles}', articles)
    }
    //artículos diarios
    if (txt.includes('{articles_daily}')) {
      const articlesDaily = await buildArticlesDaily()
      txt = txt.replaceAll('{articles_daily}', articlesDaily)
    }
    //promociones
    if (txt.includes('{promotions}')) {
      const promotions = await buildPromotions()
      txt = txt.replaceAll('{promotions}', promotions)
    }

    //SS TOOLS
    //sendRequest
    if (brain.toolSendRequest && txt.includes('{request_tags}')) {
      const requestTags = await buildRequestTags(brain.toolSendRequest)
      txt = txt.replaceAll('{request_tags}', requestTags)
    }

    return txt
  } catch (error) {
    console.error('buildPrompt: Error al construir el prompt', error)
    sendLog('error', 'ai/openAI/buildPrompt', 'Error creating message:\n' + String(error))
    return 'Error al construir el prompt'
  }
}
