import { addOrder as addOrderDb } from '#db/orders/addOrder.mjs'

export async function addOrder(order) {
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
