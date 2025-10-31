import axios from 'axios'
import { formatData } from './formatData.mjs'
import { ENV } from '#config/config.mjs'

export async function addData(table, properties = {}, rows = []) {
  // construir la URL de la API de AppSheet
  const url = `https://www.appsheet.com/api/v2/apps/${ENV.APPSHEET_ID}/tables/${table}/Action?applicationAccessKey=${ENV.APPSHEET_TOKEN}`

  // Configurar los encabezados
  const headers = {
    'Content-Type': 'application/json',
  }

  // Construir el cuerpo de la solicitud
  const body = {
    Action: 'Add',
    Properties: {
      Locale: 'en-GB',
      Timezone: ENV.TZ,
      UserSettings: { FROM_API: true },
      ...properties,
    },
    Rows: !Array.isArray(rows) ? [rows] : rows,
  }

  try {
    // Realizar la solicitud POST a la API de AppSheet
    const response = await axios.post(url, body, { headers })

    // Validar la respuesta
    if (response.status !== 200) {
      console.error(`appsheet - patchData: Error en la petición, código de estado ${response.status}`)
      throw new Error(`appsheet - patchData: Error en la petición, código de estado ${response.status}`)
    }

    // Formatear los datos recibidos
    const data = formatData(response.data.Rows)

    // Devolver los datos formateados
    return data
  } catch (error) {
    console.error('Error al realizar la petición:', error.response?.data || error.message)
    throw error
  }
}
