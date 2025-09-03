import { provider } from '#provider/provider.mjs'
import { convertMarkdownToWhatsapp } from '#utilities/formatText/whatsapp.mjs'
import { createPhone } from './createPhone.mjs'

/**
 * Envía un mensaje de texto a un usuario de WhatsApp.
 *
 * @param {string} phone - Número de teléfono del destinatario (sin prefijo '@s.whatsapp.net').
 * @param {string} message - Mensaje de texto a enviar.
 * @returns {Promise<Object|null>} Respuesta de WhatsApp o `null` si ocurre un error.
 */
export async function sendText(phone, message, role = 'bot') {
  try {
    // Validación de los parámetros de entrada
    if (!phone || typeof phone !== 'string') {
      throw new Error('El número de teléfono es inválido o no fue proporcionado.')
    }

    if (!message || typeof message !== 'string') {
      throw new Error('El mensaje de texto es inválido o no fue proporcionado.')
    }

    // Construcción del ID del usuario y envío del mensaje
    const userId = createPhone(phone)
    const messageFormatted = convertMarkdownToWhatsapp(message)
    const response = await provider.whatsapp.sock.sendMessage(userId, { text: messageFormatted })

    return response
  } catch (error) {
    console.error('Error al enviar el mensaje de texto:', error.message)
    return null
  }
}
