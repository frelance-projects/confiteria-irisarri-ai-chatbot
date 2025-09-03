export const functionName = 'sendFile'

export async function getJson() {
  const jsonSendFile = {
    type: 'function',
    name: functionName,
    description: 'Envía el archivo adjunto al usuario',
    parameters: {
      type: 'object',
      properties: {
        fileId: {
          type: 'string',
          description: 'id del archivo a enviar',
        },
      },
      required: ['fileId'],
      additionalProperties: false,
    },
    strict: true,
  }
  return jsonSendFile
}
