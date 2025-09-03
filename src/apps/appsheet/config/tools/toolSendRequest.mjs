import { appsheeTablesTools } from '../../tablesId.mjs'
import { getTable } from '../../api/getTable.mjs'
import { formatArray } from '#utilities/appsheetTools/formatArray.mjs'
import { setSendRequestConfig } from '#config/tools/toolSendRequest.mjs'

//TT CARGAR TOOLS
export async function loadToolSendRequest(estate = 'init') {
  const sendRequest = await getTable(appsheeTablesTools.toolSendRequest)
  if (sendRequest) {
    console.info('appsheet: configuracion de <tool-sendRequest> cargada')
    const sendRequestConfig = buildFormat(sendRequest)
    if (estate === 'init') {
      console.info('appsheet: configuracion de <tool-sendRequest> inicializada', sendRequestConfig.length)
      return setSendRequestConfig(sendRequestConfig)
    }
    return sendRequestConfig
  } else {
    console.error('appsheet: configuracion de <tool-sendRequest> no cargada')
    return null
  }
}

export function buildFormat(data) {
  const sendRequestConfig = data.map((obj) => ({
    id: obj.ID,
    name: obj.NAME,
    description: obj.DESCRIPTION,
    notify: obj.NOTIFY || false,
    channels: formatArray(obj.CHANNELS),
    messageTemplate: obj.MESSAGE_TEMPLATE,
    tamplateId: obj.TEMPLATE_ID,
    emailTamplate: obj.EMAIL_TEMPLATE,
    tags: formatArray(obj.TAGS)
  }))
  return sendRequestConfig
}

/*
export const sendRequestConfig = {
  status: true,
  messageTemplate: 'Hola {user_name}, gracias por contactarnos. Tu consulta es: {user_request}', //mensaje o id plantilla,
  tamplateId: '', //id plantilla para meta
  emailTamplate: '', // plantilla para email
  tags: ['buy', 'sell', 'pqr', 'support', 'other'], //platillas personalizadas
  channels: ['email'], // email | whatsapp | sms
  emailId: ['johan12361@gmail.com', 'johan12361.pay@gmail.com'],
  whatsappId: [], //numeros de telefono
  smsId: [] //numeros de telefono
}
*/
