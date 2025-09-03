//TT MÓDULOS
import { getAgent } from '#config/agent/agent.mjs'

//TT AGREGAR CLAVE
export async function getCredentialsOpenAI() {
  const agentConfig = await getAgent()
  if (agentConfig && agentConfig.ai.provider === 'openai') {
    return agentConfig
  } else {
    console.error('getCredentialsOpenAI: No se ha configurado un proveedor de IA válido')
    return null
  }
}
