import { ENV } from '#config/config.mjs'
import { DB_HOST } from '#enums/db.mjs'

//SS MODELOS
import { PromotionsAppsheet } from '#services/appsheet/promotions.mjs'

export class PromotionsDb {
  //ss Mapeo de proveedores de base de datos
  static dbProviders = {
    // Proveedor AppSheet
    [DB_HOST.APPSHEET]: PromotionsAppsheet,
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

  //ss cargar todas las promociones
  static async getAllPromotions() {
    try {
      return await this.getProvider().getAllPromotions()
    } catch (error) {
      console.error('PromotionsDb: Error al obtener todas las promociones:', error.message)
      throw error
    }
  }

  //ss cargar promoción por id
  static async getPromotionById(id) {
    try {
      return await this.getProvider().getPromotionById(id)
    } catch (error) {
      console.error('PromotionsDb: Error al obtener la promoción por ID:', error.message)
      throw error
    }
  }
}
