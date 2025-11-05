import { formatArray } from '#utilities/appsheet/formatArray.mjs'
import { getData } from '#utilities/appsheet/getData.mjs'

const NAME_TABLE = 'TOOL_SENDREQUEST_TAGS'

export class SendRequestTagsAppsheet {
  // ss obtener todos las etiquetas de solicitud
  static async getAllSendRequestTags() {
    const res = await getData(NAME_TABLE)
    return DataFormatter.buildData(res)
  }

  //ss obtener herramienta por id
  static async getSendRequestTagById(id) {
    const res = await getData(NAME_TABLE, {
      Selector: `Filter(${NAME_TABLE}, [id] = "${id}")`,
    })
    return DataFormatter.buildData(res[0])
  }
}

class DataFormatter {
  //ss construir datos de configuración
  static buildData(data) {
    const allData = Array.isArray(data) ? data : [data]

    // mapear datos al formato requerido
    const result = allData.map((item) => ({
      id: item.ID,
      name: item.NAME,
      description: item.DESCRIPTION,
      assistants: formatArray(item.ASSISTANTS),
    }))

    // validar si es un solo objeto o un array
    if (result.length === 1) {
      return result[0]
    }
    // devolver array de objetos
    return result
  }
}
