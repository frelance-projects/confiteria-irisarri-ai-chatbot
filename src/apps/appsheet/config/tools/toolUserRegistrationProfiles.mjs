import { appsheetTablesTools } from '../../tablesId.mjs'
import { getTable } from '../../api/getTable.mjs'
import { postTable } from '../../api/postTable.mjs'
import { getFullDateFormatGB, getTimeFormat } from '#utilities/dateFunctions/dateNow.mjs'
import { buildFormatDateTime, revertDateTime } from '#utilities/appsheetTools/formatDateTime.mjs'
import { setUserRegistrationProfiles } from '#config/tools/toolUserRegistrationProfiles.mjs'

//TT CARGAR CONFIGURACION DE <tool-userregistrationprofiles>
export async function loadUserRegistrationProfiles(estate = 'init') {
  const res = await getTable(appsheetTablesTools.toolUserRegistrationProfiles)
  if (res) {
    console.info('appsheet: configuración de <tool-userregistrationprofiles> cargada')
    const toolUserRegistrationProfiles = buildFormat(res)
    if (estate === 'init') {
      console.info(
        'appsheet: configuración de <tool-userregistrationprofiles> inicializada: ',
        toolUserRegistrationProfiles.length
      )
      return setUserRegistrationProfiles(toolUserRegistrationProfiles)
    }
    return toolUserRegistrationProfiles
  } else {
    console.error('appsheet: configuración de <tool-userregistrationprofiles> no cargada')
    return null
  }
}

//TT AGREGAR PERFIL NUEVO
export async function addUserRegistrationProfiles(profile) {
  const newProfiles = Array.isArray(profile) ? profile : [profile]
  const data = revetFormat(newProfiles)
  const res = await postTable(appsheetTablesTools.toolUserRegistrationProfiles, data)
  if (res) {
    const toolUserRegistrationProfiles = buildFormat(res)
    return toolUserRegistrationProfiles
  } else {
    console.error('appsheet: configuración de <tool-userregistrationprofiles> no cargada')
    return null
  }
}

//SS CREAR FORMATO
function buildFormat(data = []) {
  const toolAutoTag = data.map((obj) => ({
    id: obj.ID,
    timestamp: buildFormatDateTime(obj.TIMESTAMP),
    toolUserRegistration: obj.TOOL_USER_REGISTRATION,
    user: obj.USER,
    logs: obj.LOGS
  }))
  //console.log('toolUserRegistration', toolAutoTag)
  return toolAutoTag
}

//SS REVERTIR FORMATO
function revetFormat(data = []) {
  const toolAutoTag = data.map((obj) => ({
    ID: obj.id,
    TIMESTAMP: revertDateTime(obj.timestamp) || getFullDateFormatGB() + ' ' + getTimeFormat(),
    TOOL_USER_REGISTRATION: obj.toolUserRegistration,
    USER: obj.user,
    LOGS: obj.logs
  }))
  //console.log('toolUserRegistration', toolAutoTag)
  return toolAutoTag
}
