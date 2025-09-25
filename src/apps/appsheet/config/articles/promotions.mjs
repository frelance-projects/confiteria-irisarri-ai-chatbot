import { appsheetTablesArticles } from '../../tablesId.mjs'
import { getTable } from '../../api/getTable.mjs'

export async function getPromotions() {
  const res = await getTable(appsheetTablesArticles.promotions)
  if (res && res.length > 0) {
    console.info('Promociones encontradas:', res.length)
    const promotions = buildFormat(res)
    return promotions
  } else {
    console.warn('No se han encontrado promociones')
    return null
  }
}

function buildFormat(data = []) {
  const promotions = data.map((obj) => ({
    id: obj.id,
    name: obj.name,
    description: obj.description || '',
    status: obj.status || false,
    urlImage: obj.urlImage || '',
  }))
  return promotions
}
