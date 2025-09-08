//TT MÓDULOS
import { ENV } from '#config/config.mjs'
import { sendLog } from '#logger/logger.mjs'
import { getServices } from '#config/services/services.mjs'
import { getProviderHost, provider } from '#provider/provider.mjs'
import { startCronJobs } from './cronJobs.mjs'
//TT APPSHEET
//ss config
import { initAppsheet } from '#apps/appsheet/initAppsheet.mjs'
import { loadAgent as loadAgentAppsheet } from '#apps/appsheet/config/agent.mjs'
import { loadAssistants as loadAssistantsAppsheet } from '#apps/appsheet/config/assistants.mjs'
import { loadBrains as loadBrainsAppsheet } from '#apps/appsheet/config/brains.mjs'
import { loadUsers as loadUsersAppsheet } from '#apps/appsheet/config/users.mjs'
import { loadUserTags as loadUserTagsAppsheet } from '#apps/appsheet/config/userdTags.mjs'
//ss tools
//toolSendRequest
import { loadToolSendRequest as loadToolSendRequestAppsheet } from '#apps/appsheet/config/tools/toolSendRequest.mjs'
import { loadToolSendRequestTags as loadToolSendRequestTagsAppsheet } from '#apps/appsheet/config/tools/toolSendRequestTags.mjs'
//toolCatalog
import { loadToolCatalog as loadToolCatalogAppsheet } from '#apps/appsheet/config/tools/toolCatalog.mjs'
import { loadToolCatalogPages as loadToolCatalogPagesAppsheet } from '#apps/appsheet/config/tools/toolCatalogPages.mjs'
//toolAutoTag
import { loadToolAutoTag as loadToolAutoTagAppsheet } from '#apps/appsheet/config/tools/toolAutoTag.mjs'
//toolAppointment
import { loadToolAppointment as loadToolAppointmentAppsheet } from '#apps/appsheet/config/tools/toolAppointment.mjs'
import { loadToolAppointmentAgendas as loadToolAppointmentAgendasAppsheet } from '#apps/appsheet/config/tools/toolAppointmentAgendas.mjs'
import { loadToolAppointmentRequiredData as loadToolAppointmentRequiredDataAppsheet } from '#apps/appsheet/config/tools/toolAppointmentRequiredData.mjs'
//toolFollowUp
import { loadToolFollowUp as loadToolFollowUpAppsheet } from '#apps/appsheet/config/tools/toolFollowUp.mjs'
import { loadToolFollowUpMessages as loadToolFollowUpMessagesAppsheet } from '#apps/appsheet/config/tools/toolFollowUpMessages.mjs'
//toolUserRegistration
import { loadUserRegistration as loadUserRegistrationAppsheet } from '#apps/appsheet/config/tools/toolUserRegistration.mjs'
import { loadUserRegistrationProfiles as loadUserRegistrationProfilesAppsheet } from '#apps/appsheet/config/tools/toolUserRegistrationProfiles.mjs'
import { loadUserRegistrationProfilesData as loadUserRegistrationProfilesDataAppsheet } from '#apps/appsheet/config/tools/toolUserRegistrationProfilesData.mjs'
import { loadUserRegistrationRequiredData as loadUserRegistrationRequiredDataAppsheet } from '#apps/appsheet/config/tools/toolUserRegistrationRequiredData.mjs'
//toolSendNotice
import { loadToolSendNotice as loadToolSendNoticeAppsheet } from '#apps/appsheet/config/tools/toolSendNotice.mjs'

//ss articles
import { loadArticles as loadArticlesAppsheet } from '#apps/appsheet/config/articles/articles.mjs'
import { loadArticlesDaily as loadArticlesDailyAppsheet } from '#apps/appsheet/config/articles/articlesDaily.mjs'

//ss resources
import { loadEmailTemplates as loadEmailTemplatesAppsheet } from '#apps/appsheet/config/resources/emailTemplates.mjs'
import { loadMessageTemplates as loadMessageTemplatesAppsheet } from '#apps/appsheet/config/resources/messageTemplates.mjs'

//TT INICIAR DATOS
export async function initData() {
  //iniciar cronjobs
  startCronJobs()
  //iniciar datos
  if (ENV.APP_FRONTEND === 'appsheet') {
    console.log('aplicacion de frontend appshet')
    const appsheet = await initAppsheet()
    return appsheet
  }
  return null
}

// TT ACTUALIZAR DATOS
export async function updateData(data) {
  if (!data) {
    console.error('updateData - Error: No se ha especificado el tipo de dato a actualizar')
    return null
  }
  if (ENV.APP_FRONTEND === 'appsheet') {
    const handlers = {
      //ss config
      agent: loadAgentAppsheet,
      assistants: loadAssistantsAppsheet,
      brains: loadBrainsAppsheet,
      users: loadUsersAppsheet,
      userTags: loadUserTagsAppsheet,
      //ss tools
      //toolSendRequest
      toolSendRequest: loadToolSendRequestAppsheet,
      toolSendRequestTags: loadToolSendRequestTagsAppsheet,
      //toolCatalog
      toolCatalog: loadToolCatalogAppsheet,
      toolCatalogPages: loadToolCatalogPagesAppsheet,
      //toolAutoTag
      toolAutoTag: loadToolAutoTagAppsheet,
      //toolAppointment
      toolAppointment: loadToolAppointmentAppsheet,
      toolAppointmentAgendas: loadToolAppointmentAgendasAppsheet,
      toolAppointmentRequiredData: loadToolAppointmentRequiredDataAppsheet,
      //toolFollowUp
      toolFollowUp: loadToolFollowUpAppsheet,
      toolFollowUpMessages: loadToolFollowUpMessagesAppsheet,
      //toolUserRegistration
      toolUserRegistration: loadUserRegistrationAppsheet,
      userRegistrationProfiles: loadUserRegistrationProfilesAppsheet,
      userRegistrationProfilesData: loadUserRegistrationProfilesDataAppsheet,
      userRegistrationRequiredData: loadUserRegistrationRequiredDataAppsheet,
      //toolSendNotice
      toolSendNotice: loadToolSendNoticeAppsheet,
      //ss articles
      articles: loadArticlesAppsheet,
      articlesDaily: loadArticlesDailyAppsheet,
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
