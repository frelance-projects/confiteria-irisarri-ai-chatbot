import { addData } from '#utilities/appsheet/addData.mjs'
import { getData } from '#utilities/appsheet/getData.mjs'
import { revertFormatDateTime, revertFormatDateTimeUs } from '#utilities/appsheet/formatDateTime.mjs'

const NAME_TABLE = 'ORDERS'
const NAME_TABLE_ITEMS = 'ORDERS_ITEMS'

export class OrdersAppsheet {
  //ss agregar orden
  static async addOrder(order) {
    // preparar datos para AppSheet
    const { ordersInfo, orderItems } = DataFormatter.revertData(order)

    // enviar datos a AppSheet
    await addData(NAME_TABLE, {}, ordersInfo) // enviar orden
    await addData(NAME_TABLE_ITEMS, {}, orderItems) // enviar items del pedido

    // obtener y devolver la orden agregada
    return this.getOrderById(ordersInfo.id)
  }

  // ss obtener orden por id
  static async getOrderByNumber(orderNumber) {
    const res = await getData(NAME_TABLE, {
      Selector: `Filter(${NAME_TABLE}, [id] = "${orderNumber}")`,
    })
    return DataFormatter.buildData(res[0])
  }

  //ss obtener historial de pedidos
  static async getOrdersHistory(clientCode, startDate, endDate) {
    const res = await getData(NAME_TABLE, {
      Selector: `Filter(${NAME_TABLE}, AND([client] = "${clientCode}", [createdAt] >= "${revertFormatDateTimeUs(
        startDate
      )}", [createdAt] <= "${revertFormatDateTimeUs(endDate)}"))`,
    })
    return DataFormatter.buildData(res)
  }
}

class DataFormatter {
  //ss construir datos de configuración
  static buildData(resOrder) {
    const allOrders = Array.isArray(resOrder) ? resOrder : [resOrder]

    const orders = []
    // mapear datos al formato requerido
    for (const item of allOrders) {
      const deliveryDate = new Date(item.deliveryDate)
      const _date = deliveryDate.getDate() + '/' + (deliveryDate.getMonth() + 1) + '/' + deliveryDate.getFullYear()
      const _time =
        String(deliveryDate.getHours()).padStart(2, '0') + ':' + String(deliveryDate.getMinutes()).padStart(2, '0')
      const _order = {
        numeroPedido: parseInt(item.id, 10),
        Fecha: _date,
        hora: _time,
        estado: item.status,
        cliente: item.name,
        direccion: item.address,
        formaPago: item.paymentMethod,
        total: parseFloat(item.totalPrice),
        // no se agrega "pago" porque no se maneja en AppSheet
        // no se agregan "facturado" porque no se maneja en AppSheet
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
        id: String(Date.now()), // generar id temporal
        createdAt: revertFormatDateTime(new Date()),
        client: item.client,
        name: item.name,
        phone: item.phone,
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
