import { getData } from '#utilities/appsheet/getData.mjs'
import { addData } from '#utilities/appsheet/addData.mjs'

const NAME_TABLE = 'RESOURCE_WA_TEMPLATES'

export class WhatsappTemplatesAppsheet {
  //ss cargar plantilla por id
  static async getTemplateById(id) {
    const res = await getData(NAME_TABLE, {
      Selector: `Filter(${NAME_TABLE}, [ID] = "${id}")`,
    })
    return DataFormatter.buildData(res[0])
  }

  //ss agregar plantillas
  static async addTemplates(templates) {
    // preparar datos para AppSheet
    const data = DataFormatter.revertData(templates)

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

  //ss revertir datos de configuración
  static revertData(data) {
    const allData = Array.isArray(data) ? data : [data]

    // mapear datos al formato requerido
    const result = []
    for (const template of allData) {
      const header = template.components.find((item) => item.type === 'HEADER')
      const body = template.components.find((item) => item.type === 'BODY')
      const footer = template.components.find((item) => item.type === 'FOOTER')
      const buttons = template.components.find((item) => item.type === 'BUTTONS')
      const obj = {
        ID: template.id,
        NAME: template.name || '',
        FORMAT: template.parameter_format || '',
        HEADER: header ? header.text : '',
        BODY: body ? body.text : '',
        FOOTER: footer ? footer.text : '',
        BUTTONS: buttons ? buttons.buttons.map((btn) => btn.text).join(', ') : '',
        LANGUAGE: template.language || '',
        STATUS: template.status || '',
        CATEGORY: template.category || '',
        SUB_CATEGORY: template.sub_category || '',
      }
      data.push(obj)
    }

    // validar si es un solo objeto o un array
    if (result.length === 1) {
      return result[0]
    }
    // devolver array de objetos
    return result
  }
}
