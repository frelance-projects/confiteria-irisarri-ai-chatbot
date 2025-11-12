import { OrdersDb } from './data.mjs'

export async function getOrdersHistory(clientCode, startDate, endDate) {
  try {
    // obtener datos desde la base de datos
    const orders = await OrdersDb.getOrdersHistory(clientCode, startDate, endDate)
    console.log('Historial de órdenes obtenidas de la base de datos: ', clientCode)
    return orders
  } catch (error) {
    console.error('getOrdersHistory: Error al obtener el historial de órdenes:', error.message)
    return []
  }
}
