//TT MÓDULOS
import { provider } from '#provider/provider.mjs'
import { ENV } from '#config/config.mjs'
import { updateStatusPlatforms } from '#config/statusPlatforms/statusPlatforms.mjs'

//TT DESPLEGAR CHATBOT
export async function deployServiceWhatsappMeta() {
  provider.whatsapp.provider = 'meta'
  updateStatusPlatforms('whatsapp-meta', {
    accountId: ENV.WHATSAPP_META_ACCOUNTID,
    status: 'online'
  })
}
