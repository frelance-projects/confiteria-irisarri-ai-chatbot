import { getData } from '#utilities/appsheet/getData.mjs'
import { revertFormatDateTime } from '#utilities/appsheet/formatDateTime.mjs'

const NAME_TABLE = 'ARTICLES'

export class ArticlesAppsheet {
  // ss obtener todos los artículos
  static async getAllArticles() {
    const res = await getData(NAME_TABLE, {
      Selector: `Filter(${NAME_TABLE}, [active] = true)`,
    })
    return DataFormatter.buildData(res)
  }

  //ss obtener artículo por código
  static async getArticleByCode(code) {
    const res = await getData(NAME_TABLE, {
      Selector: `Filter(${NAME_TABLE}, And([code] = "${code}", [active] = true))`,
    })
    return DataFormatter.buildData(res[0])
  }

  //ss obtener artículos actualizados desde una fecha
  static async getUpdatedArticles(sinceDate) {
    const dateValid = revertFormatDateTime(sinceDate)
    const res = await getData(NAME_TABLE, {
      Selector: `Filter(${NAME_TABLE}, And([updateDate] > "${dateValid}", [active] = true))`,
    })
    return DataFormatter.buildData(res)
  }
}

class DataFormatter {
  //ss construir datos de configuración
  static buildData(data) {
    const allData = Array.isArray(data) ? data : [data]

    // mapear datos al formato requerido
    const result = allData.map((item) => ({
      codigo: item.code,
      descripcion: item.description,
      descripcionAvanzada: item.advancedDescription,
      stockActual: parseFloat(item.stock),
      ramo: item.branch,
      familia: item.family,
      grupo: item.group,
      precioVenta: parseFloat(item.purchasePrice),
      unidadMedida: item.unit,
      fotoPortada: item.coverPhoto,
      fechaUpdate: item.updateDate,
    }))

    // validar si es un solo objeto o un array
    if (result.length === 1) {
      return result[0]
    }
    // devolver array de objetos
    return result
  }
}
