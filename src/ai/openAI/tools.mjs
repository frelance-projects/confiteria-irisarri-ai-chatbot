import { getBrainById } from '#config/brain/brain.mjs'

//tools
import { getJson as jsonSendRequest } from './tools/jsonSendRequest.mjs'
import { getJson as jsonLoadClientProfile } from './tools/clients/jsonLoadClientProfile.mjs'
import { getJson as jsonAddClientProfile } from './tools/clients/jsonAddClientProfile.mjs'

export async function getToolsOpenAi(brainId) {
  const tools = []
  const brain = await getBrainById(brainId)
  if (!brain) {
    console.error('getToolsOpenAi: No se ha encontrado el cerebro')
    return tools
  }

  //clients
  const clientProfileJson = await jsonLoadClientProfile()
  if (clientProfileJson) {
    tools.push(clientProfileJson)
  }
  const addClientProfileJson = await jsonAddClientProfile()
  if (addClientProfileJson) {
    tools.push(addClientProfileJson)
  }

  //sendRequest
  if (brain.toolSendRequest) {
    const sendRequestJson = await jsonSendRequest(brain.toolSendRequest)
    if (sendRequestJson) {
      tools.push(sendRequestJson)
    }
  }

  //console.log('getToolsOpenAi: ', tools)
  return tools
}
