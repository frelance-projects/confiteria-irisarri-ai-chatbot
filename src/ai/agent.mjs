//TT MÓDULOS IA
import { getAgent } from '#db/agent/getAgent.mjs'
import { sendToChannels } from '#channels/channels.mjs'
//AGENT PROCESS
import { resetUserSession } from './agentProcess/userSessionHistoryTiming.mjs'
import { loadUser } from './agentProcess/validateUser.mjs'
import { updatedLastMessage, checkTemporalState } from './agentProcess/userState.mjs'
import { addTextMessageToHistory, addMediaMessageToHistory } from './agentProcess/addMessageToHistory.mjs'
import { groupMessages } from './agentProcess/groupMessages.mjs'
import { sendResponse } from './agentProcess/sendResponse.mjs'
import { mediaProcessing } from './agentProcess/mediaProcessing.mjs'
import { sentToAi } from './agentProcess/sentToAi.mjs'
import { Clients } from './agentProcess/clientAction.mjs'
import { FunctionProcess } from '#ai/agentProcess/functionProcess.mjs'
import { FUNCTION_STATUS } from '#enums/agent.mjs'

export async function agentResponse(userId, message, origin, platform, originalMessage = null) {
  try {
    // Origen: Usuario
    if (origin !== 'user' && origin !== 'hidden') {
      console.error('Mensaje de origen no soportado')
      return null
    }
    // Cargar configuración del agente
    const agentConfig = await getAgent()
    if (!agentConfig) {
      console.error('Agente: Error al cargar configuración')
      return null
    }
    // cargar usuario
    const user = await loadUser(userId, platform)
    if (!user) {
      console.error('Agente: Error al validar usuario')
      return null
    }
    if (!checkTemporalState(user)) {
      console.log('asistente en linea')
      return null
    }
    updatedLastMessage(user)

    // Comprobar estado del agente
    if (agentConfig.status !== 'active') {
      console.error('Agente desactivado')
      return null
    }
    // Comprobar si el usuario está bloqueado
    if (user.blacklist) {
      console.error('Agente: Usuario bloqueado')
      return null
    }

    // Crear userIdKey
    const userIdKey = `${user[platform].id}-*-${platform}`

    // validar si hay una función en proceso
    const functionInProgress = FunctionProcess.isProcessing(userIdKey)
    if (functionInProgress) {
      if (message.type !== 'text') {
        console.warn('solo se permiten mensajes de texto durante la ejecución de una función')
        //TODO: Enviar mensaje al usuario indicando que solo se permiten mensajes de texto
        return null
      }
      return await FunctionProcess.executeFunction(userIdKey, message.text)
    }

    // Reiniciar sesión
    resetUserSession(userIdKey, agentConfig)

    // Agrupar mensajes
    groupMessages(userIdKey, { message, originalMessage }, agentConfig.delay, async (chunks) => {
      for (const block of chunks) {
        switch (block.message.type) {
          case 'text':
            await addTextMessageToHistory(userIdKey, block.message.text, agentConfig.ai.provider, 'user', user)
            break

          case 'media': {
            const res = await mediaProcessing(block.message, platform, agentConfig)
            if (res) {
              if (res.type === 'text') {
                await addTextMessageToHistory(userIdKey, res.text, agentConfig.ai.provider, 'user', user)
              } else if (res.type === 'media') {
                await addMediaMessageToHistory(userIdKey, res.media, agentConfig.ai.provider, 'user', user)
              }
            }
            if (block.message.media.caption) {
              await addTextMessageToHistory(
                userIdKey,
                block.message.media.caption,
                agentConfig.ai.provider,
                'user',
                user
              )
            }
            break
          }

          default:
            console.error('Tipo de mensaje no soportado')
            return null
        }
      }

      // Validar si es un cliente de compañía
      const isCompany = await isClientCompany(userId, chunks, agentConfig, user, userIdKey, platform)
      if (isCompany) {
        return
      }
      // Enviar petición a OpenAI

      const resAi = await sentToAi(agentConfig.ai.provider, userIdKey, user, agentConfig)

      // Si la IA solicita iniciar un flujo estático
      if (resAi === FUNCTION_STATUS.IN_PROGRESS) {
        return resAi
      }
      //TODO: enviar mensaje de error
      if (!resAi) {
        console.error('Error al obtener respuesta de la IA')
        return null
      }

      // Validar si es un cliente de compañía
      const isClientCompanyHandled = await isClientCompany(userId, chunks, agentConfig, user, userIdKey, platform)
      if (isClientCompanyHandled) {
        return
      }

      // Enviar respuesta al usuario
      let originalMessages = []
      if (chunks.length > 0) {
        originalMessages = chunks.map((obj) => obj.originalMessage)
      }
      const res = await sendResponse(agentConfig, resAi, userId, userIdKey, platform, originalMessages, user)
      if (!res) {
        console.error('Error al enviar respuesta al usuario')
        return null
      }
      // Enviar a canales
      sendToChannels(res)

      // ver mensaje en consola para debug
    })
  } catch (error) {
    console.error('Error en agentResponse:', error)
    return null
  }
}

async function isClientCompany(userId, chunks, agentConfig, user, userIdKey, platform) {
  // Validar si es un cliente de compañía
  const client = Clients.getClient(userId)
  if (client && client.empresa) {
    console.log('Cliente de compañía detectado:', client)
    const message = { type: 'text', text: 'Hola, en un momento un representante se pondrá en contacto contigo.' }
    let originalMessages = []
    if (chunks.length > 0) {
      originalMessages = chunks.map((obj) => obj.originalMessage)
    }
    const res = await sendResponse(agentConfig, message, userId, userIdKey, platform, originalMessages, user)
    if (res) {
      sendToChannels(res)
    }
    return true
  }
}
