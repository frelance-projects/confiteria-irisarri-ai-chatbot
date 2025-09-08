import { appsheetTablesArticles } from '../../tablesId.mjs'
import { getTable } from '../../api/getTable.mjs'
import { setArticlesDaily } from '#config/articles/articlesDaily.mjs'

export async function loadArticlesDaily(estate = 'init') {
  const res = await getTable(appsheetTablesArticles.articlesDaily)
  if (res) {
    console.info('appsheet: configuración de <articlesDaily> cargada')
    const articlesDaily = buildFormat(res)
    if (estate === 'init') {
      console.info('appsheet: configuración de <articlesDaily> inicializada: ', articlesDaily.length)
      return setArticlesDaily(articlesDaily)
    }
    return articlesDaily
  } else {
    console.error('appsheet: configuración de <articlesDaily> no cargada')
    return null
  }
}

function buildFormat(data = []) {
  const articlesDaily = data.map((obj) => ({
    code: obj.code,
    description: obj.description,
    bestSellingRanking: parseFloat(obj.bestSellingRanking) || 0,
    quantities: parseInt(obj.quantities) || 0,
    percentage: parseFloat(obj.percentage) || 0,
    branch: obj.branch || '',
    availableToday: obj.availableToday === 'SI',
    stockSource: obj.stockSource || '',
    estimatedStock: obj.estimatedStock || '',
    specialRestriction: obj.specialRestriction || false,
    dateConsideration: obj.dateConsideration || '',
    shortDescription: obj.shortDescription || '',
    nextTasks: obj.nextTasks || '',
    family: obj.family || '',
    group: obj.group || '',
    unit: obj.unit || '',
    lineDescription: obj.lineDescription || '',
    currency: obj.currency || '',
    rate: parseFloat(obj.rate) || 0,
    customerType: obj.customerType || '',
    supplier: obj.supplier || '',
    branchOffice: obj.branchOffice || '',
    itemNotes: obj.itemNotes || '',
    docNotes: obj.docNotes || '',
    orderNumber: parseInt(obj.orderNumber) || 0,
    branchIndicators: obj.branchIndicators || '',
    factory: obj.factory || '',
    salePrice: parseFloat(obj.salePrice) || 0,
    urlImage: obj.urlImage || '',
  }))
  //console.log('articlesDaily cargados:', articles[0])
  return articlesDaily
}
