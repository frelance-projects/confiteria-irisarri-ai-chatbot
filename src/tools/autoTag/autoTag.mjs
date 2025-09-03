import { getBrainById } from '#config/brain/brain.mjs'
import { getAutoTagToolById } from '#config/tools/toolAutoTag.mjs'
import { getUsersTags } from '#config/userdTags/userdTags.mjs'
import { loadHistory } from './functions/loadHistory.mjs'
import { sentToAi } from './functions/sentToAi.mjs'
import { updateUser } from '#config/users/users.mjs'
import { autoTagNotifications } from './autoTagNotifications.mjs'

export async function autoTag(user, userIdKey) {
  //cargar brain
  const brain = await getBrainById(user.brain)
  if (!brain) {
    console.error('autoTag: Brain no encontrado')
    return null
  }

  //verificar auto
  if (!brain.toolAutoTag) {
    return null
  }

  //cargar auto tag
  const autoTag = await getAutoTagToolById(brain.toolAutoTag)
  if (!autoTag) {
    console.warn('autoTag: AutoTag no encontrado')
    return null
  }

  //verificar etiquetas
  if (autoTag.tags.length < 1) {
    console.warn('autoTag: No hay etiquetas para autoTag')
    return null
  }

  //etiquetas de usuario
  const usersTags = await getUsersTags()
  if (!usersTags || usersTags.length < 1) {
    console.warn('autoTag: No se han encontrado etiquetas de usuario')
    return null
  }

  //verificar etiqueta de usuario
  if (user.tag) {
    console.info(`autoTag: Usuario ${user.name} ya tiene etiqueta: ${user.tag}`)
    const userTag = usersTags.find((obj) => obj.id === user.tag)
    if (!userTag) {
      console.warn('autoTag: No se ha encontrado etiqueta de usuario')
    }
    if (userTag.static) {
      console.info(`autoTag: Etiqueta de usuario ${userTag.name} es estática`)
      return null
    }
  }

  //etiquetas de usuario
  const tags = usersTags.filter((tag) => autoTag.tags.includes(tag.id))
  if (tags.length < 1) {
    console.warn('autoTag: No se han encontrado etiquetas de usuario')
    return null
  }

  //historial
  const allHistory = await loadHistory(userIdKey, user)
  if (!allHistory || allHistory.length < 1) {
    console.warn('autoTag: Historial no encontrado para autoTag, usuario:', userIdKey)
    return null
  }
  //filtrar historial
  const history = []
  for (const message of allHistory) {
    if ((message.role === 'user' || message.role === 'assistant') && typeof message.content === 'string') {
      history.push(message)
    }
  }
  //verificar historial
  if (history.length < autoTag.minHistory) {
    console.info('autoTag: Historial insuficiente para autoTag, usuario:', userIdKey)
    return null
  }
  history.slice(-autoTag.maxHistory)

  //enviar a IA
  const response = await sentToAi(history, tags)
  if (!response) {
    console.error('autoTag: Error al enviar a IA')
    return null
  }

  //etiquetar
  const tag = tags.find((obj) => response.includes(obj.id))
  if (!tag) {
    console.warn('autoTag: No se ha encontrado etiqueta en respuesta de IA')
    return null
  }

  //verificar etiqueta
  if (user.tag === tag.id) {
    console.info(`autoTag: Usuario ${user.name} ya tiene etiqueta: ${tag.name}`)
    return null
  }

  //agregar etiqueta
  user.tag = tag.id
  const resUser = await updateUser(user)
  if (!resUser) {
    console.error('autoTag: Error al actualizar usuario')
    return null
  }
  console.info(`autoTag: Usuario ${user.name} etiquetado con: ${tag.name}`)

  //notificar
  if (autoTag.notify && tag.assistants.length > 0) {
    autoTagNotifications(user, userIdKey, tag, autoTag)
  }
  return true
}
