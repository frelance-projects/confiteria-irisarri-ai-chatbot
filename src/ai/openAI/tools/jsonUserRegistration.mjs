import { getUserRegistrationById } from '#config/tools/toolUserRegistration.mjs'
import { getUserRegistrationRequiredDataByTool } from '#config/tools/toolUserRegistrationRequiredData.mjs'

const types = {
  string: 'string',
  number: 'number',
  boolean: 'boolean',
  enum: 'string',
}

export const functionName = 'registerUserProfile'

export async function getJson(toolId) {
  //cargo la base de datos de la herramienta
  const tool = await getUserRegistrationById(toolId)
  if (!tool) {
    console.error('No se encontró la herramienta')
    return null
  }
  //cargo la base de datos de los datos requeridos
  const allData = await getUserRegistrationRequiredDataByTool(toolId)
  if (!allData) {
    console.error('No se encontró la base de datos de los datos requeridos')
    return null
  }
  // validar si se encuentra un valor a solicitar
  let isValid = false
  if (tool.requestName || tool.requestEmail) {
    isValid = true
  }
  for (const obj of allData) {
    if (obj.required) {
      isValid = true
      break
    }
  }
  //si no hay ningun dato requerido para solicitar
  if (!isValid) {
    console.error('No hay ninguno dato requerido para solicitar')
    return null
  }

  //base de datos de la herramienta
  const jsonSendFile = {
    type: 'function',

    name: functionName,
    description: 'Registra los datos del usuario',
    parameters: {
      type: 'object',
      properties: {},
      required: [],
      additionalProperties: false,
    },
    strict: true,
  }
  //agregar parámetro de nombre
  if (tool.requestName) {
    jsonSendFile.parameters.properties.name = {
      type: 'string',
      description: 'Nombre del usuario',
    }
    jsonSendFile.parameters.required.push('name')
  }
  //agregar parámetro de email
  if (tool.requestEmail) {
    jsonSendFile.parameters.properties.email = {
      type: 'string',
      description: 'Email del usuario',
    }
    jsonSendFile.parameters.required.push('email')
  }
  //agregar los parametros de la base de datos
  if (allData && allData.length > 0) {
    for (const obj of allData) {
      jsonSendFile.parameters.properties[obj.id] = {}
      //si es requerido
      if (!obj.required) {
        jsonSendFile.parameters.properties[obj.id].type = [types[obj.type], 'null']
      } else {
        jsonSendFile.parameters.properties[obj.id].type = types[obj.type]
      }

      //si es un enum
      if (obj.enumSelect && obj.enumSelect.length > 0) {
        jsonSendFile.parameters.properties[obj.id].enum = obj.enumSelect
      }

      //si tiene descripcion
      jsonSendFile.parameters.properties[obj.id].description = obj.descriptionAi || ''

      //agregar a required
      jsonSendFile.parameters.required.push(obj.id)
    }
  }

  //console.info('jsonSendFile: registerUserProfile', JSON.stringify(jsonSendFile, null, 2))
  return jsonSendFile
}
