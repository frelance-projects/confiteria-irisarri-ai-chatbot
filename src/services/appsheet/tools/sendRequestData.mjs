import { addData } from '#utilities/appsheet/addData.mjs'
import { getFullDateFormatGB, getTimeFormat } from '#utilities/dateFunctions/dateNow.mjs'

const NAME_TABLE = 'TOOL_SENDREQUEST_DATA'

export class SendRequestDataAppsheet {
  //ss obtener herramienta por id
  static async addRequest(requestData) {
    // preparar datos para AppSheet
    const data = DataFormatter.revertData(requestData)

    // enviar datos a AppSheet
    const res = await addData(NAME_TABLE, {}, data)

    return DataFormatter.buildData(res[0])
  }
}

class DataFormatter {
  //ss revertir datos de configuración
  static revertData(data) {
    const allData = Array.isArray(data) ? data : [data]

    // mapear datos al formato requerido
    const result = allData.map((item) => ({
      ID: item.id,
      DATE: getFullDateFormatGB() + ' ' + getTimeFormat(),
      USER: item.id,
      TAG: item.tag,
      REQUEST: item.request,
      PLATFORM: item.platform,
      STATUS: item.status,
    }))

    // validar si es un solo objeto o un array
    if (result.length === 1) {
      return result[0]
    }
    // devolver array de objetos
    return result
  }
}
