import { isFacturappActive } from '#config/config.mjs'
import { FACTURAPP_ACCESS } from '#enums/facturapp.mjs'

//SS MODELOS
import { ClientsAppsheet } from '#services/appsheet/clients.mjs'
import { ClientsFacturapp } from '#services/facturapp/clients.mjs'

export class ClientsDb {
  //ss Método para obtener el proveedor actual
  static getProvider() {
    if (isFacturappActive(FACTURAPP_ACCESS.CLIENTS)) {
      return ClientsFacturapp
    }
    return ClientsAppsheet
  }

  //ss cargar cliente por código
  static async getClientByCode(code) {
    try {
      return await this.getProvider().getClientByCode(code)
    } catch (error) {
      console.error('ClientsDb: Error al obtener el cliente por código:', error.message)
      throw error
    }
  }

  //ss cargar cliente por teléfono
  static async getClientByPhone(phone) {
    try {
      return await this.getProvider().getClientByPhone(phone)
    } catch (error) {
      console.error('ClientsDb: Error al obtener el cliente por teléfono:', error.message)
      throw error
    }
  }

  //ss cargar cliente por dni
  static async getClientByDni(dni) {
    try {
      return await this.getProvider().getClientByDni(dni)
    } catch (error) {
      console.error('ClientsDb: Error al obtener el cliente por dni:', error.message)
      throw error
    }
  }

  //ss cargar cliente por rut
  static async getClientByRut(rut) {
    try {
      return await this.getProvider().getClientByRut(rut)
    } catch (error) {
      console.error('ClientsDb: Error al obtener el cliente por rut:', error.message)
      throw error
    }
  }

  //ss agregar nuevo cliente
  static async addNewClient(clientData) {
    try {
      return await this.getProvider().addNewClient(clientData)
    } catch (error) {
      console.error('ClientsDb: Error al crear nuevo cliente:', error.message)
      throw error
    }
  }
}
