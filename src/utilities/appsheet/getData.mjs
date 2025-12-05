import axios from 'axios'
import { formatData } from './formatData.mjs'
import { ENV } from '#config/config.mjs'

export async function getData(table, properties = {}, rows = []) {
  // construir la URL de la API de AppSheet
  const url = `https://www.appsheet.com/api/v2/apps/${ENV.APPSHEET_ID}/tables/${table}/Action?applicationAccessKey=${ENV.APPSHEET_TOKEN}`

  // Configurar los encabezados
  const headers = {
    'Content-Type': 'application/json',
  }

  // Construir el cuerpo de la solicitud
  const body = {
    Action: 'Find',
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
      console.error(`appsheet - getData: Error en la petición, código de estado ${response.status}`)
      throw new Error(`appsheet - getData: Error en la petición, código de estado ${response.status}`)
    }

    // Formatear los datos recibidos
    const data = formatData(response.data)

    // Devolver los datos formateados
    return data
  } catch (error) {
    // si el status code es 429 esperar 1 segundo y reintentar
    if (error.response?.status === 429) {
      console.warn('appsheet - getData: Límite de peticiones alcanzado, esperando 1.5 segundos antes de reintentar...')
      await new Promise((resolve) => setTimeout(resolve, 1500))
      return getData(table, properties, rows)
    }
    console.error('Error al realizar la petición:', error.response?.data || error.message)
    throw error
  }
}
