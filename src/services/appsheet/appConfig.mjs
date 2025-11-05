import { ENV } from '#config/config.mjs'
import { patchData } from '#utilities/appsheet/patchData.mjs'
import { getState } from '#config/license.mjs'

const NAME_TABLE = 'APP_CONFIG'

export class AppConfigAppsheet {
  //ss cargar agent
  static async initConfig() {
    // preparar datos para AppSheet
    const data = DataFormatter.gerConfig()

    // enviar datos a AppSheet
    const res = await patchData(NAME_TABLE, {}, data)

    return res
  }
}

class DataFormatter {
  //ss revertir datos de configuración
  static gerConfig() {
    // mapear datos al formato requerido
    const config = {
      SERVICE_ID: ENV.SERVICE_ID,
      EMAIL_SUPPORT: false,
      INBOX_SUPPORT: false,
      WHATSAPP_INBOX: false,
      WHATSAPP_PROVIDER: '',
      MESSENGER_INBOX: false,
      INSTAGRAM_INBOX: false,
      //ss tools
      TOOL_SENDREQUEST: getState('toolSendRequest') || false,
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
    // devolver array de objetos
    return config
  }
}
