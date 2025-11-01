import { ENV } from '#config/config.mjs'
import { DB_HOST } from '#enums/db.mjs'

//SS MODELOS
import { AgentAppsheet } from '#services/appsheet/agent.mjs'

export class AgentDb {
  //ss Mapeo de proveedores de base de datos
  static dbProviders = {
    // Proveedor AppSheet
    [DB_HOST.APPSHEET]: AgentAppsheet,
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

  //ss cargar agent por id
  static async getAgent() {
    try {
      return await this.getProvider().getAgent()
    } catch (error) {
      console.error('AgentDb: Error al obtener el agent', error.message)
      throw error
    }
  }
}
