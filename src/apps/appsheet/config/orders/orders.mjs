import { addData } from '#utilities/appsheet/addData.mjs'
import { appsheetTablesOrders } from '../../tablesId.mjs'

export async function addOrder(orderData) {
  const orders = Array.isArray(orderData) ? orderData : [orderData]
  const formattedData = reverseFormat(orders)
  try {
    const res = await addData(appsheetTablesOrders.orders, {}, formattedData)
    if (res && res.length > 0) {
      const formattedOrders = buildFormat(res)
      return formattedOrders[0]
    } else {
      console.error('Error al añadir pedidos: respuesta vacía o inválida')
      return null
    }
  } catch (error) {
    console.error('Error adding order:', error)
    return null
  }
}

function buildFormat(data = []) {
  const clients = data.map((obj) => ({
    id: obj.id,
    createdAt: obj.createdAt || '',
    client: obj.client || '',
    address: obj.address || '',
    status: obj.status || '',
    deliveryDateTime: obj.deliveryDateTime || '',
    note: obj.note || '',
    totalPrice: parseFloat(obj.totalPrice) || 0,
  }))
  return clients
}

function reverseFormat(data = []) {
  const orders = data.map((obj) => ({
    id: obj.id,
    createdAt: obj.createdAt || '',
    client: obj.client || '',
    address: obj.address || '',
    status: obj.status,
    deliveryDateTime: obj.deliveryDateTime || '',
    note: obj.note || '',
  }))
  return orders
}
