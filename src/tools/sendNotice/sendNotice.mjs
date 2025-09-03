import { sendWhatsapp } from './sends/sendWhatsapp.mjs'
import { getUsersByTag } from '#config/users/users.mjs'
import { getStatusById } from './status.mjs'
import { getNoticeLogByNotice } from '#config/data/noticeLogs.mjs'
import { sendEmail } from './sends/sendEmail.mjs'

const WEEK_DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

export async function sendNotice(notice) {
  const users = await getUsersByTag(notice.userTag)
  if (!users || users.length === 0) {
    console.error('sendNotice: No se han encontrado usuarios para la etiqueta', notice.tag)
    return null
  }
  const noticeLog = await getNoticeLogByNotice(notice.id)
  if (!noticeLog) {
    console.error('sendNotice: No se ha encontrado el log del comunicado', notice.id)
    return null
  }
  let counter = 0
  for (const user of users) {
    //verificar si se esta enviando el comunicado
    const idStatus = notice.id + '_' + user.userId
    const noticeLogUser = noticeLog.find((log) => log.user === user.userId)
    if (noticeLogUser) {
      console.log('sendNotice: Ya se ha enviado el comunicado, Log:', noticeLogUser)
      counter++
      continue
    }
    //verificar si se esta enviando el comunicado
    const status = getStatusById(idStatus)
    if (status && status.status === 'sending') {
      console.info('sendNotice: Ya se está enviando el comunicado', idStatus)
      continue
    }
    //verificar tiempo de envio
    const today = new Date()
    if (!notice.weekDays.includes(WEEK_DAYS[today.getDay()])) {
      console.log('sendNotice - notice: Notice not in sending process', notice.id)
      continue
    }
    //verificar hora de envio
    const startTime = timeToSeconds(notice.startTime)
    const endTime = timeToSeconds(notice.endTime)
    if (!startTime || !endTime) {
      console.log('sendNotice - notice: Missing parameters or invalid time format', notice.id)
      continue
    }
    const currentTime = timeToSeconds(today.toTimeString().split(' ')[0])
    if (currentTime < startTime || currentTime > endTime) {
      console.log('sendNotice - notice: Notice not in sending process', notice.id)
      continue
    }

    //SS WHATSAPP
    if (notice.channel === 'whatsapp') {
      //verificar si el usuario tiene whatsapp
      if (!user.whatsapp || !user.whatsapp.id) {
        console.error('sendNotice: No se ha encontrado el id de whatsapp del usuario', user.userId)
        continue
      }
      sendWhatsapp(notice, user)
    }
    //SS EMAIL
    else if (notice.channel === 'email') {
      //verificar si el usuario tiene email
      if (!user.email) {
        console.error('sendNotice: No se ha encontrado el email del usuario', user.userId)
        continue
      }
      sendEmail(notice, user)
    } else {
      console.error('sendNotice: Canal no soportado', notice.channel)
    }
  }
  if (counter >= users.length) {
    console.info('sendNotice: Ya se han enviado todos los comunicados', notice.id)
  }
}

//TT CONVERTIR HORA A SEGUNDOS
export function timeToSeconds(timeStr) {
  try {
    const [hours, minutes] = timeStr.split(':').map(Number)
    return hours * 3600 + minutes * 60
  } catch (error) {
    console.error('timeToSeconds: Error parsing time string', timeStr, error)
    return null
  }
}
