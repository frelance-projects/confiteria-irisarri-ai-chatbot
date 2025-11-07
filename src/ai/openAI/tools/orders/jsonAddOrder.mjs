import { DELIVERY_MODES, PAYMENT_METHODS } from '#enums/tools/orders.mjs'

export const functionName = 'addOrder'

export async function getJson() {
  const jsonData = {
    type: 'function',
    name: functionName,
    description:
      'Crea un nuevo pedido con los detalles proporcionados (esta función solicitará al usuario confirmación de forma interactiva para proceder).',
    parameters: {
      type: 'object',
      properties: {
        //FechaEntrega
        deliveryDate: {
          type: 'string',
          description: 'Fecha de entrega del pedido en formato AAAA-MM-DD HH:MM',
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
      required: ['deliveryDate', 'paymentMethod', 'deliveryMode', 'address', 'note', 'articles'],
      additionalProperties: false,
    },
    strict: true,
  }
  return jsonData
}
