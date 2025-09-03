import { appsheetTablesTools } from '../../tablesId.mjs'
import { getTable } from '../../api/getTable.mjs'
import { formatArray } from '#utilities/appsheetTools/formatArray.mjs'
import { setFollowUp } from '#config/tools/toolFollowUp.mjs'

export async function loadToolFollowUp(estate = 'init') {
  const res = await getTable(appsheetTablesTools.toolFollowUp)
  if (res) {
    console.info('appsheet: configuración de <tool-followUp> cargada')
    const followUp = buildFormat(res)
    if (estate === 'init') {
      console.info('appsheet: configuración de <tool-followUp> inicializada: ', followUp.length)
      return setFollowUp(followUp)
    }
    return followUp
  } else {
    console.error('appsheet: configuración de <tool-followUp> no cargada')
    return null
  }
}

function buildFormat(data = []) {
  const toolAutoTag = data.map((obj) => ({
    tag: obj.TAG,
    description: obj.DESCRIPTION,
    status: obj.STATUS || false,
    condition: obj.CONDITION,
    delayStart: parseInt(obj.DELAY_START, 10) || 0,
    starTime: obj.START_TIME,
    endTime: obj.END_TIME,
    days: formatArray(obj.DAYS),
    follows: parseInt(obj.FOLLOWS, 10) || 0,
    firstFollowUp: obj.FIRST_FOLLOWUP || '',
    secondFollowUp: obj.SECOND_FOLLOWUP || '',
    thirdFollowUp: obj.THIRD_FOLLOWUP || ''
  }))
  //console.warn('tool-followUp', toolAutoTag)
  return toolAutoTag
}
