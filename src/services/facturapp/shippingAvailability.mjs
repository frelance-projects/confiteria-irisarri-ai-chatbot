import axios from 'axios'

import { getAuth } from './auth.mjs'
import { ENV } from '#config/config.mjs'

export class ShippingAvailabilityFacturapp {
  // ss obtener cliente por código
  static async getAvailability(date, validate) {
    const url = `${ENV.FACTURAPP_URL}/pedido/getCantidadHoras`
    const data = getAuth()

    try {
      const res = await axios.post(url, { ...data, FechaEntrega: date, NumeroPedido: 0, ValidarTope: validate })
      if (res.status !== 200) {
        console.log('Error en la respuesta de Facturapp:', res.status, res.statusText)
        throw new Error(`ClientsFacturapp: Error en la petición, código de estado ${res.status}`)
      }
      return res.data
    } catch (error) {
      console.error(`ShippingAvailabilityFacturapp: Error `, error.message)
      throw error
    }
  }
}
