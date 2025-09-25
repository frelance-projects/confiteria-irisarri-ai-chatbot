import { revertPhoneNumber } from '#utilities/revertPhoneNumber.mjs'
import { postContact } from './api/postContact.mjs'
import { getUserName } from '#provider/provider.mjs'

export async function createContact(userId, platform, inboxId) {
  const userName = await getUserName(userId, platform)
  //whatsapp
  if (platform === 'whatsapp') {
    const formattedNumber = revertPhoneNumber(userId)
    console.log('chatwoot: creando contacto en whatsapp: ' + formattedNumber)
    const res = await postContact(inboxId, userName, '', formattedNumber, {
      id_whatsapp: userId
    })
    if (!res) {
      console.error('createContact: Error al crear contacto en whatsapp')
      return null
    }
    if (!res.payload || !res.payload.contact) {
      console.error('createContact: Error al obtener datos del contacto creado')
      return null
    }
    console.log('contacto creado en whatsapp: ', res.payload.contact)
    return res.payload.contact
  }
  //messenger
  else if (platform === 'messenger') {
    console.log('creando contacto en messenger: ' + userId)
    const res = await postContact(inboxId, userName, '', '', { id_messenger: userId })
    if (!res) {
      console.error('createContact: Error al crear contacto en messenger')
      return null
    }
    if (!res.payload || !res.payload.contact) {
      console.error('createContact: Error al obtener datos del contacto creado')
      return null
    }
    console.log('contacto creado en messenger: ', res.payload.contact)
    return res.payload.contact
  } //instagram
  else if (platform === 'instagram') {
    console.log('creando contacto en instagram: ' + userId)
    const res = await postContact(inboxId, userName, '', '', { id_instagram: userId })
    if (!res) {
      console.error('createContact: Error al crear contacto en instagram')
      return null
    }
    if (!res.payload || !res.payload.contact) {
      console.error('createContact: Error al obtener datos del contacto creado')
      return null
    }
    console.log('contacto creado en instagram: ', res.payload.contact)
    return res.payload.contact
  } else {
    console.error('createContact: plataforma no soportada: ' + platform)
    return null
  }
}
