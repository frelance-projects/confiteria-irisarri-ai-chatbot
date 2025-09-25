import axios from 'axios'
import { getCredentials } from '../getCredentials.mjs'

export async function getConversation(inboxId, status = 'open') {
  const credentials = await getCredentials()
  if (!credentials) {
    console.error('Error al obtener credenciales')
    return null
  }

  const url = `${credentials.url}/api/v1/accounts/${credentials.accountid}/conversations`
  const headers = {
    api_access_token: credentials.token,
    'Content-Type': 'application/json'
  }
  const params = {
    status,
    inbox_id: inboxId
  }

  try {
    const response = await axios.get(url, { headers, params })

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
