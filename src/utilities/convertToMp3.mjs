import ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import fs from 'fs'

// Convertir OGG a MP3
export async function convertToMp3(inputPath, velocity = 1) {
  try {
    // Verificar que el archivo de entrada exista
    if (!fs.existsSync(inputPath)) {
      console.error('convertToMp3: El archivo de entrada no existe:', inputPath)
      return null
    }

    // Mantener el nombre original si no se proporciona un nombre de salida
    const finalOutputName = path.basename(inputPath, path.extname(inputPath)) + '.mp3'
    const outputDir = path.resolve('./temp/convertToMp3/')
    const outputFile = path.join(outputDir, finalOutputName)

    // Crear el directorio de salida si no existe
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // Retorna una promesa y espera el resultado
    return await new Promise((resolve) => {
      ffmpeg(inputPath)
        .toFormat('mp3')
        .audioFilters(`atempo=${velocity}`) // Ajusta la velocidad del audio
        .on('end', () => {
          console.log('convertToMp3: Conversión completada:', outputFile)
          resolve(outputFile)
        })
        .on('error', (err) => {
          console.error('convertToMp3: No se logró convertir audio a mp3:', err)
          resolve(null) // Regresa null en caso de error
        })
        .save(outputFile)
    })
  } catch (err) {
    console.error('convertToMp3: Error inesperado:', err)
    return null // Regresa null en caso de error inesperado
  }
}
