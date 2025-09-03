import { eventMessages } from './messages/eventMessages.mjs'

//TT DETECTAR EVENTOS
export async function events(data) {
  if (data.event === 'message_created') {
    //console.log('chatwoot: Mensaje recibido')
    const res = eventMessages(data)
    return res
  }
  return null
}
