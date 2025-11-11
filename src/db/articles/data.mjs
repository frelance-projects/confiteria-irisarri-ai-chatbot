import { isFacturappActive } from '#config/config.mjs'
import { FACTURAPP_ACCESS } from '#enums/facturapp.mjs'

//SS MODELOS
import { ArticlesAppsheet } from '#services/appsheet/articles.mjs'
import { ArticlesFacturapp } from '#services/facturapp/articles.mjs'

export class ArticlesDb {
  //ss Método para obtener el proveedor actual
  static getProvider() {
    if (isFacturappActive(FACTURAPP_ACCESS.ARTICLES)) {
      return ArticlesFacturapp
    }
    return ArticlesAppsheet
  }

  //ss cargar todos los artículos
  static async getAllArticles() {
    try {
      return await this.getProvider().getAllArticles()
    } catch (error) {
      console.error('ArticlesDb: Error al obtener todos los artículos:', error.message)
      throw error
    }
  }

  //ss cargar artículo por código
  static async getArticleByCode(code) {
    try {
      return await this.getProvider().getArticleByCode(code)
    } catch (error) {
      console.error('ArticlesDb: Error al obtener el artículo por código:', error.message)
      throw error
    }
  }

  //ss cargar artículos actualizados desde una fecha
  static async getUpdatedArticles(sinceDate) {
    try {
      return await this.getProvider().getUpdatedArticles(sinceDate)
    } catch (error) {
      console.error('ArticlesDb: Error al obtener artículos actualizados:', error.message)
      throw error
    }
  }
}
