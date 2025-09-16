//SS FUNCIONES
import { sendRequest } from './functionCalling/sendRequest.mjs'

//SS NOMBRES
import { functionName as sendRequestName } from './tools/jsonSendRequest.mjs'

// TT COMPROBAR LLAMADA A FUNCTION
export async function functionCalling(aiFunction, user, userIdKey) {
  //Cargar argumentos
  const functionName = aiFunction.name
  const functionArgs = JSON.parse(aiFunction.arguments)
  console.log(`🔹 se llamo a una function para ${user.name} desde IA: ${functionName}`, functionArgs)

  const handlers = {
    [sendRequestName]: sendRequest,
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
  console.info('Respuesta de la function:\n', result)
  return response
}
