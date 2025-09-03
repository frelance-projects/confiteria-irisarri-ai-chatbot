import { getFullDateFormatGB, getFullDateFormatUS, getTimeFormat } from '#utilities/dateFunctions/dateNow.mjs'

//TT CONSTRUIR MENSAJE EMAIL
export function userRegistrationEmailFormat({ user, platform, htmlTamplate, data }) {
  const userid = user[platform].id
  let txt = htmlTamplate.replaceAll('{user_name}', user.name)
  txt = txt.replaceAll('{user_id}', userid)
  txt = txt.replaceAll('{user_email}', user.email || 'sin correo')
  txt = txt.replaceAll('{user_name_provided}', user.registeredName || 'sin nombre')
  txt = txt.replaceAll('{platform}', platform)
  txt = txt.replaceAll('{date_now}', getFullDateFormatGB())
  txt = txt.replaceAll('{date_now_us}', getFullDateFormatUS())
  txt = txt.replaceAll('{time_now}', getTimeFormat())
  txt = txt.replaceAll('{data_provided}', builtDataFormat(data))

  return txt
}

//SS CONSTRUIR DATOS DE LA CITA
function builtDataFormat(data) {
  let txt = ''
  if (!data || data.length === 0) {
    return '<p>No hay datos adicionales</p>'
  }
  for (const dat of data) {
    txt += `<p>${dat.name}: ${dat.value}</p>`
  }
  return txt
}
