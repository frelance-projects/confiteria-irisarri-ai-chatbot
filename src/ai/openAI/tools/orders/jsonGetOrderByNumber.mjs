export const functionName = 'getOrderByNumber'

export async function getJson() {
  const jsonData = {
    type: 'function',
    name: functionName,
    description: 'Consulta y devuelve los detalles de un pedido existente utilizando su número de pedido único.',
    parameters: {
      type: 'object',
      properties: {
        // nombre del cliente
        orderNumber: {
          type: 'integer',
          description: 'Número único del pedido que se desea consultar',
        },
      },
      required: ['orderNumber'],
      additionalProperties: false,
    },
    strict: true,
  }
  return jsonData
}
