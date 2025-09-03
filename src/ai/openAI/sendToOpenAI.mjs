import { OpenAI } from 'openai'
//TT MÓDULOS
import { getCredentialsOpenAI } from './credentials.mjs'
import { getMessageHistory } from './messageHistory.mjs'
import { sendLog } from '#logger/logger.mjs'
import { functionCalling } from './functionCalling.mjs'
import { addMessageToHistoryOpenAi } from './messageHistory.mjs'
import { getToolsOpenAi } from './tools.mjs'
import { addLog } from '#logger/loggerToken.mjs'
import { select } from './models/select.mjs'

export async function sendToOpenAI(userIdKey, user, aiModel, aiMaxTokens, aiTemperature) {
  try {
    //cargar credenciales
    const agentConfig = await getCredentialsOpenAI()
    if (!agentConfig) {
      console.error('sendToOpenAI: No se han encontrado credenciales de OpenAI')
      sendLog('error', 'ai/openAI/sendToOpenAI', 'No OpenAI credentials found')
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
      const resFunction = await functionCalling(functionCall, user, userIdKey)
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
    sendLog('error', 'ai/openAI/sendToOpenAI', 'Error sending message to OpenAI:\n' + String(error))
    console.error('Error al enviar el mensaje a OpenAI:', error)
    return null
  }
}

//SS AGREGAR LOGS
function addLogOpenAi(user, model, response) {
  try {
    const userId = user.userId
    const provider = 'openai'
    const type = 'text'
    const unit = 'tokens'
    const input = response.usage.input_tokens || 0
    const output = response.usage.output_tokens || 0
    const cachedInput = response.usage.input_tokens_details?.cached_tokens || 0
    addLog(userId, { provider, model, type, unit, input, output, cachedInput })
    console.log(response.usage)
    console.log(response.user)
  } catch (error) {
    sendLog('error', 'ai/openAI/sendToOpenAI', 'Error adding log to OpenAI:\n' + String(error))
    console.error('Error al agregar el log a OpenAI:', error)
  }
}
