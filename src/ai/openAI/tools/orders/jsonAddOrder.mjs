import { DELIVERY_MODES, PAYMENT_METHODS } from '#enums/tools/orders.mjs'

export const functionName = 'addOrder'

const ENUM_TIME = [
  '00:00',
  '01:00',
  '02:00',
  '03:00',
  '04:00',
  '05:00',
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
]

export async function getJson() {
  const jsonData = {
    type: 'function',
    name: functionName,
    description:
      'Crea un nuevo pedido con los detalles proporcionados (esta función solicitará al usuario confirmación de forma interactiva para proceder).',
    parameters: {
      type: 'object',
      properties: {
        // nombre del cliente
        name: {
          type: 'string',
          description: 'Nombre completo del cliente que realiza el pedido',
        },
        //FechaEntrega
        deliveryDate: {
          type: 'object',
          description: 'Fecha de entrega del pedido',
          properties: {
            date: {
              type: 'string',
              description: 'Fecha de entrega en formato AAAA-MM-DD',
            },
            time: {
              type: 'string',
              enum: ENUM_TIME,
              description: 'Hora de entrega en formato HH:MM',
            },
          },
          required: ['date', 'time'],
          additionalProperties: false,
        },
        paymentMethod: {
          type: 'string',
          enum: Object.values(PAYMENT_METHODS),
          description: 'Método de pago del pedido, ya sea contado o crédito',
        },
        // modo de entrega (domicilio o recogida)
        deliveryMode: {
          type: 'string',
          enum: Object.values(DELIVERY_MODES),
          description: 'Modo de entrega del pedido, ya sea a domicilio o para recogida en tienda',
        },

        // dirección de entrega
        address: {
          type: ['string', 'null'],
          description: 'Dirección de entrega del pedido en caso de ser a domicilio',
        },
        // nota general del pedido
        note: {
          type: ['string', 'null'],
          description: 'Nota u observaciones generales del pedido',
        },
        // listado de artículos del pedido
        articles: {
          type: 'array',
          description: 'Listado de artículos del pedido',
          items: {
            type: 'object',
            properties: {
              // código del articulo
              code: {
                type: 'string',
                description: 'Código del articulo solicitado',
              },
              // cantidad solicitada
              quantity: {
                type: 'number',
                description: 'Cantidad solicitada del articulo',
              },
              // nota específica del articulo
              note: {
                type: ['string', 'null'],
                description: 'Nota específica para este articulo',
              },
            },
            required: ['code', 'quantity', 'note'],
            additionalProperties: false,
          },
        },
      },
      required: ['name', 'deliveryDate', 'paymentMethod', 'deliveryMode', 'address', 'note', 'articles'],
      additionalProperties: false,
    },
    strict: true,
  }
  return jsonData
}
