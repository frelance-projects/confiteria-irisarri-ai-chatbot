import { ServiceDb } from './data.mjs'

export async function initConfig() {
  try {
    // obtener datos desde la base de datos
    const serviceConfig = await ServiceDb.initConfig()

    return serviceConfig
  } catch (error) {
    console.error('initConfig: Error al inicializar la configuración del servicio:', error.message)
    return null
  }
}
