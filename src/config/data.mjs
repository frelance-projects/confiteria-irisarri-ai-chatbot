//TT MÓDULOS
import { ENV } from '#config/config.mjs'
import { sendLog } from '#logger/logger.mjs'
import { getServices } from '#config/services/services.mjs'
import { getProviderHost, provider } from '#provider/provider.mjs'
import { deleteAllHistory } from '#ai/agentProcess/deleteHistory.mjs'

//TT APPSHEET
//ss config
import { loadUserTags as loadUserTagsAppsheet } from '#apps/appsheet/config/userTags.mjs'
//ss tools
//toolSendRequest
import { loadToolSendRequestTags as loadToolSendRequestTagsAppsheet } from '#apps/appsheet/config/tools/toolSendRequestTags.mjs'

//ss resources
import { loadEmailTemplates as loadEmailTemplatesAppsheet } from '#apps/appsheet/config/resources/emailTemplates.mjs'
import { loadMessageTemplates as loadMessageTemplatesAppsheet } from '#apps/appsheet/config/resources/messageTemplates.mjs'


// TT ACTUALIZAR DATOS
export async function updateData(data) {
  if (!data) {
    console.error('updateData - Error: No se ha especificado el tipo de dato a actualizar')
    return null
  }
  if (ENV.APP_FRONTEND === 'appsheet') {
    const handlers = {
      //ss config
      userTags: loadUserTagsAppsheet,
      //ss tools
      //toolSendRequest
      toolSendRequestTags: loadToolSendRequestTagsAppsheet,
      //ss resources
      resourceEmailTemplates: loadEmailTemplatesAppsheet,
      resourceMessageTemplates: loadMessageTemplatesAppsheet,
    }
    const loader = handlers[data]
    if (!loader) {
      console.error(`updateData - Error: Tipo de dato no válido "${data}"`)
      return null
    }
    try {
      const result = await loader('init')

      if (data === 'brains') {
        console.log('updateData - Se actualizó "brains", se eliminará el historial de conversaciones.')
        await deleteAllHistory('openai')
      }
      return result || null
    } catch (error) {
      console.error(`updateData - Error al cargar "${data}":`, error)
      sendLog('error', 'config/data', `updateData: Error loading "${data}":\n${error}`)
      return null
    }
  } else {
    console.error('updateData - Error: No se ha especificado la pataforma de dato a actualizar')
    return null
  }
}

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
