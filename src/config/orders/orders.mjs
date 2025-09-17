import { ENV } from '#config/config.mjs'
import { addOrder as addOrderAppsheet } from '#apps/appsheet/config/orders/orders.mjs'

export async function addOrder(orderData) {
  if (ENV.APP_FRONTEND === 'appsheet') {
    const request = await addOrderAppsheet(orderData)
    return request
  } else {
    console.error('addOrder: frontend no soportado')
    return null
  }
}
