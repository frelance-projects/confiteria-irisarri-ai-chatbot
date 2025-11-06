import { createId } from '#utilities/createId.mjs'
import { addLogs } from '#db/loggerAiTokens/addLogs.mjs'

const logs = []

//TT AGREGA REGISTRO
export async function addLog(userId, { provider, model, type, unit, input, output, cachedInput }) {
  const log = {
    id: 'log-token-' + createId(),
    timestamp: new Date(),
    userId,
    provider,
    model,
    type,
    unit,
    input: parseInt(input, 10) || 0,
    output: parseInt(output, 10) || 0,
    cachedInput: parseInt(cachedInput, 10) || 0,
  }
  logs.push(log)
  //console.log('Log added:', log)
}

//TT GUARDAR REGISTRO
export async function saveLogs() {
  if (logs.length === 0) {
    console.log('No logs to save')
    return
  }

  //appsheet
  try {
    const result = await addLogs(logs)
    console.log(`Saved ${logs.length} logs to the database.`)
    logs.length = 0 // Clear the logs array after saving
    return result
  } catch (error) {
    console.error('Error saving logs:', error.message)
  }
}
