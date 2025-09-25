import axios from 'axios'
import { getCredentials } from '../getCredentials.mjs'

export async function postConversation(inboxId, inboxToken, contactId, status = 'open') {
  if (!inboxId || !inboxToken || !contactId) {
    console.error('postConversation: Faltan parámetros')
    return null
  }
  const credentials = await getCredentials()
  if (!credentials) {
    console.error('postConversation: Error al obtener credenciales')
    return null
  }

  const url = `${credentials.url}/api/v1/accounts/${credentials.accountid}/conversations`
  const headers = {
    api_access_token: credentials.token,
    'Content-Type': 'application/json'
  }
  const data = {
    source_id: inboxToken,
    inbox_id: inboxId,
    contact_id: contactId,
    status
  }
  console.log('data', data)

  try {
    const response = await axios.post(url, data, { headers })

    if (response.status !== 200) {
      console.error(`Error en la respuesta: ${response.status} ${response.statusText}`)
      return null
    }
    //console.log('respuesta', response.data)
    //return response.data

    const _url = `${credentials.url}/api/v1/accounts/${credentials.accountid}/conversations/${response.data.id}/toggle_status`
    const _data = {
      status
    }
    const _response = await axios.post(_url, _data, { headers })
    if (_response.status !== 200) {
      console.error(`Error en la respuesta: ${_response.status} ${_response.statusText}`)
      return null
    }
    return response.data
  } catch (error) {
    console.error('postConversation: Error al realizar la petición:', error)
    return null
  }
}
