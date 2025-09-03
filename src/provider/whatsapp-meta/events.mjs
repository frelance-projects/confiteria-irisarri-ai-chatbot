//TT MÓDULOS
import { eventMessages } from './messages/eventMessages.mjs'

//TT DETECTAR EVENTOS
export function events(data) {
  if (data.entry) {
    for (const event of data.entry) {
      if (event.changes) {
        for (const change of event.changes) {
          if (change.value) {
            if (change.value.messages) {
              eventMessages(change.value.messages)
            } else if (change.value.statuses) {
              console.log('Estados recibidos')
            } else {
              console.log('No hay mensajes')
            }
          } else {
            console.log('No hay cambios')
          }
        }
      } else {
        console.log('No hay cambios')
      }
    }
  } else {
    console.log('No hay eventos')
  }
}
