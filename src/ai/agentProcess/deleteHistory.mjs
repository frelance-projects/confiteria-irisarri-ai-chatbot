//TT MÓDULOS
import {
  clearMessageHistory,
  clearAllMessageHistory,
  clearMessageHistoryByBrain
} from '../openAI/messageHistory.mjs'

//TT ELIMINAR HISTORIAL DE USUARIO
export async function deleteUserHistory(userIdKey, provider) {
  if (provider === 'openai') {
    clearMessageHistory(userIdKey)
    return true
  } else {
    console.error('deleteUserHistory: Tipo de IA no soportado')
    return false
  }
}

//TT ELIMINAR TODO EL HISTORIAL
export async function deleteAllHistory(provider) {
  if (provider === 'openai') {
    clearAllMessageHistory()
    return true
  } else {
    console.error('deleteAllHistory: Tipo de IA no soportado')
    return false
  }
}

//TT ELIMINAR HISTORIAL DE USUARIO POR CEREBRO
export async function deleteUserHistoryByBrain(provider, brainId) {
  if (provider === 'openai') {
    clearMessageHistoryByBrain(brainId)
    return true
  } else {
    console.error('deleteUserHistoryByBrain: Tipo de IA no soportado')
    return false
  }
}
