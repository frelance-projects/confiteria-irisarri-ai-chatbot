import { appsheetTablesConfig } from '../tablesId.mjs'
import { ENV } from '#config/config.mjs'
import { addData } from '#utilities/appsheet/addData.mjs'

export async function updateStatusPlatforms(platform, { accountId, status }) {
  let table
  let data = {}
  if (platform === 'whatsapp-baileys' || platform === 'whatsapp-meta') {
    if (ENV.PROV_WHATSAPP === 'baileys') {
      data = {
        PLATFORM: platform,
        ACCOUNT_ID: accountId,
        STATUS: status,
      }
      table = appsheetTablesConfig.platformWaBaileys
    } else if (ENV.PROV_WHATSAPP === 'meta') {
      data = {
        PLATFORM: platform,
        PHONE_ID: ENV.WHATSAPP_META_PHONEID,
        ACCOUNT_ID: accountId,
        STATUS: status,
      }
      table = appsheetTablesConfig.platformWaMeta
    }
  } else {
    console.error('updateStatusPlatforms: plataforma no soportada')
    return null
  }
  console.info(
    `updateStatusPlatforms: actualizando estado de plataforma *${platform}*, accountId: *${accountId}*, status: *${status}*`
  )
  const res = await addData(table, {}, data)
  if (res) {
    console.log('appsheet: estado de plataforma actualizado')
    return res
  } else {
    console.error('appsheet: error al actualizar estado de plataforma')
    return null
  }
}
