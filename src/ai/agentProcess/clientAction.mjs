const CLIENTS = new Map()

export class Clients {
  static addClientCompany(key, client) {
    CLIENTS.set(key, client)
    return client
  }

  static getClientCompany(key) {
    return CLIENTS.get(key) || null
  }
}
