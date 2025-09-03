//TT MÓDULOS
import { ENV } from '#config/config.mjs'
import { getServices } from '#config/services/services.mjs'
import { BaileysInit } from '#provider/baileys/baileys.mjs'
import { deployServiceWhatsappMeta } from '#provider/whatsapp-meta/whatsappMeta.mjs'

export async function deployServices() {
  try {
    const services = await getServices()
    //comprobar servicios
    if (!services) {
      console.error('Deploy: Error al cargar configuración de servicios')
      return null
    }
    if (!Array.isArray(services)) {
      console.error('Deploy: Error configuración de servicios no es un array')
      return null
    }

    for (const service of services) {
      //whatsapp
      if (service.platform === 'whatsapp') {
        //baileys
        if (ENV.PROV_WHATSAPP === 'baileys') {
          console.log('Deploy: Servicio whatsapp con proveedor baileys desplegado')
          BaileysInit()
        }
        //meta
        else if (ENV.PROV_WHATSAPP === 'meta') {
          deployServiceWhatsappMeta()
          console.log('Deploy: Servicio whatsapp con proveedor meta desplegado')
        }
        //no soportado
        else {
          console.error('Deploy: Proveedor de whatsapp no soportado :' + ENV.PROV_WHATSAPP)
        }
      }
    }
  } catch (error) {
    console.error('Deploy: Error al desplegar servicios', error)
  }
}
