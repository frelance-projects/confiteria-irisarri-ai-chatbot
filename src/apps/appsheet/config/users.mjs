import { appsheetTablesConfig } from '../tablesId.mjs'
import { getTable } from '../api/getTable.mjs'
import { postTable } from '../api/postTable.mjs'
import { setUsers } from '#config/users/users.mjs'
import { patchTable } from '../api/patchTable.mjs'
import { buildFormatDateTime } from '#utilities/appsheetTools/formatDateTime.mjs'

import { ENV } from '#config/config.mjs'

//TT CARGAR LISTA DE USUARIOS
export async function loadUsers(estate = 'init') {
  const res = await getTable(appsheetTablesConfig.users)
  if (res) {
    console.info('appsheet: configuracion de <users> cargada')
    const users = buildFormat(res)
    if (estate === 'init') {
      console.info('appsheet: configuracion de <users> inicializada: ', users.length)
      return setUsers(users)
    }
    return users
  } else {
    console.error('appsheet: configuracion de <users> no cargada')
    return null
  }
}

//TT AGREGAR USUARIO
export async function addUsers(newUser) {
  const dataUsers = Array.isArray(newUser) ? newUser : [newUser]
  const users = revertFormat(dataUsers)
  const res = await postTable(appsheetTablesConfig.users, users)
  if (res) {
    console.log('appsheet: usuario agregado')
    return buildFormat(res)
  } else {
    console.error('appsheet: error al agregar usuario')
    return null
  }
}

//TT ACTUALIZAR USUARIO
export async function updateUsers(user) {
  const dataUsers = Array.isArray(user) ? user : [user]
  const users = revertFormat(dataUsers)
  const res = await patchTable(appsheetTablesConfig.users, users)
  if (res) {
    console.log('appsheet: usuario actualizado')
    return buildFormat(res)
  } else {
    console.error('appsheet: error al actualizar usuario')
    return null
  }
}

//TT OBTENER ULTIMO CONTACTO
export async function getLastContactById(userId) {
  const res = await getTable(appsheetTablesConfig.users, [], {
    Selector: `FILTER(${appsheetTablesConfig.users}, [ID] = "${userId}")`,
    Locale: 'en-GB',
    Timezone: ENV.TZ,
    UserSettings: { FROM_API: true }
  })
  if (res && res.length > 0) {
    return buildFormatDateTime(res[0].LAST_CONTACT)
  } else {
    console.error('Error al cargar el ultimo contacto de AppSheet')
    return null
  }
}

//SS DAR FORMATO A LISTA DE USUARIOS
function buildFormat(data = []) {
  const users = data.map((obj) => ({
    userId: obj.ID,
    name: obj.NAME || '',
    registeredName: obj.REGISTERED_NAME || '',
    tag: obj.TAG || '',
    email: obj.EMAIL || '',
    whatsapp: { id: obj.WHATSAPP_ID },
    messenger: { id: obj.MESSENGER_ID },
    instagram: { id: obj.INSTAGRAM_ID },
    brain: obj.BRAIN,
    blacklist: obj.BLACKLIST
  }))
  //console.log('appsheet: usuarios', users)
  return users
}
//SS REVERTIR FORMATO A LISTA DE USUARIO
export function revertFormat(data = []) {
  const users = data.map((obj) => ({
    ID: obj.userId,
    NAME: obj.name,
    REGISTERED_NAME: obj.registeredName,
    TAG: obj.tag,
    EMAIL: obj.email,
    WHATSAPP_ID: obj.whatsapp.id,
    MESSENGER_ID: obj.messenger.id,
    INSTAGRAM_ID: obj.instagram.id,
    BRAIN: obj.brain,
    BLACKLIST: obj.blacklist
  }))
  return users
}
