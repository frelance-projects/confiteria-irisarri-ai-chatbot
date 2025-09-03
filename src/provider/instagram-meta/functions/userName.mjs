import axios from 'axios'
import { ENV } from '#config/config.mjs'

export async function getUserName(userId) {
  const url = `https://graph.facebook.com/${userId}`
  const accessToken = ENV.INSTAGRAM_MESSENGER_TOKEN
  try {
    const response = await axios.get(url, {
      params: { access_token: accessToken }
    })
    return response.data.name
  } catch (error) {
    console.error('Error en la petición:', error.response ? error.response.data : error.message)
    return 'New user Instagram'
  }
}
