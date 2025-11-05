import { ENV } from '#config/config.mjs'
import { DB_HOST } from '#enums/db.mjs'

//SS MODELOS
import { MessageTemplatesAppsheet } from '#services/appsheet/messageTemplates.mjs'

export class MessageTemplatesDb {
  //ss Mapeo de proveedores de base de datos
  static dbProviders = {
    // Proveedor AppSheet
    [DB_HOST.APPSHEET]: MessageTemplatesAppsheet,
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

  //ss cargar plantilla por id
  static async getTemplateById(id) {
    try {
      return await this.getProvider().getTemplateById(id)
    } catch (error) {
      console.error('MessageTemplatesDb: Error al obtener la plantilla por ID:', error.message)
      throw error
    }
  }
}
