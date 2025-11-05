import { timeOutConnection } from '../events.mjs'
import { stopProvider } from './stopProvider.mjs'
import { existsSync, mkdirSync } from 'fs'
import { publicPath } from '#config/paths.mjs'
import qrcode from 'qrcode' // Importar la librería QR

const destination = publicPath + '/baileys-provider'
const qrName = 'baileys_qr.png'
export function generateQrCode(qr) {
  if (!timeOutConnection.disconnectStartTime) {
    timeOutConnection.disconnectStartTime = Date.now()
  }
  const elapsedTime = Date.now() - timeOutConnection.disconnectStartTime

  if (elapsedTime > timeOutConnection.timeoutLimit) {
    console.info('Conexión cerrada por más de 5 minutos. Deteniendo proveedor...')
    stopProvider() // Llama a la función para detener el proveedor
    timeOutConnection.disconnectStartTime = null // Resetea el temporizador
  } else {
    console.log('Generando QR Code...')
    if (!existsSync(destination)) {
      mkdirSync(destination, { recursive: true })
    }
    qrcode.toFile(destination + '/' + qrName, qr, {
      width: 300,
      margin: 2
    })
    console.info('QR Code guardado como: ' + destination + '/' + qrName)
  }
}
