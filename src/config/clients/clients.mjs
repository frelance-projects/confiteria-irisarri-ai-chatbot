import { ENV, isFacturappActive } from '#config/config.mjs'
import {
  getClientByPhone as getClientByPhoneAppsheet,
  getClientByDni as getClientByDniAppsheet,
} from '#apps/appsheet/config/clients/clients.mjs'
import {
  getClientByPhone as getClientByPhoneFacturapp,
  getClientByDni as getClientByDniFacturapp,
} from '#apps/facturapp/clients/clients.mjs'

export async function getClientByPhone(phone) {
  // facturapp
  if (isFacturappActive('clients')) {
    const request = await getClientByPhoneFacturapp(phone)
    return request
  } else if (ENV.APP_FRONTEND === 'appsheet') {
    const request = await getClientByPhoneAppsheet(phone)
    return request
  } else {
    console.error('getClientByPhone: frontend no soportado')
    return null
  }
}

export async function getClientByDni(dni) {
  // facturapp
  if (isFacturappActive('clients')) {
    const request = await getClientByDniFacturapp(dni)
    return request
  } else if (ENV.APP_FRONTEND === 'appsheet') {
    const request = await getClientByDniAppsheet(dni)
    return request
  } else {
    console.error('getClientByDni: frontend no soportado')
    return null
  }
}
