import axios from 'axios'
import { getCredentials } from '../getCredentials.mjs'

export async function postMessage(
  conversationId,
  content,
  channel,
  contenType = '',
  contentAttributes = {},
  state = false,
  attachments = []
) {
  if (!conversationId || !channel) {
    console.error('postMessage: Faltan parametros')
    return null
  }
  const credentials = await getCredentials()
  if (!credentials) {
    console.error('postMessage: Error al obtener credenciales')
    return null
  }

  const url = `${credentials.url}/api/v1/accounts/${credentials.accountid}/conversations/${conversationId}/messages`
  const headers = {
    api_access_token: credentials.token,
    'Content-Type': 'application/json'
  }
  const data = {
    content,
    message_type: channel,
    private: state,
    content_type: contenType,
    content_attributes: contentAttributes
  }

  try {
    const response = await axios.post(url, data, { headers })

    if (response.status !== 200) {
      console.error(response)
      console.error(`postMessage: Error en la respuesta: ${response.status} ${response.statusText}`)

      return null
    }
    //console.log('respuesta', response.data)
    return response.data
  } catch (error) {
    console.error('postMessage: Error al realizar la petición:', error.message)
    return null
  }
}
