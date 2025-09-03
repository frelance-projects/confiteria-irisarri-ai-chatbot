import { sendLog } from '#logger/logger.mjs'
import { provider } from '#provider/provider.mjs'

export async function closeSession() {
  if (provider.whatsapp.sock) {
    console.log('Cerrando sesión')
    try {
      await provider.whatsapp.sock.logout()
      console.info('Sesión cerrada correctamente')
      sendLog('info', 'provider/baileys/functions/closeSession', 'Session closed')
    } catch (e) {
      console.error('Error al cerrar sesión')
    }
    return true
  } else {
    console.warn('No hay provedor de WhatsApp activo')
    return false
  }
}
