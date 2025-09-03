import axios from 'axios'

//TT MÓDULOS
import { ENV } from '#config/config.mjs'

export async function loadTemplates() {
  if (ENV.PROV_WHATSAPP === 'meta') {
    try {
      const url = `https://graph.facebook.com/v22.0/${ENV.WHATSAPP_META_ACCOUNTID}/message_templates`
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${ENV.WHATSAPP_META_TOKEN}`
        }
      })

      return response.data
    } catch (error) {
      console.error('Error al obtener plantillas:', error.response?.data || error.message)
      return null
    }
  } else {
    console.error('El proveedor de WhatsApp no es Meta. No se pueden cargar las plantillas.')
    return null
  }
}
