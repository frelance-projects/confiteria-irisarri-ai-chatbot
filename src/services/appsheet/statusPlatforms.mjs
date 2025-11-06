import { addData } from '#utilities/appsheet/addData.mjs'

export class StatusPlatforms {
  static async updateStatus(table, update) {
    // preparar datos para AppSheet
    const data = DataFormatter.gerConfig(update)

    // enviar datos a AppSheet
    const res = await addData(table, {}, data)

    return DataFormatter.buildData(res[0])
  }
}

class DataFormatter {
  static buildData(data) {
    const allData = Array.isArray(data) ? data : [data]

    // mapear datos al formato requerido
    const result = allData.map((item) => ({
      platform: item.PLATFORM,
      accountId: item.ACCOUNT_ID,
      status: item.STATUS,
    }))

    // validar si es un solo objeto o un array
    if (result.length === 1) {
      return result[0]
    }
    // devolver array de objetos
    return result
  }

  //ss revertir datos de configuración
  static gerConfig(data) {
    // mapear datos al formato requerido
    const result = {
      PLATFORM: data.platform,
      ACCOUNT_ID: data.accountId,
      STATUS: data.status,
    }
    // devolver array de objetos
    return result
  }
}
