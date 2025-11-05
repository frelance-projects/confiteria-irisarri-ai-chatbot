import { getSendRequestById as getTool } from '#db/tools/sendRequest/getSendRequestById.mjs'
import { getToolSendRequestTags } from '#config/tools/toolSendRequestTags.mjs'
export const functionName = 'sendRequest'

export async function getJson(toolId) {
  const sendRequestConfig = await getTool(toolId)
  if (!sendRequestConfig) {
    console.error('getJson: No se ha encontrado la configuración de sendRequest con ID: ' + toolId)
    return null
  }
  const tags = await getToolSendRequestTags()
  if (!tags) {
    console.error('getJson: No se han encontrado las etiquetas')
    return null
  }
  const tagsFunction = tags.filter((obj) => sendRequestConfig.tags.includes(obj.id))
  const tagsId = tagsFunction.map((tag) => tag.id)

  const jsonSendRequest = {
    type: 'function',
    name: functionName,
    description: 'Envía una solicitud a un encargado de soporte',
    parameters: {
      type: 'object',
      properties: {
        request: {
          type: 'string',
          description: 'Description de consulta',
        },
        tagId: {
          type: ['string'],
          enum: [...tagsId],
          description: 'Id de la etiqueta de la solicitud',
        },
      },
      required: ['request', 'tagId'],
      additionalProperties: false,
    },
    strict: true,
  }
  return jsonSendRequest
}
