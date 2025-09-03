import { provider } from '#provider/provider.mjs'
import { validateMediaType } from './validateMediaType.mjs'
import { convertMarkdownToWhatsapp } from '#utilities/formatText/whatsapp.mjs'
import { createPhone } from './createPhone.mjs'

/**
 * Envía un mensaje de media (imagen, video o audio) a través de WhatsApp.
 *
 * @param {string} phone - Número de teléfono del destinatario (sin prefijo '@s.whatsapp.net').
 * @param {Object} options - Opciones del mensaje.
 * @param {string} options.fileType - Tipo de archivo ('image', 'video', 'audio').
 * @param {string} options.fileUrl - URL del archivo a enviar.
 * @param {string} [options.caption] - Texto opcional que acompaña al archivo.
 * @returns {Promise<Object|null>} Respuesta de WhatsApp o `null` si ocurre un error.
 */
export async function sendMedia(phone, { fileType, fileUrl, caption } = {}, role) {
  try {
    // Validación de parámetros de entrada
    if (!phone || !fileType || !fileUrl) {
      throw new Error('Parámetros inválidos: se requiere phone, fileType y fileUrl.')
    }

    // Validación del tipo de archivo soportado
    const supportedTypes = ['image', 'video', 'audio', 'document', 'file']
    if (!supportedTypes.includes(fileType)) {
      throw new Error(
        `Tipo de media no soportado: ${fileType}. Tipos soportados: ${supportedTypes.join(', ')}`
      )
    }

    // Construcción del mensaje según el tipo de archivo
    let message = {}
    switch (fileType) {
      case 'image': {
        message = { image: { url: fileUrl } }
        break
      }
      case 'video': {
        message = { video: { url: fileUrl }, ptv: false } // `ptv` para videos normales
        break
      }
      case 'audio': {
        message = { audio: { url: fileUrl } }
        break
      }
      case 'document': {
        message = { document: { url: fileUrl } }
        break
      }
      case 'file': {
        console.log('file-----------------------')
        const mimeType = validateMediaType(fileUrl)
        message = { document: { url: fileUrl }, mimetype: mimeType }
        break
      }
      default:
        throw new Error(`Tipo de media no soportado: ${fileType}`)
    }

    // Agregar el caption si está presente
    if (caption) {
      message.caption = convertMarkdownToWhatsapp(caption)
    }

    // Construcción del ID del usuario y envío del mensaje
    const userId = createPhone(phone)
    const response = await provider.whatsapp.sock.sendMessage(userId, message)

    return response
  } catch (error) {
    console.error('Error al enviar el media:', error.message)
    return null
  }
}
