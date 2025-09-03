import { appsheeTablesOthers } from './tablesId.mjs'
import { postTable } from './api/postTable.mjs'
import { urlMedia } from '#storage/urlMedia.mjs'
import { createId } from '#utilities/createId.mjs'
import { getFullDateFormatGB, getTimeFormat } from '#utilities/dateFunctions/dateNow.mjs'

export async function sendToAppsheet(mesagges) {
  console.log('Mensajes a canal de appsheet: ' + mesagges.length)
  //NEXT: creasr sistema de lotes para enviar mensajes a appsheet
  for (const message of mesagges) {
    //console.log('Mensajes a canal de chatwoot', userid)
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
        TEXT: message.message.text
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
          MEDIA_ULR: fileUrl
        }
        list.push(textMessage)
      }
    }
    addToChunk(list)
  }
}

const chunk = []
let timeoutId = null

//SS ENVIA MENSAJES A APPSHEET EN LOTE
export function addToChunk(messages) {
  const newMessages = Array.isArray(messages) ? messages : [messages]
  chunk.push(...newMessages)

  if (chunk.length > 10) {
    postTable(appsheeTablesOthers.messages, chunk).then((res) => {
      if (!res) {
        console.error('appsheet: error al enviar mensajes')
      }
    })
    chunk.length = 0
    clearTimeout(timeoutId)
    timeoutId = null
    return
  }

  if (!timeoutId) {
    timeoutId = setTimeout(() => {
      if (chunk.length > 0) {
        postTable(appsheeTablesOthers.messages, chunk).then((res) => {
          if (!res) {
            console.error('appsheet: error al enviar mensajes')
          }
        })
        chunk.length = 0
      }
      timeoutId = null
    }, 10000)
  }
}
