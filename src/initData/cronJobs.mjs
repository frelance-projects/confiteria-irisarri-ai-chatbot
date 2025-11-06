import cron from 'node-cron' // Asegúrate de tener instalado 'node-cron'
import { isProductionEnv } from '#config/config.mjs' // Importa tu configuración si es necesario
import { saveLogs } from '#logger/loggerToken.mjs'

export function startCronJobs() {
  //ss guardar logs
  if (isProductionEnv()) {
    cron.schedule('0 * * * *', async () => {
      console.info('CronJob: Guardando logs ...')
      saveLogs()
    })
  }
}
