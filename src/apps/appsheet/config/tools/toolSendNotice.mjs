import { appsheetTablesTools } from '../../tablesId.mjs'
import { getTable } from '../../api/getTable.mjs'
import { formatArray } from '#utilities/appsheetTools/formatArray.mjs'
import { setToolSendNotice } from '#config/tools/toolSendNotice.mjs'
import { patchTable } from '../../api/patchTable.mjs'

export async function loadToolSendNotice(estate = 'init') {
  const res = await getTable(appsheetTablesTools.toolSendNotice)
  if (res) {
    console.info('appsheet: configuración de <tool-sendnotice> cargada')
    const toolSendNotice = buildFormat(res)
    if (estate === 'init') {
      console.info('appsheet: configuración de <tool-sendnotice> inicializada', toolSendNotice.length)
      return setToolSendNotice(toolSendNotice)
    }
    return toolSendNotice
  } else {
    console.error('appsheet: configuración de <tool-sendnotice> no cargada')
    return null
  }
}

//TT ACTUALIZAR NOTICIA
export async function updateNoticeProcess(notice) {
  const dataNotice = Array.isArray(notice) ? notice : [notice]
  const data = revertFormat(dataNotice)
  const res = await patchTable(appsheetTablesTools.toolSendNotice, data)
  if (res) {
    console.log('appsheet: usuario actualizado')
    return buildFormat(res)
  } else {
    console.error('appsheet: error al actualizar usuario')
    return null
  }
}

//SS DAR FORMATO
function buildFormat(data = []) {
  const toolSendNotice = data.map((obj) => ({
    id: obj.ID,
    name: obj.NAME,
    description: obj.DESCRIPTION,
    userTag: obj.USER_TAG,
    channel: obj.CHANNEL,
    messageTemplate: obj.MESSAGE_TEMPLATE,
    templateId: obj.TEMPLATE_ID,
    emailTemplate: obj.EMAIL_TEMPLATE,
    fileType: obj.FILE_TYPE || 'none',
    fileUrl: obj.URL,
    weekDays: formatArray(obj.WEEK_DAYS),
    interval: parseInt(obj.INTERVAL, 10) || 5,
    startTime: obj.START_TIME,
    endTime: obj.END_TIME,
    process: obj.PROCESS
  }))
  //console.warn('appsheet: configuración de <tool-sendnotice> formateada: ', toolSendNotice)
  return toolSendNotice
}

//SS REVERTIR FORMATO
function revertFormat(data = []) {
  const toolSendNotice = data.map((obj) => ({
    ID: obj.id,
    PROCESS: obj.process
  }))
  //console.warn('appsheet: configuración de <tool-sendnotice> formateada: ', toolSendNotice)
  return toolSendNotice
}
