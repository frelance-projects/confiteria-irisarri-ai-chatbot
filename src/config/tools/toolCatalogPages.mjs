import { ENV } from '#config/config.mjs'
//appsheet
import { loadToolCatalogPages as loadToolCatalogPagesAppsheet } from '#apps/appsheet/config/tools/toolCatalogPages.mjs'

let TOOLS = null
let TOOLS_PROMISE = null

//TT OBTENER PAGINAS DE CATALOGO
export async function getCatalogPagesTool() {
  // Si ya se cargó previamente, se retorna inmediatamente
  if (TOOLS) return TOOLS

  // Si no hay una promesa en curso, se crea una
  if (!TOOLS_PROMISE) {
    if (ENV.APP_FRONTEND === 'appsheet') {
      TOOLS_PROMISE = loadToolCatalogPagesAppsheet('load')
    } else {
      console.error('plataforma de frontend no soportada')
      return null
    }
  }

  // Se espera a que se resuelva la promesa y se almacena el resultado
  TOOLS = await TOOLS_PROMISE
  return TOOLS
}

//TT OBTENER PAGINA DE CATALOGO POR ID
export async function getCatalogPagesToolById(pageId) {
  const toolCatalogPages = await getCatalogPagesTool()
  if (!toolCatalogPages) {
    return null
  }
  const pages = toolCatalogPages.find((obj) => obj.id === pageId)
  if (!pages) {
    return null
  }
  return pages
}

//TT OBTENER TODAS LAS PAGINAS DEL CATALOGO POR ID DE CATALOGO
export async function getCatalogPagesByCatalogId(catalogId) {
  const toolCatalogPages = await getCatalogPagesTool()
  if (!toolCatalogPages) {
    return null
  }
  const pages = toolCatalogPages.filter((obj) => obj.catalogId === catalogId)
  if (pages.length < 1) {
    return null
  }
  return pages
}

//TT ACTUALIZAR PAGINAS DE CATALOGO
export function setCatalogPagesTool(obj) {
  TOOLS = obj
  // Se actualiza también la promesa para que futuras llamadas la utilicen
  TOOLS_PROMISE = Promise.resolve(obj)
  return obj
}
