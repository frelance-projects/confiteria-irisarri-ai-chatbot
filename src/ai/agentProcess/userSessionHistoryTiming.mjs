import { deleteUserHistory } from './deleteHistory.mjs'

const timers = {}

// TT REINICIAR SESION
export function resetUserSession(userIdKey, agentConfig) {
  //sin sesion temporal
  if (agentConfig.historyInMemory < 1) {
    if (timers[userIdKey]) {
      clearTimeout(timers[userIdKey])
      delete timers[userIdKey]
    }
    //console.log(`No se reiniciara la sesión para ${userIdKey}`)
    return true
  }
  //buscar timer
  if (timers[userIdKey]) {
    //console.log(`Reiniciando la sesión para ${userIdKey}`)
    clearTimeout(timers[userIdKey])
  }
  //crear timer
  timers[userIdKey] = setTimeout(() => {
    return stopUserSession(userIdKey, agentConfig.ai.provider)
  }, agentConfig.historyInMemory || 20 * 60 * 1000)
}

// TT TERMINAR SESION
function stopUserSession(userIdKey, provider) {
  if (timers[userIdKey]) {
    clearTimeout(timers[userIdKey])
    delete timers[userIdKey]
  }
  deleteUserHistory(userIdKey, provider)
  console.log(`Se ha terminado la sesión para el usuario ${userIdKey}`)
  return true
}
