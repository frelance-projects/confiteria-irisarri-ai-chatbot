export const functionName = 'addOrder'

export async function getJson() {
  const jsonData = {
    type: 'function',
    name: functionName,
    description: 'Crea un nuevo pedido para un cliente',
    parameters: {
      type: 'object',
      properties: {
        client: {
          type: 'string',
          description: 'Identificador del cliente (por ejemplo, DNI o ID interno)',
        },
        address: {
          type: 'string',
          description: 'Dirección de entrega del pedido',
        },
        note: {
          type: ['string', 'null'],
          description: 'Nota u observaciones del pedido',
        },
        products: {
          type: 'array',
          description: 'Listado de productos del pedido',
          items: {
            type: 'object',
            properties: {
              product: {
                type: 'string',
                description: 'Código del producto',
              },
              quantity: {
                type: 'number',
                description: 'Cantidad solicitada del producto',
              },
              note: {
                type: ['string', 'null'],
                description: 'Nota específica para este producto',
              },
            },
            required: ['product', 'quantity', 'note'],
            additionalProperties: false,
          },
        },
      },
      required: ['client', 'address', 'note', 'products'],
      additionalProperties: false,
    },
    strict: true,
  }
  return jsonData
}
