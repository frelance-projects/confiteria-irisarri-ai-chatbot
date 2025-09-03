import { appsheeTablesTools } from '../../tablesId.mjs'
import { getTable } from '../../api/getTable.mjs'
import { formatArray } from '#utilities/appsheetTools/formatArray.mjs'
import { setAppointmentRequiredDataTool } from '#config/tools/toolAppointmentRequiredData.mjs'

export async function loadToolAppointmentRequiredData(estate = 'init') {
  const res = await getTable(appsheeTablesTools.toolAppointmentRequiredData)
  if (res) {
    console.info('appsheet: configuracion de <tool-appointmentrequireddata> cargada')
    const toolAppointmentRequiredData = buildFormat(res)
    if (estate === 'init') {
      console.info(
        'appsheet: configuracion de <tool-appointmentrequireddata> inicializada: ',
        toolAppointmentRequiredData.length
      )
      return setAppointmentRequiredDataTool(toolAppointmentRequiredData)
    }
    return toolAppointmentRequiredData
  } else {
    console.error('appsheet: configuracion de <tool-appointmentrequireddata> no cargada')
    return null
  }
}

function buildFormat(data = []) {
  const toolAutoTag = data.map((obj) => ({
    id: obj.ID,
    toolAppointment: obj.TOOL_APPOINTMENT,
    name: obj.NAME,
    descriptionAi: obj.DESCRIPTION_AI || '',
    type: obj.TYPE || '',
    enumSelect: formatArray(obj.ENUM_SELECT),
    required: obj.REQUIRED || false
  }))
  return toolAutoTag
}
