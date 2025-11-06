import { addOrder as addOrderDb } from '#db/orders/addOrder.mjs'

export async function addOrder(clientCode, orderData) {
  const order = buildOrder(clientCode, orderData)
  try {
    const addedOrder = await addOrderDb(order)
    if (!addedOrder) {
      return { success: false, message: 'No se pudo crear el pedido.' }
    }
    return { success: true, data: addedOrder }
  } catch (error) {
    console.error('addOrder: Error al agregar el pedido:', error.message)
    return { success: false, message: 'Error al crear el pedido.' }
  }
}

function buildOrder(clientCode, orderData) {
  const order = {
    client: clientCode,
    paymentMethod: orderData.paymentMethod,
    address: orderData.address || '',
    deliveryMode: orderData.deliveryMode,
    deliveryDate: orderData.deliveryDate,
    note: orderData.note || '',
    articles: [],
  }
  for (const item of orderData.articles) {
    const orderItem = {
      article: item.code,
      quantity: item.quantity,
      note: item.note || '',
    }
    order.articles.push(orderItem)
  }
  return order
}
