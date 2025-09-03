import { ENV, isProductionEnv } from '#config/config.mjs'
import { createId } from '#utilities/createId.mjs'
import { sendLogs as sendLogsAppsheet } from '#apps/appsheet/config/logger.mjs'

//TT REGISTROS
export function sendLog(priority, location, text) {
  //PRODUCCIÓN
  if (isProductionEnv()) {
    const log = {
      id: 'log' + createId(),
      timestamp: new Date(),
      priority,
      location,
      text
    }
    //appsheet
    if (ENV.APP_FRONTEND === 'appsheet') {
      sendLogsAppsheet(log)
    }
  }
}
