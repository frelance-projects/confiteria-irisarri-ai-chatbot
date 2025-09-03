import cron from 'node-cron' // Asegúrate de tener instalado 'node-cron'
import { isProductionEnv } from '#config/config.mjs' // Importa tu configuración si es necesario
import { appointmentReminders } from '#tools/userNotifications/appointments/appointmentReminders.mjs'
import { followUp } from '#tools/followUp/followUp.mjs'
import { saveLogs } from '#logger/loggerToken.mjs'
import { initSendNotice } from '#tools/sendNotice/initSendNotice.mjs'
import { cronAppointment, cronFollowUp, cronSendNotice } from './license.mjs'

export function startCronJobs() {
  //ss recordatorio de agenda
  if (cronAppointment() && isProductionEnv()) {
    console.info('CronJob: iniciado appointment')
    cron.schedule('1 * * * *', async () => {
      console.info('CronJob: Comprobando recordatorio de agenda ...')
      appointmentReminders()
    })
  }

  //ss envió de comunicados
  if (cronSendNotice() && isProductionEnv()) {
    console.info('CronJob: iniciado sendNotice')
    cron.schedule('11 * * * *', async () => {
      console.info('CronJob: Comprobando sistema de comunicados ...')
      initSendNotice()
    })
  }

  //ss seguimiento de usuarios
  if (cronFollowUp() && isProductionEnv()) {
    console.info('CronJob: iniciado followUp')
    cron.schedule('21 * * * *', async () => {
      console.info('CronJob: Comprobando sistema de seguimiento ...')
      followUp()
    })
  }

  //ss guardar logs
  if (isProductionEnv()) {
    cron.schedule('31 * * * *', async () => {
      console.info('CronJob: Guardando logs ...')
      saveLogs()
    })
  }
}
