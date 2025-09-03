import { getContentType } from 'baileys'

//TT MÓDULOS
import { sendLog } from '#logger/logger.mjs'
import { setUserName } from '../functions/userName.mjs'
import { sendToChannels } from '#channels/channels.mjs'
import { getProviderHost } from '#provider/provider.mjs'
import { detectMessageOrigin } from '../functions/detectMessageOrigin.mjs'

//TT HANDLERS DE TIPOS DE MENSAJES
import { extendedTextMessage } from './typeMessages/extendedTextMessage.mjs'
import { conversation } from './typeMessages/conversation.mjs'
import { audioMessage } from './typeMessages/audioMessage.mjs'
import { imageMessage } from './typeMessages/imageMessage.mjs'
import { videoMessage } from './typeMessages/videoMessage.mjs'
import { documentMessage } from './typeMessages/documentMessage.mjs'
import { documentWithCaptionMessage } from './typeMessages/documentWithCaptionMessage.mjs'
import { reactionMessage } from './typeMessages/reactionMessage.mjs'
import { locationMessage } from './typeMessages/locationMessage.mjs'
import { stickerMessage } from './typeMessages/stickerMessage.mjs'
import { contactMessage } from './typeMessages/contactMessage.mjs'
import { contactsArrayMessage } from './typeMessages/contactsArrayMessage.mjs'

//SS ENUMERACIONES
const ENUM_MESSAGE_ORIGIN = {
  User: 'user',
  Group: 'group',
  Hidden: 'hidden'
}

//SS MAPEO DE HANDLERS
const MESSAGE_HANDLER = {
  extendedTextMessage,
  conversation,
  audioMessage,
  imageMessage,
  videoMessage,
  documentMessage,
  documentWithCaptionMessage,
  reactionMessage,
  locationMessage,
  stickerMessage,
  contactMessage,
  contactsArrayMessage
}

//TT MENSAJES DE EVENTOS
export async function eventMessages(data) {
  if (!Array.isArray(data)) {
    return console.error('Error: data no es un array')
  }
  const host = getProviderHost('whatsapp') ? getProviderHost('whatsapp') : 'bot'
  const list = []
  for (const message of data) {
    if (message.key.fromMe) {
      detectMessageOrigin(message)
      continue
    }

    //origen del mensaje
    const messageOriginType = messageOrigin(message)
    if (!messageOriginType) {
      continue
    }

    //tipo de mensaje
    const contentType = getContentType(message.message)
    if (!contentType) {
      console.error('Tipo de contenido desconocido:', contentType)
      continue
    }

    const userId = getUserId(message?.key?.remoteJid, messageOriginType)
    if (!userId) {
      console.error('Error al obtener el ID de usuario:', message?.key?.remoteJid)
      continue
    }
    setUserName(userId, message.pushName)

    console.log('Origen del mensaje:', messageOriginType)
    console.log('Tipo de contenido:', contentType)

    //TT PROCESAR MENSAJE CON HANDLER
    if (MESSAGE_HANDLER[contentType]) {
      try {
        await MESSAGE_HANDLER[contentType](message, userId, host, messageOriginType, list)
      } catch (error) {
        console.error(`Error al procesar mensaje tipo ${contentType}:`, error)
        sendLog(
          'error',
          'provider/baileys/messages/eventMessages',
          `Error processing ${contentType}: ${error.message}`
        )
      }
    }
    // TIPO DESCONOCIDO
    else {
      console.log('Mensaje de tipo desconocido:', contentType)
      console.log(JSON.stringify(message, null, 2))
      sendLog(
        'error',
        'provider/baileys/messages/eventMessages',
        'Unknown message type:\n' + JSON.stringify(message, null, 2)
      )
    }
  }
  if (list.length > 0) {
    sendToChannels(list)
  }
}

//SS ORIGEN DEL MENSAJE
function messageOrigin(message) {
  try {
    // usuarios
    if (String(message.key.remoteJid).includes('s.whatsapp.net')) {
      return ENUM_MESSAGE_ORIGIN.User
    }
    // grupos
    else if (String(message.key.remoteJid).includes('g.us')) {
      return ENUM_MESSAGE_ORIGIN.Group
    }
    // teléfono oculto
    else if (String(message.key.remoteJid).includes('@lid')) {
      console.log('Origen del mensaje: teléfono oculto: ' + message.key.remoteJid)
      return ENUM_MESSAGE_ORIGIN.Hidden
    }
    // desconocido
    else {
      console.warn('Origen del mensaje no soportado:', message.key.remoteJid)
      return null
    }
  } catch (error) {
    console.error('Error al determinar la fuente del mensaje:', error)
    return null
  }
}

//SS OBTENER ID DE USUARIO
function getUserId(remoteJid, type) {
  try {
    if (type === ENUM_MESSAGE_ORIGIN.User) {
      return String(remoteJid).split('@')[0]
    } else if (type === ENUM_MESSAGE_ORIGIN.Hidden) {
      return String(remoteJid)
    } else if (type === ENUM_MESSAGE_ORIGIN.Group) {
      return null
    } else {
      console.error('Tipo de origen de mensaje no soportado:', type)
      return null
    }
  } catch (error) {
    console.error('Error al obtener el ID de usuario:', error)
    return null
  }
}
