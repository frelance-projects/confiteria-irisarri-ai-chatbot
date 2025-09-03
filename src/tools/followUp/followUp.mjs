import { getFollowUps } from '#config/tools/toolFollowUp.mjs'
import { getFollowUpMessagesById } from '#config/tools/toolFollowUpMessages.mjs'
import { sendFollowUpMessages } from './sendFollowUpMessages.mjs'
import { getUsersByTag } from '#config/users/users.mjs'

const week = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

//TT SISTEMA DE SEGUIMIENTO
export async function followUp() {
  //comprobar seguimientos
  let followUps = await getFollowUps()
  if (!followUps || followUps.length === 0) {
    console.log('No hay seguimientos')
    return
  }
  //comprobar seguimientos activos
  followUps = followUps.filter((followUp) => followUp.status)
  if (followUps.length === 0) {
    console.log('No hay seguimientos activos')
    return
  }
  //comprobar dia
  const today = new Date()
  today.setSeconds(0, 0)
  const dayName = week[today.getDay()]
  followUps = followUps.filter((followUp) => followUp.days.includes(dayName))
  if (followUps.length === 0) {
    console.log('No hay seguimientos disponibles para hoy')
    return
  }

  //comprobar hora
  followUps = followUps.filter((followUp) => {
    try {
      const start = new Date(today)
      const [iHour, iMinute] = followUp.starTime.split(':').map(Number)
      start.setHours(iHour, iMinute)
      const end = new Date(today)
      const [eHour, eMinute] = followUp.endTime.split(':').map(Number)
      end.setHours(eHour, eMinute)
      return today >= start && today <= end
    } catch (error) {
      console.error(`Error al comprobar la hora del seguimiento: ${followUp.tag}`)
      return false
    }
  })

  console.info(`Seguimientos disponibles para hoy: ${followUps.length}`)
  //enviar
  for (const followUp of followUps) {
    //comprobar recordatorios
    const steps = [
      { required: 1, key: 'firstFollowUp' },
      { required: 2, key: 'secondFollowUp' },
      { required: 3, key: 'thirdFollowUp' }
    ]
    //enviar recordatorios
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
        //obtener usuarios
        const users = await getUsersByTag(followUp.tag)
        if (!users) {
          console.log(`No hay usuarios para el seguimiento: ${followUp.tag}`)
          continue
        }
        //enviar mensaje
        await sendFollowUpMessages(followUp, users, followUpMessages, key)
      }
    }
  }
}
