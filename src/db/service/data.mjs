import { ENV } from '#config/config.mjs'
import { DB_HOST } from '#enums/db.mjs'

//SS MODELOS
import { ServiceAppsheet } from '#services/appsheet/service.mjs'

//ss Mapeo de proveedores de base de datos
export class ServiceDb {
  static dbProviders = {
    // Proveedor AppSheet
    [DB_HOST.APPSHEET]: ServiceAppsheet,
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

  //ss cargar usuario por plataforma
  static async initConfig() {
    try {
      return await this.getProvider().initConfig()
    } catch (error) {
      console.error('UsersDb: Error al obtener el usuario por plataforma:', error.message)
      throw error
    }
  }
}
