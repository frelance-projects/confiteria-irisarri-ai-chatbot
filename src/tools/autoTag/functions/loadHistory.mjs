import { getAgent } from '#config/agent/agent.mjs'
import { getMessageHistory } from '#ai/openAI/messageHistory.mjs'

export async function loadHistory(userIdKey, user) {
  const agentConfig = await getAgent()
  if (!agentConfig) {
    console.error('Agente: Error al cargar configuración')
    return null
  }
  if (agentConfig.ai.provider === 'openai') {
    const history = await getMessageHistory(userIdKey, user)
    return history
  } else {
    console.error('loadHistory: Tipo de IA no soportado')
    return null
  }
}
