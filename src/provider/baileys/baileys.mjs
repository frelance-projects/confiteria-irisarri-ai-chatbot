import { makeWASocket, useMultiFileAuthState } from 'baileys'
import pino from 'pino'

//TT MÓDULOS
import { provider } from '#provider/provider.mjs'
import { events } from './events.mjs'
const logger = pino({
  level: 'warn' // Solo mostrar logs de nivel 'warn' o superior
})

//SS RUTA DE SESIÓN
const sessionPath = 'volume/session/baileys'

//TT INTEGRAR LA FUNCIÓN EN EL DESPLIEGUE
export async function BaileysInit() {
  const { state, saveCreds } = await useMultiFileAuthState(sessionPath)
  if (provider.whatsapp.state === 'close') {
    console.log('Proveedor ya detenido.')
    return
  }
  provider.whatsapp.sock = makeWASocket({
    logger,
    auth: state,
    printQRInTerminal: false
  })
  provider.whatsapp.provider = 'baileys'
  events(provider)

  provider.whatsapp.sock.ev.on('creds.update', saveCreds)
}
