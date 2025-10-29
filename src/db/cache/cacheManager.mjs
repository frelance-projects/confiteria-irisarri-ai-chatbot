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
    if (data && typeof data.get === 'function' && data.get(keyData)) {
      console.info(`Eliminando dato de la caché para ${key} con clave ${keyData}`)
      data.delete(keyData)
      if (data.reload && typeof data.reload === 'function') {
        console.info(`Recargando dato de la caché para ${key} con clave ${keyData}`)
        data.reload(keyData)
      }
    } else {
      console.log(`No se encontró dato en la caché para ${key} con clave ${keyData}`)
    }
  }

  static deleteData(key) {
    DATA.delete(key)
  }
}
