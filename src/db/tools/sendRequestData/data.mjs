import { ENV } from '#config/config.mjs'
import { DB_HOST } from '#enums/db.mjs'

//SS MODELOS
import { SendRequestDataAppsheet } from '#services/appsheet/tools/sendRequestData.mjs'

export class SendRequestDataDb {
  //ss Mapeo de proveedores de base de datos
  static dbProviders = {
    // Proveedor AppSheet
    [DB_HOST.APPSHEET]: SendRequestDataAppsheet,
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
  static async addRequest(requestData) {
    try {
      return await this.getProvider().addRequest(requestData)
    } catch (error) {
      console.error('SendRequestDb: Error al agregar el sendRequest:', error.message)
      throw error
    }
  }
}
