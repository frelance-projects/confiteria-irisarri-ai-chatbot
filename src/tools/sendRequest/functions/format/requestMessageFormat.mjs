import { getFullDateFormatGB, getFullDateFormatUS, getTimeFormat } from '#utilities/dateFunctions/dateNow.mjs'

//TT CONSTRUIR MENSAJE BASE
export function requestMessageFormat(user, platform, message, request, tagName) {
  const userid = user[platform].id
  let txt = message.replaceAll('{user_name}', user.name)
  txt = txt.replaceAll('{user_id}', userid)
  txt = txt.replaceAll('{platform}', platform)
  txt = txt.replaceAll('{tag}', tagName)
  txt = txt.replaceAll('{user_request}', request)
  txt = txt.replaceAll('{date_now}', getFullDateFormatGB())
  txt = txt.replaceAll('{date_now_us}', getFullDateFormatUS())
  txt = txt.replaceAll('{time_now}', getTimeFormat())
  return txt
}
