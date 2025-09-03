import { getCatalogPagesByCatalogId } from '#config/tools/toolCatalogPages.mjs'

//TT CONSTRUIR CATALOGO
export async function buildCatalog(catalogId) {
  let text = 'sin catalogo disponible\n'
  const pages = await getCatalogPagesByCatalogId(catalogId)
  if (pages && pages.length > 0) {
    text = ''
    let counter = 1
    for (const page of pages) {
      if (page.status) {
        text += `${counter}. ${page.name}\n`
        text += `  * fileId: ${page.id}\n`
        text += `  * description: ${page.description}\n`
        if (page.price) {
          text += `  * price: ${page.price}\n`
        }
        if (page.paymentLink) {
          text += `  * paymentLink: ${page.paymentLink}\n`
        }
        text += '\n'
        counter++
      }
    }
  }
  //console.info('Catalogo:\n', text)
  return text
}
