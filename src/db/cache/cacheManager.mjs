const DATA = new Map()

export class CacheManager {
  static getData(key) {
    return DATA.get(key)
  }

  static addData(key, value) {
    DATA.set(key, value)
  }

  static refreshData(key, keyData) {
    const data = DATA.get(key)
    if (data && data.get(keyData)) {
      console.info(`Eliminando dato de la caché para ${key} con clave ${keyData}`)
      data.delete(keyData)
    } else {
      console.log(`No se encontró dato en la caché para ${key} con clave ${keyData}`)
    }
  }

  static deleteData(key) {
    DATA.delete(key)
  }
}
