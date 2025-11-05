import { ENV } from '#config/config.mjs'
import { addData } from '#utilities/appsheet/addData.mjs'

const NAME_TABLE = 'SERVICE'

export class ServiceAppsheet {
  //ss cargar agent
  static async initConfig() {
    // preparar datos para AppSheet
    const data = DataFormatter.gerConfig()

    // enviar datos a AppSheet
    const res = await addData(NAME_TABLE, {}, data)

    return DataFormatter.buildData(res[0])
  }
}

class DataFormatter {
  static buildData(data) {
    const allData = Array.isArray(data) ? data : [data]

    // mapear datos al formato requerido
    const result = allData.map((item) => ({
      serviceId: item.SERVICE_ID,
      serviceUrl: item.SERVICE_URL,
      serviceToken: item.SERVICE_TOKEN,
    }))

    // validar si es un solo objeto o un array
    if (result.length === 1) {
      return result[0]
    }
    // devolver array de objetos
    return result
  }

  //ss revertir datos de configuración
  static gerConfig() {
    // mapear datos al formato requerido
    const result = {
      SERVICE_ID: ENV.SERVICE_ID,
      SERVICE_URL: ENV.SERVICE_URL,
      SERVICE_TOKEN: ENV.SERVICE_TOKEN,
    }
    // devolver array de objetos
    return result
  }
}
