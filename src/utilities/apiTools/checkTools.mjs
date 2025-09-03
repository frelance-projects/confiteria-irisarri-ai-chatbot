import { getTextGoogleDocs } from './getTextGoogleDocs/getTextGoogleDocs.mjs'

export async function checkTools(body) {
  try {
    console.log('API tools: ', body)
    if (!body.accion) {
      console.log('Accion no valida')
      return { res: 'Body is required' }
    }
    //SS Obtener texto de google docs
    if (body.accion === 'get-text-google-docs') {
      const response = await getTextGoogleDocs(body.urlDoc)
      return response
    }
  } catch (error) {
    console.error('apiTools - checkTools  Error:', error)
    return { res: 'Error processing request' }
  }
}
