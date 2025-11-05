import { ENV } from '#config/config.mjs'
import { DB_HOST } from '#enums/db.mjs'

//SS MODELOS
import { SendRequestTagsAppsheet } from '#services/appsheet/tools/sendRequestTags.mjs'

export class SendRequestTagsDb {
  //ss Mapeo de proveedores de base de datos
  static dbProviders = {
    // Proveedor AppSheet
    [DB_HOST.APPSHEET]: SendRequestTagsAppsheet,
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
  static async getSendRequestTagById(id) {
    try {
      return await this.getProvider().getSendRequestTagById(id)
    } catch (error) {
      console.error('SendRequestTagsDb: Error al obtener la etiqueta de solicitud por ID:', error.message)
      throw error
    }
  }

  //ss cargar todos los asistentes
  static async getAllSendRequestTags() {
    try {
      return await this.getProvider().getAllSendRequestTags()
    } catch (error) {
      console.error('SendRequestTagsDb: Error al obtener todos las etiquetas de solicitud:', error.message)
      throw error
    }
  }
}
