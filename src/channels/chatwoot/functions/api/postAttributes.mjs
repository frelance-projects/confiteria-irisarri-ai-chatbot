import axios from 'axios'
import { getCredentials } from '../getCredentials.mjs'

export async function postAttributes(name, key, type = 0, description = '', tag = 1) {
  if (!name || !key) {
    console.error('postAttributes: Faltan parametros: ')
    return null
  }
  const credentials = await getCredentials()
  if (!credentials) {
    console.error('postAttributes: Error al obtener credenciales')
    return null
  }

  const url = `${credentials.url}/api/v1/accounts/${credentials.accountid}/custom_attribute_definitions`
  const headers = {
    api_access_token: credentials.token,
    'Content-Type': 'application/json'
  }
  const data = {
    attribute_display_name: name,
    attribute_key: key,
    attribute_display_type: type,
    attribute_description: description,
    attribute_model: tag
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
