import { formatArray } from '#utilities/appsheet/formatArray.mjs'
import { getData } from '#utilities/appsheet/getData.mjs'

const NAME_TABLE = 'TOOL_SENDREQUEST'

export class SendRequestAppsheet {
  //ss obtener herramienta por id
  static async getSendRequestById(id) {
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
      notify: item.NOTIFY || false,
      channels: formatArray(item.CHANNELS),
      messageTemplate: item.MESSAGE_TEMPLATE,
      templateId: item.TEMPLATE_ID,
      emailTemplate: item.EMAIL_TEMPLATE,
      tags: formatArray(item.TAGS),
    }))

    // validar si es un solo objeto o un array
    if (result.length === 1) {
      return result[0]
    }
    // devolver array de objetos
    return result
  }
}
