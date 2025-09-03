import axios from 'axios'
import { getCredentials } from '../getCredentials.mjs'

export async function getContactFilter(attributeKey, filterOperator, values = [], operator = null) {
  const credentials = await getCredentials()
  if (!credentials) {
    console.error('postAttributes: Error al obtener credenciales')
    return null
  }

  const url = `${credentials.url}/api/v1/accounts/${credentials.accountid}/contacts/filter`
  const headers = {
    api_access_token: credentials.token,
    'Content-Type': 'application/json'
  }
  const data = {
    payload: [
      {
        attribute_key: attributeKey,
        filter_operator: filterOperator,
        values: [values],
        operatquery_operatoror: operator
      }
    ]
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
