import axios from 'axios'

//TT MÓDULOS
import { ENV } from '#config/config.mjs'
import { getAuth } from './auth.mjs'
import { DELIVERY_MODES, PAYMENT_METHODS } from '#enums/tools/orders.mjs'

const HANDLE_DELIVERY_MODES = {
  [DELIVERY_MODES.PICKUP]: 1,
  [DELIVERY_MODES.HOME_DELIVERY]: 2,
}
const HANDLE_PAYMENT_METHODS = {
  [PAYMENT_METHODS.CASH]: 1,
  [PAYMENT_METHODS.CREDIT]: 2,
}

export class OrdersFacturapp {
  // ss obtener cliente por código
  static async addOrder(order) {
    const url = `${ENV.FACTURAPP_URL}/altaPedido`
    const data = getAuth()
    const orderFormat = DataFormatter.revertData(order)
    console.log('Datos del pedido formateados para Facturapp:\n', JSON.stringify(orderFormat, null, 2))

    try {
      const res = await axios.post(url, { ...data, ...orderFormat })
      if (res.status !== 200) {
        throw new Error(`ClientsFacturapp: Error en la petición, código de estado ${res.status}`)
      }
      console.log('Respuesta de Facturapp al agregar pedido:\n', JSON.stringify(res.data, null, 2))
      return res.data
    } catch (error) {
      console.error(`OrdersFacturapp: Error adding order`, error.message)
      throw new Error(`OrdersFacturapp: Error adding order`)
    }
  }
}

class DataFormatter {
  //ss revertir datos de configuración
  static revertData(data) {
    const allData = Array.isArray(data) ? data : [data]

    // mapear datos al formato requerido
    const result = allData.map((item) => ({
      CodigoCliente: item.client,
      Terminal: 1,
      FechaEntrega: item.deliveryDate,
      CodMovimiento: 6, // **6 (PEDIDOS)** o **16 (PEDIDOS WEB)**.
      IdFormaPago: HANDLE_PAYMENT_METHODS[item.paymentMethod], //  **1 (Contado)** o **2 (Crédito)**.
      IdModoEntrega: HANDLE_DELIVERY_MODES[item.deliveryMode], //  **1 (Retira en local)** o **2 (Envío a domicilio)**
      IdBarrio: 0,
      IdZona: 0,
      IdAccion: HANDLE_DELIVERY_MODES[item.deliveryMode], // **1 (Pedido para llevar)** o **2 (Pedido a domicilio)**
      Observaciones: item.note || '',
      ReferenciaExterna: 'BOT-123',
      ContactoNombre: item.name || '',
      ContactoDireccion: item.address || '',
      ContactoTelefono: item.phone || '',
      ContactoObservacion: '', //TODO: pendiente preguntar uso
      Items: item.articles.map((article) => ({
        Codigo: article.article,
        Cantidad: article.quantity,
        PorcDtoLinea: 0, // porcentaje de descuento en la línea
        Observaciones: article.note || '',
      })),
    }))

    // validar si es un solo objeto o un array
    if (result.length === 1) {
      return result[0]
    }
    // devolver array de objetos
    return result
  }
}
