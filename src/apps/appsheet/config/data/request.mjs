import { appsheeTablesData } from '../../tablesId.mjs'
import { getFullDateFormatGB, getTimeFormat } from '#utilities/dateFunctions/dateNow.mjs'
import { postTable } from '../../api/postTable.mjs'

export async function addRequest(request) {
  const newRequest = Array.isArray(request) ? request : [request]
  const data = newRequest.map((obj) => ({
    ID: obj.id,
    DATE: getFullDateFormatGB() + ' ' + getTimeFormat(),
    USER: obj.userId,
    TAG: obj.tag,
    REQUEST: obj.request,
    PLATFORM: obj.platform,
    STATUS: obj.status
  }))
  try {
    const res = await postTable(appsheeTablesData.toolSendRequestData, data)
    console.info(`Solicitud agregada a AppSheet:\n${JSON.stringify(res, null, 2)}`)
    return res
  } catch (error) {
    console.error('Error al agregar la solicitud a AppSheet:', error)
    return null
  }
}
