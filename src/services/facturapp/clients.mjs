import axios from 'axios'

//TT MÓDULOS
import { ENV } from '#config/config.mjs'
import { getAuth } from './auth.mjs'
import { buildFormatDateTime } from '#utilities/facturapp/formatDateTime.mjs'

export class ClientsFacturapp {
  // ss obtener cliente por código
  //FIX: solicitar endpoint correcto para obtener cliente por código
  static async getClientByCode(clientCode) {
    const url = `${ENV.FACTURAPP_URL}/buscarCliente`
    const data = getAuth()
    try {
      const res = await axios.post(url, { ...data, codigo: clientCode })
      if (res.status !== 200) {
        throw new Error(`ClientsFacturapp: Error en la petición, código de estado ${res.status}`)
      }
      return DataFormatter.buildData(res.data)
    } catch (error) {
      console.error(`ClientsFacturapp: Error fetching client by código ${clientCode}`, error.message)
      throw new Error(`ClientsFacturapp: Cliente con código ${clientCode} no encontrado`)
    }
  }

  // ss obtener cliente por teléfono
  static async getClientByPhone(phone) {
    const url = `${ENV.FACTURAPP_URL}/buscarCliente`
    const data = getAuth()
    try {
      const res = await axios.post(url, { ...data, celular: phone })
      if (res.status !== 200) {
        throw new Error(`ClientsFacturapp: Error en la petición, código de estado ${res.status}`)
      }

      return DataFormatter.buildData(res.data)
    } catch (error) {
      console.error(`ClientsFacturapp: Error fetching client by phone ${phone}`, error.message)
      throw new Error(`ClientsFacturapp: Cliente con teléfono ${phone} no encontrado`)
    }
  }

  // ss obtener cliente por dni
  static async getClientByDni(dni) {
    const url = `${ENV.FACTURAPP_URL}/buscarCliente`
    const data = getAuth()
    try {
      const res = await axios.post(url, { ...data, cedula: dni })
      if (res.status !== 200) {
        console.error(`ClientsFacturapp: Error en la petición, código de estado ${res.status}`)
        throw new Error(`ClientsFacturapp: Error en la petición, código de estado ${res.status}`)
      }

      console.log('Respuesta de Facturapp al buscar por DNI:', res.data)
      return DataFormatter.buildData(res.data)
    } catch (error) {
      console.error(`ClientsFacturapp: Error fetching client by DNI ${dni}`, error.message)
      throw new Error(`ClientsFacturapp: Cliente con DNI ${dni} no encontrado`)
    }
  }

  //ss agregar nuevo cliente
  static async addNewClient(clientData) {
    const url = `${ENV.FACTURAPP_URL}/altaCliente`
    const data = getAuth()
    const clientFormat = DataFormatter.revertData(clientData)
    try {
      const res = await axios.post(url, { ...data, ...clientFormat })
      if (res.status !== 200) {
        throw new Error(`ClientsFacturapp: Error en la petición, código de estado ${res.status} `)
      }
      console.log('Factura: Código de cliente creado:', res.data)

      // buscar el cliente recién creado con su cedula para obtener todos sus datos
      return await this.getClientByDni(clientData.dni)
    } catch (error) {
      console.error(`ClientsFacturapp: Error `, error.response?.data || error.message)
      throw new Error(`ClientsFacturapp: Cliente no pudo ser creado`)
    }
  }
}

class DataFormatter {
  //ss construir datos de configuración
  static buildData(data) {
    const allData = Array.isArray(data) ? data : [data]

    // mapear datos al formato requerido
    const result = allData.map((item) => ({
      codigoCliente: item.codigoCliente,
      cedula: item.cedula,
      nombre: item.nombre,
      apellidos: item.apellidos,
      descripcion: item.descripcion,
      direccion: item.direccion,
      mail: item.mail,
      telefono: item.telefono,
      codigoPostal: item.codigoPostal,
      rut: item.rut,
      observaciones: item.observaciones,
      fechaAlta: item.fechaAlta ? buildFormatDateTime(item.fechaAlta) : null, // dar formato si es necesario
      activo: item.activo === 'S',
      empresa: item.empresa === 'S',
      consumidorFinal: item.consumidorFinal === 'S',
      facturaNombre: item.facturaNombre,
      contacto: item.contacto,
      fechaUpdate: item.fechaUpdate ? buildFormatDateTime(item.fechaUpdate) : null, // dar formato si es necesario
    }))

    // validar si es un solo objeto o un array
    if (result.length === 1) {
      return result[0]
    }
    // devolver array de objetos
    return result
  }

  //ss revertir datos de configuración
  static revertData(data) {
    const allData = Array.isArray(data) ? data : [data]

    // mapear datos al formato requerido
    const result = allData.map((item) => ({
      documento: item.dni,
      nombre: item.name || '',
      apellidos: item.lastName || '',
      descripcion: item.description || '',
      direccion: item.address || '',
      mail: item.email || '',
      telefono: item.phone || '',
      codigoPostal: item.postalCode || '',
      observaciones: item.observations || '',
      facturaNombre: item.invoiceName || '',
      contacto: item.contact || '',
    }))

    // validar si es un solo objeto o un array
    if (result.length === 1) {
      return result[0]
    }
    // devolver array de objetos
    return result
  }
}
