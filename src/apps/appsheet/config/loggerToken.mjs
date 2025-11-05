import { appsheetTablesConfig } from '../tablesId.mjs'
import { addData } from '#utilities/appsheet/addData.mjs'
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
    USER: log.id,
  }))
  try {
    const res = await addData(appsheetTablesConfig.logsToken, {}, logs)
    return res
  } catch (error) {
    console.error('Error al enviar los logs a AppSheet:', error)
    return null
  }
}
