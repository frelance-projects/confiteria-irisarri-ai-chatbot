//TT MÓDULOS
import { appsheetTablesData } from '../../tablesId.mjs'
import { getTable } from '../../api/getTable.mjs'
import { postTable } from '../../api/postTable.mjs'
import { patchTable } from '../../api/patchTable.mjs'
import { ENV } from '#config/config.mjs'
import { buildFormatDateTime, revertDateTime } from '#utilities/appsheetTools/formatDateTime.mjs'

//TT CARGAR LOGS DE UN USUARIO
export async function getFollowUpLogByUser(userId) {
  const logs = await getTable(appsheetTablesData.toolFollowUpLogs, [], {
    Selector: `FILTER(${appsheetTablesData.toolFollowUpLogs}, [USER] = "${userId}")`,
    Locale: 'en-GB',
    Timezone: ENV.TZ,
    UserSettings: { FROM_API: true }
  })
  if (!logs) {
    return null
  }
  return buildFormat(logs)
}

//TT AGREGAR LOGS DE SEGUIMIENTO
export async function addFollowUpLog(followUpLog) {
  const newFollowUpLog = Array.isArray(followUpLog) ? followUpLog : [followUpLog]
  const data = revetFormat(newFollowUpLog)
  //console.info(`Datos de seguimiento a agregar a AppSheet:\n${JSON.stringify(data, null, 2)}`)
  const res = await postTable(appsheetTablesData.toolFollowUpLogs, data)
  if (res) {
    //console.info(`Datos de seguimiento agregados a AppSheet:\n${JSON.stringify(res, null, 2)}`)
    return buildFormat(res)
  } else {
    console.error('appsheet: datos de seguimiento no agregados')
    return null
  }
}

//TT ACTUALIZAR LOGS DE SEGUIMIENTO
export async function updateFollowUpLog(followUpLog) {
  const newFollowUpLog = Array.isArray(followUpLog) ? followUpLog : [followUpLog]
  const data = revetFormat(newFollowUpLog)
  const res = await patchTable(appsheetTablesData.toolFollowUpLogs, data)
  if (res) {
    return buildFormat(res)
  } else {
    console.error('Error al actualizar los logs de seguimiento en AppSheet')
    return null
  }
}

//SS DAR FORMATO
function buildFormat(data = []) {
  const logs = data.map((obj) => ({
    id: obj.ID,
    toolFollowUp: obj.TOOL_FOLLOWUP,
    status: obj.STATUS,
    timestamp: buildFormatDateTime(obj.TIMESTAMP),
    user: obj.USER,
    followUpLogs: obj.FOLLOWUP_LOGS
  }))
  return logs
}

//SS REVERTIR FORMATO
function revetFormat(data = []) {
  const logs = data.map((obj) => ({
    ID: obj.id,
    TOOL_FOLLOWUP: obj.toolFollowUp,
    STATUS: obj.status,
    TIMESTAMP: revertDateTime(obj.timestamp, true),
    USER: obj.user,
    FOLLOWUP_LOGS: obj.followUpLogs
  }))
  return logs
}
