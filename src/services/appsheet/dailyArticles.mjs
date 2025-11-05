import { getData } from '#utilities/appsheet/getData.mjs'
import { revertFormatDateTime } from '#utilities/appsheet/formatDateTime.mjs'

const NAME_TABLE = 'ARTICLES_DAILY'

export class DailyArticlesAppsheet {
  // ss obtener todos los artículos
  static async getAllDailyArticles() {
    const res = await getData(NAME_TABLE)
    const result = DataFormatter.buildData(res)
    return Array.isArray(result) ? result : [result]
  }

  //ss obtener artículo por código
  static async getDailyArticleByCode(code) {
    const res = await getData(NAME_TABLE, {
      Selector: `Filter(${NAME_TABLE}, [code] = "${code}")`,
    })
    return DataFormatter.buildData(res[0])
  }

  //ss obtener artículos actualizados desde una fecha
  static async getUpdatedDailyArticles(sinceDate) {
    const dateValid = revertFormatDateTime(sinceDate)
    const res = await getData(NAME_TABLE, {
      Selector: `Filter(${NAME_TABLE}, [updateDate] > "${dateValid}")`,
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
      precioVenta: parseFloat(item.salePrice), //fix: se debe actualizar desde la lista de articulos o no
      unidadMedida: item.unit, //fix: se debe actualizar desde la lista de articulos o no
      fotoPortada: item.urlImage,
      fechaUpdate: item.updateDate,
      // adiciones
      restricciones: item.restriction,
      cantidadMinima: parseFloat(item.minimumQuantity) || 0,
      multipleDe: parseFloat(item.multipleOf) || 1,
      horasDeAnticipacion: parseInt(item.hoursInAdvance) || 0,
      libreDeAzucar: item.sugarFree,
      aptoParaCeliacos: item.suitableForCeliacs,
      esVegano: item.vegan,
      remitirHumano: item.goToHuman,
      commentario: item.comment,
      // otros campos
      active: item.active,
    }))

    // validar si es un solo objeto o un array
    if (result.length === 1) {
      return result[0]
    }
    // devolver array de objetos
    return result
  }
}
