import { appsheetTablesConfig } from '../tablesId.mjs'
import { getTable } from '../api/getTable.mjs'
import { formatArray } from '#utilities/appsheetTools/formatArray.mjs'
import { setUsersTags } from '#config/userdTags/userdTags.mjs'

export async function loadUserTags(estate = 'init') {
  const res = await getTable(appsheetTablesConfig.usersTags)
  if (res) {
    console.info('appsheet: configuración de <userstags> cargada')
    const usersTags = buildFormat(res)
    if (estate === 'init') {
      console.info('appsheet: configuración de <userstags> inicializada: ', usersTags.length)
      return setUsersTags(usersTags)
    }
    return usersTags
  } else {
    console.error('appsheet: configuración de <userstags> no cargada')
    return null
  }
}

function buildFormat(data = []) {
  const brains = data.map((obj) => ({
    id: obj.ID,
    name: obj.NAME,
    description: obj.DESCRIPTION,
    aiDescription: obj.AI_DESCRIPTION,
    static: obj.STATIC || false,
    assistants: formatArray(obj.ASSISTANTS)
  }))
  return brains
}
