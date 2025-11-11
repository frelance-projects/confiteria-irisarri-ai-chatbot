import { isFacturappActive } from '#config/config.mjs'
import { FACTURAPP_ACCESS } from '#enums/facturapp.mjs'

const IS_FACTURAPP_ACTIVE = isFacturappActive(FACTURAPP_ACCESS.ARTICLES)

export function formatToAi(articles) {
  const data = []

  for (const article of articles) {
    //TODO: agregar mas filtros según necesidad
    // validar stock
    if (article.stockActual && article.stockActual > 0 && isActive(article)) {
      const obj = {
        codigo: article.codigo,
        nombre: article.descripcion,
        descripcion: article.descripcionAvanzada || '',
        familia: article.familia || '',
        grupo: article.grupo || '',
        precio: article.precioVenta || 0,
        unidadMedida: article.unidadMedida || '',
        fotoPortada: article.fotoPortada || '',
      }
      data.push(obj)
    }
  }
  return data
}

function isActive(article) {
  // si está activa la integración con Facturapp, todos los artículos se consideran activos
  if (IS_FACTURAPP_ACTIVE) {
    return true
  }
  // de lo contrario, se valida el campo active del artículo
  return article.active === true
}
