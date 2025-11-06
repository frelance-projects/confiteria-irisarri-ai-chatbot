import { OrdersDb } from './data.mjs'

export async function addOrder(orderData) {
  try {
    // obtener datos desde la base de datos
    const newOrder = await OrdersDb.addOrder(orderData)

    return newOrder
  } catch (error) {
    console.error('addOrder: Error al agregar el pedido:', error.message)
    return null
  }
}
