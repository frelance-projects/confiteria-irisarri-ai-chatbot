import { eventMessages } from './messages/eventMessages.mjs'

//TT DETECTAR EVENTOS
export async function events(data) {
  if (data.event === 'message_created') {
    const res = eventMessages(data)
    return res
  }
  return null
}
