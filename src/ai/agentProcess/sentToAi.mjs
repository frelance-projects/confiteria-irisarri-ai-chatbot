//TT MÓDULOS
import { sendToOpenAI } from '../openAI/sendToOpenAI.mjs'
import { sendLog } from '#logger/logger.mjs'

export async function sentToAi(provider, userIdKey, user, agentConfig) {
  if (provider === 'openai') {
    const resAi = await sendToOpenAI(
      userIdKey,
      user,
      agentConfig.ai.model,
      agentConfig.ai.maxTokens,
      agentConfig.ai.temperature
    )
    return resAi
  } else {
    sendLog('error', 'ai/agentProcess/sentToAi', 'Unsupported ai type')
    console.error('Agente: Tipo de IA no soportado')
    return null
  }
}
