import { ENV, isProductionEnv } from '#config/config.mjs'
import { StatusPlatformsDb } from './data.mjs'

const HANDLER_TABLE = {
  whatsapp: {
    meta: 'PLATFORM_WA_META',
    baileys: 'PLATFORM_WA_BAILEYS',
  },
}

export async function updateStatus(platform, data) {
  try {
    const table = HANDLER_TABLE[platform]?.[ENV.PROV_WHATSAPP]
    if (!table) {
      throw new Error('Tabla no encontrada')
    }

    if (!isProductionEnv()) {
      console.warn('updateStatus: Modo no productivo, no se actualiza el estado del servicio')
      console.warn('Datos:', { platform, table, data })
      return data
    }
    const status = await StatusPlatformsDb.updateStatus(table, { platform, ...data })

    return status
  } catch (error) {
    console.error('updateStatus: Error al actualizar el estado del servicio:', error.message)
    return null
  }
}
