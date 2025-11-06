import { LoggerAiTokensDb } from './data.mjs'

export async function addLogs(logs) {
  try {
    // agregar logs a la base de datos
    const result = await LoggerAiTokensDb.addLogs(logs)
    return result
  } catch (error) {
    console.error('addLogs: Error al agregar logs:', error.message)
    return null
  }
}
