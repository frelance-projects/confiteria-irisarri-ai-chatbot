import { provider } from '#provider/provider.mjs'

export async function markReadMessage(messages) {
  try {
    const listMesages = Array.isArray(messages) ? messages : [messages]
    const keys = listMesages.map((obj) => obj.key)
    const res = await provider.whatsapp.sock.readMessages(keys)
    return res
  } catch (error) {
    console.error('markReadMessage: Error al marcar mensajes como leídos:', error)
    return null
  }
}
