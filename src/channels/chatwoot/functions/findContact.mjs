//import { getSearchContacts } from './api/getSearchContacts.mjs'
import { getContactFilter } from './api/getContactFilter.mjs'

export async function findContact(platform, userid) {
  try {
    //whatsapp
    if (platform === 'whatsapp') {
      const data = await getContactFilter('id_whatsapp', 'equal_to', [userid])
      if (!data) {
        console.error('Error al buscar contacto en whatsapp')
        return null
      }
      if (!data.payload || !Array.isArray(data.payload)) {
        console.error('findContact: no se encontro contacto en whatsapp: ' + userid)
        return null
      }
      if (data.payload.length < 1) {
        console.log('no se encontro contacto en whatsapp: ' + userid)
        return null
      }
      const contact = data.payload[0]
      return contact
    }
    //messenger
    else if (platform === 'messenger') {
      const data = await getContactFilter('id_messenger', 'equal_to', userid)
      if (!data) {
        console.error('Error al buscar contacto en messenger')
        return null
      }
      if (!data.payload || !Array.isArray(data.payload)) {
        console.error('findContact: no se encontro contacto en messenger: ' + userid)
        return null
      }
      if (data.payload.length < 1) {
        console.log('no se encontro contacto en messenger: ' + userid)
        return null
      }
      const contact = data.payload[0]
      return contact
    }
    //instagram
    else if (platform === 'instagram') {
      const data = await getContactFilter('id_instagram', 'equal_to', userid)
      if (!data) {
        console.error('Error al buscar contacto en instagram')
        return null
      }
      if (!data.payload || !Array.isArray(data.payload)) {
        console.error('findContact: no se encontro contacto en instagram: ' + userid)
        return null
      }
      if (data.payload.length < 1) {
        console.log('no se encontro contacto en instagram: ' + userid)
        return null
      }
      const contact = data.payload[0]
      return contact
    } else {
      console.error('findContact: Error plataforma no soportada: ' + platform)
      return null
    }
  } catch (error) {
    console.error('findContact: Error al buscar contacto:', error)
    return null
  }
}
