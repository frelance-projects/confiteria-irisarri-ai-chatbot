import { deleteFilesInFolder } from '#utilities/deleteFilesInFolder.mjs'
import { sendLog } from '#logger/logger.mjs'

export async function deleteCredentials() {
  const res = await deleteFilesInFolder('volume/session/baileys')
  if (res) {
    console.info('Credenciales borradas correctamente')
    return true
  } else {
    sendLog('error', 'provider/baileys/functions/deleteCredentials', 'Error deleting credentials')
    console.error('Error al borrar credenciales')
    return false
  }
}
