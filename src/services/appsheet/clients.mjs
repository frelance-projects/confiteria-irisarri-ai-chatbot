import { getData } from '#utilities/appsheet/getData.mjs'
import { addData } from '#utilities/appsheet/addData.mjs'
import { buildFormatDateTime, revertFormatDateTime } from '#utilities/appsheet/formatDateTime.mjs'
import { createIdNumber } from '#utilities/createId.mjs'

const NAME_TABLE = 'CLIENTS'

export class ClientsAppsheet {
  //ss obtener cliente por código
  static async getClientByCode(clientCode) {
    const res = await getData(NAME_TABLE, {
      Selector: `Filter(${NAME_TABLE}, [code] = "${clientCode}")`,
    })
    return DataFormatter.buildData(res[0])
  }

  //ss obtener cliente por teléfono
  static async getClientByPhone(phone) {
    const res = await getData(NAME_TABLE, {
      Selector: `Filter(${NAME_TABLE}, [phone] = "${phone}")`,
    })
    return DataFormatter.buildData(res[0])
  }

  //ss obtener cliente por dni
  static async getClientByDni(dni) {
    const res = await getData(NAME_TABLE, {
      Selector: `Filter(${NAME_TABLE}, [dni] = "${dni}")`,
    })
    return DataFormatter.buildData(res[0])
  }

  //ss obtener cliente por rut
  static async getClientByRut(rut) {
    const res = await getData(NAME_TABLE, {
      Selector: `Filter(${NAME_TABLE}, [rut] = "${rut}")`,
    })
    return DataFormatter.buildData(res[0])
  }

  //ss agregar nuevo cliente
  static async addNewClient(clientData) {
    // preparar datos para AppSheet
    const data = DataFormatter.revertData(clientData)

    console.log('Datos a enviar a AppSheet para nuevo cliente:', data)

    // enviar datos a AppSheet
    const res = await addData(NAME_TABLE, {}, data)

    console.log('Respuesta de AppSheet al agregar nuevo cliente:', res)
    return DataFormatter.buildData(res)
  }
}

class DataFormatter {
  //ss construir datos de configuración
  static buildData(data) {
    const allData = Array.isArray(data) ? data : [data]

    // mapear datos al formato requerido
    const result = allData.map((item) => ({
      codigoCliente: parseInt(item.code, 10),
      cedula: item.dni,
      nombre: item.name,
      apellidos: item.lastName,
      descripcion: item.description,
      direccion: item.address,
      mail: item.email,
      telefono: item.phone,
      codigoPostal: item.postalCode,
      rut: item.rut,
      observaciones: item.observations,
      fechaAlta: buildFormatDateTime(item.createdAt),
      activo: item.active,
      empresa: item.company,
      consumidorFinal: item.finalConsumer,
      facturaNombre: item.invoiceName,
      contacto: item.contact,
      fechaUpdate: buildFormatDateTime(item.updateDate),
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
      code: parseInt(item.code, 10) || parseInt(createIdNumber(), 10),
      dni: item.dni,
      name: item.name,
      lastName: item.lastName,
      description: item.description,
      address: item.address,
      email: item.email,
      phone: item.phone,
      postalCode: item.postalCode,
      rut: item.rut,
      observations: item.observations,
      createdAt: item.createdAt ? revertFormatDateTime(item.createdAt) : revertFormatDateTime(new Date()),
      active: item.active,
      company: item.company,
      finalConsumer: item.finalConsumer,
      invoiceName: item.invoiceName,
      contact: item.contact,
    }))

    // validar si es un solo objeto o un array
    if (result.length === 1) {
      return result[0]
    }
    // devolver array de objetos
    return result
  }
}
