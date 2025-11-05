import { ENV } from '#config/config.mjs'
import { DB_HOST } from '#enums/db.mjs'

//SS MODELOS
import { EmailTemplatesAppsheet } from '#services/appsheet/emailTemplates.mjs'

export class EmailTemplatesDb {
  //ss Mapeo de proveedores de base de datos
  static dbProviders = {
    // Proveedor AppSheet
    [DB_HOST.APPSHEET]: EmailTemplatesAppsheet,
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
      console.error('EmailTemplatesDb: Error al obtener la plantilla por ID:', error.message)
      throw error
    }
  }
}
