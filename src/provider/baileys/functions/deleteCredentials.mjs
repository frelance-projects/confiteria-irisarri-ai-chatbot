import { deleteFilesInFolder } from '#utilities/deleteFilesInFolder.mjs'

export async function deleteCredentials() {
  const res = await deleteFilesInFolder('volume/session/baileys')
  if (res) {
    console.info('Credenciales borradas correctamente')
    return true
  } else {
    console.error('Error al borrar credenciales')
    return false
  }
}
