import { deleteCredentials } from './deleteCredentials.mjs'
import { sendLog } from '#logger/logger.mjs'
import { provider } from '#provider/provider.mjs'

export function stopProvider() {
  if (provider.whatsapp.sock) {
    console.info('Proveedor detenido.')
    provider.whatsapp.state = 'close'
    provider.whatsapp.sock.ws.close() // Cierra el socket
    provider.whatsapp.sock = null // Limpia la referencia
    sendLog('info', 'provider/baileys/functions/stopProvider', 'Provider stopped.')
    deleteCredentials()
    return true
  } else {
    console.log('El proveedor ya está detenido.')
    return true
  }
}
