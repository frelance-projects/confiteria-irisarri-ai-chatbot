import axios from 'axios'
import { formatData } from './formatData.mjs'
import { ENV } from '#config/config.mjs'

export async function postTable(
  table,
  rows = [],
  properties = { Locale: 'en-GB', Timezone: ENV.TZ, UserSettings: { FROM_API: true } }
) {
  const url = `https://www.appsheet.com/api/v2/apps/${ENV.APPSHEET_ID}/tables/${table}/Action?applicationAccessKey=${ENV.APPSHEET_TOKEN}`
  const headers = {
    'Content-Type': 'application/json',
  }
  const values = ensureArray(rows)
  const data = {
    Action: 'Add',
    Properties: properties,
    Rows: values,
  }

  try {
    const response = await axios.post(url, data, { headers })
    if (response.status !== 200) {
      console.log(response)
      console.error(`Error en la respuesta: ${response.status} ${response.statusText}`)
      return null
    }
    const formatedData = formatData(response.data.Rows)
    return formatedData
  } catch (error) {
    console.error('Error al realizar la petición:', error)
    return null
  }
}

function ensureArray(input) {
  if (!Array.isArray(input)) {
    return [input]
  }
  return input
}
