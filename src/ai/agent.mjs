//TT MÓDULOS IA
import { getAgent } from '#config/agent/agent.mjs'
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
//TOOLS
import { initAutoTag } from '#tools/autoTag/initAutoTag.mjs'

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
    if (agentConfig.state !== 'active') {
      console.error('Agente desactivado')
      return null
    }
    // Comprobar si el usuario está bloqueado
    if (user.blacklist) {
      console.error('Agente: Usuario bloqueado')
      return null
    }

    const userIdKey = `${user[platform].id}-*-${platform}`

    // Reiniciar sesión
    resetUserSession(userIdKey, agentConfig)

    // Agrupar mensajes
    groupMessages(userIdKey, { message, originalMessage }, agentConfig.delay, async (chunks) => {
      for (const block of chunks) {
        switch (block.message.type) {
          case 'text':
            await addTextMessageToHistory(
              userIdKey,
              block.message.text,
              agentConfig.ai.provider,
              'user',
              user
            )
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

      // Enviar petición a OpenAI
      const resAi = await sentToAi(agentConfig.ai.provider, userIdKey, user, agentConfig)
      if (resAi) {
        // Enviar respuesta al usuario
        let originalMessages = []
        if (chunks.length > 0) {
          originalMessages = chunks.map((obj) => obj.originalMessage)
        }
        const res = await sendResponse(
          agentConfig,
          resAi,
          userId,
          userIdKey,
          platform,
          originalMessages,
          user
        )
        if (res) {
          console.info('Mensaje del usuario', JSON.stringify(chunks, null, 2))
          console.info('Respuesta enviada al usuario', JSON.stringify(res, null, 2))
          sendToChannels(res)
          //SS TOOLS
          initAutoTag(user, userIdKey)
        }
      }
      //FIX enviar mensaje de error
      else {
        console.error('Error al obtener respuesta de la IA')
        return null
      }
    })
  } catch (error) {
    console.error('Error en agentResponse:', error)
    return null
  }
}
