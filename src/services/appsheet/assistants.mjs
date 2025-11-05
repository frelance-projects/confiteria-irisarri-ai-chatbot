import { getData } from '#utilities/appsheet/getData.mjs'

const NAME_TABLE = 'ASSISTANTS'

export class AssistantsAppsheet {
  // ss obtener todos los asistentes
  static async getAllAssistants() {
    const res = await getData(NAME_TABLE)
    return DataFormatter.buildData(res)
  }

  //ss obtener asistente por id
  static async getAssistantById(id) {
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
      email: item.EMAIL || '',
      whatsappId: item.WHATSAPP_ID || '',
      phone: item.PHONE || '',
      detectAssistantCondition: item.DETECT_ASSISTANT_CONDITION || 'never',
      detectAssistantMessage: item.DETECT_ASSISTANT_MESSAGE,
      detectAssistantIdle: parseInt(item.DETECT_ASSISTANT_IDLE, 10) || 5, // minutos
    }))

    // validar si es un solo objeto o un array
    if (result.length === 1) {
      return result[0]
    }
    // devolver array de objetos
    return result
  }
}
