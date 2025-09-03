import { validateType } from './functions/validateType.mjs'
import { providerSendMessage } from '#provider/provider.mjs'
import { sendToChannels } from '#channels/channels.mjs'

export async function sendCatalogPage(user, platform, catalogPage) {
  if (!validateType(catalogPage.type, platform)) {
    console.error(
      `sendCatalogPage: Tipo de archivo no válido: ${catalogPage.type} en plataforma: ${platform}`
    )
    return null
  }
  const mediaMesage = {
    type: 'media',
    media: {
      fileType: catalogPage.type,
      fileUrl: catalogPage.url
    }
  }
  if (!user[platform].id) {
    console.error(`sendCatalogPage: No se encontró el ID de usuario en ${platform}`)
    return null
  }
  const res = await providerSendMessage(user[platform].id, mediaMesage, platform, 'bot', 'outgoing', 'bot')
  if (!res) {
    return null
  }
  //enviar a canales
  sendToChannels(res)
  return true
}
