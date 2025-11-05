//TT MÓDULOS
import { getServices } from '#config/services/services.mjs'
import { getProviderHost, provider } from '#provider/provider.mjs'

// TT CARGAR DATOS DE PLATAFORMA
export async function loadDataPlatform(platform) {
  const data = {
    accountId: 'not available',
    status: 'not connected',
  }
  const services = await getServices()
  const service = services.find((obj) => obj.platform === platform)
  if (!service) {
    console.error(`loadDataPlatform - Error: No se ha encontrado la plataforma "${platform}"`)
    return data
  }
  //whatsapp
  if (platform === 'whatsapp') {
    if (service.provider === 'baileys') {
      const host = getProviderHost(platform)
      if (host) {
        data.accountId = host
        data.status = 'online'
        return data
      } else {
        data.accountId = 'no available'
        if (provider.whatsapp.state === 'open') {
          data.status = 'waiting for connection'
        } else {
          data.status = 'sleep mode'
        }
      }

      return data
    } else if (service.provider === 'meta') {
      data.accountId = service.phoneid
      data.status = 'online'
      return data
    }
  }
  //messenger
  else if (platform === 'messenger') {
    data.accountId = service.pageid
    data.status = 'online'
    return data
  }
  //instagram
  else if (platform === 'instagram') {
    data.accountId = service.pageid
    data.status = 'online'
    return data
  }
  //appsheet
  else if (platform === 'appsheet') {
    data.accountId = service.appid
    data.status = 'online'
    return data
  }
  //chatwoot
  else if (platform === 'chatwoot') {
    data.accountId = service.accountid
    data.status = 'online'
    return data
  } else {
    console.error('loadDataPlatform - Error: No se ha especificado la pataforma de dato a cargar')
    return null
  }
}
