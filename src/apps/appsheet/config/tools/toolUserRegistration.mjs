import { appsheetTablesTools } from '../../tablesId.mjs'
import { getTable } from '../../api/getTable.mjs'
import { formatArray } from '#utilities/appsheetTools/formatArray.mjs'

import { setUserRegistration } from '#config/tools/toolUserRegistration.mjs'

export async function loadUserRegistration(estate = 'init') {
  const res = await getTable(appsheetTablesTools.toolUserRegistration)
  if (res) {
    console.info('appsheet: configuración de <tool-userregistration> cargada')
    const toolUserRegistration = buildFormat(res)
    if (estate === 'init') {
      console.info(
        'appsheet: configuración de <tool-userregistration> inicializada: ',
        toolUserRegistration.length
      )
      return setUserRegistration(toolUserRegistration)
    }
    return toolUserRegistration
  } else {
    console.error('appsheet: configuración de <tool-userregistration> no cargada')
    return null
  }
}

function buildFormat(data = []) {
  const toolAutoTag = data.map((obj) => ({
    id: obj.ID,
    name: obj.NAME,
    description: obj.DESCRIPTION,
    requestName: obj.REQUEST_NAME,
    requestEmail: obj.REQUEST_EMAIL,
    //notificaciones
    notify: obj.NOTIFY || false,
    assistants: formatArray(obj.ASSISTANTS),
    channels: formatArray(obj.CHANNELS),
    messageTemplate: obj.MESSAGE_TEMPLATE,
    tamplateId: obj.TEMPLATE_ID,
    emailTamplate: obj.EMAIL_TEMPLATE
  }))
  //console.log('toolUserRegistration', toolAutoTag)
  return toolAutoTag
}
