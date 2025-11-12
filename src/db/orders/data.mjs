import { isFacturappActive } from '#config/config.mjs'
import { FACTURAPP_ACCESS } from '#enums/facturapp.mjs'

//SS MODELOS
import { OrdersAppsheet } from '#services/appsheet/orders.mjs'
import { OrdersFacturapp } from '#services/facturapp/orders.mjs'

//ss Mapeo de proveedores de base de datos
export class OrdersDb {
  //ss Método para obtener el proveedor actual
  static getProvider() {
    if (isFacturappActive(FACTURAPP_ACCESS.ORDERS)) {
      return OrdersFacturapp
    }
    return OrdersAppsheet
  }

  //ss agregar pedido
  static async addOrder(orderData) {
    try {
      return await this.getProvider().addOrder(orderData)
    } catch (error) {
      console.error('OrdersDb: Error al agregar el pedido:', error.message)
      throw error
    }
  }

  //ss obtener orden por número
  static async getOrderByNumber(orderNumber) {
    try {
      return await this.getProvider().getOrderByNumber(orderNumber)
    } catch (error) {
      console.error('OrdersDb: Error al obtener la orden por número:', error.message)
      throw error
    }
  }

  //ss obtener historial de pedidos
  static async getOrdersHistory(clientCode, startDate, endDate) {
    try {
      return await this.getProvider().getOrdersHistory(clientCode, startDate, endDate)
    } catch (error) {
      console.error('OrdersDb: Error al obtener el historial de pedidos:', error.message)
      throw error
    }
  }
}
