import { getOrderByNumber as getOrderByNumberDb } from '#db/orders/getOrderByNumber.mjs'

export async function getOrderByNumber(args, user, userIdKey) {
  const { orderNumber } = args

  if (!orderNumber) {
    return { success: false, message: 'El número de pedido es requerido.' }
  }

  const order = await getOrderByNumberDb(orderNumber)
  if (!order) {
    return { success: false, message: 'No se encontró ningún pedido con el número proporcionado.' }
  }

  console.info('🧩 Respuesta de función <getOrderByNumber>:\n', JSON.stringify(order, null, 2))
  return { success: true, order }
}
