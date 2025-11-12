import { getBrainById } from '#db/brains/getBrainById.mjs'

//tools
import { getJson as jsonSendRequest } from './tools/jsonSendRequest.mjs'
import { getJson as jsonLoadClientProfile } from './tools/clients/jsonLoadClientProfile.mjs'
import { getJson as jsonAddClientProfile } from './tools/clients/jsonAddClientProfile.mjs'
import { getJson as jsonAddOrder } from './tools/orders/jsonAddOrder.mjs'
import { getJson as getArticles } from './tools/articles/getArticles.mjs'
import { getJson as getDailyArticles } from './tools/dailyArticles/getDailyArticles.mjs'
import { getJson as jsonGetShippingAvailability } from './tools/orders/jsonGetShippingAvailability.mjs'
import { getJson as jsonGetOrderByNumber } from './tools/orders/jsonGetOrderByNumber.mjs'

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

  //orders
  const addOrderJson = await jsonAddOrder()
  if (addOrderJson) {
    tools.push(addOrderJson)
  }

  //articles
  const articlesJson = await getArticles()
  if (articlesJson) {
    tools.push(articlesJson)
  }
  //dailyArticles
  const dailyArticlesJson = await getDailyArticles()
  if (dailyArticlesJson) {
    tools.push(dailyArticlesJson)
  }
  //shippingAvailability
  const shippingAvailabilityJson = await jsonGetShippingAvailability()
  if (shippingAvailabilityJson) {
    tools.push(shippingAvailabilityJson)
  }
  //getOrderByNumber
  const getOrderByNumberJson = await jsonGetOrderByNumber()
  if (getOrderByNumberJson) {
    tools.push(getOrderByNumberJson)
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
