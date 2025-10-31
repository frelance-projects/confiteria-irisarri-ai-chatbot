import { sendRequest as sendRequestTool } from '#tools/sendRequest/sendRequest.mjs'
import { getBrainById } from '#db/brains/getBrainById.mjs'
import { getToolSendRequestTagsById } from '#config/tools/toolSendRequestTags.mjs'

export async function sendRequest(args, user, userIdKey) {
  const platform = userIdKey.split('-*-')[1]
  const request = args.request
  const tagId = args.tagId

  //verificar datos
  if (!request) {
    console.error('request es requerido')
    return { response: 'error: request is required' }
  }
  if (!tagId) {
    console.error('tagId es requerido')
    return { response: 'error: tagId is required' }
  }
  //cargar etiqueta
  const tag = await getToolSendRequestTagsById(tagId)
  if (!tag) {
    console.error('Error al cargar la etiqueta')
    return { response: 'error: error loading tag' }
  }
  //cargar configuración
  const brain = await getBrainById(user.brain)

  //console.log(tag)
  const res = await sendRequestTool(user, request, platform, tag, brain)
  if (res) {
    //verificar si hay error
    if (res.error) {
      console.error('sendRequest: ', res.error)
      return { response: 'error: error sending request', error: res.error }
    }
    //verificar si hay respuesta
    else {
      console.log('Solicitud enviada')
      return { response: 'success: request sent' }
    }
  }
  //error al enviar la solicitud
  else {
    console.error('Error al enviar la solicitud')
    return { response: 'error: error sending request ' }
  }
}
