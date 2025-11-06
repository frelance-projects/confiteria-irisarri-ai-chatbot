import { addData } from '#utilities/appsheet/addData.mjs'
import { buildFormatDateTime, revertFormatDateTime } from '#utilities/appsheet/formatDateTime.mjs'

const NAME_TABLE = 'ORDERS'
const NAME_TABLE_ITEMS = 'ORDERS_ITEMS'

export class OrdersAppsheet {
  //ss agregar orden
  static async addOrder(order) {
    // preparar datos para AppSheet
    const { ordersInfo, orderItems } = DataFormatter.revertData(order)

    // enviar datos a AppSheet
    const resOrder = await addData(NAME_TABLE, {}, ordersInfo)
    const resOrderItems = await addData(NAME_TABLE_ITEMS, {}, orderItems)

    // construir datos de configuración
    return DataFormatter.buildData(resOrder, resOrderItems)
  }
}

class DataFormatter {
  //ss construir datos de configuración
  static buildData(resOrder, resOrderItems) {
    const allOrders = Array.isArray(resOrder) ? resOrder : [resOrder]

    const orders = []
    // mapear datos al formato requerido
    for (const item of allOrders) {
      const _order = {
        id: item.id,
        createdAt: buildFormatDateTime(item.createdAt),
        client: item.client,
        status: item.status,
        address: item.address,
        paymentMethod: item.paymentMethod,
        deliveryMode: item.deliveryMode,
        deliveryDate: item.deliveryDate,
        note: item.note,
        articles: [],
      }
      // filtrar items del pedido
      const itemsForOrder = resOrderItems.filter((it) => it.order === item.id)
      for (const orderItem of itemsForOrder) {
        const _article = {
          order: orderItem.order,
          article: orderItem.article,
          quantity: orderItem.quantity,
          note: orderItem.note,
        }
        _order.articles.push(_article)
      }
      orders.push(_order)
    }

    if (orders.length === 1) {
      return orders[0]
    }
    return orders
  }

  //ss revertir datos de configuración
  static revertData(data) {
    const orderData = Array.isArray(data) ? data : [data]

    const ordersInfo = []
    const orderItems = []
    // mapear datos al formato requerido
    for (const item of orderData) {
      const _order = {
        id: `ord-${crypto.randomUUID()}`,
        createdAt: revertFormatDateTime(new Date()),
        client: item.client,
        address: item.address,
        paymentMethod: item.paymentMethod,
        deliveryMode: item.deliveryMode,
        deliveryDate: item.deliveryDate,
        note: item.note,
      }

      for (const article of item.articles) {
        const _item = {
          id: `ord-item-${crypto.randomUUID()}`,
          order: _order.id,
          article: article.article,
          quantity: article.quantity,
          note: article.note || '',
        }
        orderItems.push(_item)
      }

      ordersInfo.push(_order)
    }
    if (ordersInfo.length === 1) {
      return { ordersInfo: ordersInfo[0], orderItems }
    }

    // devolver array de objetos
    return { ordersInfo, orderItems }
  }
}
