//TT MÓDULOS
import { ENV } from '#config/config.mjs'

import { sendLog } from '#logger/logger.mjs'
import { getPresence } from './functionsProvider/getPresence.mjs'
//whatsapp-Baileys
import { sendMessageWhatsappBaileys } from './baileys/functions/sendMessage.mjs'
import { sendPresence } from './baileys/functions/sends/sendPresence.mjs'
import { markReadMessage } from './baileys/functions/updateState/markReadMessage.mjs'
import { getUserName as getUserNameBaileys } from './baileys/functions/userName.mjs'
//whatsapp-meta
import { sendMessageWhatsappMeta } from './whatsapp-meta/functions/sendMessage.mjs'
//messenger-meta
import { sendMessageMessengerMeta } from './messenger-meta/functions/sendMessage.mjs'
import { getUserName as getUserNameMessengerMeta } from './messenger-meta/functions/userName.mjs'
//instagram-meta
import { sendMessageInstagramMeta } from './instagram-meta/functions/sendMessage.mjs'
import { getUserName as getUserNameInstagramMeta } from './instagram-meta/functions/userName.mjs'

//proveedor
export const provider = {
  whatsapp: { sock: null, provider: '', state: 'open', connection: 'disconnected' },
  messenger: { provider: 'meta' },
  instagram: { provider: 'meta' }
}

//TT OBTENER HOST DE DEL PROVEEDOR
export function getProviderHost(platform) {
  try {
    if (platform === 'whatsapp') {
      if (ENV.PROV_WHATSAPP === 'baileys') {
        try {
          const user = provider.whatsapp.sock.user
          if (!user) {
            return null
          }
          const host = user.id.split(':')[0]
          if (host) {
            return host
          } else {
            return null
          }
        } catch (err) {
          console.log('proveeder whatsapp baileys no conectado a cuenta')
          return null
        }
      } else if (ENV.PROV_WHATSAPP === 'meta') {
        return provider.whatsapp.host
      } else {
        console.error('Provider (getProviderHost): Whatsapp provider not supported')
        sendLog('error', 'provider/provider', 'getProviderHost: Whatsapp provider not supported')
        return null
      }
    }
    return null
  } catch (err) {
    sendLog('error', 'provider/provider', 'getProviderHost: Unexpected error')
    console.error('Provider (getProviderHost): Error al obtener el host del proveedor', err)
    return null
  }
}
//TT GUARDAR HOST DE PROVEEDOR
export function setProviderHost(platform, host) {
  try {
    if (platform === 'whatsapp') {
      if (ENV.PROV_WHATSAPP === 'meta') {
        provider.whatsapp.host = host
        return true
      } else {
        console.error('Provider (setProviderHost): Whatsapp provider not supported')
        sendLog('error', 'provider/provider', 'setProviderHost: Whatsapp provider not supported')
        return false
      }
    }
    return false
  } catch (err) {
    sendLog('error', 'provider/provider', 'setProviderHost: Unexpected error')
    console.error('Provider (setProviderHost): Error al guardar el host del proveedor', err)
    return false
  }
}

//TT OBTENER NOMBRE DE USUARIO
export async function getUserName(userId, platform) {
  //SS PATAFORMA WHATSAPP
  if (platform === 'whatsapp') {
    //BAILEYS
    if (ENV.PROV_WHATSAPP === 'baileys') {
      const res = getUserNameBaileys(userId)
      return res
    } //META
    else if (ENV.PROV_WHATSAPP === 'meta') {
      sendLog('warn', 'provider/provider', 'getUserName: Whatsapp provider not supported')
      return 'New User - Whatsapp'
    }
  } //SS PATAFORMA MESSENGER
  else if (platform === 'messenger') {
    //META
    if (provider.messenger.provider === 'meta') {
      const res = await getUserNameMessengerMeta(userId)
      return res
    } else {
      sendLog('warn', 'provider/provider', 'getUserName: Messenger provider not supported')
      console.warn('Provider (getUserName): Proveedor no soportado: ' + provider.messenger.provider)
      return 'New User - Messenger'
    }
  }
  //SS PATAFORMA INSTAGRAM
  else if (platform === 'instagram') {
    //META
    if (provider.instagram.provider === 'meta') {
      const res = await getUserNameInstagramMeta(userId)
      return res
    } else {
      sendLog('warn', 'provider/provider', 'getUserName: Instagram provider not supported')
      console.warn('Provider (getUserName): Proveedor no soportado: ' + provider.instagram.provider)
      return 'New User - Instagram'
    }
  }
  //SS PLATAFORMA NO SOPORTADA
  else {
    sendLog('warn', 'provider/provider', 'getUserName: Platform not supported')
    console.warn('Provider (getUserName): Plataforma no soportada')
    return 'New User'
  }
  return 'New User'
}

