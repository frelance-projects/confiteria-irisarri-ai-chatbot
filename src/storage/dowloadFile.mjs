import axios from 'axios'
import fs from 'fs'
import path from 'path'
import { ENV } from '#config/config.mjs'
import { downloadFiles } from '#config/paths.mjs'

export async function downloadFile(url, name) {
  console.log(url)
  let destination = './temp/files'
  if (ENV.STORAGE === 'local') {
    destination = downloadFiles + '/files'
  }
  destination = path.join(process.cwd(), destination)

  try {
    // Crear la carpeta si no existe
    await fs.promises.mkdir(destination, { recursive: true })

    // Descargar el archivo
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    if (response.status !== 200) {
      throw new Error('Error al descargar el archivo')
    }

    // Obtener la extensión del archivo directamente en línea:
    ///const urlSinQuery = url.split('?')[0].split('#')[0]
    const extension = path.extname(url).toLowerCase() || '.bin'

    // Especificar la ruta donde se guardará el archivo
    const filePath = path.join(destination, name + extension)

    // Guardar el archivo en el sistema de archivos
    await fs.promises.writeFile(filePath, response.data)

    console.log('Archivo descargado correctamente:', filePath)
    return filePath
  } catch (error) {
    console.error('Error al descargar el archivo:', error)
    return null
  }
}
