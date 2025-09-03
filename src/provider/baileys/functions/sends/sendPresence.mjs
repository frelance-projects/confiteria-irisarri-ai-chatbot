import { provider } from '#provider/provider.mjs'
import { createPhone } from './createPhone.mjs'

const validPresences = ['unavailable', 'available', 'composing', 'recording', 'paused']

/**
 * Envía un estado de presencia (presence) a un usuario de WhatsApp.
 *
 * @param {string} presence - Estado de presencia a enviar ('unavailable', 'available', 'composing', 'recording', 'paused').
 * @param {string} phone - Número de teléfono del destinatario (sin prefijo '@s.whatsapp.net').
 * @returns {Promise<boolean|null>} Devuelve `true` si se envió correctamente, `null` en caso de error.
 */
export async function sendPresence(presence, phone) {
  try {
    // Validación de los parámetros de entrada
    if (!validPresences.includes(presence)) {
      throw new Error(
        `Presencia no válida: "${presence}". Las opciones permitidas son: ${validPresences.join(', ')}.`
      )
    }

    if (!phone || typeof phone !== 'string') {
      throw new Error('El número de teléfono es inválido o no fue proporcionado.')
    }

    // Construcción del ID del usuario y envío de la presencia
    const userId = createPhone(phone)
    await provider.whatsapp.sock.sendPresenceUpdate(presence, userId)

    return true
  } catch (error) {
    console.error('Error al enviar la presencia:', error.message)
    return null
  }
}
