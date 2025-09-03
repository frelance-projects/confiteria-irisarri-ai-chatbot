//TT MÓDULOS
import { getBrainById } from '#config/brain/brain.mjs'
import { buildPrompt } from './buildPrompt.mjs'
import { getUserByPlatform } from '#config/users/users.mjs'

//TT HISTORIAL DE MENSAJES
const messageHistory = {}

//TT OBTENER HISTORIAL
export async function getMessageHistory(userIdKey, user) {
  if (!messageHistory[userIdKey] || messageHistory[userIdKey].length < 1) {
    messageHistory[userIdKey] = []
    const brain = await getBrainById(user.brain)
    if (brain) {
      const text = await buildPrompt(brain, user)
      messageHistory[userIdKey].push({ role: 'system', content: text })
    } else {
      console.error('getMessageHistory: No se ha encontrado el prompt o el cerebro')
    }
  }
  return messageHistory[userIdKey]
}

//TT AGREGAR MENSAJE AL HISTORIAL
export async function addMessageToHistoryOpenAi(userIdKey, content, user) {
  const history = await getMessageHistory(userIdKey, user)
  if (Array.isArray(content)) {
    history.push(...content)
  } else if (typeof content === 'object') {
    history.push(content)
  }
  //console.log('Mensaje agregado al historial:', messageHistory)
}

//TT BORRAR HISTORIAL DE USUARIO
export function clearMessageHistory(userIdKey) {
  if (messageHistory[userIdKey]) {
    console.log('historial de mensajes borrado: ' + messageHistory[userIdKey].length)
    console.log('Historial de mensajes borrado para el usuario:', userIdKey)
    delete messageHistory[userIdKey]
  } else {
    console.warn(`No se encontró historial para el usuario: ${userIdKey}`)
  }
}

//TT BORRAR TODAS LAS CONVERSACIONES
export function clearAllMessageHistory() {
  const userCount = Object.keys(messageHistory).length
  if (userCount > 0) {
    Object.keys(messageHistory).forEach((key) => delete messageHistory[key])
    console.info(`Historial de mensajes borrado para ${userCount} usuario(s).`)
  } else {
    console.warn('No hay historiales para borrar.')
  }
}

//TT BORRAR HISTORIAL DE USUARIO POR BARIN
export async function clearMessageHistoryByBrain(brainId) {
  const keys = Object.keys(messageHistory)
  const userCount = keys.length
  if (userCount > 0) {
    try {
      await Promise.all(
        keys.map(async (userIdKey) => {
          const [userId, platform] = userIdKey.split('-*-')
          const user = await getUserByPlatform(userId, platform)
          if (user.brain === brainId) {
            delete messageHistory[userIdKey]
          }
        })
      )
      console.info(`Historial de mensajes borrado para ${userCount} usuario(s).`)
    } catch (error) {
      console.error('clearMessageHistoryByBrain: ', error)
    }
  } else {
    console.warn('No hay historiales para borrar.')
  }
}
