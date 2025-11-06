import { ENV } from '#config/config.mjs'
import { DB_HOST } from '#enums/db.mjs'

//SS MODELOS
import { OrdersAppsheet } from '#services/appsheet/orders.mjs'

//ss Mapeo de proveedores de base de datos
export class OrdersDb {
  static dbProviders = {
    // Proveedor AppSheet
    [DB_HOST.APPSHEET]: OrdersAppsheet,
  }

  //ss Método para obtener el proveedor actual
  static getProvider() {
    const provider = this.dbProviders[ENV.DB_HOST]
    if (!provider) {
      console.error('Proveedor de base de datos no soportado')
      throw new Error('Proveedor de base de datos no soportado')
    }
    return provider
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
