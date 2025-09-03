import { appsheeTablesTools } from '../../tablesId.mjs'
import { getTable } from '../../api/getTable.mjs'
import { formatArray } from '#utilities/appsheetTools/formatArray.mjs'
import { setAppointmentAgendasTool } from '#config/tools/toolAppointmentAgendas.mjs'

export async function loadToolAppointmentAgendas(estate = 'init') {
  const res = await getTable(appsheeTablesTools.toolAppointmentAgendas)
  if (res) {
    console.info('appsheet: configuracion de <tool-appointmentagendas> cargada')
    const toolAppointmentAgendas = buildFormat(res)
    if (estate === 'init') {
      console.info(
        'appsheet: configuracion de <tool-appointmentagendas> inicializada: ',
        toolAppointmentAgendas.length
      )
      return setAppointmentAgendasTool(toolAppointmentAgendas)
    }
    return toolAppointmentAgendas
  } else {
    console.error('appsheet: configuracion de <tool-appointmentagendas> no cargada')
    return null
  }
}

function buildFormat(data = []) {
  const toolAppointmentAgendas = data.map((obj) => ({
    id: obj.ID,
    toolAppointment: obj.TOOL_APPOINTMENT,
    name: obj.NAME || '',
    description: obj.DESCRIPTION || '',
    status: obj.STATUS || false,
    descriptionAi: obj.DESCRIPTION_AI || '',
    unlimitedAppointments: obj.UNLIMITED_APPOINTMENTS || false,
    maxAppointments: parseInt(obj.MAX_APPOINTMENTS, 10) || 1,
    assistants: formatArray(obj.ASSISTANTS),
    schedule: {
      sunday: formatArray(obj.H_SUNDAY),
      monday: formatArray(obj.H_MONDAY),
      tuesday: formatArray(obj.H_TUESDAY),
      wednesday: formatArray(obj.H_WEDNESDAY),
      thursday: formatArray(obj.H_THURSDAY),
      friday: formatArray(obj.H_FRIDAY),
      saturday: formatArray(obj.H_SATURDAY)
    }
  }))
  //console.warn('appsheet: configuracion de <tool-appointmentagendas> formateada: ', toolAppointmentAgendas)
  return toolAppointmentAgendas
}
