import { addToQueue } from '#utilities/queuedExecution.mjs'
import { setStatus, deleteStatus } from '../status.mjs'
import { getUserById } from '#config/users/users.mjs'
import { getToolSendNoticeById } from '#config/tools/toolSendNotice.mjs'
import { getEmailTemplateById } from '#config/resources/emailTemplates.mjs'
import { timeToSeconds } from '../sendNotice.mjs'
import { getNoticeLogById, addNoticeLog } from '#config/data/noticeLogs.mjs'
import { sendEmail as sendEmailUtilitie } from '#utilities/sendEmail/sendEmail.mjs'

const WEEK_DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

export async function sendEmail(notice, user) {
  const delay = notice.interval * 60 * 1000 || 600000
  //actualizar estado
  const idStatus = notice.id + '_' + user.userId
  setStatus(idStatus, 'sending')
  const userId = user.userId
  const noticeId = notice.id
  addToQueue(
    { data: { noticeId, userId }, callback: sendEmailMessage, delay: delay + getRandomDelay() },
    'sendEmail'
  )
}

//SS OBTENER RETRASO ALEATORIO
function getRandomDelay() {
  const maxDelay = 2 * 60 * 1000 // 2 minutos en milisegundos
  return Math.floor(Math.random() * maxDelay)
}

//SS ENVIO DE CORREO
async function sendEmailMessage({ noticeId, userId }) {
  //cargar comunicado
  const notice = await getToolSendNoticeById(noticeId)
  if (!notice) {
    console.error('sendMessages-email - notice: Missing parameters or notice not found', noticeId)
    return null
  }
  //cargar usuario
  const user = await getUserById(userId)
  if (!user) {
    console.error('sendMessages-email - notice: Missing parameters or user not found', userId)
    return null
  }
  const idStatus = notice.id + '_' + user.userId

  if (!user.email) {
    console.error('sendMessages-email - notice: Missing parameters or user not found', userId)
    updateNoticeLog(idStatus, notice.id, user.userId, 'email', 'error', 'error, not found email')
    return null
  }

  //verificar estado
  if (notice.process !== 'sending') {
    console.warn('sendMessages-email - notice: Notice not in sending process', noticeId)
    deleteStatus(idStatus)
    return null
  }
  //verificar tiempo de envio
  const today = new Date()
  if (!notice.weekDays.includes(WEEK_DAYS[today.getDay()])) {
    console.warn('sendMessages-email - notice: Notice not in sending process', noticeId)
    deleteStatus(idStatus)
    return null
  }
  //verificar hora de envio
  const startTime = timeToSeconds(notice.startTime)
  const endTime = timeToSeconds(notice.endTime)
  if (!startTime || !endTime) {
    console.warn('sendMessages-email - notice: Missing parameters or invalid time format', noticeId)
    deleteStatus(idStatus)
    return null
  }
  const currentTime = timeToSeconds(today.toTimeString().split(' ')[0])
  if (currentTime < startTime || currentTime > endTime) {
    console.warn('sendMessages-email - notice: Notice not in sending process', noticeId)
    deleteStatus(idStatus)
    return null
  }
  //cargar plantilla
  const emailTemplate = await getEmailTemplateById(notice.emailTemplate)
  if (!emailTemplate) {
    console.warn('sendMessages-email - notice: Missing parameters or email template not found', noticeId)
    updateNoticeLog(idStatus, notice.id, user.userId, 'email', 'error', 'error, not found email template')
    deleteStatus(idStatus)
    return null
  }

  const logs = await getNoticeLogById(idStatus)
  if (logs && logs.length > 0 && logs[0].id === idStatus) {
    console.log('sendMessages-email - notice: Ya se ha enviado el email', logs)
    deleteStatus(idStatus)
    return null
  }

  const res = await sendEmailUtilitie(
    user.email,
    formatMessage(emailTemplate.suject, user),
    formatMessage(emailTemplate.text, user),
    formatMessage(emailTemplate.html, user)
  )
  deleteStatus(idStatus)
  if (res) {
    updateNoticeLog(idStatus, notice.id, user.userId, 'email', 'ok', '')
    console.log('Mensaje enviado a email:', user.name)
  } else {
    updateNoticeLog(idStatus, notice.id, user.userId, 'email', 'error', 'error to send email')
    console.error('Error al enviar mensaje a email:', user.email)
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
    console.log('sendMessages-email - notice: Log actualizado', res)
    return res
  } else {
    console.error('sendMessages-email - notice: Error al actualizar el log', idStatus)
    return null
  }
}
