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
}
