import { ENV } from '#config/config.mjs'
import { DB_HOST } from '#enums/db.mjs'

//SS MODELOS
import { BrainsAppsheet } from '#services/appsheet/brains.mjs'

export class BrainsDb {
  //ss Mapeo de proveedores de base de datos
  static dbProviders = {
    // Proveedor AppSheet
    [DB_HOST.APPSHEET]: BrainsAppsheet,
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

  //ss cargar brain por id
  static async getBrainById(id) {
    try {
      return await this.getProvider().getBrainById(id)
    } catch (error) {
      console.error('BrainsDb: Error al obtener el brain por ID:', error.message)
      throw error
    }
  }
}
