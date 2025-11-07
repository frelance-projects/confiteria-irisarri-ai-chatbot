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
export async function sendButtons(phone, { header, body, footer }, buttonList) {
  try {
    // Validar entradas
    if (!phone || typeof phone !== 'string') {
      throw new Error('El número de teléfono es inválido o no fue proporcionado.')
    }

    // Obtener credenciales
    const meta = await getCredentials()
    if (!meta || !meta.version || !meta.phoneid || !meta.token) {
      throw new Error('Error al obtener las credenciales de Meta.')
    }

    // Construir la URL y el cuerpo de la solicitud
    const url = `https://graph.facebook.com/${meta.version}/${meta.phoneid}/messages`
    const data = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: phone,
      type: 'interactive',
      interactive: {
        type: 'button',
        action: {
          buttons: buttonList.map((button) => ({
            type: 'reply',
            reply: { id: button.id, title: button.title },
          })),
        },
      },
    }

    // agregar las secciones y filas a la estructura de datos
    if (header) data.interactive.header = { type: 'text', text: header }
    if (body) data.interactive.body = { text: convertMarkdownToWhatsapp(body) }
    if (footer) data.interactive.footer = { text: footer }

    // Enviar la solicitud a la API utilizando Axios
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${meta.token}`,
        'Content-Type': 'application/json',
      },
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
