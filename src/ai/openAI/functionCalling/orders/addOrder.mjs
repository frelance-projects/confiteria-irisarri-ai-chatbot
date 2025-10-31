import { addOrder as addOrderTool } from '#tools/orders/addOrder.mjs'

export async function addOrder(args, user, userIdKey) {
  const order = {
    client: args.client,
    address: args.address,
    note: args.note || '',
    products: args.products,
  }

  if (!order.client || !order.address || !order.products) {
    console.error('addOrder: client, address and products are required')
    return { response: 'error: client, address and products are required' }
  }
  if (!Array.isArray(order.products) || order.products.length === 0) {
    console.error('addOrder: products must be a non-empty array')
    return { response: 'error: products must be a non-empty array' }
  }

  //crear el pedido
  const res = await addOrderTool(order)
  if (res) {
    //verificar si hay error
    if (res.error) {
      console.error('addOrder: ', res.error)
      return { response: 'error', error: res.error }
    }
    //verificar si hay respuesta
    else {
      console.info('🧩 Respuesta de función <addOrder>: ', JSON.stringify(res, null, 2))
      return { response: 'success: order created', order: res }
    }
  }
  //error al crear el pedido
  else {
    console.error('Error al crear el pedido')
    return { response: 'error al crear el pedido' }
  }
}
