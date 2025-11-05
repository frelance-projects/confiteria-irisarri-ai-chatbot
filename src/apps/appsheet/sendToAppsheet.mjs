import { addData } from '#utilities/appsheet/addData.mjs'
import { urlMedia } from '#storage/urlMedia.mjs'
import { createId } from '#utilities/createId.mjs'
import { getFullDateFormatGB, getTimeFormat } from '#utilities/dateFunctions/dateNow.mjs'

const CHUNK = []
let TIME_OUT = null

const TABLE = 'MESSAGES'

export async function sendToAppsheet(messages) {
  console.log('Mensajes a canal de appsheet: ' + messages.length)
  for (const message of messages) {
    //console.log('Mensajes a canal de chatwoot', userId)
    const list = []
    //SS TEXTO
    if (message.message.type === 'text') {
      const textMessage = {
        ID: 'msg-' + createId(),
        TIMESTAMP: getFullDateFormatGB() + ' ' + getTimeFormat(),
        PLATFORM: message.platform,
        PROVIDER: message.provider,
        STATUS: message.status,
        LOG: message.log,
        APP: message.app,
        ROLE: message.role,
        CHANNEL: message.channel,
        TRANSMITTER: message.transmitter,
        RECEIVER: message.receiver,
        TYPE: message.message.type,
        TEXT: message.message.text,
      }
      list.push(textMessage)
    }
    //SS MEDIA
    else if (message.message.type === 'media') {
      let fileUrl = ''
      if (message.message.media.path) {
        fileUrl = urlMedia(message.message.media.path)
      } else if (message.message.media.fileUrl) {
        fileUrl = message.message.media.fileUrl
      }

      if (fileUrl) {
        const textMessage = {
          ID: 'msg-' + createId(),
          TIMESTAMP: getFullDateFormatGB() + ' ' + getTimeFormat(),
          PLATFORM: message.platform,
          PROVIDER: message.provider,
          STATUS: message.status,
          LOG: message.log,
          APP: message.app,
          ROLE: message.role,
          CHANNEL: message.channel,
          TRANSMITTER: message.transmitter,
          RECEIVER: message.receiver,
          TYPE: message.message.media.fileType,
          TEXT: message.message.media.caption ? message.message.media.caption : '',
          MEDIA_ULR: fileUrl,
        }
        list.push(textMessage)
      }
    }
    addToChunk(list)
  }
}

//SS ENVIA MENSAJES A APPSHEET EN LOTE
export function addToChunk(messages) {
  const newMessages = Array.isArray(messages) ? messages : [messages]
  CHUNK.push(...newMessages)

  if (CHUNK.length > 10) {
    addData(TABLE, {}, CHUNK).then((res) => {
      if (!res) {
        console.error('appsheet: error al enviar mensajes')
      }
    })
    CHUNK.length = 0
    clearTimeout(TIME_OUT)
    TIME_OUT = null
    return
  }

  if (!TIME_OUT) {
    TIME_OUT = setTimeout(() => {
      if (CHUNK.length > 0) {
        addData(TABLE, {}, CHUNK).then((res) => {
          if (!res) {
            console.error('appsheet: error al enviar mensajes')
          }
        })
        CHUNK.length = 0
      }
      TIME_OUT = null
    }, 10000)
  }
}
