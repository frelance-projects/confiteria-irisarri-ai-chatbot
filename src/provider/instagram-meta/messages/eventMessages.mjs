import { agentResponse } from '#ai/agent.mjs'
import { attachmentsMessage } from './attachmentsMessage.mjs'
import { sendToChannels } from '#channels/channels.mjs'
import { formatIncomingMessage } from '#utilities/formatIncomingMessage.mjs'
import { getCredentials } from '../functions/getCredentials.mjs'

export async function eventMessages(data) {
  if (!Array.isArray(data)) {
    return console.error('Error: data no es un array')
  }
  const meta = await getCredentials()
  if (!meta) {
    console.error('Error al obtener las credenciales de Meta')
    return null
  }
  const list = []
  for (const message of data) {
    //SS TEXTO
    if ('text' in message.message) {
      if (message.message.is_echo) {
        console.log('Mensaje de eco instagram')
        return
      }
      const userId = message.sender.id
      const text = message.message.text
      console.log('Mensaje de texto instagram:', text)
      agentResponse(userId, { type: 'text', text }, 'user', 'instagram', message)
      const formatMessage = formatIncomingMessage('instagram', 'meta', 'user', userId, meta.pageid, {
        type: 'text',
        text
      })
      list.push(formatMessage)
    }
    //SS ADJUNTO
    else if ('attachments' in message.message) {
      const attachments = await attachmentsMessage(message.message.attachments)
      if (attachments) {
        for (const attachment of attachments) {
          agentResponse(message.sender.id, { type: 'media', media: attachment }, 'user', 'instagram', message)
          const formatMessage = formatIncomingMessage(
            'instagram',
            'meta',
            'user',
            message.sender.id,
            meta.pageid,
            {
              type: 'media',
              media: attachment
            }
          )
          list.push(formatMessage)
        }
      }
    } else {
      console.log('Mensaje de tipo desconocido:', message)
    }
    console.log()
  }
  if (list.length > 0) {
    sendToChannels(list)
  }
}
