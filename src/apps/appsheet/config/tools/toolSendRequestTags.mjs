import { appsheetTablesTools } from '../../tablesId.mjs'
import { getTable } from '../../api/getTable.mjs'
import { formatArray } from '#utilities/appsheetTools/formatArray.mjs'
import { setToolSendRequestTags } from '#config/tools/toolSendRequestTags.mjs'

export async function loadToolSendRequestTags(estate = 'init') {
  const res = await getTable(appsheetTablesTools.toolSendRequestTags)
  if (res) {
    console.info('appsheet: configuración de <tool-sendrequesttags> cargada')
    const tags = buildFormat(res)
    if (estate === 'init') {
      console.info('appsheet: configuración de <tool-sendrequesttags> inicializada: ', tags.length)
      return setToolSendRequestTags(tags)
    }
    return tags
  } else {
    console.error('appsheet: configuración de <tool-sendrequesttags> no cargada')
    return null
  }
}

function buildFormat(data = []) {
  const tags = data.map((obj) => ({
    id: obj.ID,
    name: obj.NAME,
    description: obj.DESCRIPTION,
    assistants: formatArray(obj.ASSISTANTS)
  }))
  return tags
}
