import { appsheeTablesTools } from '../../tablesId.mjs'
import { getTable } from '../../api/getTable.mjs'
import { setCatalogPagesTool } from '#config/tools/toolCatalogPages.mjs'

export async function loadToolCatalogPages(estate = 'init') {
  const res = await getTable(appsheeTablesTools.toolCatalogPages)
  if (res) {
    console.info('appsheet: configuracion de <tool-catalogpages> cargada')
    const catalogPages = buildFormat(res)
    if (estate === 'init') {
      console.info('appsheet: configuracion de <tool-catalogpages> inicializada: ', catalogPages.length)
      return setCatalogPagesTool(catalogPages)
    }
    return catalogPages
  } else {
    console.error('appsheet: configuracion de <tool-catalogpages> no cargada')
    return null
  }
}

function buildFormat(data = []) {
  const catalogsPages = data.map((obj) => ({
    id: obj.ID,
    catalogId: obj.CATALOG,
    name: obj.NAME,
    description: obj.DESCRIPTION || '',
    status: obj.STATUS || false,
    price: parseFloat(obj.PRICE) || 0,
    paymentLink: obj.PAYMENT_LINK || '',
    type: obj.TYPE,
    url: obj.URL
  }))
  return catalogsPages
}
