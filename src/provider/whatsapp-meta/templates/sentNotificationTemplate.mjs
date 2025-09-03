import axios from 'axios'
import { ENV } from '#config/config.mjs'

export async function sentNotificationTemplate({ userPhone, templateName, languageCode, parameters }) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v22.0/${ENV.WHATSAPP_META_PHONEID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: userPhone,
        type: 'template',
        template: {
          name: templateName,
          language: {
            code: languageCode
          },
          components: [
            {
              type: 'body',
              parameters
            }
          ]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${ENV.WHATSAPP_META_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    )
    console.log('Mensaje enviado correctamente:', response.data)
    return response.data
  } catch (error) {
    console.error('Error al enviar el mensaje:', error.response?.data || error.message)
    return null
  }
}
