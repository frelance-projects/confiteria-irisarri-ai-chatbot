import { getToolSendNotice } from '#config/tools/toolSendNotice.mjs'
import { sendNotice } from './sendNotice.mjs'

export async function initSendNotice() {
  const notices = await getToolSendNotice()
  if (!notices) {
    console.error('initSendNotices: No se pudo cargar la configuración de <tool-sendnotice>')
    return null
  }
  //console.warn('initSendNotices: Iniciando el envío de comunicados', notices)

  const activeNotices = notices.filter((notice) => notice.process === 'sending')
  if (activeNotices.length === 0) {
    console.info('initSendNotices: No hay comunicados activos para enviar')
    return null
  }

  for (const notice of activeNotices) {
    sendNotice(notice)
  }
}
