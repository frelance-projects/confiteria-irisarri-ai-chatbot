import fs from 'fs/promises'
//TT MÓDULOS
import { ENV } from '#config/config.mjs'

import { urlMedia } from '#storage/urlMedia.mjs'

//AUDIO
export async function processImage(path, provider) {
  if (!path) {
    console.error('Se requiere un path válido.')
    return null
  }

  if (provider !== 'openai') {
    console.error(`Proveedor "${provider}" no soportado.`)
    return null
  }

  try {
    let imageUrl
    // Procesar imagen para OpenAI en producción
    if (ENV === 'production') {
      const urlFile = urlMedia(path)
      console.log('imagen procesada')
      imageUrl = { url: urlFile, detail: 'auto' }
    }
    // Procesar imagen para OpenAI en desarrollo
    else {
      const imgBase64 = await fs.readFile(path, { encoding: 'base64' })
      imageUrl = { url: `data:image/jpeg;base64,${imgBase64}`, detail: 'auto' }
    }

    return {
      type: 'media',
      media: {
        fileType: 'image',
        image: [{ type: 'image_url', image_url: imageUrl }] //NEXT:AGREGAR ID DE IMAGEN
      }
    }
  } catch (error) {
    console.error('Error al procesar la imagen:', error.message)
    return null
  }
}
