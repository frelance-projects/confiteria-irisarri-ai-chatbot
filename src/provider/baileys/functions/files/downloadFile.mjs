import { createWriteStream, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { downloadMediaMessage } from 'baileys'
import { ENV } from '#config/config.mjs'
import { provider } from '#provider/provider.mjs'
import { downloadFiles } from '#config/paths.mjs'

export async function downloadFile(message, extensión, localPath = 'baileys') {
  try {
    let destination = './temp/' + localPath
    if (ENV.STORAGE === 'local') {
      destination = downloadFiles + '/' + localPath
    }
    destination = join(process.cwd(), destination)
    // Verificar si el directorio de destino existe y crearlo si es necesario
    if (!existsSync(destination)) {
      mkdirSync(destination, { recursive: true })
    }

    // Obtener el nombre del archivo original o generar uno único
    const fileName = message.fileName || `download-${Date.now()}${extensión}`
    const filePath = join(destination, fileName)

    // Descargar el mensaje como un flujo
    const stream = await downloadMediaMessage(
      message,
      'stream', // Puede ser 'buffer' también
      {},
      {
        logger: provider.whatsapp.sock.logger, // Usa el logger de Baileys
        reuploadRequest: provider.whatsapp.sock.updateMediaMessage // Para reupload si el medio fue eliminado
      }
    )

    // Guardar el archivo en el destino especificado
    const writeStream = createWriteStream(filePath)
    stream.pipe(writeStream)

    // Esperar a que el flujo de escritura finalice
    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve)
      writeStream.on('error', reject)
    })

    console.log(`Archivo descargado exitosamente en: ${filePath}`)
    return filePath // Retorna la ruta completa del archivo descargado
  } catch (error) {
    console.error('Error al descargar el archivo:', error)
    return null // Retorna null en caso de error
  }
}
