import { getSendRequestById as getTool } from '#db/tools/sendRequest/getSendRequestById.mjs'
import { getToolSendRequestTagsById } from '#config/tools/toolSendRequestTags.mjs'

//TT CONSTRUIR CATALOGO
export async function buildRequestTags(toolSendRequestId) {
  let text = 'sin etiquetas de solicitud disponibles\n'
  const tool = await getTool(toolSendRequestId)
  const tags = []
  if (tool) {
    //obtener etiquetas
    for (const tagId of tool.tags) {
      const tag = await getToolSendRequestTagsById(tagId)
      if (tag) {
        tags.push(tag)
      }
    }
    if (tags.length === 0) {
      console.error('No se encontraron etiquetas de solicitud')
      return text
    }
    text = ''
    //construir texto
    let counter = 1
    for (const tag of tags) {
      text += `${counter}. ${tag.name}\n`
      text += `  * id: ${tag.id}\n`
      text += `  * description: ${tag.description}\n\n`
      counter++
    }
  }
  //console.info('Lista de etiquetas de solicitud:\n', text)
  return text
}
