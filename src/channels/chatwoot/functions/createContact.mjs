import { revertPhoneNumber } from '#utilities/revertPhoneNumber.mjs'
import { postContact } from './api/postContact.mjs'
import { getUserName } from '#provider/provider.mjs'

export async function createContact(userid, platform, inboxid) {
  const userName = await getUserName(userid, platform)
  //whatsapp
  if (platform === 'whatsapp') {
    const formattedNumber = revertPhoneNumber(userid)
    console.log('creando contacto en whatsapp: ' + formattedNumber)
    const res = await postContact(inboxid, userName, '', formattedNumber, {
      id_whatsapp: userid
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
    console.log('creando contacto en messenger: ' + userid)
    const res = await postContact(inboxid, userName, '', '', { id_messenger: userid })
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
    console.log('creando contacto en instagram: ' + userid)
    const res = await postContact(inboxid, userName, '', '', { id_instagram: userid })
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
