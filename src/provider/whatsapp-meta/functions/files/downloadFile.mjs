import axios from 'axios'
import fs from 'fs'
import { join } from 'path'

import { ENV } from '#config/config.mjs'
import { downloadFiles } from '#config/paths.mjs'

// Importar credenciales desde otro módulo
import { getCredentials } from '../getCredentials.mjs'

export async function downloadFile(mediaId, extension, localPath = 'whatsapp-meta') {
  try {
    let destination = './temp/' + localPath
    if (ENV.STORAGE === 'local') {
      destination = downloadFiles + '/' + localPath
    }
    destination = join(process.cwd(), destination)
    // Verificar si el directorio de destino existe y crearlo si es necesario
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true })
    }
    // Obtener credenciales
    const meta = await getCredentials()
    if (!meta || !meta.version || !meta.phoneid || !meta.token) {
      throw new Error('Error al obtener las credenciales de Meta.')
    }

    // Crear la carpeta si no existe
    await fs.promises.mkdir(destination, { recursive: true })

    // Paso 1: Obtener la URL del archivo multimedia
    const mediaUrlResponse = await axios.get(`https://graph.facebook.com/v17.0/${mediaId}`, {
      headers: {
        Authorization: `Bearer ${meta.token}`,
      },
    })

    const fileUrl = mediaUrlResponse.data.url

    // Definir la ruta de salida del archivo
    const outputLocation = `${destination}${mediaId}${extension}`

    // Paso 2: Descargar el archivo y guardarlo
    const writer = fs.createWriteStream(outputLocation)

    // Hacer la solicitud HTTP para descargar el archivo
    const response = await axios({
      url: fileUrl,
      method: 'GET',
      responseType: 'stream', // Obtener el archivo como flujo de datos
      headers: {
        Authorization: `Bearer ${meta.token}`,
      },
    })

    // Piped stream para guardar el archivo en el sistema
    response.data.pipe(writer)

    // Esperar que el archivo se haya guardado
    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log('Archivo guardado en:', outputLocation)
        resolve(outputLocation)
      })
      writer.on('error', (error) => {
        console.error('Error al guardar el archivo:', error)
        reject(error)
      })
    })
  } catch (error) {
    console.error('Error en el proceso de descarga:', error.response?.data || error.message)
    return null // Retorna null en caso de error
  }
}
