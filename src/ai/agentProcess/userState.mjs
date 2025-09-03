import { updateUser } from '#config/users/users.mjs'
import { sendLog } from '#logger/logger.mjs'

const temporalState = {}

//TT AGREGAR A LISTA NEGRA
export async function addToBlacklist(user) {
  try {
    user.blacklist = true
    const res = await updateUser(user)
    if (!res) {
      console.error('addToBlacklist: Error al agregar usuario a la lista negra')
      sendLog('error', 'ai/agentProcess/userState', 'Error adding user to blacklist')
      return null
    }
    sendLog('info', 'ai/agentProcess/userState', `User added to blacklist: ${user.userId} - ${user.userName}`)
    console.info('addToBlacklist: Usuario agregado a la lista negra: ' + user.userId)
    return res
  } catch (error) {
    sendLog('error', 'ai/agentProcess/userState', `Unexpected error adding user to blacklist: ${error}`)
    console.error('addToBlacklist: Error inesperado', error)
    return null
  }
}

//TT PONER EN ESPERA AL BOT
export function setSleep(user, time = 60000 /* 1 min */) {
  if (!temporalState[user.userId]) {
    temporalState[user.userId] = { lastMessage: Date.now(), sleep: true, time }
  }
  temporalState[user.userId].lastMessage = Date.now()
  temporalState[user.userId].sleep = true
  temporalState[user.userId].time = time
}

//TT ACTUALIZAR ULTIMO MENSAJE ENVIADO
export function updatedLastMessage(user) {
  if (!temporalState[user.userId]) {
    temporalState[user.userId] = { lastMessage: Date.now() }
  }
  temporalState[user.userId].lastMessage = Date.now()
}

//TT REVISAR ESTADO VALIDO DE USUARIO
export function checkTemporalState(user) {
  if (temporalState[user.userId]?.sleep) {
    const time = Date.now() - temporalState[user.userId].lastMessage
    if (time > temporalState[user.userId].time) {
      console.log('bot en linea')
      temporalState[user.userId].sleep = false
      return true
    } else {
      console.log('bot en espera')
      return false
    }
  }
  return true
}
