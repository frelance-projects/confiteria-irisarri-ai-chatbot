import { appsheetTablesConfig } from '../tablesId.mjs'
import { postTable } from '../api/postTable.mjs'
import { revertDateTime } from '#utilities/appsheetTools/formatDateTime.mjs'

export async function sendLogsToken(data) {
  const format = Array.isArray(data) ? data : [data]

  const logs = format.map((log) => ({
    ID: log.id,
    TIMESTAMP: revertDateTime(log.timestamp),
    PROVIDER: log.provider,
    MODEL: log.model,
    TYPE: log.type,
    UNIT: log.unit,
    INPUT: log.input,
    OUTPUT: log.output,
    CACHED_INPUT: log.cachedInput,
    USER: log.userId
  }))
  try {
    const res = await postTable(appsheetTablesConfig.logsToken, logs)
    return res
  } catch (error) {
    console.error('Error al enviar los logs a AppSheet:', error)
    return null
  }
}
