import { getContentType } from 'baileys'

//import { getLastMessage } from './updateState/lastBotMessage.mjs'
import { getAssistants } from '#config/assistants/assistants.mjs'
import { getUserByPlatform } from '#db/users/getUserByPlatform.mjs'
import { addToBlacklist, setSleep } from '#ai/agentProcess/userState.mjs'

export async function detectMessageOrigin(message) {
  let assistants = await getAssistants()
  if (!assistants) {
    console.log('detectMessageOrigin: Error al cargar asistentes')
    return null
  }
  if (assistants.length === 0) {
    console.log('detectMessageOrigin: No hay asistentes configurados')
    return null
  }
  assistants = assistants.filter(
    (obj) => obj.detectAssistantCondition === 'always' || obj.detectAssistantCondition === 'delay'
  )
  if (assistants.length === 0) {
    return null
  }
  //console.log('detectMessageOrigin: Asistentes para detectar mensajes', assistants)
  //console.log('detectMessageOrigin: Mensaje a detectar', message)

  const textMessage = isValidMessageType(message)
  if (!textMessage) {
    console.log('detectMessageOrigin: Mensaje no soportado')
    return null
  }
  console.log('detectMessageOrigin: Mensaje soportado >>>', textMessage)
  const user = await getUserByPlatform(textMessage.id, 'whatsapp')
  if (!user) {
    console.log('detectMessageOrigin: Usuario no encontrado')
    return null
  }
  //verificar si el mensaje es de un asistente
  const assistant = assistants.find((obj) => obj.detectAssistantMessage === textMessage.text)
  if (!assistant) {
    console.log('detectMessageOrigin: Mensaje no es de asistente')
    return null
  }
  console.log('detectMessageOrigin: Mensaje de asistente: ', assistant.id)
  if (assistant.detectAssistantCondition === 'always') {
    console.info('detectMessageOrigin: usuario agregado a lista negra', user.id)
    addToBlacklist(user)
    return true
  } else if (assistant.detectAssistantCondition === 'delay') {
    const time = assistant.detectAssistantIdel * 60000 || 60000 // 1 min
    console.info(`detectMessageOrigin: usuario en espera por : ${time / 60000} min, usuario: ${user.id}`)
    setSleep(user, time)
    return true
  } else {
    console.error('detectMessageOrigin: Mensaje de asistente no soportado')
    return null
  }
}

//ss validar tipo de mensaje
function isValidMessageType(message) {
  try {
    const contentType = getContentType(message.message)
    console.warn('detectMessageOrigin: Tipo de mensaje', contentType)
    //MENSAJE DE TEXTO
    if (contentType === 'extendedTextMessage') {
      const text = message.message.extendedTextMessage.text
      const userId = String(message.key.remoteJid).split('@')[0]
      return { text, userId }
    } else if (contentType === 'conversation') {
      const text = message.message.conversation
      const userId = String(message.key.remoteJid).split('@')[0]
      return { text, userId }
    } else {
      console.warn('detectMessageOrigin: Tipo de mensaje no soportado', contentType)
      return null
    }
  } catch (error) {
    console.error('detectMessageOrigin: Error al detectar tipo de mensaje', error)
    return null
  }
}
