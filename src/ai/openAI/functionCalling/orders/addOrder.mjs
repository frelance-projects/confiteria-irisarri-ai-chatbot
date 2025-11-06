import { validateOrder } from '#tools/orders/validateOrder.mjs'
import { Clients } from '#ai/agentProcess/clientAction.mjs'
import { addOrder as addOrderTool } from '#tools/orders/addOrder.mjs'

export async function addOrder(args, user, userIdKey) {
  const platform = userIdKey.split('-*-')[1]
  // cargar datos del pedido desde los argumentos
  const order = {
    deliveryDate: args.deliveryDate,
    deliveryMode: args.deliveryMode,
    address: args.address || '',
    note: args.note || '',
    articles: args.articles,
    paymentMethod: args.paymentMethod,
  }

  // cargar cliente desde la sesión
  const client = Clients.getClient(user[platform]?.id)
  if (!client) {
    console.error('No se ha encontrado el cliente en la sesión')
    return { success: false, message: 'Cliente no registrado' }
  }

  // validar datos del pedido
  const validation = await validateOrder(order)
  if (validation.error) {
    return {
      success: false,
      message: 'Error de validación en el pedido',
      details: validation.details,
    }
  }

  //TODO: crear resumen de pedido

  const result = await addOrderTool(client.codigoCliente, order)
  if (!result.success) {
    return {
      success: false,
      message: result.message || 'Error al crear el pedido',
    }
  }

  console.info('🧩 Respuesta de función <addOrder>:\n', JSON.stringify(result, null, 2))
  return { status: true, message: 'Pedido creado correctamente.', order: result.data }
}
