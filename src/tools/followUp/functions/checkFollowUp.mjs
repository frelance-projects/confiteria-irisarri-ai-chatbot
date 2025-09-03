import { loadFollowUpLogByUser, addFollowUpLog, updateFollowUpLog } from '#config/data/followUpLog.mjs'
import { createId } from '#utilities/createId.mjs'
import { getLastContactById } from '#config/users/users.mjs'
import { checkPostFollowUp } from './checkPostFollowUp.mjs'

const unitTime = {
  seconds: 1,
  minutes: 60,
  hours: 60 * 60,
  days: 24 * 60 * 60,
  months: 30 * 24 * 60 * 60,
  years: 365 * 24 * 60 * 60
}

export async function checkFollowUp(user, followUp, key, platform, followUpMessage) {
  const keyPlatform = `${key} ${platform}`
  //cargar logs del usuario
  const logs = await loadFollowUpLogByUser(user.userId)
  if (!logs) {
    console.error('checkFollowUp: Error al cargar los logs del usuario')
    return null
  }
  //comprobar si se cumple la condición del seguimiento
  const lastContact = await getLastContactById(user.userId)
  if (!lastContact) {
    console.error('checkFollowUp: Error al cargar el último contacto del usuario')
    return null
  }

  //buscar log del seguimiento
  let userLog = logs.find((log) => log.toolFollowUp === followUp.tag)
  if (!userLog) {
    console.log(`No se encontro el log del seguimiento: ${followUp.tag} del usuario: ${user.userId}`)
    //comprobar tiempo
    const today = new Date()
    today.setHours(today.getHours() - followUp.delayStart)
    if (lastContact > today) {
      console.log(`El usuario: ${user.userId} aun no cumple la condición de tiempo para el seguimiento`)
      return null
    }
    userLog = await addLog(user, followUp)
    if (!userLog) {
      console.error('checkFollowUp: Error al crear el log')
      return null
    }
  }

  //verificar si se envio el seguimiento
  if (userLog.status !== 'started') {
    console.log(`El seguimiento ya termino ser enviado: ${user.userId} estado ${userLog.status}`)
    return null
  }

  //comprobar tiempo
  const sendTime = new Date()
  sendTime.setSeconds(sendTime.getSeconds() - followUpMessage.time * unitTime[followUpMessage.unitTime])
  if (lastContact > sendTime) {
    console.log(
      `No se cumple la condición de tiempo para el seguimiento: ${followUp.tag} del usuario: ${
        user.userId
      } fecha y hora minima: ${sendTime.toISOString()}`
    )
    checkPostFollowUp(followUp, userLog)
    return null
  }

  //SS VERIFICAR HASTA QUE CONTESTE
  if (followUp.condition === 'response') {
    if (lastContact > userLog.timestamp) {
      console.info(`El usuario: ${user.userId} ya contesto el seguimiento: ${followUp.tag} condicion: ${followUp.condition}`)
      userLog.status = 'finished'
      const newLog = await updateFollowUpLog(userLog)
      if (!newLog || newLog.length === 0) {
        console.error('checkFollowUp: Error al actualizar el log')
      }
      checkPostFollowUp(followUp, userLog)
      return null
    }
  }

  //si ya se envio el seguimiento
  if (userLog.followUpLogs.includes(keyPlatform)) {
    console.log(`El seguimiento ${keyPlatform} ya fue enviado al usuario: ${user.userId}`)
    checkPostFollowUp(followUp, userLog)
    return null
  }

  // ...existing code...
  const followUpOrder = ['firstFollowUp', 'secondFollowUp', 'thirdFollowUp']

  // Si no es el primer seguimiento, verificar que los anteriores se hayan enviado
  const currentIndex = followUpOrder.indexOf(key)
  if (currentIndex > 0) {
    for (let i = 0; i < currentIndex; i++) {
      //si no previo el seguimiento
      if (!userLog.followUpLogs.includes(followUpOrder[i])) {
        console.log(`No se ha enviado el ${followUpOrder[i]} al usuario: ${user.userId} para el seguimiento: ${followUp.tag}`)
        checkPostFollowUp(followUp, userLog)
        return null
      }
    }
  }

  return userLog
}

//SS CREAR LOG
async function addLog(user, followUp) {
  console.log('addLog: Creando log')
  const log = {
    id: 'f-log-' + createId(),
    timestamp: new Date(),
    status: 'started',
    toolFollowUp: followUp.tag,
    user: user.userId,
    followUpLogs: ''
  }
  const res = await addFollowUpLog(log)
  if (!res) {
    console.error('addLog: Error al agregar el log')
    return null
  }
  console.log('addLog: Log creado', res[0])
  return res[0]
}
