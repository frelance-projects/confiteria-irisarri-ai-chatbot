import { setUserName } from '../functions/userName.mjs'

export function eventContacts(contacts) {
  for (const contact of contacts) {
    if (contact.profile) {
      const userId = contact.wa_id
      const name = contact.profile.name
      setUserName(userId, name)
    }
  }
}
