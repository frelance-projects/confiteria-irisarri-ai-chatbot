import { ENV } from '#config/config.mjs'
import { DB_HOST } from '#enums/db.mjs'

//SS MODELOS
import { StatusPlatforms } from '#services/appsheet/statusPlatforms.mjs'

//ss Mapeo de proveedores de base de datos
export class StatusPlatformsDb {
  static dbProviders = {
    // Proveedor AppSheet
    [DB_HOST.APPSHEET]: StatusPlatforms,
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
  static async updateStatus(table, update) {
    try {
      return await this.getProvider().updateStatus(table, update)
    } catch (error) {
      console.error('StatusPlatformsDb: Error al actualizar el estado por plataforma:', error.message)
      throw error
    }
  }
}
