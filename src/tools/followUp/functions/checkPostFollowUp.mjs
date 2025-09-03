import { getFollowUpMessagesById } from '#config/tools/toolFollowUpMessages.mjs'
import { updateFollowUpLog } from '#config/data/followUpLog.mjs'

export async function checkPostFollowUp(followUp, followUpLog) {
  //comprobar recordatorios
  const steps = [
    { required: 1, key: 'firstFollowUp' },
    { required: 2, key: 'secondFollowUp' },
    { required: 3, key: 'thirdFollowUp' }
  ]
  //enviar recordatorios
  let sendAll = true
  for (const { required, key } of steps) {
    if (followUp.follows >= required) {
      if (!followUp[key]) {
        console.warn(`No hay ${key} recordatorio para el seguimiento: ${followUp.tag}`)
        continue
      }
      //comprobar mensaje
      const followUpMessages = await getFollowUpMessagesById(followUp[key])
      if (!followUpMessages) {
        console.warn(`No hay mensaje para el ${key} recordatorio del seguimiento: ${followUp.tag}`)
        continue
      }
      //comprobar si ya se envio el seguimiento

      if (!followUpLog.followUpLogs.includes(`${key} ${followUpMessages.channel}`)) {
        console.warn(`No se ha enviado el ${key} recordatorio del seguimiento: ${followUp.tag}`)
        sendAll = false
        break
      }
    }
  }
  //enviar
  if (sendAll) {
    followUpLog.status = 'finished'
    console.info('checkPostFollowUp: Se enviaron todos los recordatorios del seguimiento: ' + followUp.tag)
    await updateFollowUpLog(followUpLog)
  }
}
