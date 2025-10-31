import { getData } from '#utilities/appsheet/getData.mjs'

const NAME_TABLE = 'BRAINS'

export class BrainsAppsheet {
  //ss cargar brain por id
  static async getBrainById(id) {
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
      name: item.NAME,
      //tools
      toolSendRequest: item.TOOL_SENDREQUEST || '',
      //prompts
      headPrompt: item.HEAD_PROMPT,
      prompt: item.PROMPT,
      footerPrompt: item.FOOTER_PROMPT,
    }))

    // validar si es un solo objeto o un array
    if (result.length === 1) {
      return result[0]
    }
    // devolver array de objetos
    return result
  }
}
