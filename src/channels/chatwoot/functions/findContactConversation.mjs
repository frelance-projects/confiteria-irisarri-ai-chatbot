import { getConversation } from './api/getConversation.mjs'

export async function findContactConversation(contactId, inboxId, status = 'open') {
  const conversations = await getConversation(inboxId, status)
  if (!conversations) {
    console.error('Error al buscar conversación en whatsapp')
    return null
  }

  if (!conversations.data.payload || !Array.isArray(conversations.data.payload)) {
    console.error('no se logo encontar conversación en esta bandeja')
    return null
  }
  const conversation = conversations.data.payload.find(
    (conv) => String(conv.meta.sender.id) === String(contactId)
  )
  if (!conversation) {
    console.log('no se encontro conversación de usuario: ' + contactId)
    return null
  }
  return conversation
}
