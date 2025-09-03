import { appsheetTablesConfig } from '../tablesId.mjs'
import { getTable } from '../api/getTable.mjs'
import { setAssistants } from '#config/assistants/assistants.mjs'

export async function loadAssistants(estate = 'init') {
  const res = await getTable(appsheetTablesConfig.assistants)
  if (res) {
    console.info('appsheet: configuracion de <assistants> cargada')
    const assistants = buildFormat(res)
    if (estate === 'init') {
      console.info('appsheet: configuracion de <assistants> inicializada: ', assistants.length)
      return setAssistants(assistants)
    }
    return assistants
  } else {
    console.error('appsheet: configuracion de <assistants> no cargada')
    return null
  }
}

function buildFormat(data = []) {
  const assistants = data.map((obj) => ({
    id: obj.ID,
    name: obj.NAME,
    email: obj.EMAIL,
    whatsappId: obj.WHATSAPP_ID,
    phone: obj.PHONE,
    status: obj.STATUS || false,
    detectAssistantCondition: obj.DETECT_ASSISTANT_CONDITION || 'never',
    detectAssistantMessage: obj.DETECT_ASSISTANT_MESSAGE,
    detectAssistantIdel: parseInt(obj.DETECT_ASSISTANT_IDEL, 10) || 5 // minutos
  }))
  //console.info('appsheet: configuracion de <assistants> cargada', assistants)
  return assistants
}
