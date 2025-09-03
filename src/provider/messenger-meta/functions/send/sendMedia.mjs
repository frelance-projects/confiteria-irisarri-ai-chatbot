import axios from 'axios'
import { getCredentials } from '../getCredentials.mjs'

/**
 * Envía un archivo multimedia a un usuario a través de la API de Facebook Messenger.
 *
 * @param {string} userId - ID del usuario destinatario.
 * @param {Object} options - Opciones del mensaje multimedia.
 * @param {string} options.fileType - Tipo de archivo ('image', 'video', 'audio', etc.).
 * @param {string} options.fileUrl - URL del archivo multimedia a enviar.
 * @returns {Promise<Object|null>} Respuesta de la API de Facebook o `null` en caso de error.
 */
export async function sendMedia(userId, { fileType, fileUrl } = {}) {
  try {
    // Validación de parámetros de entrada
    if (!userId || typeof userId !== 'string') {
      throw new Error('El ID del usuario es inválido o no fue proporcionado.')
    }

    if (!fileType || typeof fileType !== 'string') {
      throw new Error('El tipo de archivo es inválido o no fue proporcionado.')
    }

    if (!fileUrl || typeof fileUrl !== 'string') {
      throw new Error('La URL del archivo es inválida o no fue proporcionada.')
    }

    // Obtener credenciales de Meta
    const meta = await getCredentials()
    if (!meta || !meta.pageid || !meta.token) {
      throw new Error('Error al obtener las credenciales de Meta.')
    }

    let metaType = ''
    switch (fileType) {
      case 'image':
        metaType = 'image'
        break
      case 'video':
        metaType = 'video'
        break
      case 'audio':
        metaType = 'audio'
        break
      case 'document':
        metaType = 'file'
        break
      default:
        throw new Error(`Tipo de archivo no soportado: ${fileType}`)
    }

    // Construir la URL y el cuerpo de la solicitud
    const url = `https://graph.facebook.com/${meta.version}/${meta.pageid}/messages?access_token=${meta.token}`
    const body = {
      recipient: { id: userId },
      message: {
        attachment: {
          type: metaType,
          payload: {
            url: fileUrl,
            is_reusable: true
          }
        }
      }
    }

    // Realizar la solicitud a la API utilizando Axios
    const response = await axios.post(url, body, {
      headers: { 'Content-Type': 'application/json' }
    })

    return response.data
  } catch (error) {
    if (error.response) {
      console.error('Error en la solicitud:', error.response.data)
    } else {
      console.error('Error al enviar el archivo multimedia:', error.message)
    }
    return null
  }
}
