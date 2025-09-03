import { getFullDateFormatGB, getFullDateFormatUS, getTimeFormat } from '#utilities/dateFunctions/dateNow.mjs'

//TT CONSTRUIR MENSAJE EMAIL
export function requestEmailFormat(user, platform, htmlTamplate, request, tag) {
  const userid = user[platform].id
  let txt = htmlTamplate.replaceAll('{user_name}', user.name)
  txt = txt.replaceAll('{user_id}', userid)
  txt = txt.replaceAll('{platform}', platform)
  txt = txt.replaceAll('{tag}', tag)
  txt = txt.replaceAll('{user_request}', request)
  txt = txt.replaceAll('{date_now}', getFullDateFormatGB())
  txt = txt.replaceAll('{date_now_us}', getFullDateFormatUS())
  txt = txt.replaceAll('{time_now}', getTimeFormat())
  return txt
}
