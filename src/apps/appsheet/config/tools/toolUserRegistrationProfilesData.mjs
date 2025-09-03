import { appsheetTablesTools } from '../../tablesId.mjs'
import { getTable } from '../../api/getTable.mjs'
import { postTable } from '../../api/postTable.mjs'

import { setUserRegistrationProfilesData } from '#config/tools/toolUserRegistrationProfilesData.mjs'

//TT CARGAR DATOS
export async function loadUserRegistrationProfilesData(estate = 'init') {
  const res = await getTable(appsheetTablesTools.toolUserRegistrationProfilesData)
  if (res) {
    console.info('appsheet: configuración de <tool-userregistrationprofilesdata> cargada')
    const toolUserRegistrationProfilesData = buildFormat(res)
    if (estate === 'init') {
      console.info(
        'appsheet: configuración de <tool-userregistrationprofilesdata> inicializada: ',
        toolUserRegistrationProfilesData.length
      )
      return setUserRegistrationProfilesData(toolUserRegistrationProfilesData)
    }
    return toolUserRegistrationProfilesData
  } else {
    console.error('appsheet: configuración de <tool-userregistrationprofilesdata> no cargada')
    return null
  }
}

//TT AGREGAR DATOS NUEVOS
export async function addUserRegistrationProfilesData(profileData) {
  const newData = Array.isArray(profileData) ? profileData : [profileData]
  const data = revetFormat(newData)
  const res = await postTable(appsheetTablesTools.toolUserRegistrationProfilesData, data)
  if (res) {
    const toolUserRegistrationProfilesData = buildFormat(res)
    return toolUserRegistrationProfilesData
  } else {
    console.error('appsheet: configuración de <tool-userregistrationprofilesdata> no cargada')
    return null
  }
}

//SS CREAR FORMATO
function buildFormat(data = []) {
  const toolAutoTag = data.map((obj) => ({
    id: obj.ID,
    toolUserRegistrationProfiles: obj.TOOL_USER_REGISTRATION_PROFILES,
    name: obj.NAME,
    value: obj.value
  }))
  //console.log('toolUserRegistrationProfilesData', toolAutoTag)
  return toolAutoTag
}

//SS REVERTIR FORMATO
function revetFormat(data = []) {
  const toolAutoTag = data.map((obj) => ({
    ID: obj.id,
    TOOL_USER_REGISTRATION_PROFILES: obj.toolUserRegistrationProfiles,
    NAME: obj.name,
    VALUE: obj.value
  }))
  //console.log('toolUserRegistrationProfilesData', toolAutoTag)
  return toolAutoTag
}
