import { appsheetTablesTools } from '../../tablesId.mjs'
import { getTable } from '../../api/getTable.mjs'
import { setCatalogTool } from '#config/tools/toolsCatalog.mjs'

export async function loadToolCatalog(estate = 'init') {
  const res = await getTable(appsheetTablesTools.toolCatalog)
  if (res) {
    console.info('appsheet: configuración de <tool-catalogs> cargada')
    const catalogs = buildFormat(res)
    if (estate === 'init') {
      console.info('appsheet: configuración de <tool-catalogs> inicializada: ', catalogs.length)
      return setCatalogTool(catalogs)
    }
    return catalogs
  } else {
    console.error('appsheet: configuración de <tool-catalogs> no cargada')
    return null
  }
}

function buildFormat(data = []) {
  const catalogs = data.map((obj) => ({
    id: obj.ID,
    name: obj.NAME,
    description: obj.DESCRIPTION
  }))
  return catalogs
}
