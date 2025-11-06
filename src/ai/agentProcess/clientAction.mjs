export class Clients {
  static clients = new Map()

  // agregar cliente de compañía a la sesión
  static addClient(key, client) {
    this.clients.set(key, client)
    return client
  }

  // obtener cliente de compañía de la sesión
  static getClient(key) {
    return this.clients.get(key) || null
  }
}
