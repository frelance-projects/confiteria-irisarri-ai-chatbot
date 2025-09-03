import { ENV } from '#config/config.mjs'
import { addRequest as addRequestAppsheet } from '#apps/appsheet/config/data/request.mjs'

export async function addRequest(obj) {
  if (ENV.APP_FRONTEND === 'appsheet') {
    const request = await addRequestAppsheet(obj)
    return request
  } else {
    console.error('addRequest: frontend no soportado')
    return null
  }
}
