import { appsheeTablesResources } from '../../tablesId.mjs'
import { getTable } from '../../api/getTable.mjs'
import { setMessagelTemplates } from '#config/resources/messageTemplates.mjs'

export async function loadMessageTemplates(estate = 'init') {
  const res = await getTable(appsheeTablesResources.resourceMessageTemplates)
  if (res) {
    console.info('appsheet: configuracion de <resouce-messagetemplates> cargada')
    const messageTemplates = buildFormat(res)
    if (estate === 'init') {
      console.info(
        'appsheet: configuracion de <resouce-messagetemplates> inicializada: ',
        messageTemplates.length
      )
      return setMessagelTemplates(messageTemplates)
    }
    return messageTemplates
  } else {
    console.error('appsheet: configuracion de <resouce-messagetemplates> no cargada')
    return null
  }
}

function buildFormat(data = []) {
  const toolAutoTag = data.map((obj) => ({
    id: obj.ID,
    name: obj.NAME,
    description: obj.DESCRIPTION,
    text: obj.TEXT
  }))
  //console.log('tool-emailTemplates', toolAutoTag)
  return toolAutoTag
}
