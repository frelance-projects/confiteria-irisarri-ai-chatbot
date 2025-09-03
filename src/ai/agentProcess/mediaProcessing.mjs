//TT MÓDULOS
import { processAudio } from './mediaProcess/processAudio.mjs'
import { processImage } from './mediaProcess/processImage.mjs'
import { processPdf } from './mediaProcess/processPdf.mjs'

export async function mediaProcessing(mediaMesagge, platform, agentConfig) {
  switch (mediaMesagge.media.fileType) {
    //SS IMAGEN
    case 'image': {
      //procesar imagen
      if (agentConfig.ai.processImage) {
        console.log('Procesando imagen...')
        const res = await processImage(mediaMesagge.media.path, agentConfig.ai.provider)
        if (res) {
          return res
        } else {
          console.error('mediaProcessing: Error al procesar imagen')
          return { type: 'text', text: `{image: ${mediaMesagge.media.fileUrl}}` }
        }
      }
      //no procesar imagen
      else {
        console.log('Imagen no procesada')
        return { type: 'text', text: `{image: ${mediaMesagge.media.fileUrl}}` }
      }
    }
    //SS VIDEO
    case 'video': {
      console.log('Video recibido')
      return { type: 'text', text: `{video: ${mediaMesagge.media.fileUrl}}` }
    }
    //SS AUDIO
    case 'audio': {
      //procesar audio
      if (agentConfig.ai.processAudio) {
        console.log('Procesando audio...')
        const res = await processAudio(mediaMesagge.media.path, agentConfig.ai.provider)
        if (res) {
          return res
        } else {
          console.error('mediaProcessing: Error al procesar audio')
          return { type: 'text', text: `{audio: ${mediaMesagge.media.fileUrl}}` }
        }
      }
      //no procesar audio
      else {
        console.log('Audio no procesado')
        return { type: 'text', text: `{audio: ${mediaMesagge.media.fileUrl}}` }
      }
    }
    //SS DOCUMENTO
    case 'document': {
      //procesar documento
      if (agentConfig.ai.processPdf) {
        const res = await processPdf(mediaMesagge.media.path, agentConfig.ai.pdfQuality)
        if (res) {
          return res
        } else {
          console.error('mediaProcessing: Error al procesar documento')
          return { type: 'text', text: `{document: ${mediaMesagge.media.fileUrl}}` }
        }
      }
      //no procesar documento
      else {
        console.log('Documento no procesado')
        return { type: 'text', text: `{document: ${mediaMesagge.media.fileUrl}}` }
      }
    }
    //SS ARCHIVO
    case 'file': {
      console.log('Archivo recibido')
      return { type: 'text', text: `{file: ${mediaMesagge.media.fileUrl}}` }
    }
    //SS NO PORTADO
    default: {
      console.error('mediaProcessing: Tipo de archivo multimedia no soportado')
      return null
    }
  }
}
