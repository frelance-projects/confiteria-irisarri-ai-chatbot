import { createId } from '#utilities/createId.mjs'
import { ENV } from '#config/config.mjs'
import { sendLogsToken as sendLogsTokenAppsheet } from '#apps/appsheet/config/loggerToken.mjs'

const logs = []

//TT AGREGA REGISTRO
export async function addLog(userId, { provider, model, type, unit, input, output, cachedInput }) {
  if (!userId) {
    console.error('No userId provided for logging')
    return
  }
  if (!provider) {
    console.error('No provider provided for logging')
    return
  }
  if (!model) {
    console.error('No model provided for logging')
    return
  }
  if (!type) {
    console.error('No type provided for logging')
    return
  }
  if (!unit) {
    console.error('No unit provided for logging')
    return
  }

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
    cachedInput: parseInt(cachedInput, 10) || 0
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
  if (ENV.APP_FRONTEND === 'appsheet') {
    console.log('Saving logs to AppSheet:', logs.length)
    const res = await sendLogsTokenAppsheet(logs)
    if (res) {
      console.log('LogsToken saved successfully:')
      logs.length = 0
    } else {
      console.error('Failed to save logs to AppSheet')
    }
  } else {
    console.error('No se ha definido el frontend para guardar los logs')
  }
}
