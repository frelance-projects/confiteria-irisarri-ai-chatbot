import { appsheeTablesResources } from '../../tablesId.mjs'
import { getTable } from '../../api/getTable.mjs'
import { setEmailTemplates } from '#config/resources/emailTemplates.mjs'

export async function loadEmailTemplates(estate = 'init') {
  const res = await getTable(appsheeTablesResources.resourceEmailTemplates)
  if (res) {
    console.info('appsheet: configuracion de <resouce-emailtemplates> cargada')
    const emailTemplates = buildFormat(res)
    if (estate === 'init') {
      console.info(
        'appsheet: configuracion de <resouce-emailtemplates> inicializada: ',
        emailTemplates.length
      )
      return setEmailTemplates(emailTemplates)
    }
    return emailTemplates
  } else {
    console.error('appsheet: configuracion de <resouce-emailtemplates> no cargada')
    return null
  }
}

function buildFormat(data = []) {
  const toolAutoTag = data.map((obj) => ({
    id: obj.ID,
    name: obj.NAME,
    description: obj.DESCRIPTION,
    suject: obj.SUBJECT,
    text: obj.TEXT,
    html: obj.HTML
  }))
  //console.log('tool-emailTemplates', toolAutoTag)
  return toolAutoTag
}
