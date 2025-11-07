import { OpenAI } from 'openai'
//TT MÓDULOS
import { getCredentialsOpenAI } from './credentials.mjs'
import { getMessageHistory } from './messageHistory.mjs'
import { functionCalling } from './functionCalling.mjs'
import { addMessageToHistoryOpenAi } from './messageHistory.mjs'
import { getToolsOpenAi } from './tools.mjs'
import { addLog } from '#logger/loggerToken.mjs'
import { select } from './models/select.mjs'
import { FUNCTION_STATUS } from '#enums/agent.mjs'

export async function sendToOpenAI(userIdKey, user, aiModel, aiMaxTokens, aiTemperature) {
  try {
    //cargar credenciales
    const agentConfig = await getCredentialsOpenAI()
    if (!agentConfig) {
      console.error('sendToOpenAI: No se han encontrado credenciales de OpenAI')
      return null
    }
    const openai = new OpenAI({
      apiKey: agentConfig.ai.token,
    })

    //cargar historial
    const history = await getMessageHistory(userIdKey, user)

    //cargar tools
    const tools = await getToolsOpenAi(user.brain)

    const model = await select(aiModel)

    const response = await model(openai, {
      aiModel,
      history,
      aiMaxTokens,
      aiTemperature,
      tools,
    })

    const functionCall = response.output.find((msg) => msg.type === 'function_call')
    addLogOpenAi(user, aiModel, response)
    //SS TOOLS
    if (functionCall) {
      //ejecutar function
      const resFunction = await functionCalling(functionCall, user, userIdKey, response.output)

      // si la función está en progreso, no continuar
      if (resFunction === FUNCTION_STATUS.IN_PROGRESS) {
        return resFunction
      }

      //agregar respuesta a historial
      await addMessageToHistoryOpenAi(userIdKey, [...response.output, resFunction], user)
      //enviar respuesta
      return await sendToOpenAI(userIdKey, user, aiModel, aiMaxTokens, aiTemperature)
    }
    //SS TEXTO
    else {
      //console.log('Respuesta en texto:', message.content)
      return { type: 'text', text: response.output_text }
    }
  } catch (error) {
    console.error('Error al enviar el mensaje a OpenAI:', error)
    return null
  }
}

//SS AGREGAR LOGS
function addLogOpenAi(user, model, response) {
  try {
    const userId = user.id
    const provider = 'openai'
    const type = 'text'
    const unit = 'tokens'
    const input = response.usage.input_tokens || 0
    const output = response.usage.output_tokens || 0
    const cachedInput = response.usage.input_tokens_details?.cached_tokens || 0
    addLog(userId, { provider, model, type, unit, input, output, cachedInput })
  } catch (error) {
    console.error('Error al agregar el log a OpenAI:', error)
  }
}
