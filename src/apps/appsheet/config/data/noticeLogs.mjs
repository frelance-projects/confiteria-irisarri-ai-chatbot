import { getTable } from '../../api/getTable.mjs'
import { postTable } from '../../api/postTable.mjs'
import { ENV } from '#config/config.mjs'
import { appsheetTablesData } from '../../tablesId.mjs'
import { revertDateTime, buildFormatDateTime } from '#utilities/appsheetTools/formatDateTime.mjs'
import { getFullDateFormatGB, getTimeFormat } from '#utilities/dateFunctions/dateNow.mjs'

//TT CARGAR LOGS TODOS LOS LOGS POR NOTICIA
export async function getNoticeLogByNotice(noticeId) {
  const logs = await getTable(appsheetTablesData.toolSendNoticeLogs, [], {
    Selector: `FILTER(${appsheetTablesData.toolSendNoticeLogs}, [TOOL_SENDNOTICE] = "${noticeId}")`,
    Locale: 'en-GB',
    Timezone: ENV.TZ,
    UserSettings: { FROM_API: true }
  })
  if (!logs) {
    return null
  }
  return buildFormat(logs)
}

//TT CARGAR LOGS POR ID
export async function getNoticeLogById(id) {
  const logs = await getTable(appsheetTablesData.toolSendNoticeLogs, [], {
    Selector: `FILTER(${appsheetTablesData.toolSendNoticeLogs}, [ID] = "${id}")`,
    Locale: 'en-GB',
    Timezone: ENV.TZ,
    UserSettings: { FROM_API: true }
  })
  if (!logs) {
    return null
  }
  return buildFormat(logs)
}
//TT AGREGAR LOGS
export async function addNoticeLog(noticeLog) {
  const newNoticeLog = Array.isArray(noticeLog) ? noticeLog : [noticeLog]
  const data = revetFormat(newNoticeLog)
  const res = await postTable(appsheetTablesData.toolSendNoticeLogs, data)
  if (res) {
    return buildFormat(res)
  } else {
    console.error('appsheet: datos de logs no agregados')
    return null
  }
}

//SS DAR FORMATO
function buildFormat(data = []) {
  const logs = data.map((obj) => ({
    id: obj.ID,
    timestamp: buildFormatDateTime(obj.TIMESTAMP),
    notice: obj.TOOL_SENDNOTICE,
    user: obj.USER,
    channel: obj.CHANNEL,
    status: obj.STATUS,
    log: obj.LOG
  }))
  return logs
}

//SS REVERTIR FORMATO
function revetFormat(data = []) {
  const logs = data.map((obj) => ({
    ID: obj.id,
    TIMESTAMP: revertDateTime(obj.timestamp) || getFullDateFormatGB() + ' ' + getTimeFormat(),
    TOOL_SENDNOTICE: obj.notice,
    USER: obj.user,
    CHANNEL: obj.channel,
    STATUS: obj.status,
    LOG: obj.log
  }))
  return logs
}
