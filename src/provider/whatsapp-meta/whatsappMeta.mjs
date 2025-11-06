//TT MÓDULOS
import { provider } from '#provider/provider.mjs'
import { ENV } from '#config/config.mjs'
import { updateStatus } from '#db/statusPlatforms/updateStatus.mjs'

//TT DESPLEGAR CHATBOT
export async function deployServiceWhatsappMeta() {
  provider.whatsapp.provider = 'meta'
  updateStatus('whatsapp', {
    accountId: ENV.WHATSAPP_META_ACCOUNTID,
    status: 'online',
  })
}
