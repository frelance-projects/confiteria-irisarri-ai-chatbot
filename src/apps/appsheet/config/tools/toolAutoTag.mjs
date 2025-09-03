import { appsheeTablesTools } from '../../tablesId.mjs'
import { getTable } from '../../api/getTable.mjs'
import { formatArray } from '#utilities/appsheetTools/formatArray.mjs'
import { setAutoTagTool } from '#config/tools/toolAutoTag.mjs'

export async function loadToolAutoTag(estate = 'init') {
  const res = await getTable(appsheeTablesTools.toolAutoTag)
  if (res) {
    console.info('appsheet: configuracion de <tool-autotag> cargada')
    const toolAutoTag = buildFormat(res)
    if (estate === 'init') {
      console.info('appsheet: configuracion de <tool-autotag> inicializada: ', toolAutoTag.length)
      return setAutoTagTool(toolAutoTag)
    }
    return toolAutoTag
  } else {
    console.error('appsheet: configuracion de <tool-autotag> no cargada')
    return null
  }
}

function buildFormat(data = []) {
  const toolAutoTag = data.map((obj) => ({
    id: obj.ID,
    name: obj.NAME,
    description: obj.DESCRIPTION,
    tags: formatArray(obj.TAGS),
    timer: parseInt(obj.TIMER, 10) * 60000 || 10 * 60000,
    minHistory: parseInt(obj.MIN_HISTORY, 10) || 2,
    maxHistory: parseInt(obj.MAX_HISTORY, 10) || 10,
    notify: obj.NOTIFY || false,
    notifyTags: formatArray(obj.NOTIFY_TAGS),
    channels: formatArray(obj.CHANNELS),
    messageTemplate: obj.MESSAGE_TEMPLATE,
    tamplateId: obj.TEMPLATE_ID,
    emailTamplate: obj.EMAIL_TEMPLATE
  }))
  return toolAutoTag
}
