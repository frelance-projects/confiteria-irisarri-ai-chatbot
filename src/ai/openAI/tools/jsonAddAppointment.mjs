import { getAppointmentRequiredDataTool } from '#config/tools/toolAppointmentRequiredData.mjs'

const types = {
  string: 'string',
  number: 'number',
  boolean: 'boolean',
  enum: 'string',
}

export const functionName = 'addAppointment'
export async function getJson(toolId) {
  //cargo la base de datos de la herramienta
  const allData = await getAppointmentRequiredDataTool()

  //base de datos de la herramienta
  const jsonSendFile = {
    type: 'function',
    name: functionName,
    description: 'Crear una cita',
    parameters: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description: 'Fecha de la cita en formato DD/MM/YYYY',
        },
        time: {
          type: 'string',
          description: 'Hora de la cita en formato HH:MM',
        },
        agendaId: {
          type: 'string',
          description: 'Id de la agenda',
        },
      },
      required: ['date', 'time', 'agendaId'],
      additionalProperties: false,
    },
    strict: true,
  }
  //agregar los parametros de la base de datos
  const data = allData.filter((obj) => obj.toolAppointment === toolId)
  if (data && data.length > 0) {
    for (const obj of data) {
      jsonSendFile.parameters.properties[obj.id] = {}
      //si es requerido
      if (!obj.required) {
        jsonSendFile.parameters.properties[obj.id].type = [types[obj.type], 'null']
      } else {
        jsonSendFile.parameters.properties[obj.id].type = types[obj.type]
      }

      //si es un enum
      if (obj.enumSelect && obj.enumSelect.length > 0 && obj.type === 'enum') {
        jsonSendFile.parameters.properties[obj.id].enum = obj.enumSelect
      }

      //si tiene descripcion
      jsonSendFile.parameters.properties[obj.id].description = obj.descriptionAi || ''

      //agregar a required
      jsonSendFile.parameters.required.push(obj.id)
    }
  }
  //console.info('jsonSendFile: addAppointment', JSON.stringify(jsonSendFile, null, 2))
  return jsonSendFile
}
