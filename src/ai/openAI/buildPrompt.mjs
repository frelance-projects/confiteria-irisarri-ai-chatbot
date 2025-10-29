//TT MÓDULOS
import { getFullDateFormatGB, getFullDateFormatUS, getTimeFormat } from '#utilities/dateFunctions/dateNow.mjs'
import { sendLog } from '#logger/logger.mjs'

//TT CONSTRUIR PROMPTS
import { buildRequestTags } from './buildPrompt/toolSendRequest.mjs'
import { buildPromotions } from './buildPrompt/promotions.mjs'
import { buildClientProfile } from './buildPrompt/clientProfile.mjs'

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

    //fecha
    txt = txt.replaceAll('{date_now}', getFullDateFormatGB())
    txt = txt.replaceAll('{date_now_us}', getFullDateFormatUS())
    txt = txt.replaceAll('{time_now}', getTimeFormat())

    //SS PROMOCIONES
    //promociones
    if (txt.includes('{promotions}')) {
      const promotions = await buildPromotions()
      txt = txt.replaceAll('{promotions}', promotions)
    }

    //SS CLIENTE
    if (txt.includes('{client_profile}')) {
      const clientProfile = await buildClientProfile(user.whatsapp?.id)
      txt = txt.replaceAll('{client_profile}', clientProfile)
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
