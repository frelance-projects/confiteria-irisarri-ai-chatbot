export const functionName = 'loadClientProfile'

export async function getJson() {
  const jsonSendRequest = {
    type: 'function',
    name: functionName,
    description: 'Carga el perfil del cliente desde la base de datos',
    parameters: {
      type: 'object',
      properties: {
        number: {
          type: 'string',
          description: 'Numero de telefono o cedula del cliente',
        },
        dataType: {
          type: 'string',
          enum: ['dni', 'phone'],
          description: 'Tipo de dato para buscar el cliente: dni (cedula) o phone (telefono)',
        },
      },
      required: ['number', 'dataType'],
      additionalProperties: false,
    },
    strict: true,
  }
  return jsonSendRequest
}
