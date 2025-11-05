import { getData } from '#utilities/appsheet/getData.mjs'

const NAME_TABLE = 'RESOURCE_WA_TEMPLATES'

export class WhatsappTemplatesAppsheet {
  //ss cargar plantilla por id
  static async getTemplateById(id) {
    const res = await getData(NAME_TABLE, {
      Selector: `Filter(${NAME_TABLE}, [ID] = "${id}")`,
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
      name: item.NAME || '',
      format: item.FORMAT || '',
      header: item.HEADER || '',
      body: item.BODY || '',
      footer: item.FOOTER || '',
      language: item.LANGUAGE || '',
      status: item.STATUS || '',
      category: item.CATEGORY || '',
      subCategory: item.SUB_CATEGORY || '',
    }))

    // validar si es un solo objeto o un array
    if (result.length === 1) {
      return result[0]
    }
    // devolver array de objetos
    return result
  }
}
