import { appsheetTablesConfig } from '../tablesId.mjs'
import { postTable } from '../api/postTable.mjs'
import { revertDateTime } from '#utilities/appsheetTools/formatDateTime.mjs'

export async function sendLogs(data) {
  const format = Array.isArray(data) ? data : [data]

  const logs = format.map((log) => ({
    ID: log.id,
    TIMESTAMP: revertDateTime(log.timestamp),
    PRIORITY: log.priority, // Corregido el typo de DAFAULT
    LOCATION: log.location, // Valor por defecto para herramientas
    TEXT: log.text
  }))
  try {
    const res = await postTable(appsheetTablesConfig.logs, logs)
    return res
  } catch (error) {
    console.error('Error al enviar los logs a AppSheet:', error)
    return null
  }
}
