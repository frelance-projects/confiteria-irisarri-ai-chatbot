import { eventMessages } from './messages/eventMessages.mjs'

//TT DETECTAR EVENTOS
export function events(data) {
  if (data.entry) {
    for (const event of data.entry) {
      if (event.messaging) {
        eventMessages(event.messaging)
      } else {
        console.log('No hay mensajes')
      }
    }
  } else {
    console.log('No hay eventos')
  }
}
