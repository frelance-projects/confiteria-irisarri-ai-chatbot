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
    ranking: parseInt(obj.ranking, 10) || 0,
    description: obj.description || '',
    advancedDescription: obj.advancedDescription || '',
    branch: obj.branch || '',
    family: obj.family || '',
    group: obj.group || '',
    brand: obj.brand || '',
    stock: obj.stock || '',
    available: obj.available || false,
    restriction: obj.restriction || false,
    minimumQuantity: parseFloat(obj.minimumQuantity) || 0,
    multipleOf: parseFloat(obj.multipleOf) || 0,
    hoursInAdvance: parseInt(obj.hoursInAdvance, 10) || 0,
    sugarFree: obj.sugarFree || false,
    suitableForCeliacs: obj.suitableForCeliacs || false,
    withoutFlour: obj.withoutFlour || false,
    vegan: obj.vegan || false,
    goToHuman: obj.goToHuman || false,
    comment: obj.comment || '',
    // virtuales
    salePrice: parseFloat(obj.salePrice) || 0,
    image: obj.urlImage || '',
  }))
  //console.log('articlesDaily cargados:', articlesDaily[0])
  return articlesDaily
}
