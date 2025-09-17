export const functionName = 'addClientProfile'

export async function getJson() {
  const jsonData = {
    type: 'function',
    name: functionName,
    description: 'Añade la información de un nuevo cliente a la base de datos',
    parameters: {
      type: 'object',
      properties: {
        dni: {
          type: 'string',
          description: 'Cédula del cliente',
        },
        name: {
          type: 'string',
          description: 'Nombre del cliente',
        },
        lastName: {
          type: 'string',
          description: 'Apellidos del cliente',
        },
        address: {
          type: 'string',
          description: 'Dirección del cliente',
        },
        email: {
          type: 'string',
          description: 'Correo electrónico del cliente',
        },
        phone: {
          type: 'string',
          description: 'Número de teléfono del cliente',
        },
        postalCode: {
          type: ['string', 'null'],
          description: 'Código postal del cliente',
        },
        invoiceName: {
          type: ['string', 'null'],
          description: 'Nombre para la factura del cliente, (si es diferente al nombre real)',
        },
        contact: {
          type: ['string', 'null'],
          description: 'Persona de contacto del cliente, en caso de que sea una empresa',
        },
      },
      required: ['dni', 'name', 'lastName', 'address', 'email', 'phone', 'postalCode', 'invoiceName', 'contact'],
      additionalProperties: false,
    },
    strict: true,
  }
  return jsonData
}
