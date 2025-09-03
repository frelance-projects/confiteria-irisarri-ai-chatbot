import { appsheeTablesTools } from '../../tablesId.mjs'
import { getTable } from '../../api/getTable.mjs'
import { setFollowUpMessages } from '#config/tools/toolFollowUpMessages.mjs'

export async function loadToolFollowUpMessages(estate = 'init') {
  const res = await getTable(appsheeTablesTools.toolFollowUpMessages)
  if (res) {
    console.info('appsheet: configuracion de <tool-followUpMessages> cargada')
    const followUpMessages = buildFormat(res)
    if (estate === 'init') {
      console.info(
        'appsheet: configuracion de <tool-followUpMessages> inicializada: ',
        followUpMessages.length
      )
      return setFollowUpMessages(followUpMessages)
    }
    return followUpMessages
  } else {
    console.error('appsheet: configuracion de <tool-followUpMessages> no cargada')
    return null
  }
}

function buildFormat(data = []) {
  const toolAutoTag = data.map((obj) => ({
    id: obj.ID,
    name: obj.NAME,
    unitTime: obj.UNIT_TIME,
    time: obj.TIME,
    channel: obj.CHANNEL,
    messageTemplate: obj.MESSAGE_TEMPLATE,
    tamplateId: obj.TEMPLATE_ID,
    emailTamplate: obj.EMAIL_TEMPLATE
  }))
  //console.warn('tool-followUpMessages', toolAutoTag)
  return toolAutoTag
}
