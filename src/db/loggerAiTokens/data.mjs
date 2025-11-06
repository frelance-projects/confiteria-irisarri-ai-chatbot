import { ENV } from '#config/config.mjs'
import { DB_HOST } from '#enums/db.mjs'

//SS MODELOS
import { LogsAiTokensAppsheet } from '#services/appsheet/loggerAiTokens.mjs'

//ss Mapeo de proveedores de base de datos
export class LoggerAiTokensDb {
  static dbProviders = {
    // Proveedor AppSheet
    [DB_HOST.APPSHEET]: LogsAiTokensAppsheet,
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
  static async addLogs(logs) {
    try {
      return await this.getProvider().addLogs(logs)
    } catch (error) {
      console.error('LoggerAiTokensDb: Error al agregar logs:', error.message)
      throw error
    }
  }
}
