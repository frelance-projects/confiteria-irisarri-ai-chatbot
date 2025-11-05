import { ENV } from '#config/config.mjs'
import { DB_HOST } from '#enums/db.mjs'

//SS MODELOS
import { AssistantsAppsheet } from '#services/appsheet/assistants.mjs'

export class AssistantsDb {
  //ss Mapeo de proveedores de base de datos
  static dbProviders = {
    // Proveedor AppSheet
    [DB_HOST.APPSHEET]: AssistantsAppsheet,
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

  //ss cargar asistente por id
  static async getAssistantById(id) {
    try {
      return await this.getProvider().getAssistantById(id)
    } catch (error) {
      console.error('AssistantsDb: Error al obtener el asistente por ID:', error.message)
      throw error
    }
  }

  //ss cargar todos los asistentes
  static async getAllAssistants() {
    try {
      return await this.getProvider().getAllAssistants()
    } catch (error) {
      console.error('AssistantsDb: Error al obtener todos los asistentes:', error.message)
      throw error
    }
  }
}
