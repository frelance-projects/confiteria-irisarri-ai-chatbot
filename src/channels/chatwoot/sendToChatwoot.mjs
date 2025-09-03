import { findContactConversation } from './functions/findContactConversation.mjs'
import { sendMessage } from './functions/sendMessage.mjs'
import { findContact } from './functions/findContact.mjs'
import { createContact } from './functions/createContact.mjs'
import { createConversation } from './functions/createConversation.mjs'
import { checkAttributes } from './functions/checkAttributes.mjs'

export async function sendToChatwoot(mesagges, chatwoot) {
  console.log('Mensajes a canal de chatwoot: ' + mesagges.length)
  for (const message of mesagges) {
    //verificar sentido de canal
    let userid = 'xxx'
    if (message.channel === 'incoming') {
      userid = message.transmitter
    } else if (message.channel === 'outgoing') {
      userid = message.receiver
    } else {
      console.error('sentido de canal de chatwoot desconocida: ' + message.channel)
      return null
    }

    //buscar bandeja
    const inbox = chatwoot.messagebox.find((obj) => obj.platform === message.platform)
    if (!inbox) {
      console.error('bandeja de chatwoot no encontrado: ' + message.platform)
      return null
    }
    //verificar atributos
    const attributes = await checkAttributes(message.platform)
    if (!attributes) {
      console.error('atributos no encontrados')
      return null
    }

    //buscar contacto
    let contact = await findContact(message.platform, userid)
    if (!contact) {
      contact = await createContact(userid, message.platform, inbox.inboxid)
      if (!contact) {
        console.error('contacto no creado: ' + userid)
        return null
      }
    }

    //buscar conversacion de usuario
    let userConversation = await findContactConversation(contact.id, inbox.inboxid, 'open')
    if (!userConversation) {
      //crear conversacion de usuario
      userConversation = await createConversation(inbox.inboxid, inbox.token, contact.id, message)
      if (!userConversation) {
        console.error('conversacion no creada: ' + userid)
        return null
      }
    }
    //enviar mensaje a conversacion de usuario
    console.log('Enviando mensaje a conversacion de usuario: ' + userid)
    sendMessage(message, userConversation)
  }
}
