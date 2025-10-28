import { ENV } from '#config/config.mjs'
import { DB_HOST } from '#enums/db.mjs'

//SS MODELOS
import { UsersAppsheet } from '#services/appsheet/users.mjs'

export class UsersDb {
  //ss Mapeo de proveedores de base de datos
  static dbProviders = {
    // Proveedor AppSheet
    [DB_HOST.APPSHEET]: UsersAppsheet,
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

  //ss cargar usuario por id
  static async getUserById(id) {
    try {
      return await this.getProvider().getUserById(id)
    } catch (error) {
      console.error('UsersDb: Error al obtener el usuario por ID:', error.message)
      throw error
    }
  }

  //ss cargar usuario por plataforma
  static async getUserByPlatform(id, platform) {
    try {
      return await this.getProvider().getUserByPlatform(id, platform)
    } catch (error) {
      console.error('UsersDb: Error al obtener el usuario por plataforma:', error.message)
      throw error
    }
  }

  //ss obtener usuarios por etiqueta
  static async getUsersByTag(tagId) {
    try {
      return await this.getProvider().getUsersByTag(tagId)
    } catch (error) {
      console.error('UsersDb: Error al obtener los usuarios por etiqueta:', error.message)
      throw error
    }
  }

  //ss obtener fecha de ultimo contacto
  static async getLastContactById(userId) {
    try {
      return await this.getProvider().getLastContactById(userId)
    } catch (error) {
      console.error('UsersDb: Error al obtener la fecha de último contacto:', error.message)
      throw error
    }
  }

  //ss agregar usuario
  static async addUser(user) {
    try {
      return await this.getProvider().addUser(user)
    } catch (error) {
      console.error('UsersDb: Error al agregar usuario:', error.message)
      throw error
    }
  }

  //ss actualizar usuario
  static async updateUser(user) {
    try {
      return await this.getProvider().updateUser(user)
    } catch (error) {
      console.error('UsersDb: Error al actualizar usuario:', error.message)
      throw error
    }
  }
}
