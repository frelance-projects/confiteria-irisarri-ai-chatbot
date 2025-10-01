const CLIENTS = new Map()

export class Clients {
  static addClient(key, client) {
    CLIENTS.set(key, client)
    return client
  }

  static getClient(key) {
    return CLIENTS.get(key) || null
  }
}
