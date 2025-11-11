import axios from 'axios'

//TT MÓDULOS
import { ENV } from '#config/config.mjs'
import { getAuth } from './auth.mjs'

export class OrdersFacturapp {
  // ss obtener cliente por código
  static async addOrder(order) {
    const url = `${ENV.FACTURAPP_URL}/altaPedido`
    const data = getAuth()
    const orderFormat = DataFormatter.revertData(order)
    console.log('Datos del pedido formateados para Facturapp:', orderFormat)

    try {
      const res = await axios.post(url, { ...data, ...orderFormat })
      if (res.status !== 200) {
        throw new Error(`ClientsFacturapp: Error en la petición, código de estado ${res.status}`)
      }
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
      IdFormaPago: item.paymentMethod, //  **1 (Contado)** o **2 (Crédito)**.
      IdModoEntrega: item.deliveryMode, //  **1 (Retira en local)** o **2 (Envío a domicilio)**
      IdBarrio: 0,
      IdZona: 0,
      IdAccion: 0, // **1 (Pedido para llevar)** o **2 (Pedido a domicilio)**
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
