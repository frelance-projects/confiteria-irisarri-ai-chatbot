export const functionName = 'cancelAppointment'

export async function getJson() {
  const jsonSendFile = {
    type: 'function',
    name: functionName,
    description: 'Cancelar una cita agendada',
    parameters: {
      type: 'object',
      properties: {
        appointmentId: {
          type: 'string',
          description: 'id de la cita a cancelar',
        },
      },
      required: ['appointmentId'],
      additionalProperties: false,
    },
    strict: true,
  }
  return jsonSendFile
}
