import { getArticle } from '#services/facturapp/articles.mjs'
import { setArticles } from '#config/articles/articles.mjs'

export async function loadArticles(estate = 'init') {
  const res = await getArticle()
  if (res) {
    console.info('facturapp: configuración de <articles> cargada')
    const articles = buildFormat(res)
    if (estate === 'init') {
      console.info('facturapp: configuración de <articles> inicializada: ', articles.length)
      return setArticles(articles)
    }
    return articles
  } else {
    console.error('facturapp: configuración de <articles> no cargada')
    return null
  }
}

function buildFormat(data = []) {
  const articles = data.map((obj) => ({
    code: obj.codigo,
    description: obj.descripcion,
    advancedDescription: obj.descripcionAvanzada || '',
    salePrice: obj.precioVenta || 0,
    unit: obj.unidadMedida || '',
    branch: obj.ramo || '',
    family: obj.familia || '',
    group: obj.grupo || '',
    stock: parseFloat(obj.stockActual) || 0,
    //image: obj.fotoPortada || '',
  }))
  return articles
}
