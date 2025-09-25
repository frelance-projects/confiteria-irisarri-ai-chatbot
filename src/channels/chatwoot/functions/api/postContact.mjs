import axios from 'axios'
import { getCredentials } from '../getCredentials.mjs'

export async function postContact(
  inboxId,
  name = 'new contact',
  email = '',
  phone = '',
  customAttributes = {}
) {
  if (!inboxId) {
    console.error('postConversation: Faltan parameters: ' + inboxId)
    return null
  }
  const credentials = await getCredentials()
  if (!credentials) {
    console.error('postConversation: Error al obtener credenciales')
    return null
  }

  const url = `${credentials.url}/api/v1/accounts/${credentials.accountid}/contacts`
  console.warn('chatwoot: URL: ' + url)
  const headers = {
    api_access_token: credentials.token,
    'Content-Type': 'application/json'
  }
  const data = {
    inbox_id: inboxId,
    name,
    email,
    phone_number: phone,
    custom_attributes: customAttributes
  }

  try {
    const response = await axios.post(url, data, { headers })

    if (response.status !== 200) {
      console.error(`Error en la respuesta: ${response.status} ${response.statusText}`)
      return null
    }
    //console.log('respuesta', response.data)
    return response.data
  } catch (error) {
    console.error('Error al realizar la petición:', error.message)
    return null
  }
}
