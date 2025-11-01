import { getData } from '#utilities/appsheet/getData.mjs'

const NAME_TABLE = 'PROMOTIONS'

export class PromotionsAppsheet {
  // ss obtener todos los artículos
  static async getAllPromotions() {
    const res = await getData(NAME_TABLE)
    return DataFormatter.buildData(res)
  }

  //ss obtener promoción por id
  static async getPromotionById(id) {
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
      id: item.id,
      name: item.name,
      description: item.description || '',
      status: item.status || false,
      urlImage: item.urlImage || '',
    }))

    // validar si es un solo objeto o un array
    if (result.length === 1) {
      return result[0]
    }
    // devolver array de objetos
    return result
  }
}
