import { addData } from '#utilities/appsheet/addData.mjs'
import { revertFormatDateTime } from '#utilities/appsheet/formatDateTime.mjs'

const NAME_TABLE = 'LOGS_TOKEN'

export class LogsAiTokensAppsheet {
  //ss cargar agent
  static async addLogs(logs) {
    // preparar datos para AppSheet
    const data = DataFormatter.revertData(logs)

    // enviar datos a AppSheet
    const res = await addData(NAME_TABLE, {}, data)

    return DataFormatter.buildData(res)
  }
}

class DataFormatter {
  //ss construir datos de configuración
  static buildData(data) {
    const allData = Array.isArray(data) ? data : [data]

    // mapear datos al formato requerido
    const result = allData.map((item) => ({
      id: item.ID,
      timestamp: item.TIMESTAMP,
      provider: item.PROVIDER,
      model: item.MODEL,
      type: item.TYPE,
      unit: item.UNIT,
      input: item.INPUT,
      output: item.OUTPUT,
      cachedInput: item.CACHED_INPUT,
      user: item.USER,
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
      ID: item.id,
      TIMESTAMP: revertFormatDateTime(item.timestamp),
      PROVIDER: item.provider,
      MODEL: item.model,
      TYPE: item.type,
      UNIT: item.unit,
      INPUT: item.input,
      OUTPUT: item.output,
      CACHED_INPUT: item.cachedInput,
      USER: item.id,
    }))

    // validar si es un solo objeto o un array
    if (result.length === 1) {
      return result[0]
    }
    // devolver array de objetos
    return result
  }
}
