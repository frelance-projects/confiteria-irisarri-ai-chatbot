import axios from 'axios'

//TT MÓDULOS
import { ENV } from '#config/config.mjs'
import { getAuth } from './auth.mjs'

export async function getArticle({ code = '', query = '' } = {}) {
  // Datos de autenticación
  const data = { ...getAuth(), q: query || '', codigo: code || '' }

  const url = `${ENV.FACTURAPP_URL}/articulos/listar-simple`
  try {
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data
  } catch (error) {
    console.error(`Error fetching article`, error.message)
    return null
  }
}
