//SS MODELOS
import { DailyArticlesAppsheet } from '#services/appsheet/dailyArticles.mjs'

export class DailyArticlesDb {
  //ss Método para obtener el proveedor actual
  static getProvider() {
    return DailyArticlesAppsheet
  }

  //ss cargar todos los artículos
  static async getAllDailyArticles() {
    try {
      return await this.getProvider().getAllDailyArticles()
    } catch (error) {
      console.error('DailyArticlesDb: Error al obtener todos los artículos:', error.message)
      throw error
    }
  }

  //ss cargar artículo por código
  static async getDailyArticleByCode(code) {
    try {
      return await this.getProvider().getDailyArticleByCode(code)
    } catch (error) {
      console.warn('DailyArticlesDb: Error al obtener el artículo por código:', error.message)
      throw error
    }
  }

  //ss cargar artículos actualizados desde una fecha
  static async getUpdatedDailyArticles(sinceDate) {
    try {
      return await this.getProvider().getUpdatedDailyArticles(sinceDate)
    } catch (error) {
      console.error('DailyArticlesDb: Error al obtener artículos actualizados:', error.message)
      throw error
    }
  }
}
