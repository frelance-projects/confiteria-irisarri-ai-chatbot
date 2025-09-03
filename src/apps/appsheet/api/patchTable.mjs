import axios from 'axios'
import { ENV } from '#config/config.mjs'

export async function patchTable(
  table,
  rows = [],
  properties = { Locale: 'en-GB', Timezone: ENV.TZ, UserSettings: { FROM_API: true } }
) {
  const url = `https://www.appsheet.com/api/v2/apps/${ENV.APPSHEET_ID}/tables/${table}/Action?applicationAccessKey=${ENV.APPSHEET_TOKEN}`
  const headers = {
    'Content-Type': 'application/json'
  }
  const values = ensureArray(rows)
  const data = {
    Action: 'Edit',
    Properties: properties,
    Rows: values
  }

  try {
    const response = await axios.post(url, data, { headers })
    if (response.status !== 200) {
      console.log(response)
      console.error(`Error en la respuesta: ${response.status} ${response.statusText}`)

      return null
    }
    const formatedData = response.data.Rows
    return formatedData
  } catch (error) {
    console.error('Error al realizar la petición:', error.message)
    return null
  }
}

function ensureArray(input) {
  if (!Array.isArray(input)) {
    return [input]
  }
  return input
}
