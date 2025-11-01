import { ENV } from '#config/config.mjs'
import { getData } from '#utilities/appsheet/getData.mjs'

const NAME_TABLE = 'AGENT'

export class AgentAppsheet {
  //ss cargar agent
  static async getAgent() {
    const res = await getData(NAME_TABLE, {
      Selector: `Filter(${NAME_TABLE}, [SERVICE_ID] = "${ENV.SERVICE_ID}")`,
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
      status: item.STATE,
      ai: {
        provider: ENV.AI_PROVIDER, //openai |
        token: ENV.OPENAI_API_KEY,
        model: item.MODEL,
        temperature: parseFloat(item.TEMPERATURE) || 0,
        maxTokens: parseInt(item.MAX_TOKEN, 10) || 300,
        processAudio: item.PROCESS_AUDIO || false,
        processImage: item.PROCESS_IMAGE || false,
        processPdf: item.PROCESS_PDF || false,
        pdfQuality: item.PDF_QUALITY || 'text', //text | ocr
      },
      delay: parseInt(item.DELAY, 10) * 1000 || 0,
      awaitResponse: parseInt(item.AWAIT_RESPONSE, 10) * 1000 || 0,
      historyInMemory: parseInt(item.HISTORY_IN_MEMORY, 10) * 60000 || 0,
      defaultBrain: item.DEFAULT_BRAIN,
      defaultBlacklist: item.DEFAULT_BLACKLIST || false,
    }))

    // validar si es un solo objeto o un array
    if (result.length === 1) {
      return result[0]
    }
    // devolver array de objetos
    return result
  }
}