//TT ENVIAR MENSAJE
export async function providerSendMessage(
  userId,
  message,
  platform,
  role = 'bot',
  channel = 'outgoing',
  app = 'bot'
) {
  try {
    //SS PATAFORMA WHATSAPP
    if (platform === 'whatsapp') {
      //BAILEYS
      if (ENV.PROV_WHATSAPP === 'baileys') {
        const res = await sendMessageWhatsappBaileys(userId, message, role, channel, app)
        return res
      }
      //WHATSAPP-META
      else if (ENV.PROV_WHATSAPP === 'meta') {
        const res = await sendMessageWhatsappMeta(userId, message, role, channel, app)
        return res
      } else {
        sendLog('error', 'provider/provider', 'providerSendMessage: Whatsapp provider not supported')
        console.error('Provider (providerSendMessage): Proveedor no soportado: ' + ENV.PROV_WHATSAPP)
        return null
      }
    }
    //SS PATAFORMA MESSENGER
    else if (platform === 'messenger') {
      //META
      if (provider.messenger.provider === 'meta') {
        const res = await sendMessageMessengerMeta(userId, message, role, channel, app)
        return res
      } else {
        sendLog('error', 'provider/provider', 'providerSendMessage: Messenger provider not supported')
        console.error(
          'Provider (providerSendMessage): Proveedor no soportado: ' + provider.messenger.provider
        )
        return null
      }
    }
    //SS PATAFORMA INSTAGRAM
    else if (platform === 'instagram') {
      if (provider.instagram.provider === 'meta') {
        const res = await sendMessageInstagramMeta(userId, message, role, channel, app)
        return res
      } else {
        sendLog('error', 'provider/provider', 'providerSendMessage: Instagram provider not supported')
        console.error(
          'Provider (providerSendMessage): Proveedor no soportado: ' + provider.instagram.provider
        )
        return null
      }
    }
    //SS PLATAFORMA NO SOPORTADA
    else {
      sendLog('error', 'provider/provider', 'providerSendMessage: Platform not supported')
      console.error('Provider (providerSendMessage): Plataforma no soportada')
      return null
    }
  } catch (error) {
    sendLog('error', 'provider/provider', 'providerSendMessage: Unexpected error')
    console.error('Provider (providerSendMessage): Error al enviar el mensaje', error)
    return null
  }
}

//TT ENVIAR PRESENCIA
export async function providerSendPresence(userId, presence, platform) {
  //SS WHATSAPP
  if (platform === 'whatsapp') {
    if (ENV.PROV_WHATSAPP === 'baileys') {
      const presenceBaileys = getPresence(platform, presence, ENV.PROV_WHATSAPP)
      if (!presenceBaileys) {
        console.error('Provider (providerSendPresence): Error al obtener presencia')
        sendLog('error', 'provider/provider', 'providerSendPresence: Error getting presence')
        return null
      }
      const res = await sendPresence(presence, userId)
      return res
    } else if (ENV.PROV_WHATSAPP === 'meta') {
      return null
    } else {
      sendLog('error', 'provider/provider', 'providerSendPresence: (whatsapp) Provider not supported')
      console.error('Provider (providerSendPresence): Proveedor no soportado')
      return null
    }
  }
  //SS MESSENGER
  else if (platform === 'messenger') {
    return null
  }
  //SS INSTAGRAM
  else if (platform === 'instagram') {
    return null
  }
  //SS PLATAFORMA NO SOPORTADA
  else {
    console.error('Provider (providerSendPresence): Plataforma no soportada')
    sendLog('error', 'provider/provider', 'providerSendPresence: Platform not supported')
    return null
  }
}

//TT MARCAR COMO LEIDO
export async function providerMarkReadMessage(orignalMessages = [], platform) {
  if (platform === 'whatsapp') {
    if (ENV.PROV_WHATSAPP === 'baileys') {
      const res = await markReadMessage(orignalMessages)
      return res
    } else if (ENV.PROV_WHATSAPP === 'meta') {
      return true
    } else {
      sendLog('warn', 'provider/provider', 'providerMarkReadMessage: (whatsapp) Provider not supported')
      console.error('Provider (providerMarkReadMessage): Proveedor no soportado')
      return null
    }
  }
  //SS MESSENGER
  else if (platform === 'messenger') {
    return true
  }
  //SS INSTAGRAM
  else if (platform === 'instagram') {
    return true
  }
  //SS PLATAFORMA NO SOPORTADA
  else {
    console.error('Provider (providerMarkReadMessage): Plataforma no soportada')
    sendLog('warn', 'provider/provider', 'providerMarkReadMessage: Platform not supported')
    return null
  }
}
