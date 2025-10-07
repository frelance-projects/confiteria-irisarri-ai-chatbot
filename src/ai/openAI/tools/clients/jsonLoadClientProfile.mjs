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
          description: 'Numero de telefono, cedula o rut del cliente',
        },
        dataType: {
          type: 'string',
          enum: ['dni', 'phone', 'rut'],
          description: 'Tipo de dato para buscar el cliente: dni (cedula), phone (telefono) o rut de la empresa',
        },
      },
      required: ['number', 'dataType'],
      additionalProperties: false,
    },
    strict: true,
  }
  return jsonSendRequest
}
