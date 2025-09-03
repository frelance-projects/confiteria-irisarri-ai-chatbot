//TT MÓDULOS
import { ENV } from '#config/config.mjs'
import { patchTable } from './api/patchTable.mjs'
import { getState } from '#config/license.mjs'
//import { loadAgent } from './config/agent.mjs'
//import { loadAssistants } from './config/assistants.mjs'
import { loadArticles } from './config/articles/articles.mjs'
import { buildArticles } from '#ai/openAI/buildPrompt/articles.mjs'

//TT INICIALIZAR APPSHEET
export async function initAppsheet() {
  console.log('appsheet inicializado')
  //loadAgent('init')
  //loadAssistants('init')
  await loadArticles('init')
  await buildArticles()
  await makeAppConfig()
  return true
}

//TT CONFIGURAR APPSHEET
async function makeAppConfig() {
  const config = {
    USER_ID: ENV.USER_ID,
    EMAIL_SUPPORT: false,
    EXTERNAL_CHAT_MANAGER: false,
    INBOX_SUPPORT: false,
    WHATSAPP_INBOX: false,
    WHATSAPP_PROVIDER: '',
    MESSENGER_INBOX: false,
    INSTAGRAM_INBOX: false,
    //ss tools
    TOOL_USER_REGISTRATION: getState('toolUserRegistration'),
    TOOL_CATALOG: getState('toolCatalog') || false,
    TOOL_SENDREQUEST: getState('toolSendRequest') || false,
    TOOL_AUTOTAG: getState('toolAutoTag') || false,
    TOOL_APPOINTMENT: getState('toolAppointment') || false,
    TOOL_FOLLOWUP: getState('toolFollowUp') || false,
    TOOL_SENDNOTICE: getState('toolSendNotice') || false,
    //ss agents
    MULTIPLE_BRAIN: getState('multipleBrain') || false,
    PROCESS_AUDIO: getState('processAudio') || false,
    PROCESS_IMAGE: getState('processImage') || false,
    PROCESS_PDF: getState('processPdf') || false,
  }
  //email
  if (ENV.SMTP_EMAIL && ENV.SMTP_PORT && ENV.SMTP_SERVICE && ENV.SMTP_TOKEN) {
    config.EMAIL_SUPPORT = true
  }

  //bandejas:
  if (ENV.APPSHEET_INBOX) {
    config.INBOX_SUPPORT = true
  } else {
    config.INBOX_SUPPORT = false
  }
  //administrador de chat externo
  if (ENV.CHATWOOT_URL && ENV.CHATWOOT_COUNT_ID && ENV.CHATWOOT_AGENT_ID && ENV.CHATWOOT_TOKEN) {
    config.EXTERNAL_CHAT_MANAGER = true
  }

  //whatsapp
  if (ENV.PROV_WHATSAPP) {
    config.WHATSAPP_INBOX = true
    config.WHATSAPP_PROVIDER = ENV.PROV_WHATSAPP
  } else {
    config.WHATSAPP_INBOX = false
    config.WHATSAPP_PROVIDER = ''
  }

  //messenger
  if (ENV.FACEBOOK_MESSENGER_TOKEN && ENV.FACEBOOK_MESSENGER_PAGEID) {
    config.MESSENGER_INBOX = true
  } else {
    config.MESSENGER_INBOX = false
  }

  //instagram
  if (ENV.INSTAGRAM_MESSENGER_TOKEN && ENV.INSTAGRAM_MESSENGER_PAGEID) {
    config.INSTAGRAM_INBOX = true
  } else {
    config.INSTAGRAM_INBOX = false
  }

  const res = await patchTable('APP_CONFIG', [config])
  if (res) {
    console.info('Configurarion de appsheet realizada con exito')
  } else {
    console.error('Error al configurar appsheet')
  }
}
