import { ENV } from '#config/config.mjs'
import {
  loadToolSendNotice as loadToolSendNoticeApp,
  updateNoticeProcess as updateNoticeProcessAppsheet
} from '#apps/appsheet/config/tools/toolSendNotice.mjs'
import { initSendNotice } from '#tools/sendNotice/initSendNotice.mjs'

let TOOLS = null
let TOOLS_PROMISE = null

//TT OBTENER NOTICIAS
export async function getToolSendNotice() {
  // Si ya se cargó previamente, se retorna inmediatamente
  if (TOOLS) return TOOLS

  // Si no hay una promesa en curso, se crea una
  if (ENV.APP_FRONTEND === 'appsheet') {
    TOOLS_PROMISE = loadToolSendNoticeApp()
  } else {
    console.error('plataforma de frontend no soportada')
    return null
  }
  // Se espera a que se resuelva la promesa y se almacena el resultado
  TOOLS = await TOOLS_PROMISE
  return TOOLS
}

//TT CARGAR NOTICIAS POR ID
export async function getToolSendNoticeById(id) {
  const tools = await getToolSendNotice()
  if (!tools) {
    return null
  }
  const tool = tools.find((obj) => obj.id === id)
  if (!tool) {
    console.info(`getToolSendNoticeById: No se ha encontrado la herramienta ${id}`)
    return null
  }
  return tool
}
//TT ACTUALIZAR NOTICIA
export async function updateProcessToolSendNotice(noticeId, process) {
  const allNotices = await getToolSendNotice()
  const index = allNotices.findIndex((obj) => obj.id === noticeId)
  if (index === -1) {
    console.error('updateToolSendNotice: Noticia no encontrada')
    return null
  }
  TOOLS[index].process = process
  if (ENV.APP_FRONTEND === 'appsheet') {
    console.log('appsheet: actualizar usuario')
    await updateNoticeProcessAppsheet({ id: noticeId, process })
  }
  return TOOLS[index]
}

//TT ACTUALIZAR NOTICIAS
export function setToolSendNotice(obj) {
  TOOLS = obj
  TOOLS_PROMISE = Promise.resolve(obj)
  initSendNotice()
  return obj
}
