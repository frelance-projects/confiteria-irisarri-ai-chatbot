export const functionName = 'getShippingAvailability'

export async function getJson() {
  const jsonData = {
    type: 'function',
    name: functionName,
    description: 'Obtiene la disponibilidad de envío para los artículos del pedido.',
  }
  return jsonData
}
