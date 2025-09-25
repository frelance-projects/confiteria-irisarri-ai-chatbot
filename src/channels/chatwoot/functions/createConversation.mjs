import { postConversation } from './api/postConversation.mjs'

export async function createConversation(inboxId, inboxToken, contactId) {
  console.log('creando conversación: ' + contactId)
  const res = await postConversation(inboxId, inboxToken, contactId, 'open')
  if (!res) {
    console.error('Error al crear conversación')
    return null
  }
  console.log('conversación creada', res)
  return res
}
