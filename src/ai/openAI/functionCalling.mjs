//SS FUNCIONES
import { sendRequest } from './functionCalling/sendRequest.mjs'
import { loadClientProfile } from './functionCalling/clients/loadClientProfile.mjs'
import { addClientProfile } from './functionCalling/clients/addClientProfile.mjs'
import { addOrder } from './functionCalling/orders/addOrder.mjs'
import { getArticles } from './functionCalling/articles/getArticles.mjs'
import { getDailyArticles } from './functionCalling/dailyArticles/getDailyArticles.mjs'

//SS NOMBRES
import { functionName as sendRequestName } from './tools/jsonSendRequest.mjs'
import { functionName as loadClientProfileName } from './tools/clients/jsonLoadClientProfile.mjs'
import { functionName as addClientProfileName } from './tools/clients/jsonAddClientProfile.mjs'
import { functionName as addOrderName } from './tools/orders/jsonAddOrder.mjs'
import { functionName as getArticlesName } from './tools/articles/getArticles.mjs'
import { functionName as getDailyArticlesName } from './tools/dailyArticles/getDailyArticles.mjs'

// TT COMPROBAR LLAMADA A FUNCTION
export async function functionCalling(aiFunction, user, userIdKey) {
  //Cargar argumentos
  const functionName = aiFunction.name
  const functionArgs = JSON.parse(aiFunction.arguments)
  console.info(`🔹 Se llamo a una function para ${user.name} desde IA: ${functionName}`, functionArgs)

  const handlers = {
    [sendRequestName]: sendRequest,
    [loadClientProfileName]: loadClientProfile,
    [addClientProfileName]: addClientProfile,
    [addOrderName]: addOrder,
    [getArticlesName]: getArticles,
    [getDailyArticlesName]: getDailyArticles,
  }

  let result
  if (handlers[functionName]) {
    try {
      const res = await handlers[functionName](functionArgs, user, userIdKey)
      result = JSON.stringify(res, null, 2)
    } catch (error) {
      console.error('Error al llamar a la function', functionName, error)
      result = JSON.stringify({ response: 'error: function failed' })
    }
  } else {
    result = JSON.stringify({ response: 'error: function not found' })
  }

  //SS REGRESAR LLAMADA
  const response = { type: 'function_call_output', call_id: aiFunction.call_id, output: result }
  //console.info('Respuesta de la function:\n', result)
  return response
}
