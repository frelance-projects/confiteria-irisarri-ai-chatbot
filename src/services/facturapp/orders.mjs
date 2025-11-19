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
  //ss obtener cliente por código
  static async addOrder(order) {
    const url = `${ENV.FACTURAPP_URL}/altaPedido`
    const data = getAuth()
    const orderFormat = DataFormatter.revertData(order)
    //console.log('Datos del pedido formateados para Facturapp:\n', JSON.stringify(orderFormat, null, 2))

    try {
      const res = await axios.post(url, { ...data, ...orderFormat })
      if (res.status !== 200) {
        console.error('Respuesta de Facturapp al agregar pedido:\n', JSON.stringify(res.data, null, 2))
        throw new Error(`OrdersFacturapp: Error en la petición, código de estado ${res.status}`)
      }
      //console.log('Respuesta de Facturapp al agregar pedido:\n', JSON.stringify(res.data, null, 2))

      try {
        return await this.getOrderByNumber(res.data.numeroPedido)
      } catch (error) {
        console.error(`OrdersFacturapp: Error al obtener pedido después de agregar`, error.message)
        return DataFormatter.buildAddOrderData(res.data)
      }
    } catch (error) {
      console.error(`OrdersFacturapp: Error al agregar pedido`, error.message)
      throw new Error(`OrdersFacturapp: Error al agregar pedido`)
    }
  }

  //ss obtener pedido por número de pedido
  static async getOrderByNumber(orderNumber) {
    const url = `${ENV.FACTURAPP_URL}/consultaPedido`
    const data = getAuth()
    try {
      const res = await axios.post(url, { ...data, NroPedido: parseInt(orderNumber, 10) })
      if (res.status !== 200) {
        throw new Error(`ClientsFacturapp: Error en la petición, código de estado ${res.status}`)
      }
      //console.log('Order cargada desde Facturapp:', JSON.stringify(res.data, null, 2))

      return DataFormatter.buildGetOrderData(res.data)
    } catch (error) {
      console.error(`OrdersFacturapp: Error al obtener pedido con número ${orderNumber}`, error.message)
      throw new Error(`OrdersFacturapp: Error al obtener pedido`)
    }
  }

  //ss obtener historial de pedidos
  static async getOrdersHistory(clientCode, startDate, endDate) {
    const url = `${ENV.FACTURAPP_URL}/historialPedidos`
    const data = getAuth()

    // pase date a formato AAAA-MM-DD HH:MM:SS
    const FechaDesde = startDate ? new Date(startDate).toISOString().slice(0, 19).replace('T', ' ') : null
    const FechaHasta = endDate ? new Date(endDate).toISOString().slice(0, 19).replace('T', ' ') : null

    try {
      const res = await axios.post(url, {
        ...data,
        CodigoCliente: clientCode,
        FechaDesde,
        FechaHasta,
      })
      if (res.status !== 200) {
        throw new Error(`ClientsFacturapp: Error en la petición, código de estado ${res.status}`)
      }

      return DataFormatter.buildGetOrderData(res.data)
    } catch (error) {
      console.error(`OrdersFacturapp: Error al obtener historial de pedidos`, error.message)
      throw new Error(`OrdersFacturapp: Error al obtener historial de pedidos`)
    }
  }
}

class DataFormatter {
  //ss construir datos de configuración
  static buildAddOrderData(resOrder) {
    const allOrders = Array.isArray(resOrder) ? resOrder : [resOrder]

    const orders = []
    // mapear datos al formato requerido
    for (const item of allOrders) {
      const _order = {
        numeroPedido: item.numeroPedido,
        estadoInicial: item.estadoInicial, //TODO: agregar mapeo de estados
        total: item.total,
      }
      orders.push(_order)
    }

    if (orders.length === 1) {
      return orders[0]
    }
    return orders
  }

  //ss construir datos de configuración
  static buildGetOrderData(resOrder) {
    const allOrders = Array.isArray(resOrder) ? resOrder : [resOrder]

    const orders = []
    // mapear datos al formato requerido
    for (const item of allOrders) {
      const _order = {
        numeroPedido: item.NroPedido,
        Fecha: item.Fecha, //TODO: agregar mapeo de estados
        hora: item.Hora,
        estado: item.Estado,
        cliente: item.Cliente,
        direccion: item.Direccion,
        formaPago: item.FormaPago,
        pago: item.Pago,
        facturado: item.Facturado,
        total: item.Total,
      }
      orders.push(_order)
    }

    if (orders.length === 1) {
      return orders[0]
    }
    return orders
  }

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
