import { getBrainById } from '#config/brain/brain.mjs'
import { getAutoTagToolById } from '#config/tools/toolAutoTag.mjs'
import { autoTag } from './autoTag.mjs'
import { getState } from '#config/license.mjs'

const timers = {}

// TT AUTOTAG
export async function initAutoTag(user, userIdKey) {
  if (!getState('toolAutoTag')) {
    return null
  }

  //cargar brain
  const brain = await getBrainById(user.brain)
  if (!brain) {
    console.error('initAutoTag: Brain no encontrado')
    return null
  }
  //verificar auto
  if (!brain.toolAutoTag) {
    return null
  }
  //cargar auto tag
  const autoTag = await getAutoTagToolById(brain.toolAutoTag)
  if (!autoTag) {
    console.error('initAutoTag: AutoTag no encontrado')
    return null
  }
  //verificar etiquetas
  if (autoTag.tags.length < 1) {
    console.warn('autoTag: No hay etiquetas para autoTag')
    return null
  }
  resetUserTimer(userIdKey, autoTag, user)
}

//SS REINICIAR TIMER
function resetUserTimer(userIdKey, autoTag, user) {
  //buscar timer
  if (timers[userIdKey]) {
    //console.log(`Reiniciando la sesión para ${userIdKey}`)
    clearTimeout(timers[userIdKey])
  }
  //crear timer
  timers[userIdKey] = setTimeout(() => {
    return stopUserTimer(userIdKey, user)
  }, autoTag.timer || 8 * 60000)
}

//SS TERMINAR TIMER
function stopUserTimer(userIdKey, user) {
  if (timers[userIdKey]) {
    clearTimeout(timers[userIdKey])
    delete timers[userIdKey]
  }
  autoTag(user, userIdKey)
  return true
}
