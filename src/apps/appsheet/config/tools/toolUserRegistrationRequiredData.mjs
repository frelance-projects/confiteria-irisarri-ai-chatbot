import { appsheeTablesTools } from '../../tablesId.mjs'
import { getTable } from '../../api/getTable.mjs'
import { formatArray } from '#utilities/appsheetTools/formatArray.mjs'
import { SetUserRegistrationRequiredData } from '#config/tools/toolUserRegistrationRequiredData.mjs'

export async function loadUserRegistrationRequiredData(estate = 'init') {
  const res = await getTable(appsheeTablesTools.toolUserRegistrationRequiredData)
  if (res) {
    console.info('appsheet: configuracion de <tool-userregistrationrequireddata> cargada')
    const toolUserRegistrationRequiredData = buildFormat(res)
    if (estate === 'init') {
      console.info(
        'appsheet: configuracion de <tool-userregistrationrequireddata> inicializada: ',
        toolUserRegistrationRequiredData.length
      )
      return SetUserRegistrationRequiredData(toolUserRegistrationRequiredData)
    }
    return toolUserRegistrationRequiredData
  } else {
    console.error('appsheet: configuracion de <tool-userregistrationrequireddata> no cargada')
    return null
  }
}

function buildFormat(data = []) {
  const toolAutoTag = data.map((obj) => ({
    id: obj.ID,
    toolUserRegistration: obj.TOOL_USER_REGISTRATION,
    name: obj.NAME,
    descriptionAi: obj.DESCRIPTION_AI,
    type: obj.TYPE || '',
    enumSelect: formatArray(obj.ENUM_SELECT),
    required: obj.REQUIRED || false
  }))
  //console.log('toolUserRegistrationRequiredData', toolAutoTag)
  return toolAutoTag
}
