import axios from 'axios'
import fs from 'fs'
import path from 'path'
import { downloadFiles } from '#config/paths.mjs'

import { ENV } from '#config/config.mjs'

export async function downloadFile(url, extension, localPath = 'instagram-meta') {
  try {
    let destination = './temp/' + localPath
    if (ENV.STORAGE === 'local') {
      destination = downloadFiles + '/' + localPath
    }
    // Crear la carpeta si no existe (sincrónicamente)
    await fs.promises.mkdir(destination, { recursive: true })
    const response = await axios.get(url, { responseType: 'arraybuffer' })

    if (response.status !== 200) {
      throw new Error('Error al descargar el archivo')
    }

    // Obtener la extensión del archivo desde la URL
    // Crear un nombre de archivo basado en la URL, con una longitud más larga
    const fileName = Math.random().toString(36).slice(2, 42) + path.extname(url.split('?')[0])

    // Especificar la ruta donde se guardará el archivo
    const filePath = path.join(destination, fileName + extension)

    // Guardar el archivo en el sistema de archivos
    fs.writeFileSync(filePath, response.data)

    console.log('Archivo descargado correctamente:', filePath)
    return filePath
  } catch (error) {
    console.error('Error al descargar el archivo:', error)
    return null
  }
}
