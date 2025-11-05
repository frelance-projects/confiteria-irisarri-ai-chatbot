import { ENV } from '#config/config.mjs'
import { DB_HOST } from '#enums/db.mjs'

//SS MODELOS
import { SendRequestAppsheet } from '#services/appsheet/tools/sendRequest.mjs'

export class SendRequestDb {
  //ss Mapeo de proveedores de base de datos
  static dbProviders = {
    // Proveedor AppSheet
    [DB_HOST.APPSHEET]: SendRequestAppsheet,
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

  //ss cargar sendRequest por id
  static async getSendRequestById(id) {
    try {
      return await this.getProvider().getSendRequestById(id)
    } catch (error) {
      console.error('SendRequestDb: Error al obtener el sendRequest por ID:', error.message)
      throw error
    }
  }
}
