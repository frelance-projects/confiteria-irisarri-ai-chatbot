import { ENV } from '#config/config.mjs'
export async function readServicesConfig() {
  const services = []
  //SS PLATAFORMAS
  //whatsapp
  if (ENV.PROV_WHATSAPP === 'baileys') {
    const whatsapp = {
      platform: 'whatsapp',
      provider: 'baileys',
      host: 'whatsapp baileys'
    }
    services.push(whatsapp)
  } else if (ENV.PROV_WHATSAPP === 'meta' && ENV.WHATSAPP_META_TOKEN && ENV.WHATSAPP_META_PHONEID) {
    const whatsapp = {
      platform: 'whatsapp',
      provider: 'meta',
      token: ENV.WHATSAPP_META_TOKEN,
      phoneid: ENV.WHATSAPP_META_PHONEID,
      accountid: ENV.WHATSAPP_META_ACCOUNTID,
      version: ENV.WHATSAPP_META_VERSION ? ENV.WHATSAPP_META_VERSION : 'v21.0'
    }
    services.push(whatsapp)
  }
  //facebook messenger
  if (ENV.FACEBOOK_MESSENGER_TOKEN && ENV.FACEBOOK_MESSENGER_PAGEID) {
    const messenger = {
      platform: 'messenger',
      provider: 'meta',
      host: 'facebook messenger',
      token: ENV.FACEBOOK_MESSENGER_TOKEN,
      pageid: ENV.FACEBOOK_MESSENGER_PAGEID,
      version: ENV.FACEBOOK_VERSION ? ENV.FACEBOOK_VERSION : 'v21.0'
    }
    services.push(messenger)
  }

  //instagram messenger
  if (ENV.INSTAGRAM_MESSENGER_TOKEN && ENV.INSTAGRAM_MESSENGER_PAGEID) {
    const instagram = {
      platform: 'instagram',
      provider: 'meta',
      host: 'instagram messenger',
      token: ENV.INSTAGRAM_MESSENGER_TOKEN,
      pageid: ENV.INSTAGRAM_MESSENGER_PAGEID,
      version: ENV.INSTAGRAM_VERSION ? ENV.INSTAGRAM_VERSION : 'v21.0'
    }
    services.push(instagram)
  }

  //SS APPS
  //appsheet
  if (ENV.APPSHEET_ID && ENV.APPSHEET_TOKEN) {
    const appsheet = {
      platform: 'appsheet',
      appid: ENV.APPSHEET_ID,
      token: ENV.APPSHEET_TOKEN,
      inbox: ENV.APPSHEET_INBOX === 'true'
    }
    services.push(appsheet)
  }

  //chatwoot
  if (ENV.CHATWOOT_URL && ENV.CHATWOOT_TOKEN && ENV.CHATWOOT_COUNT_ID && ENV.CHATWOOT_AGENT_ID) {
    
    const chatwoot = {
      platform: 'chatwoot',
      url: ENV.CHATWOOT_URL,
      accountid: ENV.CHATWOOT_COUNT_ID,
      agentid: ENV.CHATWOOT_AGENT_ID,
      token: ENV.CHATWOOT_TOKEN,
      messageBox: []
    }
    //inbox whatsapp
    if (ENV.CHATWOOT_WHATSAPP_ID && ENV.CHATWOOT_WHATSAPP_TOKEN) {
      const whatsappInbox = {
        platform: 'whatsapp',
        inboxid: ENV.CHATWOOT_WHATSAPP_ID,
        token: ENV.CHATWOOT_WHATSAPP_TOKEN
      }
      chatwoot.messageBox.push(whatsappInbox)
    }
    //inbox messenger
    if (ENV.CHATWOOT_MESSENGER_ID && ENV.CHATWOOT_MESSENGER_TOKEN) {
      const messenger = {
        platform: 'messenger',
        inboxid: ENV.CHATWOOT_MESSENGER_ID,
        token: ENV.CHATWOOT_MESSENGER_TOKEN
      }
      chatwoot.messageBox.push(messenger)
    }
    //inbox instagram
    if (ENV.CHATWOOT_INSTAGRAM_ID && ENV.CHATWOOT_INSTAGRAM_TOKEN) {
      const instagram = {
        platform: 'instagram',
        inboxid: ENV.CHATWOOT_INSTAGRAM_ID,
        token: ENV.CHATWOOT_INSTAGRAM_TOKEN
      }
      chatwoot.messageBox.push(instagram)
    }
    services.push(chatwoot)
    //console.log('Configurando chatwoot', JSON.stringify(chatwoot, null, 2))
  }
  //console.log('servicios creados', JSON.stringify(services, null, 2))
  return services
}
