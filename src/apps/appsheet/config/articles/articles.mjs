import { appsheetTablesArticles } from '../../tablesId.mjs'
import { getTable } from '../../api/getTable.mjs'
import { setArticles } from '#config/articles/articles.mjs'

export async function loadArticles(estate = 'init') {
  const res = await getTable(appsheetTablesArticles.articles)
  if (res) {
    console.info('appsheet: configuración de <articles> cargada')
    const articles = buildFormat(res)
    if (estate === 'init') {
      console.info('appsheet: configuración de <articles> inicializada: ', articles.length)
      return setArticles(articles)
    }
    return articles
  } else {
    console.error('appsheet: configuración de <articles> no cargada')
    return null
  }
}

function buildFormat(data = []) {
  const articles = data.map((obj) => ({
    code: obj.code,
    description: obj.description,
    advancedDescription: obj.advancedDescription || '',
    salePrice: obj.salePrice || 0,
    unit: obj.unit || '',
    branch: obj.branch || '',
    family: obj.family || '',
    group: obj.group || '',
    stock: parseFloat(obj.stock) || 0,
    //image: obj.urlImage || '',
  }))
  return articles
}
