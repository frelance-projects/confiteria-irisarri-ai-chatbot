import { ENV } from '#config/config.mjs'
//appsheet
import { loadToolCatalog as loadToolCatalogApp } from '#apps/appsheet/config/tools/toolCatalog.mjs'

let TOOLS = null
let TOOLS_PROMISE = null

//TT OBTENER CATALOGOS
export async function getCatalogTool() {
  // Si ya se cargó previamente, se retorna inmediatamente
  if (TOOLS) return TOOLS

  // Si no hay una promesa en curso, se crea una
  if (!TOOLS_PROMISE) {
    if (ENV.APP_FRONTEND === 'appsheet') {
      TOOLS_PROMISE = loadToolCatalogApp('load')
    } else {
      console.error('plataforma de frontend no soportada')
      return null
    }
  }

  // Se espera a que se resuelva la promesa y se almacena el resultado
  TOOLS = await TOOLS_PROMISE
  return TOOLS
}

//TT OBTENER CATALOGO
export async function getCatalogToolById(catalogId) {
  const toolCatalog = await getCatalogTool()
  if (!toolCatalog) {
    return null
  }
  const tool = toolCatalog.find((obj) => obj.id === catalogId)
  if (!tool) {
    return null
  }
  return tool
}

//TT ACTUALIZAR CATALOGO
export function setCatalogTool(obj) {
  TOOLS = obj
  // Se actualiza también la promesa para que futuras llamadas la utilicen
  TOOLS_PROMISE = Promise.resolve(obj)
  return obj
}
