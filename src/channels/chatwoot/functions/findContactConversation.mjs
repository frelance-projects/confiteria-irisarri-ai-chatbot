import { getConversation } from './api/getConversation.mjs'

export async function findContactConversation(contactId, inboxid, status = 'open') {
  const conversations = await getConversation(inboxid, status)
  if (!conversations) {
    console.error('Error al buscar conversacion en whatsapp')
    return null
  }

  if (!conversations.data.payload || !Array.isArray(conversations.data.payload)) {
    console.error('no se logo encontar conversacion en esta bandeja')
    return null
  }
  const conversation = conversations.data.payload.find(
    (conv) => String(conv.meta.sender.id) === String(contactId)
  )
  if (!conversation) {
    console.log('no se encontro conversacion de usuario: ' + contactId)
    return null
  }
  return conversation
}
