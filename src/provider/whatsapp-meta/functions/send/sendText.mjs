import axios from 'axios'
import { getCredentials } from '../getCredentials.mjs'
import { convertMarkdownToWhatsapp } from '#utilities/formatText/whatsapp.mjs'

/**
 * Envía un mensaje de texto a través de la API de WhatsApp Business.
 *
 * @param {string} phone - Número de teléfono del destinatario.
 * @param {string} message - El mensaje de texto a enviar.
 * @returns {Promise<Object|null>} Respuesta de la API o `null` en caso de error.
 */
export async function sendText(phone, message) {
  try {
    // Validar entradas
    if (!phone || typeof phone !== 'string') {
      throw new Error('El número de teléfono es inválido o no fue proporcionado.')
    }

    if (!message || typeof message !== 'string') {
      throw new Error('El mensaje no es válido o no fue proporcionado.')
    }

    // Obtener credenciales
    const meta = await getCredentials()
    if (!meta || !meta.version || !meta.phoneid || !meta.token) {
      throw new Error('Error al obtener las credenciales de Meta.')
    }

    // Construir la URL y el cuerpo de la solicitud
    const url = `https://graph.facebook.com/${meta.version}/${meta.phoneid}/messages`
    const body = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: phone,
      type: 'text',
      text: { body: convertMarkdownToWhatsapp(message) }
    }

    // Enviar la solicitud a la API utilizando Axios
    const response = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${meta.token}`,
        'Content-Type': 'application/json'
      }
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
