import { postConversation } from './api/postConversation.mjs'

export async function createConversation(inboxid, inboxToken, contactId) {
  console.log('creando conversacion: ' + contactId)
  const res = await postConversation(inboxid, inboxToken, contactId, 'open')
  if (!res) {
    console.error('Error al crear conversacion')
    return null
  }
  console.log('conversacion creada', res)
  return res
}
