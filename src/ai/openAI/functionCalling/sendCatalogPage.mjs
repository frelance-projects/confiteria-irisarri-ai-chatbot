import { sendCatalogPage as sendCatalogPageTool } from '#tools/sendCatalog/sendCatalogPage.mjs'
import { getCatalogPagesToolById } from '#config/tools/toolCatalogPages.mjs'

export async function sendCatalogPage(args, user, userIdKey) {
  const platform = userIdKey.split('-*-')[1]
  const pageId = args.fileId
  const catalogPage = await getCatalogPagesToolById(pageId)
  if (!catalogPage) {
    console.error('sendFile: No se ha encontrado el archivo')
    return { response: 'error: file not found' }
  }
  const res = await sendCatalogPageTool(user, platform, catalogPage)

  if (res) {
    //verificar si hay error
    if (res.error) {
      console.error('sendFile: ', res.error)
      return { response: 'error: error sending file', error: res.error }
    }
    //verificar si hay respuesta
    else {
      console.log('Solicitud enviada')
      return { response: 'success: file sent' }
    }
  }
  //error al enviar el archivo
  else {
    console.error('Error al enviar el archivo')
    return { response: 'error: error sending file ' }
  }
}
