import { findContactConversation } from './functions/findContactConversation.mjs'
import { sendMessage } from './functions/sendMessage.mjs'
import { findContact } from './functions/findContact.mjs'
import { createContact } from './functions/createContact.mjs'
import { createConversation } from './functions/createConversation.mjs'
import { checkAttributes } from './functions/checkAttributes.mjs'

export async function sendToChatwoot(messages, chatwoot) {
  console.log('Mensajes a canal de chatwoot: ' + messages.length)
  for (const message of messages) {
    //verificar sentido de canal
    let userId = 'xxx'
    if (message.channel === 'incoming') {
      userId = message.transmitter
    } else if (message.channel === 'outgoing') {
      userId = message.receiver
    } else {
      console.error('sentido de canal de chatwoot desconocida: ' + message.channel)
      return null
    }

    console.warn('chatwoot: Procesando mensaje para usuario: ' + userId)
    //buscar bandeja
    const inbox = chatwoot.messageBox.find((obj) => obj.platform === message.platform)
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
    let contact = await findContact(message.platform, userId)
    if (!contact) {
      console.warn('contacto no encontrado, creando: ' + userId)
      contact = await createContact(userId, message.platform, inbox.inboxid)
      if (!contact) {
        console.error('contacto no creado: ' + userId)
        return null
      }
    }

    //buscar conversation de usuario
    let userConversation = await findContactConversation(contact.id, inbox.inboxid, 'open')
    if (!userConversation) {
      //crear conversation de usuario
      userConversation = await createConversation(inbox.inboxid, inbox.token, contact.id, message)
      if (!userConversation) {
        console.error('chatwoot: conversation no creada: ' + userId)
        return null
      }
    }
    //enviar mensaje a conversation de usuario
    console.log('Enviando mensaje a conversation de usuario: ' + userId)
    sendMessage(message, userConversation)
  }
}
