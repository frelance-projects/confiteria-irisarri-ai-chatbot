import { ENV } from '#config/config.mjs'
import {
  getFollowUpLogByUser as getFollowUpLogByUserAppsheet,
  addFollowUpLog as addFollowUpLogAppsheet,
  updateFollowUpLog as updateFollowUpLogAppsheet
} from '#apps/appsheet/config/data/followUpLog.mjs'

//TT CARGAR LOGS DE UN USUARIO
export async function loadFollowUpLogByUser(userId) {
  if (ENV.APP_FRONTEND === 'appsheet') {
    const request = await getFollowUpLogByUserAppsheet(userId)
    return request
  } else {
    console.error('loadFollowUpLogByUser: frontend no soportado')
    return null
  }
}

//TT AGREGAR LOG DE SEGUIMIENTO
export async function addFollowUpLog(followUpLog) {
  if (ENV.APP_FRONTEND === 'appsheet') {
    const request = await addFollowUpLogAppsheet(followUpLog)
    return request
  } else {
    console.error('addFollowUpLog: frontend no soportado')
    return null
  }
}

//TT ACTUALIZAR LOG DE SEGUIMIENTO
export async function updateFollowUpLog(followUpLog) {
  if (ENV.APP_FRONTEND === 'appsheet') {
    const request = await updateFollowUpLogAppsheet(followUpLog)
    return request
  } else {
    console.error('updateFollowUpLog: frontend no soportado')
    return null
  }
}
