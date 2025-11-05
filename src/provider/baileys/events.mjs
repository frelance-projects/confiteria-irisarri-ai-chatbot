import { DisconnectReason } from 'baileys'
//TT MÓDULOS
import { updateStatusPlatforms } from '#config/statusPlatforms/statusPlatforms.mjs'
import { eventMessages } from './messages/eventMessages.mjs'
import { deployProvider } from './functions/deployProvider.mjs'
import { generateQrCode } from './functions/generateQrCode.mjs'
import { stopProvider } from './functions/stopProvider.mjs'

const PLATFORM = 'whatsapp-baileys'
export const timeOutConnection = {
  timeoutLimit: 5 * 60 * 1000, // 5 minutos
  disconnectStartTime: null
}

//SS EVENTOS
export async function events(provider) {
  //SS CONEXIÓN
  provider.whatsapp.sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update

    //SS QR CODE
    if (qr) {
      generateQrCode(qr)
    }
    //SS CONECTANDO
    else if (connection === 'connecting') {
      updateStatusPlatforms(PLATFORM, {
        accountId: 'no available',
        status: 'waiting for connection'
      })
      console.info('Conectando a WhatsApp Baileys...')
    }
    //SS CONEXIÓN CERRADA
    else if (connection === 'close') {
      provider.whatsapp.connection = 'disconnected'
      const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut
      if (provider.whatsapp.state === 'open') {
        if (shouldReconnect) {
          console.warn('Conexión caída, re-conectando WhatsApp Baileys...')
          deployProvider()
        } else {
          console.info('la session se cerro')
          updateStatusPlatforms(PLATFORM, { accountId: 'no available', status: 'offline' })
          stopProvider()
        }
      }
      //SS SESSION CERRADO Y PROVEEDOR DETENIDO
      else {
        console.info('Conexión cerrada, no se recolectará.')
        updateStatusPlatforms(PLATFORM, { accountId: 'no available', status: 'sleep mode' })
      }
    }
    //SS CONEXIÓN ABIERTA
    else if (connection === 'open') {
      provider.whatsapp.connection = 'connected'
      provider.whatsapp.state = 'open'
      timeOutConnection.disconnectStartTime = null
      const host = provider.whatsapp.sock?.user?.id?.split(':')[0]
      console.info(`¡Conexión exitosa con WhatsApp Baileys, count ${host} !`)
      updateStatusPlatforms(PLATFORM, { accountId: host, status: 'online' })
    }
  })

  //SS MENSAJES
  provider.whatsapp.sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type === 'notify') {
      eventMessages(messages)
    }
  })
}
