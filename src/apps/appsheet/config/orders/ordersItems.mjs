import { postTable } from '../../api/postTable.mjs'
import { appsheetTablesOrders } from '../../tablesId.mjs'

export async function addOrderItems(orderData) {
  const orders = Array.isArray(orderData) ? orderData : [orderData]
  const formattedData = reverseFormat(orders)
  try {
    const res = await postTable(appsheetTablesOrders.ordersItems, formattedData)
    console.info('Order items added:', res.length)
    if (res && res.length > 0) {
      const formattedOrders = buildFormat(res)
      return formattedOrders
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
    order: obj.order || '',
    product: obj.product || '',
    quantity: parseFloat(obj.quantity) || 0,
    note: obj.note || '',
    price: parseFloat(obj.price) || 0,
  }))
  return clients
}

function reverseFormat(data = []) {
  const orders = data.map((obj) => ({
    id: obj.id,
    order: obj.order || '',
    product: obj.product || '',
    quantity: parseFloat(obj.quantity) || 0,
    note: obj.note || '',
  }))
  return orders
}
