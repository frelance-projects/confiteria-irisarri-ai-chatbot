import axios from 'axios'
import { getCredentials } from '../getCredentials.mjs'
import { convertMarkdownToWhatsapp } from '#utilities/formatText/whatsapp.mjs'

/**
 * Envía un archivo multimedia a través de la API de WhatsApp Business.
 *
 * @param {string} phone - Número de teléfono del destinatario.
 * @param {Object} options - Opciones del mensaje multimedia.
 * @param {string} options.fileType - Tipo de archivo ('image', 'video', 'audio', 'document').
 * @param {string} options.fileUrl - URL del archivo a enviar.
 * @param {string} [options.caption] - Texto opcional para incluir como pie de foto.
 * @returns {Promise<Object|null>} Respuesta de la API o `null` en caso de error.
 */
export async function sendMedia(phone, { fileType, fileUrl, caption }) {
  try {
    // Validar entrada
    if (!phone || typeof phone !== 'string') {
      throw new Error('El número de teléfono es inválido o no fue proporcionado.')
    }

    if (!fileType || !['image', 'video', 'audio', 'document'].includes(fileType)) {
      throw new Error(
        `Tipo de archivo no soportado: "${fileType}". Los tipos permitidos son: 'image', 'video', 'audio', 'document'.`
      )
    }

    if (!fileUrl || typeof fileUrl !== 'string') {
      throw new Error('La URL del archivo es inválida o no fue proporcionada.')
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
      type: fileType
    }

    // Configurar el cuerpo según el tipo de archivo
    if (fileType === 'image') {
      body.image = { link: fileUrl }
      if (caption) body.image.caption = caption
    } else if (fileType === 'video') {
      body.video = { link: fileUrl }
      if (caption) body.video.caption = caption
    } else if (fileType === 'audio') {
      body.audio = { link: fileUrl }
    } else if (fileType === 'document') {
      body.document = { link: fileUrl }
      if (caption) body.document.caption = convertMarkdownToWhatsapp(caption)
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
    // En caso de error, si es un error de Axios, podemos extraer más información
    if (error.response) {
      console.error('Error en la solicitud:', error.response.data)
    } else {
      console.error('Error al enviar el archivo multimedia:', error.message)
    }
    return null
  }
}
