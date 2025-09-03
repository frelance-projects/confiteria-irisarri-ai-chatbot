export const functionName = 'loadAvailabilityCalendar'

export async function getJson() {
  const jsonSendFile = {
    type: 'function',
    name: functionName,
    description: 'Carga los días y horas disponibles para agendar una cita en formato DD/MM/YYYY y HH:MM',
    parameters: {
      type: 'object',
      properties: {
        startDate: {
          type: ['string', 'null'],
          description:
            'fecha de inicio para consultar la disponibilidad de la agenda en formato DD/MM/YYYY, o null para consultar todas las fechas disponibles',
        },
        endDate: {
          type: ['string', 'null'],
          description:
            'fecha de fin para consultar la disponibilidad de la agenda en formato DD/MM/YYYY, o null para consultar todas las fechas disponibles',
        },
        agendaId: {
          type: 'string',
          description: 'id de la agenda a consultar',
        },
      },
      required: ['startDate', 'endDate', 'agendaId'],
      additionalProperties: false,
    },
    strict: true,
  }
  return jsonSendFile
}
