import { getAgent } from '#config/agent/agent.mjs'
import { sendToOpenAI } from './openAi.mjs'

export async function sentToAi(history, tags) {
  const agentConfig = await getAgent()
  if (!agentConfig) {
    console.error('Agente: Error al cargar configuración')
    return null
  }
  if (agentConfig.ai.provider === 'openai') {
    const message = buildMessage(history, tags)
    const response = await sendToOpenAI(agentConfig, message)
    return response
  } else {
    console.error('sentToAi: Tipo de IA no soportado')
    return null
  }
}

function buildMessage(history, tags) {
  let textTags = ''
  for (const tag of tags) {
    textTags += `id: ${tag.id}\n  Nombre: ${tag.name}\n  Descripción: ${tag.aiDescription}\n\n`
  }
  const prompt = `
  Dada la siguiente conversación, elige solo UNA de estas etiquetas y responde con el id de la etiqueta:
  ${textTags}.
  
  Conversación:
  {${JSON.stringify(history, null, 2)}}
  
  Dev`
  //console.info('prompt', prompt)
  return prompt
}
