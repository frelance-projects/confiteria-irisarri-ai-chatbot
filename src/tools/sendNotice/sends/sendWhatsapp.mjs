import { provider, providerSendMessage } from '#provider/provider.mjs'
import { sendToChannels } from '#channels/channels.mjs'
import { addToQueue } from '#utilities/queuedExecution.mjs'
import { setStatus, deleteStatus } from '../status.mjs'
import { getUserById } from '#config/users/users.mjs'
import { getToolSendNoticeById } from '#config/tools/toolSendNotice.mjs'
import { getMessageTemplateById } from '#config/resources/messageTemplates.mjs'
import { timeToSeconds } from '../sendNotice.mjs'
import { getNoticeLogById, addNoticeLog } from '#config/data/noticeLogs.mjs'
import { getRandomDelay } from '#utilities/dateFunctions/time.mjs'

const WEEK_DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

export async function sendWhatsapp(notice, user) {
  //SS BAILEYS
  if (provider.whatsapp.provider === 'baileys') {
    const delay = notice.interval * 60 * 1000 || 600000
    //actualizar estado
    const idStatus = notice.id + '_' + user.userId
    setStatus(idStatus, 'sending')
    const userId = user.userId
    const noticeId = notice.id
    addToQueue(
      {
        data: { noticeId, userId },
        callback: sendMessages,
        delay: delay + getRandomDelay(120000 /* 2 minutos */)
      },
      'sendWhatsappBaileys'
    )
  }
  //SS META
  else if (provider.whatsapp.provider === 'meta') {
    //NEXT: FEATURE
    return true
  } else {
    console.error('sendRequestWhatsapp: proveedor de whatsapp no soportado')
    return false
  }
}

//SS ENVIO DE MENSAJES
async function sendMessages({ noticeId, userId }) {
  //cargar comunicado
  const notice = await getToolSendNoticeById(noticeId)
  if (!notice) {
    console.error('sendMessages-baileys - notice: Missing parameters or notice not found', noticeId)
    return null
  }
  //cargar usuario
  const user = await getUserById(userId)
  if (!user) {
    console.error('sendMessages-baileys - notice: Missing parameters or user not found', userId)
    return null
  }
  const idStatus = notice.id + '_' + user.userId

  if (!user.whatsapp || !user.whatsapp.id) {
    console.error('sendMessages-baileys - notice: Missing parameters or user not found', userId)
    updateNoticeLog(idStatus, notice.id, user.userId, 'whatsapp', 'error', 'error, not found whatsapp id')
    return null
  }

  //verificar estado
  if (notice.process !== 'sending') {
    console.warn('sendMessages-baileys - notice: Notice not in sending process', noticeId)
    deleteStatus(idStatus)
    return null
  }
  //verificar tiempo de envio
  const today = new Date()
  if (!notice.weekDays.includes(WEEK_DAYS[today.getDay()])) {
    console.warn('sendMessages-baileys - notice: Notice not in sending process', noticeId)
    deleteStatus(idStatus)
    return null
  }
  //verificar hora de envio
  const startTime = timeToSeconds(notice.startTime)
  const endTime = timeToSeconds(notice.endTime)
  if (!startTime || !endTime) {
    console.warn('sendMessages-baileys - notice: Missing parameters or invalid time format', noticeId)
    deleteStatus(idStatus)
    return null
  }
  const currentTime = timeToSeconds(today.toTimeString().split(' ')[0])
  if (currentTime < startTime || currentTime > endTime) {
    console.warn('sendMessages-baileys - notice: Notice not in sending process', noticeId)
    deleteStatus(idStatus)
    return null
  }
  //cargar plantilla
  const messageTemplate = await getMessageTemplateById(notice.messageTemplate)
  if (!messageTemplate) {
    console.warn('sendMessages-baileys - notice: Missing parameters or message template not found', noticeId)
    updateNoticeLog(
      idStatus,
      notice.id,
      user.userId,
      'whatsapp',
      'error',
      'error, not found message template'
    )
    deleteStatus(idStatus)
    return null
  }

  const logs = await getNoticeLogById(idStatus)
  if (logs && logs.length > 0 && logs[0].id === idStatus) {
    console.log('sendMessages-baileys - notice: Ya se ha enviado el mensaje', logs)
    deleteStatus(idStatus)
    return null
  }
  //formatear mensaje
  const textMessage = formatMessage(messageTemplate.text, user)
  let message = {}
  if (!notice.fileType || notice.fileType === 'none') {
    message = { type: 'text', text: textMessage }
  } else {
    message = {
      type: 'media',
      media: {
        fileType: notice.fileType,
        fileUrl: notice.fileUrl,
        caption: textMessage
      }
    }
  }
  deleteStatus(idStatus)
  const res = await providerSendMessage(user.whatsapp.id, message, 'whatsapp', 'bot', 'outgoing', 'bot')
  if (res) {
    sendToChannels(res)
    updateNoticeLog(idStatus, notice.id, user.userId, 'whatsapp', 'ok', '')
    console.log('Mensaje enviado a whatsapp:', user.name)
  } else {
    updateNoticeLog(idStatus, notice.id, user.userId, 'whatsapp', 'error', 'error to send message')
    console.error('Error al enviar mensaje a whatsapp:', user.whatsapp.id)
  }
}

//SS FORMATEAR MENSAJE
function formatMessage(messageTemplate, user) {
  let txt = messageTemplate.replaceAll('{user_name}', user.name)
  txt = txt.replaceAll('{user_name_registered}', user.registeredName)
  return txt
}

//SS ACTUALIZAR-CREAR LOG
async function updateNoticeLog(idStatus, notice, user, channel, status, log) {
  const noticeLog = {
    id: idStatus,
    timestamp: new Date(),
    notice,
    user,
    channel,
    status,
    log
  }
  const res = await addNoticeLog(noticeLog)
  if (res) {
    console.log('sendMessages-baileys - notice: Log actualizado', res)
    return res
  } else {
    console.error('sendMessages-baileys - notice: Error al actualizar el log', idStatus)
    return null
  }
}
