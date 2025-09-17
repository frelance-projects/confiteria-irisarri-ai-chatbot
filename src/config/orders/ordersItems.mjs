import { ENV } from '#config/config.mjs'
import { addOrderItems as addOrderItemsAppsheet } from '#apps/appsheet/config/orders/ordersItems.mjs'

export async function addOrderItems(orderData) {
  if (ENV.APP_FRONTEND === 'appsheet') {
    const request = await addOrderItemsAppsheet(orderData)
    return request
  } else {
    console.error('addOrderItems: frontend no soportado')
    return null
  }
}
