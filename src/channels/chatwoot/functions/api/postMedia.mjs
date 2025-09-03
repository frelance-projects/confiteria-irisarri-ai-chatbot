import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'
import { getCredentials } from '../getCredentials.mjs'

export async function postMedia(conversationId, channel, filePath, content = '', fileType = 'image') {
  // Obtener las credenciales (asegúrate de que esto esté bien configurado)
  const credentials = await getCredentials()
  if (!credentials) {
    console.error('Error al obtener credenciales')
    return null
  }
  if (!conversationId || !channel || !filePath || !fileType) {
    console.error('postMedia: Faltan parametros')
    return null
  }

  const url = `${credentials.url}/api/v1/accounts/${credentials.accountid}/conversations/${conversationId}/messages`

  // Crear FormData para manejar el archivo adjunto
  const formData = new FormData()
  formData.append('content', content)
  formData.append('message_type', channel) // Según el ejemplo de curl
  formData.append('file_type', fileType) // Según el ejemplo de curl
  formData.append('attachments[]', fs.createReadStream(filePath)) // Ruta del archivo

  // Configurar los encabezados
  const headers = {
    api_access_token: credentials.token, // Token de acceso
    ...formData.getHeaders() // Los encabezados necesarios para multipart/form-data
  }

  try {
    const response = await axios.post(url, formData, { headers })

    if (response.status !== 200) {
      console.error(`Error en la respuesta: ${response.status} ${response.statusText}`)
      return null
    }

    return response.data
  } catch (error) {
    console.error('Error al realizar la petición:', error.message)
    return null
  }
}
