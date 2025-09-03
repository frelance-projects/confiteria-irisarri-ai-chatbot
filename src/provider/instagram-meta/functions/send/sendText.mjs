import axios from 'axios'
import { getCredentials } from '../getCredentials.mjs'
import { convertMarkdownToInstagram } from '#utilities/formatText/instagram.mjs'

/**
 * Envía un mensaje de texto a un usuario a través de la API de Facebook Messenger.
 *
 * @param {string} userId - ID del usuario destinatario.
 * @param {string} message - Mensaje de texto a enviar.
 * @returns {Promise<Object|null>} Respuesta de la API de Facebook o `null` en caso de error.
 */
export async function sendText(userId, message) {
  try {
    // Validación de parámetros de entrada
    if (!userId || typeof userId !== 'string') {
      throw new Error('El ID del usuario es inválido o no fue proporcionado.')
    }

    if (!message || typeof message !== 'string') {
      throw new Error('El mensaje de texto es inválido o no fue proporcionado.')
    }

    // Obtener credenciales de Meta
    const meta = await getCredentials()
    if (!meta || !meta.pageid || !meta.token) {
      throw new Error('Error al obtener las credenciales de Meta.')
    }

    // Construir la URL y el cuerpo de la solicitud
    const url = `https://graph.facebook.com/${meta.version}/${meta.pageid}/messages?access_token=${meta.token}`
    const body = {
      recipient: { id: userId },
      message: {
        text: convertMarkdownToInstagram(message)
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
      console.error('Error al enviar el mensaje de texto:', error.message)
    }
    return null
  }
}
