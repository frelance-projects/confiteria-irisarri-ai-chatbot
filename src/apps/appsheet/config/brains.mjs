import { appsheetTablesConfig } from '../tablesId.mjs'
import { getTable } from '../api/getTable.mjs'
import { setBrains } from '#config/brain/brain.mjs'
import { buildBrain } from '#config/license.mjs'

export async function loadBrains(estate = 'init') {
  const res = await getTable(appsheetTablesConfig.brains)
  if (res) {
    console.info('appsheet: configuracion de <brains> cargada')
    const brains = buildFormat(res)
    if (estate === 'init') {
      console.info('appsheet: configuracion de <brains> inicializada: ', brains.length)
      return setBrains(brains)
    }
    return brains
  } else {
    console.error('appsheet: configuracion de <brains> no cargada')
    return null
  }
}

function buildFormat(data = []) {
  const brains = data.map((obj) => ({
    brainId: obj.ID,
    name: obj.NAME,
    //tools
    toolUserRegistration: obj.TOOL_USER_REGISTRATION || '',
    toolCatalog: obj.TOOL_CATALOG || '',
    toolSendRequest: obj.TOOL_SENDREQUEST || '',
    toolAutoTag: obj.TOOL_AUTOTAG || '',
    toolAppointment: obj.TOOL_APPOINTMENT || '',
    //prompts
    headPrompt: obj.HEAD_PROMPT,
    prompt: obj.PROMPT,
    footerPrompt: obj.FOOTER_PROMPT
  }))
  return buildBrain(brains)
}
