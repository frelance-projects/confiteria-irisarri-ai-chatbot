import { OrdersDb } from './data.mjs'

export async function getOrderByNumber(orderNumber) {
  try {
    // obtener datos desde la base de datos
    const order = await OrdersDb.getOrderByNumber(orderNumber)
    console.log('Orden obtenida de la base de datos: ', orderNumber)
    return order
  } catch (error) {
    console.error('getOrderByNumber: Error al obtener la orden por número:', error.message)
    return null
  }
}
